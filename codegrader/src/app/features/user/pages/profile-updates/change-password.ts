import { Component, inject, OnInit, signal } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UserProfileService } from '../../services/user-profile-serive';
import { CommonModule } from '@angular/common';
import { Password } from 'primeng/password';
import { finalize } from 'rxjs';
import { ApiResponse } from '../../models/api-respone';
import { ToastComponent } from '../../../../shared/components/toast';
import { ToastMessageOptions } from 'primeng/api';
import { AuthService } from '../../../../auth/auth.service';
@Component({
  selector: 'change-password',
  standalone: true,
  imports: [FloatLabel, ButtonModule, ReactiveFormsModule, CommonModule, Password, ToastComponent],
  template: `
    <toast-component [message]="this.message()"></toast-component>

    <form
      class="container w-full max-w-2xl mx-auto"
      (submit)="handleSubmit($event)"
      [formGroup]="formChangePassword"
    >
      <div class="px-6 py-4 grid grid-cols-1 gap-4">
        <p-floatlabel variant="on">
          <p-password
            inputId="cpw"
            formControlName="currentPassword"
            [feedback]="false"
            class="w-full  select-none "
            fluid="true"
            [toggleMask]="true"
          />
          <label for="cpw">Current Password</label>
        </p-floatlabel>

        <p-floatlabel variant="on">
          <p-password
            inputId="npw"
            formControlName="newPassword"
            class="w-full  select-none "
            fluid="true"
            [toggleMask]="true"
          />
          <label for="npw">New Password</label>
        </p-floatlabel>

        <p-floatlabel variant="on">
          <p-password
            inputId="cfpw"
            formControlName="confirmPassword"
            [feedback]="false"
            class="w-full  select-none "
            fluid="true"
            [toggleMask]="true"
          />
          <label for="cfpw">Confirm New Password</label>
        </p-floatlabel>

        <div class="flex justify-center">
          <button
            type="reset"
            class="px-5 py-2 rounded border text-sm font-medium bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200 hover:text-gray-800 mx-2
              select-none  cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="px-5 py-2.5 rounded border text-sm font-medium bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600 mx-2
            cursor-pointer"
          >
            Change Password
          </button>
        </div>
      </div>
    </form>
  `,
})
export class ChangePasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  //   private common = inject(CommonFunc);
  isLoading = true;
  message = signal<ToastMessageOptions | ToastMessageOptions[] | null>(null);
  showInfo(severity: string, summary: string, detail: string) {
    this.message.set({
      severity: severity,
      summary: summary,
      detail: detail,
      key: 'tr',
      life: 3000,
    });
  }
  constructor(private userProfileService: UserProfileService, private authService: AuthService) {}

  username = signal<string | null>(null);
  userid = signal<number | null>(null);
  ngOnInit(): void {
    const uname = this.authService.getUsername();
    this.username.set(uname);
    if (uname) {
      this.userProfileService.getUserProfile(uname).subscribe({
        next: (res) => this.userid.set(res.id),
        error: (err) => console.error(err),
      });
    }
  }

  formChangePassword = this.fb.nonNullable.group({
    currentPassword: ['', [Validators.required, Validators.minLength(6)]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  handleSubmit(e: Event) {
    e.preventDefault();
    if (!this.authService.isLoggedIn()) {
      this.showInfo('warn', 'Warning', 'You must loggin first');
      return;
    } else {
      if (this.formChangePassword.invalid) {
        this.formChangePassword.markAllAsTouched();
        this.showInfo('warn', 'Warning', 'All inputs must have content');
        return;
      }

      const { currentPassword, newPassword, confirmPassword } =
        this.formChangePassword.getRawValue();
      if (newPassword !== confirmPassword) {
        this.showInfo('warn', 'Warning', 'New password and confirm password do not match');
        return;
      }

      this.isLoading = true;
      const userId = this.userid();
      if (!userId) {
        console.warn('UserId chưa sẵn sàng. Vui lòng thử lại sau.');
        return;
      }
      this.userProfileService
        .updatePassword(userId, currentPassword, newPassword)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (res) => {
            if (res?.isSuccess) {
              this.showInfo('success', 'Success', res.message ?? '');
              this.formChangePassword.reset();
            } else {
              const msg =
                (res?.errorDetail?.errors ?? []).map((e) => `• ${e.errorMessage}`).join('\n') ||
                res?.message ||
                'Change password failed!';
              this.showInfo('warn', 'Warning', msg);
            }
          },
          error: (err) => {
            const body = err?.error as ApiResponse | undefined;
            const msg =
              (body?.errorDetail?.errors ?? []).map((e) => `• ${e.errorMessage}`).join('\n') ||
              body?.message ||
              'Change password failed! Please try again.';
            this.showInfo('warn', 'Warning', msg);
          },
        });
    }
  }
}
