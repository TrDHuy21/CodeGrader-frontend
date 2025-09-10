import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UserProfileService } from '../../services/user-profile-serive';
import { CommonModule } from '@angular/common';
import { AvatarUpload } from '../../components/avatar-upload/avatar-upload';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { ToastComponent } from '../../../../shared/components/toast';
import { ToastMessageOptions } from 'primeng/api';
import { ApiResponse } from '../../models/api-respone';
@Component({
  selector: `avatar-update`,
  standalone: true,
  imports: [ButtonModule, ReactiveFormsModule, CommonModule, AvatarUpload, ToastComponent],
  template: `
    <toast-component [message]="this.message()"></toast-component>

    <form
      class=" mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
      (submit)="handleSubmit($event)"
      [formGroup]="formChangeAvatar"
    >
      <div class="px-6 py-4 border-b border-gray-100">
        <h2 class="text-lg font-semibold text-gray-800">Change Avatar</h2>
        <p class="text-sm text-gray-500">Upload a new profile picture</p>
      </div>

      <div class="px-6 py-8 grid grid-cols-1 gap-6">
        <avatar-component
          [control]="formChangeAvatar.controls.avatar"
          [imgSrc]="imgSrc()"
        ></avatar-component>
      </div>

      <div class="px-6 py-4 flex justify-end gap-3 border-t border-gray-100 bg-gray-50">
        <!-- <button
          type="reset"
          class="px-5 py-2 rounded-lg border text-sm font-medium transition
             bg-white text-gray-600 border-gray-300 hover:bg-gray-100 hover:text-gray-800
             focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Cancel
        </button> -->

        <button
          type="submit"
          class="px-5 py-2 rounded-lg text-sm font-medium transition
             bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2
             focus:ring-blue-500 focus:ring-offset-1"
        >
          Save Changes
        </button>
      </div>
    </form>
  `,
})
export class UpdateAvatarComponent implements OnInit {
  private fb = inject(FormBuilder);
  // private userProfileService = inject(UserProfileService);
  imgSrc = signal<string>('');
  formChangeAvatar = this.fb.group({
    avatar: [null as File | null],
  });
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
  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.userProfileService
        .getUserProfile('user')
        .pipe(
          finalize(() => {
            // this.form.enable({ emitEvent: false });
          })
        )
        .subscribe({
          next: (data) => {
            console.log(data);
            this.imgSrc.set(data.avatar ?? '');
          },
          error: (err) => console.error(err),
        });
    }
  }

  handleSubmit(e: Event) {
    e.preventDefault();
    if (!this.authService.isLoggedIn()) {
      this.showInfo('warn', 'Warning', 'You must loggin first');
      return;
    }
    const file = this.formChangeAvatar.value.avatar;
    if (!file) {
      alert('Please select a file');
      return;
    }
    this.userProfileService.updateAvatar(file).subscribe({
      next: (res) => {
        if (res?.isSuccess) {
          this.showInfo('success', 'Success', res.message ?? '');
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
