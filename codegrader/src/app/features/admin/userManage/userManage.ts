import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { AdminNavbar, AdminSidebar } from "../layoutAdminPage";
import { UserService } from "./user.service";
import { UserForAdminGet } from "./userAdminModel";
import { Subscription } from "rxjs";
import Swal from 'sweetalert2';

@Component({
    selector: "usermanagepage",
    templateUrl: "userManage.html",
    styleUrl: "userManage.css",
    imports: [AdminNavbar, AdminSidebar],
    standalone: true
})
export class UserManage implements OnInit, OnDestroy {
    constructor(
        private router: Router,
        private userService: UserService
    ) {}

    // Properties
    isDropdownActive = false;
    searchTerm = '';
    notificationCount = 3;
    
    // Pagination properties
    currentPage = 1;
    pageSize = 5;
    totalUsers = 0;
    totalPages = 0;
    
    // Data properties
    users: UserForAdminGet[] = [];
    filteredUsers: UserForAdminGet[] = [];
    loading = false;
    error = '';
    
    // Subscription
    private subscription = new Subscription();

    ngOnInit() {
        this.loadUsers();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    // Load users from API
    loadUsers() {
        this.loading = true;
        this.error = '';
        
        // First, get all users from API
        this.subscription.add(
            this.userService.getAllUsers().subscribe({
                next: (response) => {
                    if (response.isSuccess && response.data) {
                        this.users = response.data;
                        this.updatePagination();
                    } else {
                        this.error = response.message || 'Failed to load users';
                        this.showErrorAlert('Error', this.error);
                    }
                    this.loading = false;
                },
                error: (err) => {
                    this.error = 'Error loading users: ' + err.message;
                    this.loading = false;
                    this.showErrorAlert('Error', this.error);
                }
            })
        );
    }

    // Update pagination and filtered users
    updatePagination() {
        this.subscription.add(
            this.userService.getUsersWithPagination(this.currentPage, this.pageSize, this.searchTerm)
                .subscribe(data => {
                    this.filteredUsers = data.users;
                    this.totalUsers = data.totalUsers;
                    this.totalPages = data.totalPages;
                })
        );
    }

    // Navigation methods
    onNavItemClick(path: string) {
        this.router.navigate([path]);
    }

    // Admin dropdown methods
    toggleDropdown() {
        this.isDropdownActive = !this.isDropdownActive;
    }

    closeDropdown() {
        this.isDropdownActive = false;
    }

    // Notification methods
    onNotificationClick() {
        Swal.fire({
            title: 'Notifications',
            text: `You have ${this.notificationCount} new notifications!`,
            icon: 'info',
            confirmButtonText: 'OK',
            confirmButtonColor: '#667eea',
            background: '#ffffff',
            backdrop: 'rgba(0,0,0,0.4)'
        });
    }

    // Search methods
    onSearchInput(searchTerm: string) {
        this.searchTerm = searchTerm;
        this.currentPage = 1; // Reset to first page when searching
        this.updatePagination();
    }

    // Pagination methods
    goToPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.updatePagination();
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.goToPage(this.currentPage + 1);
        }
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
        }
    }

    // Action button methods
  onViewUser(user: UserForAdminGet) {
  // Tạo HTML avatar sẵn
  const avatarHtml = user.avatar
    ? `<img src="${user.avatar}" class="avatar-img" alt="${user.fullName}" />`
    : `<div class="${this.getUserAvatarClass()}">${this.getUserAvatarText(user)}</div>`;

  Swal.fire({
    title: `<i class="fas fa-user-circle text-primary"></i> User Details`,
    html: `
      <div class="user-details-container">
        <div data-bs-toggle="tooltip" title="${user.fullName}">
          ${avatarHtml}
        </div>
        <p><i class="fas fa-id-card"></i> <strong>Full Name:</strong> ${user.fullName}</p>
        <p><i class="fas fa-user"></i> <strong>Username:</strong> ${user.username}</p>
        <p><i class="fas fa-envelope"></i> <strong>Email:</strong> ${user.email}</p>
        <p><i class="fas fa-birthday-cake"></i> <strong>Birthday:</strong> ${this.formatBirthday(user.birthday)}</p>
        <p><i class="fas fa-toggle-on"></i> <strong>Status:</strong> 
          <span class="badge ${user.isActive ? 'badge-success' : 'badge-danger'}">
            ${user.isActive ? 'Active' : 'Banned'}
          </span>
        </p>
        <p><i class="fas fa-check-circle"></i> <strong>Email Confirmed:</strong> 
          <span class="badge ${user.isEmailConfirmed ? 'badge-success' : 'badge-warning'}">
            ${user.isEmailConfirmed ? 'Confirmed' : 'Pending'}
          </span>
        </p>
        <p><i class="fas fa-clock"></i> <strong>Created:</strong> ${this.formatDate(user.createdAt)}</p>
        ${user.bio ? `<p><i class="fas fa-info-circle"></i> <strong>Bio:</strong> ${user.bio}</p>` : ''}
        ${user.githubLink ? `<p><i class="fab fa-github"></i> <strong>GitHub:</strong> <a href="${user.githubLink}" target="_blank">${user.githubLink}</a></p>` : ''}
        ${user.linkedinLink ? `<p><i class="fab fa-linkedin text-primary"></i> <strong>LinkedIn:</strong> <a href="${user.linkedinLink}" target="_blank">${user.linkedinLink}</a></p>` : ''}
      </div>
    `,
    confirmButtonText: '<i class="fas fa-times"></i> Close',
    confirmButtonColor: '#667eea',
    background: '#ffffff',
    backdrop: 'rgba(0,0,0,0.4)',
    customClass: {
      popup: 'swal-wide'
    }
  });
}


    onToggleUserStatus(user: UserForAdminGet) {
        const action = user.isActive ? 'ban' : 'unban';
        const actionText = user.isActive ? 'Ban' : 'Unban';
        const icon = user.isActive ? 'warning' : 'question';
        
        Swal.fire({
            title: `${actionText} User`,
            text: `Are you sure you want to ${action} ${user.fullName}?`,
            icon: icon,
            showCancelButton: true,
            confirmButtonColor: user.isActive ? '#ef4444' : '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: `Yes, ${actionText}!`,
            cancelButtonText: 'Cancel',
            background: '#ffffff',
            backdrop: 'rgba(0,0,0,0.4)'
        }).then((result) => {
            if (result.isConfirmed) {
                this.subscription.add(
                    this.userService.toggleUserStatus(user.id, user.isActive).subscribe({
                        next: (response) => {
                            this.showSuccessAlert(`${actionText} Successful`, `${user.fullName} has been ${action}ed successfully!`);
                            // Refresh users data
                            this.loadUsers();
                        },
                        error: (err) => {
                            this.showErrorAlert('Error', `Failed to ${action} user: ${err.message}`);
                        }
                    })
                );
            }
        });
    }

    // SweetAlert helper methods
    showSuccessAlert(title: string, message: string) {
        Swal.fire({
            title: title,
            text: message,
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#10b981',
            background: '#ffffff',
            backdrop: 'rgba(0,0,0,0.4)',
            timer: 3000,
            timerProgressBar: true
        });
    }

    showErrorAlert(title: string, message: string) {
        Swal.fire({
            title: title,
            text: message,
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#ef4444',
            background: '#ffffff',
            backdrop: 'rgba(0,0,0,0.4)'
        });
    }

    // Get status badge class
    getStatusBadgeClass(isActive: boolean): string {
        return isActive ? 'status-badge status-active' : 'status-badge status-banned';
    }

    // Get status text
    getStatusText(isActive: boolean): string {
        return isActive ? 'Active' : 'Banned';
    }

    // Get lock/unlock icon
    getLockIcon(isActive: boolean): string {
        return isActive ? 'fas fa-lock' : 'fas fa-unlock';
    }

    getColorIconLock(isActive: boolean): string {
        return isActive ? 'lockcolor' : 'unlockcolor';
    }

    // Get user avatar class
    getUserAvatarClass(gender?: string): string {
        return `user-avatar ${gender || 'male'}`;
    }

    // Get user avatar text
    getUserAvatarText(user: UserForAdminGet): string {
        return user.avatar || user.fullName.charAt(0).toUpperCase();
    }

    // Format date
    formatDate(dateString: string): string {
        if (!dateString) return 'Not provided';
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid date';
        
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Format birthday
    formatBirthday(birthday: string): string {
        if (!birthday) return 'Not provided';
        
        const date = new Date(birthday);
        if (isNaN(date.getTime())) return 'Invalid date';
        
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Get page numbers for pagination
    getPageNumbers(): number[] {
        const pages: number[] = [];
        const maxPagesToShow = 5;
        
        if (this.totalPages <= maxPagesToShow) {
            for (let i = 1; i <= this.totalPages; i++) {
                pages.push(i);
            }
        } else {
            let start = Math.max(1, this.currentPage - 2);
            let end = Math.min(this.totalPages, start + maxPagesToShow - 1);
            
            if (end - start + 1 < maxPagesToShow) {
                start = Math.max(1, end - maxPagesToShow + 1);
            }
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
        }
        
        return pages;
    }

    // Get email confirmed class
    getEmailConfirmedClass(isEmailConfirmed: boolean): string {
        return isEmailConfirmed ? 'status-badge status-active' : 'status-badge status-pending';
    }

    // Math utility for template
    get Math() {
        return Math;
    }
}