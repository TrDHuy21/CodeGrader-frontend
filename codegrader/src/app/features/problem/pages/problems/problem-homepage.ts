import { Component } from '@angular/core';
import { TopicComponent } from '../../components/topic';
import { ProblemTableComponent } from '../../components/problem-table';
import { SideBarProblem } from '../../components/sidebar';
import { TrendingComponent } from '../../components/trending';
@Component({
  selector: `problem-home-component`,
  imports: [TopicComponent, ProblemTableComponent, SideBarProblem, TrendingComponent],
  template: `
    <main class="mx-auto max-w-[1300px] px-4 mt-6">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <section class="0">
          <topic-component></topic-component>
          <problem-table-component></problem-table-component>
        </section>
        <aside class="hidden lg:block sticky top-24 h-fit">
          <trending-component></trending-component>
        </aside>
      </div>
    </main>
  `,
})
export class ProblemHomepage {}
