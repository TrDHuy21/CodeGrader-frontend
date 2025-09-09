// results-card.component.ts
import { Component, computed, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { KnobModule } from 'primeng/knob';
import { NgClass } from '@angular/common';
import { GradingModel } from '../models/Grading/grading-model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'results-card',
  standalone: true,
  imports: [
    CardModule,
    BadgeModule,
    DividerModule,
    TagModule,
    KnobModule,
    CommonModule,
    FormsModule,
  ],
  styles: [
    `
      .ring-wrap {
        position: relative;
        display: inline-block;
      }
      .ring-rotor {
        position: absolute;
        inset: 0;
        transform-origin: center;
        pointer-events: none;
      }
      .ring-rotor::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        width: 14px;
        height: 14px;
        border-radius: 9999px;
        transform: translate(-50%, -50%) translateY(calc(-1 * var(--r, 66px)));
        background: var(--dot, #10b981);
        box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.15);
      }
    `,
  ],
  template: `
    <p-card class="mt-4 overflow-hidden">
      <div class="flex gap-6 items-center">
        <!-- Info -->
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-500">Programming Language:</span>
            <span class="inline-flex items-center">
              <span class="px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                {{ results()?.programmingLanguage || '—' }}
              </span>
            </span>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-500">Review:</span>
            <p-tag [value]="level().label" [severity]="level().severity"></p-tag>
          </div>

          <div class="text-gray-500">
            <span class="text-sm">Point:</span>
            <span class="text-lg font-semibold ml-2">{{ point() }} / 10</span>
          </div>
        </div>

        <!-- Circle score -->
        <div
          class="justify-self-center ring-wrap"
          [style.--r.px]="knobSize() / 2 - stroke()"
          [style.--dot]="level().color"
        >
          <p-knob
            [ngModel]="point() * 10"
            [readonly]="true"
            [size]="knobSize()"
            [strokeWidth]="stroke()"
            valueColor="SlateGray"
            rangeColor="MediumTurquoise"
            [textColor]="'#CBD5E1'"
          ></p-knob>
          <!-- chấm tròn chạy theo cung -->
        </div>
      </div>

      <p-divider class="my-5"></p-divider>

      <!-- Criteria -->
      <div class="grid gap-3 md:grid-cols-2">
        <div class="p-3 rounded-xl bg-slate-50">
          <div class="text-sm text-gray-500 mb-1">Algorithm</div>
          <div class="font-medium">{{ results()?.evaluationCriteria?.algorithm || '—' }}</div>
        </div>
        <div class="p-3 rounded-xl bg-slate-50">
          <div class="text-sm text-gray-500 mb-1">Clean code</div>
          <div class="font-medium">{{ results()?.evaluationCriteria?.cleanCode || '—' }}</div>
        </div>
      </div>
    </p-card>
  `,
})
export class ResultsCardComponent {
  results = input<GradingModel | null>(null);
  knobSize = input<number>(160);
  stroke = input<number>(14);

  point = computed(() => {
    const raw = this.results()?.point ?? 0;
    const clamped = Math.max(0, Math.min(10, raw));
    return Math.round(clamped * 10) / 10;
  });

  percent = computed(() => Math.round(this.point() * 10)); // 0..100

  // Kém <5, Khá 5–7.5, Tốt >7.5
  level = computed(() => {
    const p = this.point();
    if (p < 5) return { label: 'Terrible', severity: 'danger' as const, color: '#ef4444' };
    if (p <= 7.5) return { label: 'Normal', severity: 'warning' as const, color: '#f59e0b' };
    return { label: 'Good', severity: 'success' as const, color: '#10b981' };
  });
}
