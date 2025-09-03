import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UserProfileService } from '../../services/user-profile-serive';
import { CommonModule } from '@angular/common';
import { AvatarUpload } from '../../components/avatar-upload/avatar-upload';
@Component({
  selector: `avatar-update`,
  standalone: true,
  imports: [ButtonModule, ReactiveFormsModule, CommonModule, AvatarUpload],
  template: `<form
    class="container w-full max-w-2xl mx-auto"
    (submit)="handleSubmit($event)"
    [formGroup]="formChangeAvatar"
  >
    <div class="px-6 py-4 grid grid-cols-1 gap-4">
      <avatar-component [control]="formChangeAvatar.controls.avatar"></avatar-component>
    </div>
    <div [classList]="'col-span-2 align-self-center justify-self-center'">
      <button
        type="reset"
        class="px-5 py-2 rounded border text-sm font-medium transition
           bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200 hover:text-gray-800 mx-2
           cursor-pointer"
      >
        Cancel
      </button>

      <button
        type="submit"
        class="px-5 py-2.5 rounded border text-sm font-medium transition
           bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600
            cursor-pointer"
      >
        Save Changes
      </button>
    </div>
  </form>`,
})
export class UpdateAvatarComponent {
  private fb = inject(FormBuilder);
  private userProfileService = inject(UserProfileService);
  formChangeAvatar = this.fb.group({
    avatar: [null as File | null],
  });
  constructor() {}
  
  handleSubmit(e: Event) {
    e.preventDefault();
    const file = this.formChangeAvatar.value.avatar;
    if (!file) {
      alert('Please select a file');
      return;
    }
    this.userProfileService.updateAvatar(file).subscribe({
      next: (res) => console.log('OK', res),
      error: (err) => {
        const msg = err?.error?.errors?.Avatar?.[0] || err?.error?.title || 'Upload failed';
        alert(msg);
        console.error(err);
      },
    });
  }
}
