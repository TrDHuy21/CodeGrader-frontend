import { Injectable, ViewContainerRef, ComponentRef, inject } from '@angular/core';
import { VerificationCodeComponent } from './verification-code.component';

export interface VerificationOpenOptions {
  email: string;
  title?: string;
  message?: string;
  length?: number;          // mặc định 6
  secondsToExpire?: number; // mặc định 90s
  onResend?: () => void;    // callback khi người dùng bấm Gửi lại mã
}

@Injectable({ providedIn: 'root' })
export class VerificationUiService {
  private hostVcr?: ViewContainerRef;
  private currentRef?: ComponentRef<VerificationCodeComponent>;

  registerHost(vcr: ViewContainerRef) {
    this.hostVcr = vcr;
  }

  async open(opts: VerificationOpenOptions): Promise<string | null> {
    if (!this.hostVcr) {
      console.error('[VerificationUiService] Host ViewContainerRef chưa được đăng ký');
      return null;
    }

    // Nếu đang mở một modal khác -> đóng trước
    if (this.currentRef) {
      this.close();
    }

    this.currentRef = this.hostVcr.createComponent(VerificationCodeComponent);
    const cmp = this.currentRef.instance;

    // Gán Input
    cmp.email = opts.email;
    if (opts.title) cmp.title = opts.title;
    if (opts.message) cmp.message = opts.message;
    if (opts.length) cmp.length = opts.length;
    if (opts.secondsToExpire) cmp.secondsToExpire = opts.secondsToExpire;

    // Trả về Promise đợi người dùng submit/cancel
    return new Promise<string | null>((resolve) => {
      const sub1 = cmp.submitted.subscribe(code => {
        resolve(code);
        // KHÔNG cleanup ở đây - để parent xử lý verify trước
      });
      const sub2 = cmp.canceled.subscribe(() => {
        resolve(null);
        this.cleanup(sub1, sub2, sub3);
      });
      const sub3 = cmp.resendRequested.subscribe(() => {
        if (opts.onResend) opts.onResend();
      });
    });
  }

  close() {
    if (this.currentRef) {
      this.currentRef.destroy();
      this.currentRef = undefined;
    }
  }

  // Method to handle invalid OTP (keep component open, just clear form)
  handleInvalidOtp(): void {
    if (this.currentRef) {
      this.currentRef.instance.onOtpInvalid();
    }
  }

  // Method to close component when verification is successful
  closeOnSuccess(): void {
    if (this.currentRef) {
      this.currentRef.destroy();
      this.currentRef = undefined;
    }
  }

  // Method to handle successful verification
  handleVerificationSuccess(): void {
    this.closeOnSuccess();
  }

  // Method to handle OTP verification (keep modal open for retry)
  async handleOtpVerification(verifyCallback: (otp: string) => Promise<boolean>): Promise<void> {
    if (!this.currentRef) return;

    const cmp = this.currentRef.instance;
    
    // Subscribe to submitted event
    const subscription = cmp.submitted.subscribe(async (otp: string) => {
      const isValid = await verifyCallback(otp);
      
      if (isValid) {
        // Success - close modal
        this.handleVerificationSuccess();
        subscription.unsubscribe();
      } else {
        // Invalid - clear form and show error
        this.handleInvalidOtp();
      }
    });
  }

  private cleanup(...subs: any[]) {
    subs.forEach((s) => s?.unsubscribe?.());
    this.close();
  }
}
