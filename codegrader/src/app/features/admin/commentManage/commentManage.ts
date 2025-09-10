import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { AdminNavbar, AdminSidebar } from "../layoutAdminPage";
import { CommentService } from "./comment.service";
import { CommentForAdminGet } from "./comment.model";
import { Subscription, forkJoin } from "rxjs";
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
@Component({
    selector: "commentmanagepage",
    templateUrl: "commentManage.html",
    styleUrl: "commentManage.css",
    imports: [AdminNavbar, AdminSidebar, FormsModule],
    standalone: true
})
export class CommentManage implements OnInit, OnDestroy {
    constructor(
        private router: Router,
        private commentService: CommentService,
    ) {}

    // Properties
    isDropdownActive = false;
    searchTerm = '';
    notificationCount = 3;
    
    // Pagination properties
    currentPage = 1;
    pageSize = 5;
    totalComments = 0;
    totalPages = 0;
    
    // Data properties
    comments: CommentForAdminGet[] = [];
    filteredComments: CommentForAdminGet[] = [];
    flattenedComments: CommentForAdminGet[] = []; // All comments including replies
    sortOption: 'createdAt_desc' | 'createdAt_asc' | 'like_desc' | 'like_asc' = 'createdAt_desc';
    loading = false;
    error = '';
    // User name lookup map
    private userIdToName = new Map<number, string>();
    
    // Subscription
    private subscription = new Subscription();

    ngOnInit() {
        this.loadComments();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    // Load usernames for display (fetch per unique userId)
    loadUserNames() {
        const uniqueUserIds = Array.from(new Set(this.flattenedComments.map(c => c.userId))).filter(id => typeof id === 'number');
        if (uniqueUserIds.length === 0) return;
        const requests = uniqueUserIds.map(id => this.commentService.getUserNameComment(id));
        this.subscription.add(
            forkJoin(requests).subscribe({
                next: (responses) => {
                    for (const resp of responses) {
                        if (resp?.isSuccess && resp?.data) {
                            const dataAny: any = resp.data as any;
                            const users: any[] = Array.isArray(dataAny) ? dataAny : [dataAny];
                            for (const u of users) {
                                const id = (u as any).id as number;
                                const name = (u as any).fullName ?? (u as any).username ?? `User ${id}`;
                                if (typeof id === 'number') {
                                    this.userIdToName.set(id, String(name));
                                }
                            }
                        }
                    }
                },
                error: () => { /* non-blocking */ }
            })
        );
    }

    getUserName(userId: number): string {
        return this.userIdToName.get(userId) ?? `#${userId}`;
    }

    // Flatten comments to include both parent comments and their replies
    // Comments are ordered: parent comment first, then its replies immediately below
    // Parent comments are sorted by creation date (newest first), replies are always newest first
    private flattenComments(comments: CommentForAdminGet[]): CommentForAdminGet[] {
        const flattened: CommentForAdminGet[] = [];
        
        // Sort parent comments by creation date (newest first by default)
        const sortedParentComments = [...comments].sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        
        for (const comment of sortedParentComments) {
            // Add the parent comment
            flattened.push(comment);
            
            // Add all replies if they exist, always sorted by creation date (newest first)
            if (comment.replies && comment.replies.length > 0) {
                const sortedReplies = [...comment.replies].sort((a, b) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });
                
                for (const reply of sortedReplies) {
                    flattened.push(reply);
                }
            }
        }
        
        return flattened;
    }

    // Load comments from API
    loadComments() {
        this.loading = true;
        this.error = '';
        
        // First, get all comments from API
        this.subscription.add(
            this.commentService.getAllComments().subscribe({
                next: (response) => {
                    if (response.isSuccess && response.data) {
                        this.comments = response.data;
                        // Flatten comments to include replies
                        this.flattenedComments = this.flattenComments(response.data);
                        this.updatePagination();
                        this.loadUserNames();
                    } else {
                        this.error = response.message || 'Failed to load comments';
                        this.showErrorAlert('Error', this.error);
                    }
                    this.loading = false;
                },
                error: (err) => {
                    this.error = 'Error loading comments: ' + err.message;
                    this.loading = false;
                    this.showErrorAlert('Error', this.error);
                }
            })
        );
    }

    // Update pagination and filtered comments
    updatePagination() {
        // Filter comments based on search term
        let filteredComments = this.flattenedComments;
        if (this.searchTerm.trim()) {
            const lower = this.searchTerm.toLowerCase();
            filteredComments = this.flattenedComments.filter(comment => 
                comment.commentText.toLowerCase().includes(lower) ||
                String(comment.userId).includes(lower) ||
                String(comment.problemId).includes(lower)
            );
        }

        // Apply sorting
        const sortedComments = this.applySort(filteredComments.slice());
        
        // Calculate pagination
        this.totalComments = sortedComments.length;
        this.totalPages = Math.ceil(this.totalComments / this.pageSize) || 1;
        
        // Get current page comments
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.filteredComments = sortedComments.slice(startIndex, endIndex);
    }

