import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
@Component({
  selector: `problem-table-component`,
  imports: [FloatLabel, InputTextModule, TableModule, CommonModule],
  template: `
    <div>
      <p-floatlabel variant="on">
        <input pInputText id="on_label" autocomplete="off" />
        <label for="on_label"> Search</label>
      </p-floatlabel>
      <p-table [value]="problems" [tableStyle]="{ width: '100%' }">
        <!-- Header -->
        <ng-template pTemplate="header">
          <tr class="hidden md:table-row">
            <th class="text-left">Title</th>
            <th class="text-right w-48">Acceptance</th>
            <th class="text-right w-32">Difficulty</th>
          </tr>
        </ng-template>

        <!-- Body -->
        <ng-template pTemplate="body" let-p let-rowIndex="rowIndex">
          <!-- Row wrapper để bo góc + nền xám -->
          <tr class="">
            <td class="!p-0 bg-gray-100">
              <!-- Left: index + title (link) -->
              <a
                class="font-semibold text-gray-800 hover:underline flex items-center gap-3"
                [href]="p.link || '#'"
                target="_blank"
              >
                <span class="tracking-wide">{{ p.code || rowIndex + 1 }}.</span>
                <span class="leading-6">{{ p.title }}</span>
              </a>
            </td>
            <td>
              <!-- Right: acceptance + difficulty -->
              <span class="text-gray-500 font-medium">{{ p.acceptance | number : '1.0-1' }}%</span>
            </td>
            <td class="text-right">
              <span
                class="text-base md:text-lg font-semibold"
                [ngClass]="getDiffClass(p.difficulty)"
              >
                {{ p.difficulty }}
              </span>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
})
export class ProblemTableComponent {
  problems = [
    { code: 175, title: 'Combine Two Tables', acceptance: 83.8, difficulty: 'Easy', link: '#' },
    { code: 176, title: 'Another Problem', acceptance: 83.8, difficulty: 'Medium', link: '#' },
    { code: 177, title: 'Hard One', acceptance: 83.8, difficulty: 'Hard', link: '#' },
  ];

  getDiffClass(diff: string) {
    switch ((diff || '').toLowerCase()) {
      case 'easy':
        return 'text-emerald-500';
      case 'medium':
        return 'text-amber-500';
      case 'hard':
        return 'text-rose-600';
      default:
        return 'text-gray-500';
    }
  }
}
