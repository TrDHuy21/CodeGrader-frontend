import { Component, Input, ElementRef, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { UserService } from '../../../admin/userManage/user.service';
import { UserProfileService } from '../../services/user-profile-serive';
import { finalize } from 'rxjs';
@Component({
  selector: `avatar-component`,
  imports: [ReactiveFormsModule],
  template: ` <div class="flex gap-4">
    <div class="aspect-square  rounded-full h-20">
      <img
        alt="Avatar"
        class="w-full h-full object-cover rounded-full  "
        [id]="'img'"
        [src]="imgSrc"
      />
    </div>
    <div class="flex flex-col gap-2 items-start">
      <input
        type="file"
        name="avatar"
        accept="image/png,image/jpeg,image/gif"
        class="custom-file-input"
        (change)="onFileChange($event)"
      />
      <span class="text-gray-500 text-sm"> JPG, PNG hoặc GIF, tối đa 2MB. </span>
    </div>
  </div>`,
  standalone: true,
  styleUrls: ['./upload-file.css'],
})
export class AvatarUpload implements OnInit {
  @Input() control!: FormControl<File | null>;
  file = signal<File | null>(null);
  previewUrl = signal<string>('');
  uploadUrl = signal<string>('');
  // imgSrc = signal<string | null>(localStorage.getItem('avatar'));
  @Input() imgSrc: string = '';

  constructor(private el: ElementRef) {}
  ngOnInit() {
    console.log(this.imgSrc)
    // this.form.disable({ emitEvent: false });
  }
  // ngAfterViewInit() {
  //   const imgElement = this.el.nativeElement.querySelector('#img');
  //   console.log(imgElement); // Output: "myElement"
  // }
  // ngOnInit() {
  //   const imgElement = this.el.nativeElement.querySelector('#img');
  //   imgElement.src = localStorage.getItem('avatar');
  // }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const f = input.files?.[0] || null;
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) {
      alert('File size exceeds 2MB limit.');
      return;
    }
    this.file.set(f);
    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result as string);
    reader.readAsDataURL(f);
    console.log('File selected:', f);
    const imgElement = this.el.nativeElement.querySelector('#img');
    imgElement.src = URL.createObjectURL(f);
    this.control.setValue(f);
  }
}
