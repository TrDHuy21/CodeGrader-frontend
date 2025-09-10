import { Component, signal, OnInit, OnDestroy, Inject, PLATFORM_ID, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SideBarProblem } from '../features/problem/components/sidebar';
import { AuthService } from '../auth/auth.service';
import { CookieService } from '../shared/services/cookie.service';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { ShareUserAvatarService } from '../shared/services/share-useravatar-service';
@Component({
  selector: 'header-component',
  standalone: true,
  imports: [RouterLink, SideBarProblem],
  template: `
    <header class="flex items-center justify-between px-6 py-4 bg-gray-100 shadow">
      <!-- Logo -->
      <div class="flex items-center justify-center">
        <div class="logo text-xl font-bold text-blue-600 cursor-pointer mr-5" routerLink="/home">
          CodeGrader
        </div>
        <sidebar-component></sidebar-component>
      </div>

      <!-- Navigation -->
      <ul class="navigation flex gap-6 text-gray-700 font-medium">
        <li class="cursor-pointer hover:text-blue-600" routerLink="/home">Home</li>
        <li class="cursor-pointer hover:text-blue-600" routerLink="/problem">Problems</li>
      </ul>

      <!-- Auth buttons -->
      <div class="auth-button flex gap-4 justify-center items-center cursor-pointer relative">
        @if(!isLoggedIn) {
        <span
          class="px-4 py-2 border border-blue-600 rounded-lg text-blue-600 cursor-pointer hover:bg-blue-50"
          routerLink="/login"
        >
          Sign In
        </span>
        <span
          class="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
          routerLink="/signup"
        >
          Sign Up
        </span>
        } @else{
        <div class="relative inline-block" tabindex="0" (blur)="dropdownOpen = false">
          <!-- Trigger -->
          <button
            type="button"
            (click)="toggleDropdown()"
            class="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm hover:bg-slate-50"
          >
            <img
              [src]="shareAvatar.avatar()"
              alt="Avatar"
              class="h-8 w-8 rounded-full object-cover"
            />
            <span class="text-sm text-slate-700 truncate">{{ username }}</span>
            <i class="pi pi-angle-down text-xs text-slate-500"></i>
          </button>

          <!-- Dropdown -->
          <ul
            class="absolute right-0 mt-2 w-48 rounded-md border border-slate-200 bg-white shadow-md  "
            [class.hidden]="!dropdownOpen"
          >
            <li>
              <a routerLink="/profile" class="block px-4 py-2 text-sm hover:bg-slate-50">Profile</a>
            </li>
            <li>
              <button
                (click)="logout()"
                class="block w-full text-left px-4 py-2 text-sm hover:bg-slate-50"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>

        <!-- Dropdown -->
        <ul
          class="dropdown absolute right-0 top-full bg-white shadow-lg rounded-lg mt-2 p-4 w-48 z-[9999]"
          [class.hidden]="!dropdownOpen"
        >
          @if (username === 'admin') {
          <li class="py-2 px-4 hover:bg-gray-100 cursor-pointer">
            <a routerLink="/manageuser">Admin UI</a>
          </li>
          } @else {
          <li class="py-2 px-4 hover:bg-gray-100 cursor-pointer">
            <a routerLink="/profile">Profile</a>
          </li>
          }
          <li class="py-2 px-4 hover:bg-gray-100 cursor-pointer" (click)="logout()">Logout</li>
        </ul>
        }
      </div>
    </header>
  `,
})
export class Header implements OnInit, OnDestroy {
  isLoggedIn = false;
  username = '';
  avatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  dropdownOpen = false;
  private authSubscription?: Subscription;
  shareAvatar = inject(ShareUserAvatarService);
  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.updateAuthState();
    console.log(this.shareAvatar.avatar());

    // Lắng nghe thay đổi trạng thái đăng nhập
    this.authSubscription = this.authService.getAuthState().subscribe(() => {
      this.updateAuthState();
    });
  }

  updateAuthState(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.isLoggedIn = false;
      this.username = '';
      this.avatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
      return;
    }

    const token = this.authService.getToken();
    if (token) {
      this.isLoggedIn = true;
      const cookieUsername = this.cookieService.getCookie('username');
      this.username = cookieUsername || this.authService.getUsername() || 'User';
      this.avatar = this.authService.getAvatar() || this.avatar;
    } else {
      this.isLoggedIn = false;
      this.username = '';
      this.avatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout(): void {
    this.authService.logout();
    this.updateAuthState(); // Cập nhật ngay lập tức
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }
}
