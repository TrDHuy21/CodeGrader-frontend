import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatLabel } from 'primeng/floatlabel';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { EditorModule } from 'primeng/editor';
import { ProblemSignalStore } from '../services/problem-signal-store';
import { CommentListComponent } from './comment/comment-list';
import { GradingService } from '../services/grading-service';
import { error } from 'console';
import { GradingModel } from '../models/Grading/grading-model';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { ActivatedRoute } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { KnobModule } from 'primeng/knob';
import { ResultsCardComponent } from './result-card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: `problem-description-component`,
  imports: [
    CommonModule,
    FileUploadModule,
    ButtonModule,
    TextareaModule,
    SelectModule,
    EditorModule,
    CommentListComponent,
    CardModule,
    BadgeModule,
    OverlayBadgeModule,
    DividerModule,
    KnobModule,
    ResultsCardComponent,
    ProgressSpinnerModule,
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
      </div>
    </section>
    <section class="content p-4 bg-white shadow rounded-lg">
      <h3 class="text-lg font-semibold mb-4">Submit Solution</h3>
      <form class="mt-4">
        <p-fileupload
          name="demo[]"
          [multiple]="true"
          maxFileSize="1000000"
          (onSelect)="onFileChange($event)"
          (uploadHandler)="onUpload($event, problemData()?.name ?? '')"
          [customUpload]="true"
          (onClear)="resetResults()"
        >
          <ng-template
            pTemplate="content"
            let-files
            let-uploadedFiles="uploadedFiles"
            let-removeFileCallback="removeFileCallback"
            let-removeUploadedFileCallback="removeUploadedFileCallback"
          >
            <div class="flex flex-col gap-4 pt-4">
              @if(!isSuccess()) {
              <div class="flex flex-wrap gap-3">
                <div
                  *ngFor="let file of files; let i = index"
                  class="p-3  rounded flex items-center gap-3"
                >
                  <span class="font-medium">{{ file.name }}</span>
                  <span class="text-sm opacity-70">({{ file.size }} bytes)</span>
                  <p-badge value="Pending" severity="warn" />
                  <p-button
                    icon="pi pi-times"
                    [outlined]="true"
                    [rounded]="true"
                    severity="danger"
                    (onClick)="removeAndReset(i, removeFileCallback)"
                  />
                </div>
              </div>
              } @else {
              <div class="flex flex-wrap gap-3">
                <div
                  *ngFor="let file of files; let i = index"
                  class="p-3 rounded flex items-center gap-3"
                >
                  <span class="font-medium">{{ file.name }}</span>
                  <span class="text-sm opacity-70">({{ file.size }} bytes)</span>
                  <p-badge value="Success" severity="success" />
                  <p-button
                    icon="pi pi-times"
                    [outlined]="true"
                    [rounded]="true"
                    severity="danger"
                    (onClick)="removeAndReset(i, removeFileCallback)"
                  />
                </div>
              </div>
              }
            </div>
          </ng-template>
        </p-fileupload>
        @if(isSuccess()) {
        <results-card [results]="results()" />
        }
      </form>
    </section>
    <section class="comment p-4 bg-white shadow rounded-lg my-6">
      @if (problemId() !== null) {
      <comment-list-component [problemId]="problemId()!"></comment-list-component>
      } @else {
      <p>Loading…</p>
      }
    </section>`,
})
export class ProblemDescriptionComponent implements OnInit {
  private route = inject(ActivatedRoute); // phải inject thế này
  private store = inject(ProblemSignalStore);
  problemData = this.store.problem;
  isSuccess = signal(false);
  isLoading = signal(true);
  problemId = signal<number | null>(null);

  constructor(private gradingService: GradingService) {
    const parent = this.route.parent ?? this.route.pathFromRoot.at(-2)!;
    const raw = parent.snapshot.paramMap.get('id');
    const n = raw != null ? Number(raw) : NaN;
    this.problemId.set(Number.isFinite(n) ? n : null);
  }

  file = signal<File | null>(null);
  results = signal<GradingModel | null>(null);
  ngOnInit(): void {}

  onFileChange(e: any) {
    const f: File | undefined = e.files?.[0];
    if (!f) return;

    if (f.size > 2 * 1024 * 1024) {
      alert('File size exceeds 2MB limit.');
      // Xóa file đã chọn khỏi UI (PrimeNG cho phép clear qua options)
      e.options?.clear && e.options.clear();
      return;
    }

    this.file.set(f);
    this.isSuccess.set(false);
    this.results.set(null);
  }
  onUpload(e: any, assignment: string) {
    const f = this.file();
    if (!f) {
      console.warn('Chưa chọn file');
      return;
    }
    this.gradingService.post(assignment, f).subscribe({
      next: (res) => {
        e.options?.clear?.(); // reset UI
        this.results.set(res.data);
        this.file.set(null);
        this.isSuccess.set(true);
      },
      error: (err) => console.error(err),
    });
  }
  resetResults() {
    this.isSuccess.set(false);
    this.results.set(null);
  }

  removeAndReset(i: number, removeCb: (index: number) => void) {
    removeCb(i); // xoá file
    this.resetResults(); // ẩn results-card
  }

  removeUploadedAndReset(i: number, removeUploadedCb: (index: number) => void) {
    removeUploadedCb(i);
    this.resetResults();
  }
}
