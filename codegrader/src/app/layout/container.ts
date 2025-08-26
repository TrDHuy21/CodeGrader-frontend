import { Component } from '@angular/core';
@Component({
  selector: 'container',
  standalone: true,
  template: ` <div class="w-full">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="text-center">
        <h1 class="text-center text-2xl font-bold text-gray-800 mb-20">
          AI-Powered Code Grading Made Simple
        </h1>
        <button
          class="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Upload your code
        </button>
      </div>
      <div class="mt-8 flex gap-6 justify-center">
        <div class="flex flex-col items-center text-center bg-white rounded-xl shadow p-6 w-64">
          <span
            class="flex items-center justify-center w-12 h-12 bg-gray-600 text-white rounded-full mb-4"
          >
            Icon
          </span>
          <span class="font-semibold text-gray-700 text-lg">Instant Feedback</span>
          <span class="text-gray-500 text-sm">
            Get detailed analysis and suggestions in seconds
          </span>
        </div>
        <div class="flex flex-col items-center text-center bg-white rounded-xl shadow p-6 w-64">
          <span
            class="flex items-center justify-center w-12 h-12 bg-gray-600 text-white rounded-full mb-4"
          >
            Icon
          </span>
          <span class="font-semibold text-gray-700 text-lg">Instant Feedback</span>
          <span class="text-gray-500 text-sm">
            Get detailed analysis and suggestions in seconds
          </span>
        </div>
        <div class="flex flex-col items-center text-center bg-white rounded-xl shadow p-6 w-64">
          <span
            class="flex items-center justify-center w-12 h-12 bg-gray-600 text-white rounded-full mb-4"
          >
            Icon
          </span>
          <span class="font-semibold text-gray-700 text-lg">Instant Feedback</span>
          <span class="text-gray-500 text-sm">
            Get detailed analysis and suggestions in seconds
          </span>
        </div>
      </div>
    </div>
  </div>`,
})
export class Container {}
