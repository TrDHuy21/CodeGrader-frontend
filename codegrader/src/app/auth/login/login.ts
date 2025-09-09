import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoginRequest, ConfirmEmailRequest } from '../auth.model';
import Swal from 'sweetalert2';
import { VerificationUiService } from '../../shared/verification/verification-ui.service';
@Component({
  selector: 'login-app',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginApp {
  constructor(private router: Router, private authService: AuthService) {}
  title = signal('codegrader');

  showPassword = signal(false);
  isLoading = signal(false);

  email = signal('');
  password = signal('');
  rememberMe = signal(false);

  private verificationUi = inject(VerificationUiService);

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  onLogin(): void {
    if (!this.email() || !this.password()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing fields',
        text: 'Please fill all fields',
        confirmButtonText: 'OK',
      });
      return;
    }

    this.isLoading.set(true);

    const request: LoginRequest = {
      userNameOrEmail: this.email(),
      password: this.password(),
    };

    this.authService.login(request).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          console.log('Login success:', res);
          // Token đã được lưu vào cookie trong AuthService, không cần lưu lại
          if (res.data.userDto.roleName == 'Admin') {
            Swal.fire({
              icon: 'success',
              title: 'Login Successful',
              text: 'Welcome to Admin Page!',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/manageuser']);
              }
            });
          } else {
            Swal.fire({
              icon: 'success',
              title: 'Login Successful',
              text: 'Welcome Back!',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/']);
              }
            });
          }
        } else {
          if (
            res.isSuccess == false &&
            res.message == 'Please confirm your email before logging in'
          ) {
            Swal.fire({
              icon: 'error',
              title: 'Login failed',
              text: res.message || 'Invalid credentials',
              confirmButtonText: 'Confirm Email',
            }).then(async (result) => {
              if (result.isConfirmed) {
                this.authService.resendOtp(this.email()).subscribe({
                  next: () => console.log('OTP đầu tiên đã gửi thành công'),
                  error: (err) => console.error('Lỗi gửi OTP lần đầu:', err),
                });
                // Mở modal OTP
                await this.verificationUi.open({
                  email: this.email(),
                  title: 'Confirm email',
                  message: 'Vui lòng nhập mã OTP đã gửi tới email của bạn',
                  length: 6,
                  secondsToExpire: 90,
                  onResend: () => {
                    // Gửi lại OTP
                    this.authService.resendOtp(this.email()).subscribe({
                      next: () => {
                        console.log('Đã gửi lại mã OTP thành công');
                      },
                      error: (error) => {
                        console.error('Lỗi gửi lại OTP:', error);
                        Swal.fire('Lỗi', 'Không thể gửi lại mã OTP, vui lòng thử lại', 'error');
                      },
                    });
                  },
                });

                // Xử lý verify OTP với retry
                await this.verificationUi.handleOtpVerification(async (otp: string) => {
                  return await this.verifyOtp(otp);
                });
              } else if (result.isDismissed) {
                // ❌ Người dùng bấm Cancel hoặc đóng modal
                console.log('Đã hủy');
              }
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Login failed',
              text: res.message || 'Invalid credentials',
              confirmButtonText: 'Try Again',
            });
          }
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'API error',
          text: err.message || 'Something went wrong!',
          confirmButtonText: 'Close',
        });
      },
      complete: () => this.isLoading.set(false),
    });
  }

  onGoogleLogin(): void {
    this.router.navigate(['/manageuser']);
  }
  onSkipSignIn(): void {
    this.router.navigate(['/']);
  }
  onForgotPassword(e: Event): void {
    e.preventDefault();
    this.router.navigate(['/forgotpassword']);
  }
  onSignUp(e: Event): void {
    e.preventDefault();
    this.router.navigate(['/signup']);
  }
  private async verifyOtp(otp: string): Promise<boolean> {
    const confirmReq: ConfirmEmailRequest = {
      email: this.email(),
      otp: otp,
    };

    return new Promise<boolean>((resolve) => {
      this.authService.verifyEmail(confirmReq).subscribe({
        next: (verifyRes: any) => {
          if (verifyRes.isSuccess) {
            Swal.fire('Xác thực thành công', 'Bạn có thể đăng nhập ngay', 'success');
            this.router.navigate(['/login']);
            resolve(true);
          } else {
            // OTP sai - trả về false để service xử lý
            resolve(false);
          }
        },
        error: () => {
          Swal.fire('Lỗi hệ thống', 'Vui lòng thử lại sau', 'error');
          resolve(false);
        },
      });
    });
  }
}
