import { Component, Input, model } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SkeletonModule } from 'primeng/skeleton';
import { CommonModule } from '@angular/common';
import { PasswordModule } from 'primeng/password';
@Component({
  selector: `input-component`,
  imports: [ReactiveFormsModule, InputTextModule, FloatLabelModule, SkeletonModule, CommonModule, PasswordModule],
  template: `
    <!-- @if (!loading) { -->

    <p-floatlabel variant="in">
      <input
        pInputText
        [formControl]="control"
        [placeholder]="placeholder"
        [formControl]="control"
        class="w-full"
        id="in_label"
        oninput="handleChange($event)"
        [type]="type || 'text'"
      />
      <label for="in_label">{{ label }}</label>
    </p-floatlabel>
    <!-- } @else {
    <p-floatlabel variant="in">
      <p-skeleton width="100%" height="3.55rem"></p-skeleton>
      <label for="in_label">{{ label }}</label>
    </p-floatlabel>

    } -->
  `,
  standalone: true,
})
export class InputForm {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() control!: FormControl<string>;
  @Input() disable: boolean = true;
  @Input() loading = false;
  @Input() type: 'text' | 'password' | 'email' | 'number' = 'text';

  handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      console.log('Input changed:', target.value);
    }
  }
}
