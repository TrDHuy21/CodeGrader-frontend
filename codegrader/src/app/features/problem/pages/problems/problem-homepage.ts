import { Component, signal } from '@angular/core';
import { TopicComponent } from '../../components/topic';
import { ProblemTableComponent } from '../../components/problem-table';
import { SideBarProblem } from '../../components/sidebar';
import { TrendingComponent } from '../../components/trending';
import { ProblemFilter, SearchComponent } from '../../components/probem-search';

@Component({
  selector: `problem-home-component`,
  imports: [
    TopicComponent,
    ProblemTableComponent,
    SideBarProblem,
    SearchComponent,
    TrendingComponent,
    SearchComponent,
  ],
  template: `
    <main class="mx-auto max-w-[1600px] px-4 mt-6">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <section class="0">
          <topic-component></topic-component>
          <advanced-search (filter)="onApply($event)"></advanced-search>
          <problem-table-component [filters]="filters()"></problem-table-component>
        </section>
        <aside class="hidden lg:block sticky top-24 h-fit">
          <!-- <trending-component></trending-component> -->
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
