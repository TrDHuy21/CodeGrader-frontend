import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
      </div>

      <!-- BUTTON ROW (SCROLLABLE) -->
      <div class="topic-button mt-6 flex w-full gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          class="whitespace-nowrap rounded-full   px-3.5 py-1.5 text-sm font-medium text-white transition
          cursor-pointer
          "
          (click)="activeTab = 'All topics'"
          [ngClass]="{
            'bg-blue-600 text-white hover:bg-blue-700': activeTab === 'All topics',
            'bg-gray-200 text-gray-700 hover:bg-gray-300': activeTab !== 'All topics'
          }"
        >
          All topics
        </button>

        <button
          class="whitespace-nowrap rounded-full bg-gray-200 px-3.5 py-1.5 text-sm font-medium text-gray-700 transition   cursor-pointer"
          (click)="activeTab = 'JavaScript'"
          [ngClass]="{
            'bg-blue-600 text-white hover:bg-blue-700': activeTab === 'JavaScript',
            'bg-gray-200 text-gray-700 hover:bg-gray-300 ': activeTab !== 'JavaScript'
          }"
        >
          JavaScript
        </button>

        <button
          class="whitespace-nowrap rounded-full bg-gray-200 px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300 transition   cursor-pointer"
        >
          Angular
        </button>

        <button
          class="whitespace-nowrap rounded-full bg-gray-200 px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300 transition   cursor-pointer"
        >
          React
        </button>

        <button
          class="whitespace-nowrap rounded-full bg-gray-200 px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300 transition   cursor-pointer"
        >
          SQL
        </button>

        <button
          class="whitespace-nowrap rounded-full bg-gray-200 px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300 transition   cursor-pointer"
        >
          C#
        </button>

        <button
          class="whitespace-nowrap rounded-full bg-gray-200 px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300 transition   cursor-pointer"
        >
          C#
        </button>
      </div>
    </div>
  `,
})
export class TopicComponent {
  activeTab = 'JavaScript';
}
