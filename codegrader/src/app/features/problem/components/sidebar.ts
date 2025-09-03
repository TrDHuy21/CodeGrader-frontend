import { Component, effect, inject, Input, signal } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { BookmarkModel } from '../models/bookmark-model';
import { ShareBookmarkService } from '../../../shared/services/share-bookmark-service';
@Component({
  selector: `sidebar-component`,
  imports: [ButtonModule, DrawerModule, TableModule, InputTextModule, CommonModule],
  template: `
    <p-drawer [(visible)]="visible" header="My Bookmark" class="w-2xl" contenteditable="true">
      <ul class="w-full">
        @for (p of bookmarkProblem(); track $index) { @for (bookItem of p.Lists; track $index) {
        <li
          class="flex items-center justify-between hover:bg-gray-200 transition w-full px-2 py-4 rounded-lg cursor-pointer"
        >
          <span class="font-medium">{{ bookItem.ProblemId }}. {{ bookItem.ProblemName }}</span>
          <!-- <span
            class="text-sm"
            [ngClass]="{
              'text-emerald-600': p.difficulty === 'Easy',
              'text-amber-500': p.difficulty === 'Medium',
              'text-rose-600': p.difficulty === 'Hard'
            }"
          >
            {{ p.difficulty }}
          </span> -->
        </li>
        } }
      </ul>
    </p-drawer>
    <p-button (click)="visible = true" label="My Bookmark" />
  `,
})
export class SideBarProblem {
  sharedBookmark = inject(ShareBookmarkService);
  bookmarkProblem = signal<BookmarkModel[] | null>([]);
  constructor() {
    effect(() => {
      this.bookmarkProblem.set([{ Id: 1, Lists: this.sharedBookmark.getAll() || [] }]);
    });
  }
  // ngOnInit() {}

  visible: any;
}