    onSortChange() {
        // When sort option changes, re-apply pagination with new sorting
        this.updatePagination();
    }

    private applySort(list: CommentForAdminGet[]): CommentForAdminGet[] {
        const option = this.sortOption;
        
        // Separate parent comments and replies
        const parentComments: CommentForAdminGet[] = [];
        const replies: CommentForAdminGet[] = [];
        
        for (const comment of list) {
            if (comment.parentCommentId === null) {
                parentComments.push(comment);
            } else {
                replies.push(comment);
            }
        }
        
        // Sort only parent comments based on the selected option
        const sortedParentComments = parentComments.sort((a, b) => {
            if (option === 'createdAt_desc') {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            if (option === 'createdAt_asc') {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }
            if (option === 'like_desc') {
                return (b.like ?? 0) - (a.like ?? 0);
            }
            if (option === 'like_asc') {
                return (a.like ?? 0) - (b.like ?? 0);
            }
            return 0;
        });
        
        // Build the final sorted list: parent comment first, then its replies
        const result: CommentForAdminGet[] = [];
        
        for (const parentComment of sortedParentComments) {
            // Add the parent comment
            result.push(parentComment);
            
            // Add all replies for this parent, sorted by creation date (newest first)
            const parentReplies = replies
                .filter(reply => reply.parentCommentId === parentComment.id)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            
            result.push(...parentReplies);
        }
        
        // Add any orphan replies at the end (replies whose parent is not in the current list)
        // These are also sorted by creation date (newest first)
        const orphanReplies = replies
            .filter(reply => !sortedParentComments.some(parent => parent.id === reply.parentCommentId))
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        result.push(...orphanReplies);
        
        return result;
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

    // Add comment via dialog (optionally prefilled)
    onAddCommentClick(prefill?: { userId?: number; problemId?: number }) {
        const preUser = prefill?.userId ?? '';
        const preProblem = prefill?.problemId ?? '';
        Swal.fire({
            title: 'Add Comment',
            html: `
              <div style="text-align:left">
                <label>User ID</label>
                <input id="swal-userId" type="number" class="swal2-input" placeholder="User ID" value="${preUser}" />
                <label>Problem ID</label>
                <input id="swal-problemId" type="number" class="swal2-input" placeholder="Problem ID" value="${preProblem}" />
                <label>Comment Text</label>
                <input id="swal-commentText" type="text" class="swal2-input" placeholder="Write a comment..." />
              </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Add',
            preConfirm: () => {
                const userId = Number((document.getElementById('swal-userId') as HTMLInputElement)?.value || 0);
                const problemId = Number((document.getElementById('swal-problemId') as HTMLInputElement)?.value || 0);
                const commentText = String((document.getElementById('swal-commentText') as HTMLInputElement)?.value || '').trim();
                if (!userId || !problemId || !commentText) {
                    Swal.showValidationMessage('Please provide userId, problemId and comment text.');
                    return false as any;
                }
                return { userId, problemId, commentText };
            }
        }).then(result => {
            if (result.isConfirmed && result.value) {
                const { userId, problemId, commentText } = result.value as { userId: number; problemId: number; commentText: string };
                this.subscription.add(
                    this.commentService.addComment({ userId, problemId, commentText, parentCommentId: null }).subscribe({
                        next: () => {
                            this.showSuccessAlert('Add Successful', 'Comment has been added successfully!');
                            this.loadComments();
                        },
                        error: (err) => {
                            this.showErrorAlert('Error', `Failed to add comment: ${err.message}`);
                        }
                    })
                );
            }
        });
    }

    onDeleteComment(comment: CommentForAdminGet) {
        Swal.fire({
            title: 'Delete Comment',
            text: `Are you sure you want to delete this comment by ${this.getUserName(comment.userId)}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Delete!',
            cancelButtonText: 'Cancel',
            background: '#ffffff',
            backdrop: 'rgba(0,0,0,0.4)'
        }).then((result) => {
            if (result.isConfirmed) {
                this.subscription.add(
                    this.commentService.deleteComment(comment.id).subscribe({
                        next: (response) => {
                            this.showSuccessAlert('Delete Successful', 'Comment has been deleted successfully!');
                            // Refresh comments data
                            this.loadComments();
                        },
                        error: (err) => {
                            this.showErrorAlert('Error', `Failed to delete comment: ${err.message}`);
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

    // Note: No status/avatar helpers needed for simplified comment model

    // Format date
    formatDate(dateString: string): string {
        if (!dateString) return 'Not provided';
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid date';
        
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Format comment content
    formatCommentContent(content: string): string {
        if (!content) return 'No content';
        
        // Truncate long content
        if (content.length > 200) {
            return content.substring(0, 200) + '...';
        }
        
        return content;
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
