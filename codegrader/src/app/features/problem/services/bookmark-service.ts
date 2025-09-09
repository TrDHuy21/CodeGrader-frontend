import { Injectable } from '@angular/core';
import { ApiResponse } from '../../user/models/api-respone';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookmarkModel } from '../models/bookmark-model';
import { Problem } from '../models/ProblemModel';
@Injectable({ providedIn: 'root' })
export class BookmarkService {
  private url = 'http://localhost:5000/bookmark';
  constructor(private http: HttpClient) {}
  get(): Observable<ApiResponse<Problem[]>> {
    return this.http.get<ApiResponse<Problem[]>>(`${this.url}`);
  }
  add(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}?problemId=${id}`, { id });
  }
  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.url}?problemId=${id}`);
  }
}
