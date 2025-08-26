import { Component, signal, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SideBarProblem } from '../features/problem/components/sidebar';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'header-component',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, SideBarProblem],
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
        } 
        @else{
        <div (click)="toggleDropdown()" class="flex items-center gap-2">
          <div class="aspect-square rounded-full h-8 w-8">
            <img [src]="avatar" alt="Avatar" class="w-8 h-8 rounded-full" />
          </div>
          <span class="text-gray-500 text-sm">{{ username }}</span>
        </div>

        <!-- Dropdown -->
        <ul
          class="dropdown absolute right-0 top-full bg-white shadow-lg rounded-lg mt-2 p-4 w-48"
          [class.hidden]="!dropdownOpen"
        >
          <li class="py-2 px-4 hover:bg-gray-100 cursor-pointer">
            <a routerLink="/profile">Profile</a>
          </li>
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
  
  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.updateAuthState();
    
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

    const token = localStorage.getItem('access_token');
    if (token) {
      this.isLoggedIn = true;
      this.username = localStorage.getItem('username') || 'User';
      this.avatar = localStorage.getItem('avatar') || this.avatar;
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
