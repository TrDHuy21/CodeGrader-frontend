import { Component, computed, effect, inject, input, OnInit, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ProblemService } from '../services/problem-service';
import { Problem } from '../models/ProblemModel';
import { ToastComponent } from '../../../shared/components/toast';
import { ToastMessageOptions } from 'primeng/api';
import { ShareBookmarkService } from '../../../shared/services/share-bookmark-service';
import { BookmarkModel, BookMarkProblemModel } from '../models/bookmark-model';
import { AuthService } from '../../../auth/auth.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
  selector: `problem-table-component`,
  imports: [
    InputTextModule,
    TableModule,
    CommonModule,
    RouterModule,
    ToastComponent,
    ProgressSpinnerModule,
  ],
  standalone: true,
  template: `
    <div>
      <toast-component [message]="this.message()"></toast-component>
      @if(isLoading()) {
      <p-progress-spinner
        strokeWidth="8"
        fill="transparent"
        animationDuration=".5s"
        [style]="{ width: '50px', height: '50px' }"
      />
      } @else { @if(data().length !== 0 ) {
      <div class="rounded-xl bg-white">
        @if (data().length !== 0) { @for (p of data(); track $index) {
        <div
          class="group relative flex items-center gap-3 px-3 py-2 rounded-lg
                 hover:bg-gray-50 transition even:bg-gray-50/60"
        >
          <a rel="noopener" class="flex-1 min-w-0" [routerLink]="['/problem', p.id]">
            <div class="flex items-center gap-2 min-w-0">
              <span class="text-emerald-500 text-sm leading-none">✓</span>

              <span class="truncate font-medium text-gray-900 text-sm">
                {{ p.name }}
              </span>
            </div>

            <div class="hidden sm:flex w-24 justify-end gap-1 mt-1"></div>
          </a>
          <span [ngClass]="diffFunc(p.level)" class="mr-10">{{ shortDiff(p.level) }}</span>
          <div class="absolute right-2 top-1/2 -translate-y-1/2">
            @if (isBookmarked(p.id)) {

            <button
              class="cursor-pointer opacity-90 group-hover:opacity-100 transition"
              aria-label="Remove bookmark"
              (click)="toggleBookmark($event, p.id)"
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
              class="cursor-pointer opacity-70 hover:opacity-100 transition"
              aria-label="Add bookmark"
              (click)="toggleBookmark($event, p.id)"
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
        } }
      </div>
      }@else {
      <div class="px-4 py-6 text-gray-500 text-sm">No problems found.</div>
      } }
    </div>
  `,
})
export class ProblemTableComponent {
  // isLoading = signal(true);
  data = input.required<Problem[]>();
  isLoading = input(false);
  sharedBookmark = inject(ShareBookmarkService);
  authService = inject(AuthService);

  constructor(private problemService: ProblemService) {}
  ngOnInit() {
    this.sharedBookmark.getAll();
    // effect(() => {
    //   if (this.data().length === 0) {
    //     this.isLoading.set(true);
    //   } else {
    //     this.isLoading.set(false);
    //   }
    // });
  }
  isBookmarked(id: number) {
    return this.sharedBookmark.bookmarkList()?.some((item) => item.id === id);
  }

  toggleBookmark(ev: MouseEvent, id: number) {
    ev.preventDefault();
    ev.stopPropagation();
    if (!this.authService.isLoggedIn()) {
      this.showInfo('error', 'Error', 'Cannot add if not logged');
      return;
    }
    const wasBookmarked = this.isBookmarked(id);
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

  showInfo(severity: string, summary: string, detail: string) {
    this.message.set({
      severity: severity,
      summary: summary,
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

  shortDiff(level?: number) {
    switch (level) {
      case 1:
        return 'Easy';
      case 2:
        return 'Medium';
      case 3:
        return 'Hard';
      default:
        return '';
    }
  }
  diffFunc(level: number) {
    switch (level) {
      case 1:
        return 'inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 px-2.5 py-0.5 text-xs font-medium';
      case 2:
        return 'inline-flex items-center rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 px-2.5 py-0.5 text-xs font-medium';
      case 3:
        return 'inline-flex items-center rounded-full bg-rose-50 text-rose-700 ring-1 ring-rose-600/20 px-2.5 py-0.5 text-xs font-medium';
      default:
        return 'inline-flex items-center rounded-full bg-gray-50 text-gray-700 ring-1 ring-gray-600/20 px-2.5 py-0.5 text-xs font-medium';
    }
  }
}
