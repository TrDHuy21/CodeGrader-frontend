import { Component } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabel } from 'primeng/floatlabel';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
@Component({
  selector: `problem-detail-submission-component`,
  imports: [FileUploadModule, ButtonModule, TextareaModule, TableModule, CommonModule],
  standalone: true,
  template: `
    <div class="container  w-[1400px] mx-auto">
      <section
        class="header flex items-center justify-between mb-6 p-4 bg-white shadow rounded-lg mt-6"
      >
        <div class="header-text">
          <h2 class="text-xl font-semibold mb-2">Problem Title</h2>
          <p class="text-gray-600 mb-4">Problem description and details go here.</p>
          <section class="problem-tabs">
            <ul class="flex gap-2 p-1 bg-gray-100 rounded-full w-fit font-medium text-sm">
              <li
                class="px-4 py-2 rounded-full cursor-pointer transition"
                [ngClass]="{
                  'bg-blue-600 text-white': activeTab === 'description',
                  'text-gray-600 hover:bg-gray-200 hover:text-gray-900': activeTab !== 'description'
                }"
                (click)="setActive('description')"
              >
                Description
              </li>

              <li
                class="px-4 py-2 rounded-full cursor-pointer transition"
                [ngClass]="{
                  'bg-blue-600 text-white': activeTab === 'submissions',
                  'text-gray-600 hover:bg-gray-200 hover:text-gray-900': activeTab !== 'submissions'
                }"
                (click)="setActive('submissions')"
              >
                Submission
              </li>
            </ul>
          </section>
        </div>
        <div class="header-badege">
          <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >Medium</span
          >
        </div>
      </section>

      <section class="content p-4 bg-white shadow rounded-lg mb-4">
        <h3 class="text-lg font-semibold mb-4">Submission Table</h3>
        <p>
          Here is where the full problem statement, examples, and any other relevant information
          will be displayed.
        </p>
        <p-table [value]="problems" [tableStyle]="{ width: '100%' }" styleClass="border-0">
          <!-- Header -->
          <ng-template pTemplate="header">
            <tr class="bg-white">
              <th class="text-left py-3 px-4">#</th>
              <th class="text-left py-3 px-4">Score</th>
              <th class="text-right py-3 px-4">Language</th>
              <th class="text-right py-3 px-4">Runtime</th>
              <th class="text-right py-3 px-4">Memory</th>
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
              <td class="py-3 px-4 text-right tabular-nums text-gray-700">
                {{ row.runtimeMs }} ms
              </td>

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
      </section>
    </div>
  `,
})
export class ProblemDetailSubmissionComponent {
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
  activeTab = 'description';

  setActive(tab: string) {
    this.activeTab = tab;
    console.log('Active tab:', this.activeTab);
  }
}
