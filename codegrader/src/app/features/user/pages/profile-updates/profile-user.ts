import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'profile-homepage',
  imports: [CommonModule, RouterModule],
  standalone: true,
  template: `
    <div class="container mx-auto p-4">
      <div class="flex gap-6">
        <!-- Sidebar -->
        <nav class="w-56 shrink-0">
          <ul class="space-y-2 px-2 py-3 bg-gray-100 rounded-lg font-medium text-sm">
            <li>
              <a
                [routerLink]="['./update-profile']"
                [routerLinkActiveOptions]="{ exact: true }"
                routerLinkActive="bg-blue-600 text-white"
                class="block w-full px-4 py-2 rounded-full transition
                   text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              >
                Update Profile
              </a>
            </li>

            <li>
              <a
                [routerLink]="['./change-password']"
                [routerLinkActiveOptions]="{ exact: true }"
                routerLinkActive="bg-blue-600 text-white"
                class="block w-full px-4 py-2 rounded-full transition
                   text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              >
                Change Password
              </a>
            </li>
            <li>
              <a
                [routerLink]="['./update-avatar']"
                [routerLinkActiveOptions]="{ exact: true }"
                routerLinkActive="bg-blue-600 text-white"
                class="block w-full px-4 py-2 rounded-full transition
                   text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              >
                Update Avatar
              </a>
            </li>
          </ul>
        </nav>

        <!-- Content -->
        <section class="flex-1 min-w-0 p-4 bg-white rounded-xl shadow-sm">
          <div class="p-fluid">
            <router-outlet></router-outlet>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class ProfileHomepageComponent {
  activeTab = 'description';
  setActive(tab: string) {
    this.activeTab = tab;
    console.log('Active tab:', this.activeTab);
  }
}
