import { Injectable, signal } from '@angular/core';
import { BookmarkModel, BookMarkProblemModel } from '../../features/problem/models/bookmark-model';
@Injectable({ providedIn: 'root' })
export class ShareBookmarkService {
  bookmarkList = signal<BookMarkProblemModel[]>([]);

  add(item: BookMarkProblemModel) {
    this.bookmarkList()?.push(item);
  }
  delete(item: BookMarkProblemModel) {
    this.bookmarkList.set(this.bookmarkList()?.filter((bm) => bm.ProblemId !== item.ProblemId));
  }
  getAll() {
    return this.bookmarkList();
  }
}
