import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
@Component({
  selector: `trending-component`,
  imports: [InputTextModule, FloatLabel],
  template: `
    <div class="flex flex-col w-full max-w-sm p-4 bg-white rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4">Trending Problems</h2>
      <p-floatlabel variant="on">
        <input pInputText id="on_label" autocomplete="off" class="w-full" />
        <label for="on_label"> Search</label>
      </p-floatlabel>
      <div class="topic-hastag flex flex-wrap gap-1 mt-2">
        <div class="topic-item flex items-center  ">
          <span class="text-gray-700 font-medium mr-1">Array</span>
          <span
            class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full shadow mr-2"
          >
            36
          </span>
        </div>
        <div class="topic-item flex items-center  ">
          <span class="text-gray-700 font-medium mr-1">Array</span>
          <span
            class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full shadow mr-2"
          >
            36
          </span>
        </div>
        <div class="topic-item flex items-center">
          <span class="text-gray-700 font-medium mr-1">Array</span>
          <span
            class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full shadow mr-2"
          >
            36
          </span>
        </div>
      </div>
    </div>
  `,
})
export class TrendingComponent {}
