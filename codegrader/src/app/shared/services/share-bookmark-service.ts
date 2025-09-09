import { inject, Injectable, signal } from '@angular/core';
import { BookmarkModel, BookMarkProblemModel } from '../../features/problem/models/bookmark-model';
import { BookmarkService } from '../../features/problem/services/bookmark-service';
import { Problem } from '../../features/problem/models/ProblemModel';
@Injectable({ providedIn: 'root' })
export class ShareBookmarkService {
  bookmarkService = inject(BookmarkService);
  bookmarkList = signal<Problem[]>([]);

  constructor() {
    this.getAll();
  }
  ngOnInit() {
    this.getAll();
  }
  getAll() {
    this.bookmarkService.get().subscribe({
      next: (res) => {
        this.bookmarkList.set(res.data ?? []);
      },
      error: (err) => console.log(err),
    });
  }
  add(id: number) {
    this.bookmarkService.add(id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.getAll();
        }
      },
      error: (err) => console.log(err),
    });
  }
  delete(id: number) {
    this.bookmarkService.delete(id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.getAll();
        }
      },
      error: (err) => console.log(err),
    });
  }
}
