import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareBookmarkService } from '../../../../shared/services/share-bookmark-service';
import { BookmarkModel } from '../../models/bookmark-model';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'bookmark-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `<div class="w-full max-w-[400px] rounded-xl bg-white shadow p-3">
    <!-- Header -->
    <div class="mb-2 flex items-center justify-between">
      <h2 class="text-sm font-semibold">My Bookmark</h2>
      <!-- <span class="text-xs text-gray-500"> {{ bookmarkProblem() }} items </span> -->
    </div>

    <!-- List -->
    @if (bookmarkProblem()) {
    <ul class="max-h-96 overflow-y-auto pr-1 space-y-1">
      @for (p of bookmarkProblem(); track $index) { @for (bookItem of p.Lists; track $index) {
      <li
        class="group flex items-center gap-2 rounded-md px-2 py-1.5
                   hover:bg-gray-50 transition cursor-pointer"
      >
        <!-- Link 
       -->
        <a
          [routerLink]="['/problem', bookItem.ProblemId]"
          class="min-w-0 flex-1"
          title="{{ bookItem.ProblemName }}"
        >
          <div class="flex items-center gap-2 min-w-0">
            <span class="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0"></span>
            <span class="truncate text-sm text-gray-800">
              {{ bookItem.ProblemId }}. {{ bookItem.ProblemName }}
            </span>
          </div>
        </a>

        <!-- Remove -->
        <button
          type="button"
          class="cursor-pointer opacity-60 hover:opacity-100 hover:text-red-500 transition p-1 -mr-1"
          aria-label="Remove bookmark"
          title="Remove"
          (click)="toggleBookmark($event, bookItem.ProblemId, bookItem.ProblemName)"
        >
          <i class="pi pi-times text-xs"></i>
        </button>
      </li>
      } }
    </ul>
    } @else {
    <div class="text-xs text-gray-500 py-4 text-center">You haven't bookmarked anything yet.</div>
    }

    <!-- Footer actions (tuỳ chọn) -->
    <div class="mt-2 flex items-center justify-between">
      <!-- <button type="button" class="text-xs text-blue-600 hover:underline">Open all</button> -->
      <button type="button" class="cursor-pointer text-xs text-gray-500 hover:text-red-500">
        Clear
      </button>
    </div>
  </div> `,
})
export class BookmarkedListComponent {
  sharedBookmark = inject(ShareBookmarkService);
  bookmarkProblem = signal<BookmarkModel[] | null>([]);
  constructor() {
    effect(() => {
      this.bookmarkProblem.set([{ Id: 1, Lists: this.sharedBookmark.getAll() || [] }]);
      console.log(this.bookmarkProblem());
    });
  }

  toggleBookmark(ev: MouseEvent, id: number, content: string) {
    ev.preventDefault();
    this.sharedBookmark.delete({ ProblemId: id, ProblemName: content });
    console.log('clicked');
  }
}
