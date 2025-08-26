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

  passwordStrengthText = computed(() =>
    this.abc.getPasswordStrengthText(this.passwordStrength())
  );

  isFormValid = computed(() => {
    const hasOtp = this.otp() && this.otp().trim() !== '';
    const hasPassword = this.newPassword() && this.newPassword().length >= 6;
    const hasConfirmPassword = this.confirmPassword() && this.confirmPassword().trim() !== '';
    const passwordsMatch = this.newPassword() === this.confirmPassword();
    
    return hasOtp && hasPassword && hasConfirmPassword && passwordsMatch;
  });

  async onRequestOtp() {
    if (!this.email()) {
      Swal.fire('Lỗi', 'Vui lòng nhập email', 'error');
      return;
    }

    this.isLoading.set(true);
    this.authService.forgotPassword(this.email()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.openOtpModal();
      },
      error: () => {
        this.isLoading.set(false);
        Swal.fire('Lỗi', 'Không thể gửi OTP, vui lòng thử lại', 'error');
      }
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
      Swal.fire('Lỗi', 'Vui lòng nhập đầy đủ OTP và mật khẩu mới', 'error');
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
          Swal.fire('Thành công', 'Mật khẩu đã được đặt lại. Hãy đăng nhập ngay', 'success');
          this.router.navigate(['/login']);
        } else {
          Swal.fire('Lỗi', res.message || 'OTP không hợp lệ', 'error');
        }
      },
      error: () => {
        Swal.fire('Lỗi hệ thống', 'Vui lòng thử lại sau', 'error');
      }
    });
  }

  takemeback() {
    this.router.navigate(['/login']);
  }

  onSignUp(e: Event): void {
    e.preventDefault();
    this.router.navigate(['/signup']);
  }

  togglePassword() { this.showPassword.update(v => !v); }
  toggleConfirmPassword() { this.showConfirmPassword.update(v => !v); }
}
