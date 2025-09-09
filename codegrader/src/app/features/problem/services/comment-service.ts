import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../user/models/api-respone';
import { __param } from 'tslib';
@Injectable({ providedIn: 'root' })
export class CommentService {
  private url = 'http://localhost:5000/comment';
  constructor(private http: HttpClient) {}

  add(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}`, data);
  }
  get(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.url}`);
  }
  like(commentId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/like/${commentId}`, null);
  }
  unlike(commentId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/unlike/${commentId}`, null);
  }
  getPerProblem(problemId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.url}/problem/${problemId}`);
  }
}
