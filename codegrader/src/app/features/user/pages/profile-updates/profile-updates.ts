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

@Component({
  selector: 'profile-update',
  imports: [AvatarUpload, InputForm, ReactiveFormsModule, DatePickerComponent, TextareaForm],
  standalone: true,
  template: `
    <form
      class="container w-full max-w-2xl mx-auto"
      (submit)="handleSubmit($event)"
      [formGroup]="form"
    >
      <div class="basic-information px-6 py-4 grid grid-cols-2 gap-4">
        <!-- <avatar-component class="col-span-2" [control]="form.controls.avatar"></avatar-component> -->
        <!-- <input-component
        [label]="'Username'"
        placeholder="Username"
        [control]="form.controls.username"
      ></input-component> -->
        <input-component
          [label]="'Full Name'"
          [placeholder]="'fullName'"
          [control]="form.controls.fullName"
          [loading]="isLoading"
        >
          ></input-component
        >
        <datepicker-component [control]="form.controls.birthday"></datepicker-component>
        <textarea-component
          [label]="'Bio'"
          [classList]="'col-span-2'"
          placeholder="Bio"
          [control]="form.controls.bio"
        ></textarea-component>
        <input-component
          label="Email Address"
          placeholder="Email Address"
          [control]="form.controls.email"
          [classList]="'col-span-2'"
          [loading]="isLoading"
        >
        </input-component>
        <input-component
          [classList]="'col-span-2'"
          label="Github Link"
          placeholder="github"
          [control]="form.controls.githubLink"
          [loading]="isLoading"
        ></input-component>
        <input-component
          [classList]="'col-span-2'"
          label="Linked Link"
          placeholder="linkedin"
          [control]="form.controls.linkedinLink"
          [loading]="isLoading"
        ></input-component>
        <div [classList]="'col-span-2 align-self-center justify-self-center'">
          <button
            type="button"
            (click)="handleClick()"
            class="px-5 py-2 rounded border text-sm font-medium transition
           bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200 hover:text-gray-800 mx-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            (click)="handleClick()"
            class="px-5 py-2.5 rounded border text-sm font-medium transition
           bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </form>
  `,
})
export class ProfileUpdate implements OnInit {
  private fb = inject(FormBuilder);
  private common = inject(CommonFunc);
  isLoading = true;
  constructor(private userProfileService: UserProfileService) {}

  ngOnInit() {
    // this.form.disable({ emitEvent: false });
    this.userProfileService
      .getUserProfile('user')
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
  handleClick() {
    console.log('clicked');
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    if (this.form.invalid) {
      this.form.markAllAsTouched();
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
          alert('Change password successfully!');
          this.form.reset();
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
