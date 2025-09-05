import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: `trending-component`,
  imports: [InputTextModule],
  template: `
    <div class="flex flex-col w-full max-w-sm p-3 bg-white rounded-lg shadow">
      <!-- Header -->
      <h2 class="text-base font-semibold mb-3">Trending Problems</h2>

      <!-- List -->
      <div class="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-1">
        <div
          class="flex items-center rounded-md bg-gray-50 px-2 py-1 hover:bg-gray-100 cursor-pointer transition"
        >
          <span class="text-sm text-gray-700 mr-1">Array</span>
          <span
            class="px-2 py-0.5 bg-blue-500 text-white text-xs font-semibold rounded-full shadow"
          >
            36
          </span>
        </div>

        <div
          class="flex items-center rounded-md bg-gray-50 px-2 py-1 hover:bg-gray-100 cursor-pointer transition"
        >
          <span class="text-sm text-gray-700 mr-1">Graph</span>
          <span
            class="px-2 py-0.5 bg-blue-500 text-white text-xs font-semibold rounded-full shadow"
          >
            24
          </span>
        </div>

        <div
          class="flex items-center rounded-md bg-gray-50 px-2 py-1 hover:bg-gray-100 cursor-pointer transition"
        >
          <span class="text-sm text-gray-700 mr-1">DP</span>
          <span
            class="px-2 py-0.5 bg-blue-500 text-white text-xs font-semibold rounded-full shadow"
          >
            18
          </span>
        </div>
        <!-- ... các item khác ... -->
      </div>
    </div>
  `,
})
export class TrendingComponent {}
