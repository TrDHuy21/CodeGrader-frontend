import { Component, inject } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UserProfileService } from '../../services/user-profile-serive';
import { CommonModule } from '@angular/common';
import { Password } from 'primeng/password';
import { finalize } from 'rxjs';
import { ApiResponse } from '../../models/api-respone';

@Component({
  selector: 'change-password',
  standalone: true,
  imports: [FloatLabel, ButtonModule, ReactiveFormsModule, CommonModule, Password],
  template: `
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
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  //   private common = inject(CommonFunc);
  isLoading = true;
  constructor(private userProfileService: UserProfileService) {}

  formChangePassword = this.fb.nonNullable.group({
    currentPassword: ['', [Validators.required, Validators.minLength(6)]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  handleSubmit(e: Event) {
    e.preventDefault();

    if (this.formChangePassword.invalid) {
      this.formChangePassword.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = this.formChangePassword.getRawValue();
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }

    this.isLoading = true;

    this.userProfileService
      .updatePassword(2, currentPassword, newPassword)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess) {
            alert('Change password successfully!');
            this.formChangePassword.reset();
          } else {
            const msg =
              (res?.errorDetail?.errors ?? []).map((e) => `• ${e.errorMessage}`).join('\n') ||
              res?.message ||
              'Change password failed!';
            alert(msg);
          }
          console.log(res);
        },
        error: (err) => {
          const body = err?.error as ApiResponse | undefined;
          const msg =
            (body?.errorDetail?.errors ?? []).map((e) => `• ${e.errorMessage}`).join('\n') ||
            body?.message ||
            'Change password failed! Please try again.';
          alert(msg);
          console.error(err);
        },
      });
  }
}
