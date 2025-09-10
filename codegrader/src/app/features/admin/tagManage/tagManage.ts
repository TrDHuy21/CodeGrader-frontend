import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AdminNavbar, AdminSidebar } from '../layoutAdminPage';
import { TagService } from './tag.service';
import { TagForAdminGet, CreateTagRequest, UpdateTagRequest } from './tag.model';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'tagmanagepage',
  templateUrl: 'tagManage.html',
  styleUrl: 'tagManage.css',
  imports: [AdminNavbar, AdminSidebar, FormsModule],
  standalone: true,
})
export class TagManage implements OnInit, OnDestroy {
  constructor(private router: Router, private tagService: TagService) {}

  // Properties
  isDropdownActive = false;
  searchTerm = '';
  notificationCount = 3;

  // Pagination properties
  currentPage = 1;
  pageSize = 5;
  totalTags = 0;
  totalPages = 0;

  // Data properties
  tags: TagForAdminGet[] = [];
  filteredTags: TagForAdminGet[] = [];
  sortOption: 'name_asc' | 'name_desc' | 'id_asc' | 'id_desc' = 'name_asc';
  loading = false;
  error = '';

  // Subscription
  private subscription = new Subscription();

  ngOnInit() {
    this.loadTags();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Load tags from API
  loadTags() {
    this.loading = true;
    this.error = '';

    this.subscription.add(
      this.tagService.getAllTags().subscribe({
        next: (response) => {
          if (response.isSuccess && response.data) {
            this.tags = response.data;
            this.updatePagination();
          } else {
            this.error = response.message || 'Failed to load tags';
            this.showErrorAlert('Error', this.error);
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error loading tags: ' + err.message;
          this.loading = false;
          this.showErrorAlert('Error', this.error);
        },
      })
    );
  }

  // Update pagination and filtered tags
  updatePagination() {
    // Filter tags based on search term
    let filteredTags = this.tags;
    if (this.searchTerm.trim()) {
      const lower = this.searchTerm.toLowerCase();
      filteredTags = this.tags.filter(
        (tag) => tag.name.toLowerCase().includes(lower) || String(tag.id).includes(lower)
      );
    }

    // Apply sorting
    const sortedTags = this.applySort(filteredTags.slice());

    // Calculate pagination
    this.totalTags = sortedTags.length;
    this.totalPages = Math.ceil(this.totalTags / this.pageSize) || 1;

    // Get current page tags
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredTags = sortedTags.slice(startIndex, endIndex);
  }

  onSortChange() {
    // When sort option changes, re-apply pagination with new sorting
    this.updatePagination();
  }

  private applySort(list: TagForAdminGet[]): TagForAdminGet[] {
    const option = this.sortOption;
    return list.sort((a, b) => {
      if (option === 'name_asc') {
        return a.name.localeCompare(b.name);
      }
      if (option === 'name_desc') {
        return b.name.localeCompare(a.name);
      }
      if (option === 'id_asc') {
        return a.id - b.id;
      }
      if (option === 'id_desc') {
        return b.id - a.id;
      }
      return 0;
    });
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
      backdrop: 'rgba(0,0,0,0.4)',
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

  // Add tag
  onAddTagClick() {
    Swal.fire({
      title: 'Add New Tag',
      html: `
              <div style="text-align:left">
                <label>Tag Name</label>
                <input id="swal-tagName" type="text" class="swal2-input" placeholder="Enter tag name..." />
              </div>
            `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Add',
      preConfirm: () => {
        const tagName = String(
          (document.getElementById('swal-tagName') as HTMLInputElement)?.value || ''
        ).trim();
        if (!tagName) {
          Swal.showValidationMessage('Please provide tag name.');
          return false as any;
        }
        return { name: tagName };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { name } = result.value as { name: string };
        const request: CreateTagRequest = { name };

        this.subscription.add(
          this.tagService.createTag(request).subscribe({
            next: (response) => {
              if (response.isSuccess) {
                this.showSuccessAlert('Add Successful', 'Tag has been added successfully!');
                this.loadTags();
              } else {
                this.showErrorAlert('Error', response.message || 'Failed to add tag');
              }
            },
            error: (err) => {
              this.showErrorAlert('Error', `Failed to add tag: ${err.message}`);
            },
          })
        );
      }
    });
  }

  // Edit tag
  onEditTag(tag: TagForAdminGet) {
    Swal.fire({
      title: 'Edit Tag',
      html: `
          <div style="text-align:left">
            <label>Tag Name</label>
            <input id="swal-tagName" type="text" class="swal2-input" placeholder="Enter tag name..." value="${tag.name}" />
          </div>
        `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update',
      preConfirm: () => {
        const tagName = String(
          (document.getElementById('swal-tagName') as HTMLInputElement)?.value || ''
        ).trim();
        if (!tagName) {
          Swal.showValidationMessage('Please provide tag name.');
          return false as any;
        }
        return { id: tag.id, name: tagName, isDelete: tag.isDelete }; // ✅ giữ nguyên isDelete cũ
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { id, name, isDelete } = result.value as UpdateTagRequest;
        const request: UpdateTagRequest = { id, name, isDelete };

        this.subscription.add(
          this.tagService.updateTag(request).subscribe({
            next: (response) => {
              if (response.isSuccess) {
                this.showSuccessAlert('Update Successful', 'Tag has been updated successfully!');
                this.loadTags();
              } else {
                this.showErrorAlert('Error', response.message || 'Failed to update tag');
              }
            },
            error: (err) => {
              this.showErrorAlert('Error', `Failed to update tag: ${err.message}`);
            },
          })
        );
      }
    });
  }

  // Toggle tag status (lock/unlock)
  onToggleTagStatus(tag: TagForAdminGet) {
    const action = tag.isDelete ? 'unlock' : 'lock';
    const actionText = tag.isDelete ? 'unlock' : 'lock';

    Swal.fire({
      title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Tag`,
      text: `Are you sure you want to ${actionText} this tag "${tag.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: tag.isDelete ? '#10b981' : '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${actionText}!`,
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      backdrop: 'rgba(0,0,0,0.4)',
    }).then((result) => {
      if (result.isConfirmed) {
        const request: UpdateTagRequest = {
          id: tag.id,
          name: tag.name, // ✅ thêm name
          isDelete: !tag.isDelete, // ✅ đảo trạng thái
        };

        this.subscription.add(
          this.tagService.updateTag(request).subscribe({
            // ✅ dùng updateTag thay vì toggleTagStatus
            next: (response) => {
              if (response.isSuccess) {
                this.showSuccessAlert(
                  `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Successful`,
                  `Tag has been ${actionText}ed successfully!`
                );
                this.loadTags();
              } else {
                this.showErrorAlert('Error', response.message || `Failed to ${actionText} tag`);
              }
            },
            error: (err) => {
              this.showErrorAlert('Error', `Failed to ${actionText} tag: ${err.message}`);
            },
          })
        );
      }
    });
  }

  // Delete tag
  onDeleteTag(tag: TagForAdminGet) {
    Swal.fire({
      title: 'Delete Tag',
      text: `Are you sure you want to delete this tag "${tag.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete!',
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      backdrop: 'rgba(0,0,0,0.4)',
    }).then((result) => {
      if (result.isConfirmed) {
        this.subscription.add(
          this.tagService.deleteTag(tag.id).subscribe({
            next: (response) => {
              if (response.isSuccess) {
                this.showSuccessAlert('Delete Successful', 'Tag has been deleted successfully!');
                this.loadTags();
              } else {
                this.showErrorAlert('Error', response.message || 'Failed to delete tag');
              }
            },
            error: (err) => {
              this.showErrorAlert('Error', `Failed to delete tag: ${err.message}`);
            },
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
      timerProgressBar: true,
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
      backdrop: 'rgba(0,0,0,0.4)',
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

  // Math utility for template
  get Math() {
    return Math;
  }
}
