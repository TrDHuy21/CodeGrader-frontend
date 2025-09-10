import { Component, effect, inject, input, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ProblemService } from '../services/problem-service';
import { Problem } from '../models/ProblemModel';
import { ProblemFilter } from './probem-search';
import { ToastComponent } from '../../../shared/components/toast';
import { ToastMessageOptions } from 'primeng/api';
import { ShareBookmarkService } from '../../../shared/services/share-bookmark-service';
@Component({
  selector: `problem-table-component`,
  imports: [InputTextModule, TableModule, CommonModule, RouterModule, ToastComponent],
  standalone: true,
  template: `
    <div>
      <toast-component [message]="this.message()"></toast-component>

      <div class="rounded-xl bg-white">
        @if (problems().length > 0) { @for (p of problems(); track $index) {
        <div
          class="group relative flex items-center gap-3 px-3 py-2 rounded-lg
                 hover:bg-gray-50 transition even:bg-gray-50/60"
        >
          <a [routerLink]="['/problem', p.id]" rel="noopener" class="flex-1 min-w-0">
            <div class="flex items-center gap-2 min-w-0">
              <span class="text-emerald-500 text-sm leading-none">✓</span>

              <span class="truncate font-medium text-gray-900 text-sm">
                {{ p.content }}
              </span>
            </div>

            <div class="hidden sm:flex w-24 justify-end gap-1 mt-1">
              <!-- ví dụ chấm trạng thái -->
              <!-- <span class="h-1.5 w-1.5 rounded-full bg-gray-300/80"></span> -->
            </div>
          </a>

          <div class="absolute right-2 top-1/2 -translate-y-1/2">
            @if (isBookmarked(p.id)) {
            <button
              (click)="toggleBookmark($event, p.id, p.content)"
              class="cursor-pointer opacity-90 group-hover:opacity-100 transition"
              aria-label="Remove bookmark"
            >
              <i
                class="pi pi-bookmark-fill text-blue-500
                     transition-transform duration-200 ease-in-out
                     group-hover:scale-110"
                style="font-size: 0.95rem"
              ></i>
            </button>
            } @else {
            <button
              (click)="toggleBookmark($event, p.id, p.content)"
              class="cursor-pointer opacity-70 hover:opacity-100 transition"
              aria-label="Add bookmark"
            >
              <i
                class="pi pi-bookmark
                     transition-transform duration-200 ease-in-out
                     hover:scale-110 hover:text-blue-500"
                style="font-size: 0.95rem"
              ></i>
            </button>
            }
          </div>
        </div>
        } } @else {
        <div class="px-4 py-6 text-gray-500 text-sm">No problems found.</div>
        }
      </div>
    </div>
  `,
})
export class ProblemTableComponent {
  sharedBookmark = inject(ShareBookmarkService);
  filters = input.required<ProblemFilter>();
  problems = signal<Problem[]>([]);
  bookmarkedIds = signal<Set<number>>(new Set<number>());

  isBookmarked(id: number) {
    return this.bookmarkedIds().has(id);
  }

  toggleBookmark(ev: MouseEvent, id: number, content: string) {
    ev.preventDefault();
    ev.stopPropagation();

    const prev = this.bookmarkedIds();
    const wasBookmarked = prev.has(id); // trạng thái trước khi đổi
    const next = new Set(prev);

    if (wasBookmarked) {
      this.sharedBookmark.delete(id);
      this.showInfo('success', 'Delete', 'Deleted succeess');
    } else {
      this.sharedBookmark.add(id);
      this.showInfo('success', 'Add', 'Added');
      this.showInfo('success', 'Add', 'Added');
    }
  }

  message = signal<ToastMessageOptions | ToastMessageOptions[] | null>(null);

  constructor(private problemService: ProblemService) {
    effect(() => {
      const f = this.filters(); // lấy giá trị mới

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
        this.problems.set(res.data ?? []); // fallback mảng rỗng
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  showInfo(detail: string) {
    this.message.set({
      severity: 'success',
      summary: 'Info Message',
      detail: detail,
      key: 'tr',
      life: 3000,
    });
  }
  //infinite scroll
  page = 0;
  loading = false;
  loadProblems() {}

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
