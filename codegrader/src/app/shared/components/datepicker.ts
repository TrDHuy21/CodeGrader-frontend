import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: `datepicker-component`,
  imports: [DatePickerModule, ReactiveFormsModule, FloatLabelModule],
  template: ` <p-floatlabel variant="in">
    <p-datepicker
      ngSkipHydration
      [formControl]="control"
      [readonlyInput]="true"
      inputId="in_label"
      showIcoc
      iconDisplay="input"
    />
    <label for="in_label">Birthday</label>
    <p></p>
  </p-floatlabel>`,
  standalone: true,
})
export class DatePickerComponent {
  @Input() control!: FormControl<Date>; // <-- BẮT BUỘC có dòng này
}
