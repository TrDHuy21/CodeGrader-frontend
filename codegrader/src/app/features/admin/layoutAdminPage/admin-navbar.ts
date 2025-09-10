import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { AuthService } from "../../../auth/auth.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { CookieService } from "../../../shared/services/cookie.service";
@Component({
  selector: "admin-navbar",
  standalone: true,
  template: `
    <nav>
      <div class="nav-left">
        <div class="search-container">
          <i class="fas fa-search search-icon"></i>
          <input
            type="text"
            [placeholder]="searchPlaceholder"
            class="search-input"
            (input)="onSearchInput($event)"
            [(ngModel)]="searchTerm"
          />
        </div>
      </div>

      <div class="nav-right">
        <button class="nav-btn notification-btn" (click)="onNotificationClick()">
          <i class="fas fa-bell"></i>
          <span class="notification-badge">
            @if(notificationCount > 0) {
              {{ notificationCount }}
            }
          </span>
        </button>
        <div class="admin-profile-dropdown" [class.active]="isDropdownActive">
          <div class="admin-profile" (click)="toggleDropdown()">
            <img [src]="adminAvatar" class="admin-avatar" alt="Admin Avatar" (error)="onAvatarError()" />
            <span>Admin</span>
            <i class="fas fa-chevron-down dropdown-arrow"></i>
          </div>
          <div class="dropdown-menu">
            <a href="#" class="dropdown-item" (click)="onDropdownItemClick($event, 'profile')">
              <i class="fas fa-user"></i>
              Profile
            </a>
            <a href="#" routerLink="/" class="dropdown-item" (click)="onDropdownItemClick($event, 'settings')">
              <i class="fas fa-home"></i>
              User UI
            </a>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item logout-item" (click)="onDropdownItemClick($event, 'logout')">
              <i class="fas fa-sign-out-alt"></i>
              Logout
            </a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styleUrl: "admin-navbar.css",
  imports: [FormsModule, RouterLink]
})
export class AdminNavbar implements OnInit {
  @Input() searchTerm: string = '';
  @Input() searchPlaceholder: string = "Search...";
  @Input() notificationCount: number = 0;
  @Input() isDropdownActive: boolean = false;

  @Output() searchChange = new EventEmitter<string>();
  @Output() notificationClick = new EventEmitter<void>();
  @Output() dropdownToggle = new EventEmitter<void>();
  @Output() dropdownItemClick = new EventEmitter<string>();
  adminAvatar: string = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  constructor(private authService: AuthService, private router: Router, private cookieService: CookieService) { }

  ngOnInit(): void {
    const cookieAvatar = this.cookieService.getCookie('avatar');
    const authAvatar = this.authService.getAvatar();
    const chosen = (cookieAvatar && cookieAvatar.trim().length > 0) ? cookieAvatar : (authAvatar && authAvatar.trim().length > 0 ? authAvatar : null);
    if (chosen) {
      this.adminAvatar = chosen;
    }
  }

  onAvatarError() {
    this.adminAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  }
  onSearchInput(event: Event) {
    this.searchChange.emit(this.searchTerm.toLowerCase());
  }

  onNotificationClick() {
    this.notificationClick.emit();
  }

  toggleDropdown() {
    this.dropdownToggle.emit();
  }

  async onDropdownItemClick(event: Event, action: string) {
    // Ngăn chặn default behavior của link
    event.preventDefault();
    event.stopPropagation();

    if (action === "logout") {
      const result = await Swal.fire({
        title: "Are you sure you want to log out?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      if (result.isConfirmed) {
        this.authService.logout();
        await Swal.fire({
          icon: "success",
          title: "Logout success!",
          timer: 1500,
          showConfirmButton: false,
        });
        this.router.navigate(["/login"]);
      }
    } else {
      console.log("Not Logout !");
    }
  }

}
