import { Component, OnInit, output, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemService } from '../services/problem-service';
import { SearchService } from '../services/search-service';
import { EventEmitter } from 'stream';
import { ProblemFilter } from './probem-search';
import { sign } from 'crypto';
import { forkJoin, map, Observable } from 'rxjs';
interface TagName {
  id: number;
  name: string;
}

@Component({
  selector: `topic-component`,
  imports: [CommonModule],
  template: `
    <div class="mx-auto">
      <!-- BUTTON ROW (SCROLLABLE) -->
      <div class="topic-button mt-6 flex w-full gap-2 flex-wrap  pb-2 ">
        <button
          class="whitespace-nowrap rounded-full   px-3.5 py-1.5 text-sm font-medium text-white transition
          cursor-pointer
          "
          (click)="sendingFilterClick('All')"
          [ngClass]="{
            'bg-blue-600 text-white hover:bg-blue-700': activeTab === 'All',
            'bg-gray-200 text-gray-700 hover:bg-gray-300': activeTab !== 'All'
          }"
        >
          All
        </button>
        @for (item of tagnames(); track item.id) {
        <button
          class="whitespace-nowrap rounded-full   px-3.5 py-1.5 text-sm font-medium text-white transition
          cursor-pointer
          "
          (click)="sendingFilterClick(item.name)"
          [ngClass]="{
            'bg-blue-600 text-white hover:bg-blue-700': activeTab === item.name,
            'bg-gray-200 text-gray-700 hover:bg-gray-300': activeTab !== item.name
          }"
        >
          {{ item.name }}
        </button>
        }
      </div>
    </div>
  `,
})
export class TopicComponent implements OnInit {
  activeTab = 'All';
  filter = output<ProblemFilter>();
  tagnames = signal<TagName[]>([]);
  constructor(private searchService: SearchService) {}
  ngOnInit(): void {
    this.searchService.getTagname().subscribe({
      next: (res) => {
        this.tagnames.set(res.data ?? []);
      },
      error: (err) => console.log(err),
    });
  }

  sendingFilterClick(buttonLabel: string) {
    this.activeTab = buttonLabel;
    this.filter.emit({
      NameSearch: '',
      Levels: [1, 2, 3],
      Tagnames: [buttonLabel],
      PageSize: 10,
      PageNumber: 1,
      SortBy: 'name',
      IsDecending: true,
      // thêm các field khác nếu cần
    });
  }
  tagCountMap = signal<Record<number, number>>({});
}
