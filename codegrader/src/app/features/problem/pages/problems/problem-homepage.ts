import { Component, signal } from '@angular/core';
import { TopicComponent } from '../../components/topic';
import { ProblemTableComponent } from '../../components/problem-table';
import { SideBarProblem } from '../../components/sidebar';
import { TrendingComponent } from '../../components/trending';
import { ProblemFilter, SearchComponent } from '../../components/probem-search';
import { BookmarkedListComponent } from '../../components/bookmark/bookmark-list';

@Component({
  selector: `problem-home-component`,
  imports: [
    TopicComponent,
    ProblemTableComponent,
    SearchComponent,
    TrendingComponent,
    SearchComponent,
    BookmarkedListComponent,
  ],
  template: `
    <!-- <main class="mx-auto  max-w-[1600px] px-4 mt-6">
      <div class="grid grid-cols-1 lg:grid-cols-[180px_0.75fr_360px] gap-8">
        <aside>
          <bookmark-component></bookmark-component>
        </aside>
        <section class="0">
          <topic-component></topic-component>
          <advanced-search (filter)="onApply($event)"></advanced-search>
          <problem-table-component [filters]="filters()"></problem-table-component>
        </section>
        <aside class="hidden lg:block sticky top-24 h-fit">
          <trending-component></trending-component>
        </aside>
      </div>
    </main> -->
    <main class="mx-auto max-w-[1280px] lg:max-w-[1400px] xl:max-w-[1600px] px-4 lg:px-6 mt-6">
      <!-- Lưu ý: KHÔNG đặt overflow-hidden ở parent của các phần sticky -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-[400px_1fr_320px] lg:gap-8">
        <!-- LEFT SIDEBAR -->
        <aside class="lg:sticky lg:top-24 h-fit">
          <bookmark-component></bookmark-component>
        </aside>

        <!-- CONTENT -->
        <section class="min-w-0">
          <!-- min-w-0 để content không tràn khi bảng rộng -->
          <div class="space-y-4">
            <topic-component></topic-component>

            <!-- Filter / Advanced Search -->
            <advanced-search (filter)="onApply($event)"></advanced-search>

            <!-- Bảng vấn đề -->
            <problem-table-component [filters]="filters()"></problem-table-component>
          </div>
        </section>

        <!-- RIGHT SIDEBAR -->
        <aside class="hidden lg:block lg:sticky lg:top-24 h-fit space-y-4">
          <trending-component></trending-component>
          <!-- Có thể thêm widget khác ở đây -->
          <!-- <bookmark-component></bookmark-component> -->
        </aside>
      </div>
    </main>
  `,
})
export class ProblemHomepage {
  filters = signal<ProblemFilter>({
    NameSearch: '',
    Levels: [],
    Tagnames: [],
    PageNumber: 1,
    PageSize: 10,
    SortBy: 'name',
    IsDecending: false,
  });

  onApply(f: ProblemFilter) {
    this.filters.set(f);
  }
}
