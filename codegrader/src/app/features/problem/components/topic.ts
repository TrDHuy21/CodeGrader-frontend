import { Component, OnInit, output, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemService } from '../services/problem-service';
import { SearchService } from '../services/search-service';
import { EventEmitter } from 'stream';
import { ProblemFilter } from './probem-search';
interface TagName {
  id: number;
  name: string;
}
@Component({
  selector: `topic-component`,
  imports: [CommonModule],
  template: `
    <div class="mx-auto">
      <div class="topic-hastag relative flex flex-wrap gap-x-3 gap-y-2">
        <div class="topic-item flex items-center gap-2 py-1">
          <span class="text-sm text-gray-700 font-medium">Array</span>
          <span
            class="px-2.5 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full shadow"
          >
            36
          </span>
        </div>

        <div class="topic-item flex items-center gap-2 py-1">
          <span class="text-sm text-gray-700 font-medium">siuuuuuu</span>
          <span
            class="px-2.5 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full shadow"
          >
            36
          </span>
        </div>

        <div class="topic-item flex items-center gap-2 py-1">
          <span class="text-sm text-gray-700 font-medium">Array</span>
          <span
            class="px-2.5 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full shadow"
          >
            36
          </span>
        </div>
        <div class="topic-item flex items-center gap-2 py-1">
          <span class="text-sm text-gray-700 font-medium">Array</span>
          <span
            class="px-2.5 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full shadow"
          >
            36
          </span>
        </div>
        <div class="topic-item flex items-center gap-2 py-1">
          <span class="text-sm text-gray-700 font-medium">Array</span>
          <span
            class="px-2.5 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full shadow"
          >
            36
          </span>
        </div>
        <div class="topic-item flex items-center gap-2 py-1">
          <span class="text-sm text-gray-700 font-medium">Array</span>
          <span
            class="px-2.5 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full shadow"
          >
            36
          </span>
        </div>
        <div class="topic-item flex items-center gap-2 py-1">
          <span class="text-sm text-gray-700 font-medium">Array</span>
          <span
            class="px-2.5 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full shadow"
          >
            36
          </span>
        </div>
        <div class="topic-item flex items-center gap-2 py-1">
          <span class="text-sm text-gray-700 font-medium">Array</span>
          <span
            class="px-2.5 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full shadow"
          >
            36
          </span>
        </div>
        <div class="topic-item flex items-center gap-2 py-1">
          <span class="text-sm text-gray-700 font-medium">Array</span>
          <span
            class="px-2.5 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full shadow"
          >
            36
          </span>
        </div>
        <div class="topic-item flex items-center gap-2 py-1">
          <span class="text-sm text-gray-700 font-medium">Array</span>
          <span
            class="px-2.5 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full shadow"
          >
            36
          </span>
        </div>
        <div class="topic-item flex items-center gap-2 py-1">
          <span class="text-sm text-gray-700 font-medium">Array</span>
          <span
            class="px-2.5 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full shadow"
          >
            36
          </span>
        </div>
        <div class="topic-item flex items-center gap-2 py-1">
          <span class="text-sm text-gray-700 font-medium">Array</span>
          <span
            class="px-2.5 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full shadow"
          >
            36
          </span>
        </div>
        <div class="topic-item flex items-center gap-2 py-1">
          <span class="text-sm text-gray-700 font-medium">Array</span>
          <span
            class="px-2.5 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full shadow"
          >
            36
          </span>
        </div>
        <div class="topic-item flex items-center gap-2 py-1">
          <span class="text-sm text-gray-700 font-medium">Array</span>
          <span
            class="px-2.5 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full shadow"
          >
            36
          </span>
        </div>
        <div class="topic-item flex items-center gap-2 py-1">
          <span class="text-sm text-gray-700 font-medium">Array</span>
          <span
            class="px-2.5 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full shadow"
          >
            36
          </span>
        </div>
        <div class="topic-item flex items-center gap-2 py-1">
          <span class="text-sm text-gray-700 font-medium">Array</span>
          <span
            class="px-2.5 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full shadow"
          >
            36
          </span>
        </div>
        <div class="topic-item flex items-center gap-2 py-1">
          <span class="text-sm text-gray-700 font-medium">Array</span>
          <span
            class="px-2.5 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full shadow"
          >
            36
          </span>
        </div>
        <div class="topic-item flex items-center gap-2 py-1">
          <span class="text-sm text-gray-700 font-medium">Array</span>
          <span
            class="px-2.5 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full shadow"
          >
            36
          </span>
        </div>
      </div>

      <!-- BUTTON ROW (SCROLLABLE) -->
      <div class="topic-button mt-6 flex w-full gap-2 overflow-x-auto pb-2 scrollbar-hide">
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
  tagnames = signal<TagName[]>([]);
  filter = output<ProblemFilter>();
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
}
