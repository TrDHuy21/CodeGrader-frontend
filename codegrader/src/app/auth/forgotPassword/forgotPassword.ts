import { Component, signal, inject, effect, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { CommonFunc } from '../../shared/common/common';

declare var bootstrap: any; // để dùng Bootstrap Modal

@Component({
  selector: 'app-forgetPassword',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: 'forgotPassword.html',
  styleUrls: ['forgotPassword.css'],
})
export class ForgotPassword {
  email = signal('');
  otp = signal('');
  newPassword = signal('');
  confirmPassword = signal('');
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  isLoading = signal(false);
  passwordStrength = signal(0);

  private abc = inject(CommonFunc);

  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() {
    effect(() => {
      this.passwordStrength.set(this.abc.calculateStrength(this.newPassword()));
    });
  }

  passwordStrengthText = computed(() => this.abc.getPasswordStrengthText(this.passwordStrength()));

  isFormValid = computed(() => {
    const hasOtp = this.otp() && this.otp().trim() !== '';
    const hasPassword = this.newPassword() && this.newPassword().length >= 6;
    const hasConfirmPassword = this.confirmPassword() && this.confirmPassword().trim() !== '';
    const passwordsMatch = this.newPassword() === this.confirmPassword();

    return hasOtp && hasPassword && hasConfirmPassword && passwordsMatch;
  });

  async onRequestOtp() {
    if (!this.email()) {
      Swal.fire('Error', 'Please enter a Email !', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email())) {
      Swal.fire('Error', 'Please enter a valid email !', 'error');
      return;
    }

    this.isLoading.set(true);
    this.authService.forgotPassword(this.email()).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.isSuccess) {
          this.openOtpModal();
        } else {
          // Email không tồn tại hoặc lỗi khác
          Swal.fire('Error', response.message || 'Email does not exist in the system !', 'error');
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        Swal.fire('Error', error.error?.message || 'Unable to send OTP, please try again !', 'error');
      },
    });
  }

  openOtpModal() {
    const modalEl = document.getElementById('otpModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  onConfirmOtp() {
    if (!this.otp() || !this.newPassword()) {
      Swal.fire('Error', 'Please enter both OTP and new password', 'error');
      return;
    }

    const payload = {
      email: this.email(),
      otp: this.otp(),
      newPassword: this.newPassword(),
    };

    this.authService.updateNewPassword(payload).subscribe({
      next: (res: any) => {
        if (res.isSuccess) {
          // Close OTP modal
          const modalEl = document.getElementById('otpModal');
          if (modalEl) {
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) {
              modalInstance.hide();
            }
          }
          // Remove leftover backdrop if any
          document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
          document.body.classList.remove('modal-open');

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: res.message || 'Password has been reset successfully',
            showConfirmButton: true,
            allowOutsideClick: false,
            willClose: () => {
              this.router.navigate(['/login']);
            },
          });
        } else {
          let errorMessage = 'Validation errors occurred';

          if (res.errorDetail?.errors?.length > 0) {
            errorMessage = res.errorDetail.errors
              .map((e: any) => `${e.field}: ${e.errorMessage}`)
              .join('<br>');
          }

          Swal.fire({
            icon: 'error',
            title: 'Error',
            html: errorMessage,
          });
        }
      },
      error: (err) => {
        let errorMessage = 'An unexpected error occurred. Please try again later.';

        if (err.error?.errorDetail?.errors?.length > 0) {
          errorMessage = err.error.errorDetail.errors
            .map((e: any) => `${e.field}: ${e.errorMessage}`)
            .join('<br>');
        }

        Swal.fire({
          icon: 'error',
          title: 'System Error',
          html: errorMessage,
        });
      },
    });
  }

  takemeback() {
    this.router.navigate(['/login']);
  }

  onSignUp(e: Event): void {
    e.preventDefault();
    this.router.navigate(['/signup']);
  }

  togglePassword() {
    this.showPassword.update((v) => !v);
  }
  toggleConfirmPassword() {
    this.showConfirmPassword.update((v) => !v);
  }
}
