import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject, map } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import {
  AdminGetTagResponse,
  TagForAdminGet,
  CreateTagRequest,
  UpdateTagRequest,
} from './tag.model';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private apiUrl = 'http://localhost:5000/problem/Tag';
  private tagsSubject = new BehaviorSubject<TagForAdminGet[]>([]);
  public tags$ = this.tagsSubject.asObservable();

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  // Get all tags from API
  getAllTags(): Observable<AdminGetTagResponse> {
    return this.http.get<AdminGetTagResponse>(this.apiUrl).pipe(
      tap((response) => {
        if (response.isSuccess && response.data) {
          this.tagsSubject.next(response.data);
        }
      })
    );
  }

  // Get tags with pagination
  getTagsWithPagination(
    page: number,
    pageSize: number,
    searchTerm: string = ''
  ): Observable<{
    tags: TagForAdminGet[];
    totalTags: number;
    currentPage: number;
    totalPages: number;
  }> {
    return this.tags$.pipe(
      map((tags) => {
        // Filter tags based on search term
        let filteredTags = tags;
        if (searchTerm.trim()) {
          const lower = searchTerm.toLowerCase();
          filteredTags = tags.filter(
            (tag) => tag.name.toLowerCase().includes(lower) || String(tag.id).includes(lower)
          );
        }

        const totalTags = filteredTags.length;
        const totalPages = Math.ceil(totalTags / pageSize) || 1;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedTags = filteredTags.slice(startIndex, endIndex);

        return {
          tags: paginatedTags,
          totalTags,
          currentPage: page,
          totalPages,
        };
      })
    );
  }

  // Create new tag
  createTag(payload: CreateTagRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}`, payload);
  }

  // Update tag
  updateTag(payload: UpdateTagRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}`, payload);
  }

  // Toggle tag status (lock/unlock)
  toggleTagStatus(payload: UpdateTagRequest): Observable<any> {
    return this.updateTag(payload);
  }

  // Delete tag
  deleteTag(tagId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${tagId}`);
  }

  // Refresh tags data
  refreshTags(): void {
    this.getAllTags().subscribe();
  }
}
