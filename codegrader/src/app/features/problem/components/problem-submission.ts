import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
@Component({
  selector: `problem-submission-component`,
  imports: [FileUploadModule, ButtonModule, TextareaModule, TableModule, CommonModule],
  template: ` <section class="content p-4 bg-white shadow rounded-lg mb-4">
    <h3 class="text-lg font-semibold mb-4">Submission Table</h3>
    <p>
      Here is where the full problem statement, examples, and any other relevant information will be
      displayed.
    </p>
    <p-table [value]="problems" [tableStyle]="{ width: '100%' }" styleClass="border-0">
      <!-- Header -->
      <ng-template pTemplate="header">
        <tr class="bg-white">
         
        </tr>
      </ng-template>

      <!-- Body -->
      <ng-template pTemplate="body">
        @for (row of problems; track $index) {
        <tr class="group">
          <!-- STT -->
          <td class="py-3 px-4 text-gray-600">{{ 1 }}</td>

          <!-- Score -->
          <td class="py-3 px-4">
            <a
              [href]="row.link || '#'"
              target="_blank"
              class="font-semibold text-gray-800 hover:underline"
            >
              {{ row.score }} pts
            </a>
          </td>

          <!-- Language -->
          <td class="py-3 px-4 text-right">
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              [ngClass]="langBadgeClass(row.language)"
            >
              {{ row.language }}
            </span>
          </td>

          <!-- Runtime -->
          <td class="py-3 px-4 text-right tabular-nums text-gray-700">{{ row.runtimeMs }} ms</td>

          <!-- Memory -->
          <td class="py-3 px-4 text-right tabular-nums text-gray-700">{{ row.memoryMb }} MB</td>
        </tr>
        }

        <!-- row separator (bo góc & hover) -->
        <tr>
          <td colspan="5" class="!p-0">
            <div class="h-[10px]"></div>
          </td>
        </tr>
      </ng-template>

      <!-- row style via rowStyleClass -->
      <ng-template pTemplate="rowexpansion" let-row></ng-template>
    </p-table>
  </section>`,
  standalone: true,
})
export class ProblemSubmissionComponent {
  problems = [
    { score: 100, language: 'TypeScript', runtimeMs: 56, memoryMb: 38, link: '#' },
    { score: 92, language: 'C#', runtimeMs: 72, memoryMb: 44, link: '#' },
    { score: 88, language: 'Python', runtimeMs: 120, memoryMb: 54, link: '#' },
  ];

  langBadgeClass(lang: string) {
    const l = (lang || '').toLowerCase();
    if (l.includes('typescript') || l.includes('javascript')) {
      return 'bg-blue-100 text-blue-700';
    }
    if (l.includes('python')) {
      return 'bg-yellow-100 text-yellow-700';
    }
    if (l.includes('c#') || l === 'csharp') {
      return 'bg-violet-100 text-violet-700';
    }
    if (l.includes('java')) {
      return 'bg-orange-100 text-orange-700';
    }
    return 'bg-gray-100 text-gray-700';
  }
}
