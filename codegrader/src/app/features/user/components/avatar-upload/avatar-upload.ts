import {
  Component,
  Input,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { read } from 'node:fs';
@Component({
  selector: `avatar-component`,
  imports: [ReactiveFormsModule],
  template: ` <div class="flex gap-4">
    <div class="aspect-square border rounded-full h-20">
      <img alt="Avatar" class="w-full h-full object-cover" />
    </div>
    <div class="flex flex-col gap-2 items-start">
      <input
        type="file"
        name="avatar"
        accept="image/png,image/jpeg,image/gif"
        class="custom-file-input"
        [formControl]="control"
        (change)="onFileChange($event)"
      />
      <span class="text-gray-500 text-sm"> JPG, PNG hoặc GIF, tối đa 2MB. </span>
    </div>
  </div>`,
  standalone: true,
  styleUrls: ['./upload-file.css'],
})
export class AvatarUpload {
  @Input({ required: true }) control!: FormControl<File | null>;
  file = signal<File | null>(null);
  previewUrl = signal<string>('');
  uploadUrl = signal<string>('');

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
  }
}
