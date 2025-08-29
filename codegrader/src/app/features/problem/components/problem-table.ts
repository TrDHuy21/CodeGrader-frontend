import { Component, effect, input, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ProblemService } from '../services/problem-service';
import { Problem } from '../models/ProblemModel';
import { ProblemFilter } from './probem-search';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
@Component({
  selector: `problem-table-component`,
  imports: [InputTextModule, TableModule, CommonModule, RouterModule],
  standalone: true,
  template: `
    <div>
      <div class="rounded-xl bg-white">
        <!-- Row -->
        @if (problems().length > 0) { @for (p of problems(); track $index) {
        <a
          [routerLink]="['/problem', p.id]"
          rel="noopener"
          class="flex items-center gap-4 px-4 py-3 rounded-lg
             hover:bg-gray-50 transition even:bg-gray-50/60"
        >
          <!-- Left: status + index + title -->
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <span class="text-emerald-500">✓</span>

            <span class="truncate font-semibold text-gray-900">
              {{ p.content }}
            </span>
          </div>

          <!-- Acceptance -->
          <!-- <div class="w-24 text-right text-gray-600 font-medium">
            {{ p.level | number : '1.0-1' }}%
          </div> -->

          <!-- Difficulty -->
          <!-- <div class="w-20 text-right">
            <span class="font-semibold" [ngClass]="diffTextClass(p.level)">
              {{ shortDiff(p.level) }}
            </span>
          </div> -->

          <!-- Right bars -->
          <div class="hidden sm:flex w-28 justify-end gap-1">
            @for (_ of bars; track $index) {
            <span class="h-2 w-2 rounded-full bg-gray-300/80"></span>
            }
          </div>
        </a>
        } } @else {
        <div class="px-4 py-6 text-gray-500">No problems found.</div>
        }
      </div>
    </div>
  `,
})
export class ProblemTableComponent {
  filters = input.required<ProblemFilter>();
  problems = signal<Problem[]>([]);
  constructor(private problemService: ProblemService) {
    // toObservable(this.filters)
    //   .pipe(
    //     debounceTime(300),
    //     distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    //     switchMap((f) => this.problemService.getProblems(f))
    //   )
    //   .subscribe((res) => this.problems.set(res.data ?? []));
    // console.log(this.problems());
    effect(() => {
      const f = this.filters(); // lấy giá trị mới
      console.log('Filters thay đổi:', f);

      // Gọi API mỗi khi filters đổi
      this.problemService.getProblems(f).subscribe({
        next: (res) => {
          this.problems.set(res.data || []);
        },
        error: (err) => console.log(err),
      });
    });
  }
  ngOnInit() {
    this.problemService.getProblems({ PageSize: 3 }).subscribe({
      next: (res) => {
        console.log(res);
        this.problems.set(res.data ?? []); // fallback mảng rỗng
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  bars = Array.from({ length: 8 });

  shortDiff(d?: string) {
    const s = (d || '').toLowerCase();
    if (s === 'easy') return 'Easy';
    if (s === 'medium' || s === 'med.' || s === 'med') return 'Medium';
    if (s === 'hard') return 'Hard';
    return d || '';
  }

  diffTextClass(d?: string) {
    switch ((d || '').toLowerCase()) {
      case 'easy':
        return 'text-emerald-500';
      case 'medium':
        return 'text-amber-500';
      case 'med.':
        return 'text-amber-500';
      case 'hard':
        return 'text-rose-500';
      default:
        return 'text-gray-500';
    }
  }
}
