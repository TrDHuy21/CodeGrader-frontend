import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'profile-homepage',
  imports: [CommonModule, RouterModule],
  standalone: true,
  template: `
    <div class="container mt-5 w-lvw">
      <div class="flex">
        <!-- Sidebar -->
        <nav class="w-80 shrink-0 h-dvh mx-auto">
          <ul class="w-full h-full space-y-2 p-4 bg-gray-100  font-medium text-sm">
            <li>
              <a
                [routerLink]="['./general']"
                [routerLinkActiveOptions]="{ exact: true }"
                routerLinkActive="bg-blue-600 text-white"
                class="block w-full px-4 py-2 rounded-lg transition
                   text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              >
                <span class="pi pi-spin pi-cog mr-2"></span>
                General
              </a>
            </li>
            <li>
              <a
                [routerLink]="['./update-profile']"
                [routerLinkActiveOptions]="{ exact: true }"
                routerLinkActive="bg-blue-600 text-white"
                class="block w-full px-4 py-2 rounded-lg transition
                   text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              >
                <span class="pi pi-user mr-2"></span>
                Update Profile
              </a>
            </li>

            <li>
              <a
                [routerLink]="['./change-password']"
                [routerLinkActiveOptions]="{ exact: true }"
                routerLinkActive="bg-blue-600 text-white"
                class="block w-full px-4 py-2  rounded-lg transition
                   text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              >
                <span class="pi pi-lock mr-2"></span>

                Change Password
              </a>
            </li>
            <!-- <li>
              <a
                [routerLink]="['./update-avatar']"
                [routerLinkActiveOptions]="{ exact: true }"
                routerLinkActive="bg-blue-600 text-white"
                class="block w-full px-4 py-2 rounded-lg transition
                   text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              >
                <span class="pi pi-image mr-2"></span>

                Update Avatar
              </a>
            </li> -->
          </ul>
        </nav>

        <!-- Content -->
        <section class="flex-1 min-w-0 p-4 bg-white shadow-sm">
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
