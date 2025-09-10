import { Component, effect, OnInit, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { SearchService } from '../services/search-service';
import { forkJoin, map } from 'rxjs';
interface TagName {
  id: number;
  name: string;
}
@Component({
  selector: `trending-component`,
  imports: [InputTextModule],
  template: `
    <div class="flex flex-col w-full max-w-sm p-3 bg-white rounded-lg shadow h-full">
      <!-- Header -->
      <h2 class="text-base font-semibold mb-3">Trending Problems</h2>
      <!-- List -->
      <div class="flex flex-wrap gap-2 max-h-60  pr-1">
        @for (item of tagnames(); track item.id) {
        <div
          class="flex items-center rounded-md bg-gray-50 px-2 py-1 hover:bg-gray-100 cursor-pointer transition"
        >
          <span class="text-sm text-gray-700 mr-1">{{ item.name }}</span>
          <span
            class="px-2 py-0.5 bg-blue-500 text-white text-xs font-semibold rounded-full shadow"
          >
            {{ tagCountMap()[item.id] }}
          </span>
        </div>
        }
      </div>
    </div>
  `,
})
export class TrendingComponent implements OnInit {
  tagnames = signal<TagName[]>([]);
  constructor(private searchService: SearchService) {
    effect(() => {
      this.loadTagCounts();
    });
  }
  ngOnInit(): void {
    this.searchService.getTagname().subscribe({
      next: (res) => {
        this.tagnames.set(res.data ?? []);
      },
      error: (err) => console.log(err),
    });
    this.loadTagCounts();
  }
  tagCountMap = signal<Record<number, number>>({});

  loadTagCounts() {
    const ids = this.tagnames().map((t) => t.id);
    forkJoin(
      ids.map((id) =>
        this.searchService
          .statisticTag(id)
          .pipe(map((res) => [id, typeof res.data === 'number' ? res.data : 0] as const))
      )
    ).subscribe((pairs) => {
      this.tagCountMap.set(Object.fromEntries(pairs));
    });
  }
}
