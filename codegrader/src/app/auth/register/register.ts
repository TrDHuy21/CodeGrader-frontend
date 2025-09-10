import { Component, signal, effect, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RegisterRequest, ApiErrorResponse, FieldError } from '../auth.model';
import { AuthService } from '../auth.service';
import { VerificationUiService } from '../../shared/verification/verification-ui.service';
import Swal from 'sweetalert2';
import { ConfirmEmailRequest } from '../auth.model';
import { CommonFunc } from '../../shared/common/common';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: 'register.html',
  styleUrls: ['register.css'],
})
export class RegisterApp {
  fullname = signal('');
  email = signal('');
  username = signal('');
  password = signal('');
  confirmPassword = signal('');
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  isLoading = signal(false);
  passwordStrength = signal(0);

  private abc = inject(CommonFunc);
  private router = inject(Router);
  private authService = inject(AuthService);
  private verificationUi = inject(VerificationUiService); // 👈 inject service OTP

  constructor() {
    effect(() => {
      this.passwordStrength.set(this.abc.calculateStrength(this.password()));
    });
  }

  passwordStrengthText = computed(() =>
    this.abc.getPasswordStrengthText(this.passwordStrength())
  );

  async onSignup() {
    if (!this.fullname() || !this.email() || !this.username() || !this.password() || !this.confirmPassword()) {
      Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Please fill in all required fields!' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email())) {
      Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Please enter a valid email address!' });
      return;
    }
    if (this.password() !== this.confirmPassword()) {
      Swal.fire({ icon: 'error', title: 'Signup failed', text: 'Passwords do not match!' });
      return;
    }
    if (this.passwordStrength() < 2) {
      Swal.fire({ icon: 'error', title: 'Weak Password', text: 'Please choose a stronger password!' });
      return;
    }

    this.isLoading.set(true);

    const request: RegisterRequest = {
      fullName: this.fullname(),
      email: this.email(),
      password: this.password(),
      username: this.username()
    };

  this.authService.signup(request).subscribe({
    next: async (res: ApiErrorResponse) => {
      if (res.isSuccess) {
        // Mở modal OTP
        await this.verificationUi.open({
          email: this.email(),
          title: 'Confirm email',
          message: 'Please enter the OTP code sent to your email !',
          length: 6,
          secondsToExpire: 90,
          onResend: () => {
            // Gửi lại OTP
            this.authService.resendOtp(this.email()).subscribe({
              next: () => {
                console.log('OTP code resent successfully !');
              },
              error: (error) => {
                console.error('OTP resend error:', error);
                Swal.fire('Error', 'Unable to resend OTP code, please try again !', 'error');
              }
            });
          }
        });

        // Xử lý verify OTP với retry
        await this.verificationUi.handleOtpVerification(async (otp: string) => {
          return await this.verifyOtp(otp);
        });
      } else {
        let errorMessages = '';
        if (res.errorDetail?.errors) {
          errorMessages =
            '<ul style="text-align:left;">' +
            res.errorDetail.errors.map((e: FieldError) => `<li>${e.errorMessage}</li>`).join('') +
            '</ul>';
        }
        Swal.fire({
          icon: 'error',
          title: 'Signup failed',
          html: errorMessages || res.message || 'Something went wrong'
        });
      }
    },
    error: (err) => {
      Swal.fire({ icon: 'error', title: 'API error', text: err.message || 'Unable to connect to server' });
    },
    complete: () => this.isLoading.set(false),
  });
  }

  togglePassword() { this.showPassword.update(v => !v); }
  toggleConfirmPassword() { this.showConfirmPassword.update(v => !v); }
  onPasswordChange(value: string) { this.password.set(value); }
  onSkipSignUp() { this.router.navigate(['/']); }
  onGoogleSignup() { alert('Google signup clicked!'); }
  onLogin(event: Event) { event.preventDefault(); this.router.navigate(['/login']); }

  private async verifyOtp(otp: string): Promise<boolean> {
    const confirmReq: ConfirmEmailRequest = {
      email: this.email(),
      otp: otp
    };

    return new Promise<boolean>((resolve) => {
      this.authService.verifyEmail(confirmReq).subscribe({
        next: (verifyRes: any) => {
          if (verifyRes.isSuccess) {
            Swal.fire('Authentication successful', 'You can log in now', 'success');
            this.router.navigate(['/login']);
            resolve(true);
          } else {
            // OTP sai - trả về false để service xử lý
            resolve(false);
          }
        },
        error: () => {
          Swal.fire('System error', 'Please try again later', 'error');
          resolve(false);
        }
      });
    });
  }
}
