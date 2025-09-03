import { Component, effect, inject, input, output, Output, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ProblemService } from '../services/problem-service';
import { Problem } from '../models/ProblemModel';
import { ProblemFilter } from './probem-search';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ToastComponent } from '../../../shared/components/toast';
import { Toast } from 'primeng/toast';
import { ToastMessageOptions } from 'primeng/api';
import { EventEmitter } from 'stream';
import { BookmarkModel } from '../models/bookmark-model';
import { ShareBookmarkService } from '../../../shared/services/share-bookmark-service';
@Component({
  selector: `problem-table-component`,
  imports: [InputTextModule, TableModule, CommonModule, RouterModule, ToastComponent],
  standalone: true,
  template: `
    <div>
      <toast-component [message]="this.message()"></toast-component>
      <div class="rounded-xl bg-white ">
        <!-- Row -->
        @if (problems().length > 0) { @for (p of problems(); track $index) {
        <div
          class="flex items-center gap-4 px-4 py-3 rounded-lg
             hover:bg-gray-50 transition even:bg-gray-50/60 relative"
        >
          <a [routerLink]="['/problem', p.id]" rel="noopener" class="w-full">
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
              <!-- @for (_ of bars; track $index) {
            <span class="h-2 w-2 rounded-full bg-gray-300/80"></span>
            } -->
            </div>
          </a>
          <div class="absolute top-0 right-1/9 translate-2/4">
            @if (isBookmarked(p.id)) {
            <button (click)="toggleBookmark($event, p.id, p.content)" class="cursor-pointer">
              <i
                class="pi pi-bookmark-fill text-blue-400
               transition-all duration-300 ease-in-out
               transform hover:scale-110"
                style="font-size: 1rem"
              ></i>
            </button>
            } @else {
            <button class="cursor-pointer " (click)="toggleBookmark($event, p.id, p.content)">
              <i
                class="pi pi-bookmark
               transition-all duration-300 ease-in-out
               transform hover:scale-110 hover:text-blue-400"
                style="font-size: 1rem"
              ></i>
            </button>
            }
          </div>
        </div>

        } } @else {
        <div class="px-4 py-6 text-gray-500">No problems found.</div>
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
      // BỎ đánh dấu: chỉ đổi UI, KHÔNG xóa khỏi danh sách lưu trữ
      next.delete(id);
      this.sharedBookmark.delete({ ProblemId: id, ProblemName: content });
    } else {
      // ĐÁNH DẤU lần đầu: thêm vào UI + đảm bảo thêm vào list nếu chưa có
      next.add(id);
      this.sharedBookmark.add({ ProblemId: id, ProblemName: content });
    }

    this.bookmarkedIds.set(next);
    // (tuỳ chọn) persist Set:
    // localStorage.setItem('bookmarks', JSON.stringify([...next]));
  }

  // isBookmarked = false;
  message = signal<ToastMessageOptions | ToastMessageOptions[] | null>(null);

  constructor(private problemService: ProblemService) {
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
  showInfo() {
    this.message.set({
      severity: 'success',
      summary: 'Info Message',
      detail: 'Bookmarked!',
      key: 'tr',
      life: 3000,
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
  toogleBookmark(event: Event, problemId: number, isBookmarked: boolean) {
    if (isBookmarked) {
      // remove book mark
    } else {
      // add book mark
    }
  }
}
