import { Component, effect, input, OnInit, signal } from '@angular/core';
import { TopicComponent } from '../../components/topic';
import { ProblemTableComponent } from '../../components/problem-table';
import { SideBarProblem } from '../../components/sidebar';
import { TrendingComponent } from '../../components/trending';
import { ProblemFilter, SearchComponent } from '../../components/probem-search';
import { BookmarkedListComponent } from '../../components/bookmark/bookmark-list';
import { ProblemService } from '../../services/problem-service';
import { error } from 'console';
import e from 'express';
import { BookMarkProblemModel } from '../../models/bookmark-model';
import { Problem } from '../../models/ProblemModel';
import { sign } from 'crypto';

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
            <topic-component (filter)="onApply($event)"></topic-component>
            <!-- Filter / Advanced Search -->
            <advanced-search (filter)="onApply($event)"></advanced-search>
            <!-- Bảng vấn đề -->
            <problem-table-component
              [data]="problems()"
              [isLoading]="isLoading()"
            ></problem-table-component>
          </div>
        </section>

        <!-- RIGHT SIDEBAR -->
        <aside class="hidden lg:block lg:sticky lg:top-24 h-fit space-y-4">
          <!-- <trending-component></trending-component> -->
        </aside>
      </div>
    </main>
  `,
})
export class ProblemHomepage implements OnInit {
  filters = signal<ProblemFilter>({
    NameSearch: '',
    Levels: [1, 2, 3],
    Tagnames: [],
    PageNumber: 1,
    PageSize: 10,
    SortBy: '',
    IsDecending: false,
  });
  problems = signal<Problem[]>([]);
  isLoading = signal(false);

  constructor(private problemService: ProblemService) {
    effect(() => {
      const f = this.filters();
      this.isLoading.set(true);
      this.problemService.getProblems(f).subscribe({
        next: (res) => {
          this.problems.set(res.data ?? []);
          console.log(this.problems());
        },
        error: () => this.problems.set([]),
        complete: () => this.isLoading.set(false),
      });
    });
  }

  ngOnInit() {
    const f = this.filters();
    this.isLoading.set(true);
    this.problemService.getProblems(f).subscribe({
      next: (res) => {
        this.problems.set(res.data ?? []);
      },
      error: () => this.problems.set([]),
      complete: () => this.isLoading.set(false),
    });
  }

  onApply(f: ProblemFilter) {
    console.log(f);
    this.filters.set(f);
  }
}
