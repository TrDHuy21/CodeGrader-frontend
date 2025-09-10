import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  tap,
  BehaviorSubject,
  map,
} from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { AdminGetCommentResponse, CommentForAdminGet } from './comment.model';
import { AdminGetUserResponse, UserForAdminGet } from '../userManage/userAdminModel';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:5000/comment';
  private commentsSubject = new BehaviorSubject<CommentForAdminGet[]>([]);
  private userByIdSubject = new BehaviorSubject<UserForAdminGet[]>([]);
  public comments$ = this.commentsSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Get all comments from API
  getAllComments(): Observable<AdminGetCommentResponse> {
    return this.http.get<AdminGetCommentResponse>(this.apiUrl).pipe(
      tap(response => {
        if (response.isSuccess && response.data) {
          this.commentsSubject.next(response.data);
        }
      })
    );
  }

  getUserNameComment(id: number): Observable<AdminGetUserResponse> {
    // Fetch users so we can map userId -> fullName/username
    return this.http.get<AdminGetUserResponse>('http://localhost:5000/admin/user/' + id).pipe(
      tap(response => {
        if (response.isSuccess && response.data) {
          this.userByIdSubject.next(response.data);
        }
      })
    );
  }

  // Get comments with pagination
  getCommentsWithPagination(page: number, pageSize: number, searchTerm: string = ''): Observable<{
    comments: CommentForAdminGet[];
    totalComments: number;
    currentPage: number;
    totalPages: number;
  }> {
    return this.comments$.pipe(
      map(comments => {
        // Filter comments based on search term
        let filteredComments = comments;
        if (searchTerm.trim()) {
          const lower = searchTerm.toLowerCase();
          filteredComments = comments.filter(comment => 
            comment.commentText.toLowerCase().includes(lower) ||
            String(comment.userId).includes(lower) ||
            String(comment.problemId).includes(lower)
          );
        }

        const totalComments = filteredComments.length;
        const totalPages = Math.ceil(totalComments / pageSize) || 1;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedComments = filteredComments.slice(startIndex, endIndex);

        return {
          comments: paginatedComments,
          totalComments,
          currentPage: page,
          totalPages
        };
      })
    );
  }

  // Add new comment
  addComment(payload: { userId: number; problemId: number; commentText: string; parentCommentId?: number | null }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, payload);
  }

deleteComment(commentId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/?id=${commentId}`);
}



  // Refresh comments data
  refreshComments(): void {
    this.getAllComments().subscribe();
  }
}
