import { Component } from '@angular/core';
@Component({
  selector: 'footer-component',
  standalone: true,
  template: `
    <footer class="px-8 py-12 bg-gray-100 shadow mt-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <p class="text-2xl font-bold text-blue-600 mb-3">CodeGrader</p>
          <p class="text-gray-500 mb-4">
            AI-powered code analysis and grading platform for students, educators, and developers.
          </p>
          <div class="flex gap-4 text-gray-500">
            <a href="#" class="hover:text-blue-600">🐦</a>
            <a href="#" class="hover:text-blue-600">💼</a>
            <a href="#" class="hover:text-blue-600">📘</a>
          </div>
        </div>

        <div>
          <p class="font-semibold text-gray-700 mb-3">Product</p>
          <ul class="space-y-2 text-gray-500">
            <li class="hover:text-blue-600 cursor-pointer">Features</li>
            <li class="hover:text-blue-600 cursor-pointer">Pricing</li>
            <li class="hover:text-blue-600 cursor-pointer">API</li>
            <li class="hover:text-blue-600 cursor-pointer">Integrations</li>
          </ul>
        </div>

        <div>
          <p class="font-semibold text-gray-700 mb-3">Resources</p>
          <ul class="space-y-2 text-gray-500">
            <li class="hover:text-blue-600 cursor-pointer">Docs</li>
            <li class="hover:text-blue-600 cursor-pointer">Tutorials</li>
            <li class="hover:text-blue-600 cursor-pointer">Community</li>
            <li class="hover:text-blue-600 cursor-pointer">Blog</li>
          </ul>
        </div>

        <div>
          <p class="font-semibold text-gray-700 mb-3">Company</p>
          <ul class="space-y-2 text-gray-500">
            <li class="hover:text-blue-600 cursor-pointer">About Us</li>
            <li class="hover:text-blue-600 cursor-pointer">Careers</li>
            <li class="hover:text-blue-600 cursor-pointer">Contact</li>
            <li class="hover:text-blue-600 cursor-pointer">Privacy Policy</li>
          </ul>
        </div>
      </div>
    </footer>
  `,
})
export class Footer {}
