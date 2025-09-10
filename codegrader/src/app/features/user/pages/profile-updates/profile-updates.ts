import { Component, signal, inject, OnInit } from '@angular/core';
import { AvatarUpload } from '../../components/avatar-upload/avatar-upload';
import { InputForm } from '../../components/profile-form/input-form';
import { TextareaForm } from '../../components/profile-form/textarea-form';
import { ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DatePickerComponent } from '../../../../shared/components/datepicker';
import { CommonFunc } from '../../../../shared/common/common';
import { UserProfileService } from '../../services/user-profile-serive';
import { UserProfileModel } from '../../models/user-profile';
import { finalize } from 'rxjs';
import { ApiResponse } from '../../models/api-respone';
import { ToastComponent } from '../../../../shared/components/toast';
import { ToastMessageOptions } from 'primeng/api';
import { AuthService } from '../../../../auth/auth.service';
import { UpdateAvatarComponent } from './update-avatar';
@Component({
  selector: 'profile-update',
  imports: [
    InputForm,
    ReactiveFormsModule,
    DatePickerComponent,
    TextareaForm,
    ToastComponent,
    UpdateAvatarComponent,
  ],
  standalone: true,
  template: `
    <toast-component [message]="this.message()"></toast-component>
    <div class="mx-auto max-w-5xl px-4 lg:px-0">
      <div class="">
        <!-- LEFT: Avatar form (độc lập) -->

        <!-- avatar-update tự là 1 form -->
        <avatar-update class="block w-full mb-4"></avatar-update>

        <!-- RIGHT: Profile form -->
        <form
          class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
          (submit)="handleSubmit($event)"
          [formGroup]="form"
          novalidate
        >
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-800">Basic Information</h2>
            <p class="text-sm text-gray-500">Cập nhật thông tin cá nhân của bạn</p>
          </div>

          <!-- Body -->
          <div class="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <input-component
              [label]="'Full Name'"
              [placeholder]="'Họ và tên'"
              [control]="form.controls.fullName"
              [loading]="isLoading"
              [classList]="'md:col-span-2'"
            ></input-component>

            <datepicker-component
              [control]="form.controls.birthday"
              [classList]="'md:col-span-1'"
            ></datepicker-component>

            <input-component
              label="Email Address"
              placeholder="Email"
              [control]="form.controls.email"
              [loading]="isLoading"
              [classList]="'md:col-span-1'"
            ></input-component>

            <textarea-component
              [label]="'Bio'"
              placeholder="Bio"
              [control]="form.controls.bio"
              [classList]="'md:col-span-2'"
            ></textarea-component>

            <input-component
              [classList]="'md:col-span-2'"
              label="Github Link"
              placeholder="https://github.com/username"
              [control]="form.controls.githubLink"
              [loading]="isLoading"
            ></input-component>

            <input-component
              [classList]="'md:col-span-2'"
              label="LinkedIn Link"
              placeholder="https://www.linkedin.com/in/username"
              [control]="form.controls.linkedinLink"
              [loading]="isLoading"
            ></input-component>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <!-- <button
              type="reset"
              class="px-5 py-2 rounded-lg border text-sm font-medium bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              Hủy
            </button> -->
            <button
              type="submit"
              class="px-5 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              [disabled]="form.invalid || isLoading"
            >
              {{ isLoading ? 'Đang lưu...' : 'Update Profile' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class ProfileUpdate implements OnInit {
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
  private fb = inject(FormBuilder);
  private common = inject(CommonFunc);
  isLoading = true;
  constructor(private userProfileService: UserProfileService, private authService: AuthService) {}
  username = signal<string | null>(null);

  ngOnInit() {
    // this.form.disable({ emitEvent: false });
    this.username.set(this.authService.getUsername());
    this.userProfileService
      .getUserProfile(this.username() ?? '')
      .pipe(
        finalize(() => {
          this.isLoading = false;
          // this.form.enable({ emitEvent: false });
        })
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.form.patchValue({
            username: data.username,
            fullName: data.fullName,
            email: data.email,
            bio: data.bio,
            githubLink: data.githubLink,
            linkedinLink: data.linkedinLink,
            createdAt: this.common.convertDateNowToISO(Date.now()),
            birthday: data.birthday,
            // avatar: null,
          });
        },
        error: (err) => console.error(err),
      });
  }

  form = this.fb.nonNullable.group({
    username: [''],
    fullName: [''],
    email: '',
    bio: '',
    githubLink: '',
    linkedinLink: '',
    birthday: this.fb.nonNullable.control<Date>(new Date()),
    createdAt: this.common.convertDateNowToISO(Date.now()),
    // avatar: this.fb.control<File | null>(null),
  });

  handleSubmit(event: Event) {
    event.preventDefault();
    if (!this.authService.isLoggedIn()) {
      this.showInfo('warn', 'Warning', 'You must loggin first');
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showInfo('warn', 'Warning', 'All inputs must have content');
      return;
    }
    const d = this.form.get('birthday')?.value;
    const iso = this.common.convertDateObjToISO(d as Date);

    const { birthday, ...rest } = this.form.getRawValue();
    const submitValue = { ...rest, birthday: iso, id: 2 };
    console.log(submitValue);
    this.userProfileService.updateUserProfile(submitValue).subscribe({
      next: (res) => {
        if (res?.isSuccess) {
          this.showInfo('success', 'Success', res.message ?? '');
        } else {
          const msg =
            (res?.errorDetail?.errors ?? []).map((e) => `• ${e.errorMessage}`).join('\n') ||
            res?.message ||
            'Update profile failed!';
          this.showInfo('warn', 'Failed', msg);
        }
        console.log(res);
      },
      error: (err) => {
        const body = err?.error as ApiResponse | undefined;
        const msg =
          (body?.errorDetail?.errors ?? []).map((e) => `• ${e.errorMessage}`).join('\n') ||
          body?.message ||
          'Update profile failed! Please try again.';
        this.showInfo('danger', 'Failed', msg);
      },
    });
  }
}
