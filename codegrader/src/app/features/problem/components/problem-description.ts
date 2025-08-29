import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatLabel } from 'primeng/floatlabel';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { EditorModule } from 'primeng/editor';
import { ProblemSignalStore } from '../services/problem-signal-store';

@Component({
  selector: `problem-description-component`,
  imports: [
    CommonModule,
    FloatLabel,
    FileUploadModule,
    ButtonModule,
    TextareaModule,
    SelectModule,
    EditorModule,
  ],
  standalone: true,
  template: ` <section class="content p-4 bg-white shadow rounded-lg mb-4">
      <h3 class="text-lg font-semibold mb-4">{{ problemData()?.prompt }}</h3>
      <p>
        Here is where the full problem statement, examples, and any other relevant information will
        be displayed.
      </p>
      <div class="mt-4">
        @for (item of problemData()?.inOutExamples; track item.id;) {
        <div class="example mb-4">
          <h4 class="text-md font-semibold mb-2">Example {{ item.id }}:</h4>
          <div class="example-content p-4 bg-white shadow rounded-lg">
            <p class="font-semibold">
              Input: <span class="text-gray-500">{{ item.inputExample }}</span>
            </p>
            <p class="font-semibold">
              Output: <span class="text-gray-500">{{ item.outputExample }}</span>
            </p>
            <p class="font-semibold">
              Explanation: <span class="text-gray-500">{{ item.explanation }} </span>
            </p>
          </div>
        </div>
        }

        <div class="constraint-content mb-4">
          <h4 class="text-md font-semibold mb-2">Constraints:</h4>
          <ul class="list-disc list-inside p-4 bg-white shadow rounded-lg">
            <li>1 <= nums.length <= 10^4</li>
            <li>-10^4 <= nums[i] <= 10^4</li>
          </ul>
        </div>
      </div>
    </section>
    <section class="content p-4 bg-white shadow rounded-lg">
      <h3 class="text-lg font-semibold mb-4">Submit Solution</h3>
      <div class="mt-4">
        <p-fileupload
          name="demo[]"
          url="https://www.primefaces.org/cdn/api/upload.php"
          [multiple]="true"
          accept="image/*"
          maxFileSize="1000000"
          mode="advanced"
        >
          <ng-template #empty>
            <div>Drag and drop files to here to upload.</div>
          </ng-template>
        </p-fileupload>
      </div>
    </section>
    <section class="comment p-4 bg-white shadow rounded-lg my-6">
      <h3 class="text-lg font-semibold mb-4">Discussion (3)</h3>
      <div class="flex flex-col gap-1">
        <p-editor formControlName="text" [style]="{ height: '320px' }" />
        <!-- @if (isInvalid('text')) {
            [invalid]="isInvalid('text')"
        <p-message severity="error" size="small" variant="simple">Content is required.</p-message>
        } -->
      </div>
      <button pButton severity="secondary" type="submit" class="w-full mt-4">
        <span pButtonLabel>Submit</span>
      </button>
      <div class="comment-list mt-4 space-y-4">
        <!-- Comment item -->
        <p-floatlabel class="w-full md:w-56" variant="on">
          <p-select inputId="on_label" optionLabel="name" class="w-full" />
          <label for="on_label">Sort</label>
        </p-floatlabel>
        <div class="comment-item flex items-start gap-4 p-4 bg-white shadow rounded-lg">
          <!-- Avatar -->
          <img
            src="https://i.pravatar.cc/40"
            alt="User Avatar"
            class="h-10 w-10 rounded-full object-cover"
          />

          <div class="flex-1">
            <!-- User + date -->
            <div class="flex items-center justify-between mb-1">
              <p class="font-semibold text-gray-800">User123</p>
              <p class="text-sm text-gray-400">August 29, 2025</p>
            </div>

            <!-- Text -->
            <p class="text-gray-700 mb-3">
              This is a sample comment on the problem. Great problem!
            </p>

            <!-- Actions -->
            <div class="flex gap-3">
              <button
                pButton
                type="button"
                label="Like"
                icon="pi pi-thumbs-up"
                class="p-button-sm p-button-text"
              ></button>
              <button
                pButton
                type="button"
                label="Reply"
                icon="pi pi-reply"
                class="p-button-sm p-button-text"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </section>`,
})
export class ProblemDescriptionComponent {
  private store = inject(ProblemSignalStore);
  problemData = this.store.problem;

  constructor() {
    console.log(this.problemData());
  }
}
