import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareBookmarkService } from '../../../../shared/services/share-bookmark-service';
import { BookmarkModel } from '../../models/bookmark-model';
import { RouterModule } from '@angular/router';
import { BookmarkService } from '../../services/bookmark-service';
@Component({
  selector: 'bookmark-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `<div class="w-full max-w-[400px] rounded-xl bg-white shadow p-3">
    <!-- Header -->
    <div class="mb-2 flex items-center justify-between">
      <h2 class="text-sm font-semibold">My Bookmark</h2>
    </div>

    @if (sharedBookmark.bookmarkList().length !== 0) {
    <ul class="max-h-96 overflow-y-auto pr-1 space-y-1">
      @for (item of sharedBookmark.bookmarkList(); track $index) {
      <li
        class="group flex items-center gap-2 rounded-md px-2 py-1.5
                   hover:bg-gray-50 transition cursor-pointer"
      >
        <a [routerLink]="['/problem', item.id]" class="min-w-0 flex-1">
          <div class="flex items-center gap-2 min-w-0">
            <span class="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0"></span>
            <span class="truncate text-sm text-gray-800">{{ item.name }} </span>
          </div>
        </a>

        <button
          type="button"
          class="cursor-pointer opacity-60 hover:opacity-100 hover:text-red-500 transition p-1 -mr-1"
          aria-label="Remove bookmark"
          title="Remove"
          (click)="toggleBookmark($event, item.id)"
        >
          <i class="pi pi-times text-xs"></i>
        </button>
      </li>
      }
    </ul>
    <div class="mt-2 flex items-center justify-between">
      <!-- <button type="button" class="text-xs  text-blue-600 hover:underline">Open all</button> -->
      <button type="button" class="cursor-pointer text-xs text-gray-500 hover:text-red-500">
        Clear
      </button>
    </div>
    } @else {
    <div class="text-xs text-gray-500 py-4 text-center">You haven't bookmarked anything yet.</div>
    }
  </div> `,
})
export class BookmarkedListComponent implements OnInit {
  sharedBookmark = inject(ShareBookmarkService);
  // constructor() {
  //   effect(() => {
  //     console.log(this.sharedBookmark.bookmarkList());
  //   });
  // }
  ngOnInit() {
    this.sharedBookmark.getAll();
    console.log(this.sharedBookmark.bookmarkList());
  }

  toggleBookmark(ev: MouseEvent, id: number) {
    ev.preventDefault();
    this.sharedBookmark.delete(id);
    console.log('clicked');
  }
}
