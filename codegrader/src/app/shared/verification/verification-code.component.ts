import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verification-code',
  templateUrl: './verification-code.component.html',
  styleUrls: ['./verification-code.component.css'],
  imports: [ ReactiveFormsModule, CommonModule ]
})
export class VerificationCodeComponent implements OnInit, OnDestroy {
  @Input() email!: string;
  @Input() title = 'Xác thực email';
  @Input() message = 'Nhập mã xác thực đã gửi tới email của bạn';
  @Input() length = 6;
  @Input() secondsToExpire?: number; // optional: hiển thị đếm ngược

  @Output() submitted = new EventEmitter<string>();      // emit mã OTP khi bấm Xác nhận
  @Output() canceled = new EventEmitter<void>();         // emit khi bấm Hủy/đóng
  @Output() resendRequested = new EventEmitter<void>();  // emit khi bấm Gửi lại mã
  @Output() otpInvalid = new EventEmitter<string>();     // emit khi OTP sai (để parent xử lý)

  // Custom validator for exact length
  private exactLengthValidator(length: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      
      if (value.length !== length) {
        return { 'exactLength': { requiredLength: length, actualLength: value.length } };
      }
      
      return null;
    };
  }

  form = new FormGroup({
    code: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d+$/),
      this.exactLengthValidator(this.length)
    ])
  });

  remaining = 0;
  private timerId: any;
  showOtpError = false;
  showResendSuccess = false;

  ngOnInit(): void {
    if (this.secondsToExpire && this.secondsToExpire > 0) {
      this.remaining = this.secondsToExpire;
      this.timerId = setInterval(() => {
        this.remaining--;
        if (this.remaining <= 0) {
          clearInterval(this.timerId);
        }
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.timerId) clearInterval(this.timerId);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      // Mark field as touched to show validation errors
      this.form.get('code')?.markAsTouched();
      return;
    }
    
    const code = (this.form.value.code || '').toString().trim();
    this.submitted.emit(code);
  }

  // Method to handle invalid OTP (called from parent)
  onOtpInvalid(): void {
    // Clear form but keep timer running
    this.form.get('code')?.setValue('');
    this.form.get('code')?.markAsUntouched();
    
    // Show error message
    this.showOtpError = true;
    setTimeout(() => {
      this.showOtpError = false;
    }, 3000);
  }

  onCancel(): void {
    this.canceled.emit();
  }

  onResend(): void {
    this.resendRequested.emit();
    // Reset timer when resend is requested
    this.resetTimer();
    
    // Clear any existing error messages
    this.showOtpError = false;
    
    // Clear form
    this.form.get('code')?.setValue('');
    this.form.get('code')?.markAsUntouched();
    
    // Show success message
    this.showResendSuccess = true;
    setTimeout(() => {
      this.showResendSuccess = false;
    }, 3000);
  }

  // Method to reset timer
  private resetTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    
    if (this.secondsToExpire && this.secondsToExpire > 0) {
      this.remaining = this.secondsToExpire;
      this.timerId = setInterval(() => {
        this.remaining--;
        if (this.remaining <= 0) {
          clearInterval(this.timerId);
        }
      }, 1000);
    }
  }

  // Method to handle input changes and format
  onInputChange(event: any): void {
    let value = event.target.value;
    
    // Remove all non-digit characters
    value = value.replace(/\D/g, '');
    
    // Limit to max length
    if (value.length > this.length) {
      value = value.substring(0, this.length);
    }
    
    // Update form control
    this.form.get('code')?.setValue(value);
  }
}
