import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
@Component({
  selector: 'textarea-component',
  imports: [ReactiveFormsModule, FloatLabelModule, TextareaModule],
  template: `
    <p-floatlabel variant="in">
      <textarea
        pTextarea
        [formControl]="control"
        [placeholder]="placeholder"
        class="w-full"
        id="in_label"
        class="w-full h-40"
      ></textarea>
      <label for="in_label">{{ label }}</label>
    </p-floatlabel>
  `,
})
export class TextareaForm {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() control!: FormControl<string | null>;
  @Input() disable: boolean = true;
}
