import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-respone';
@Injectable({ providedIn: 'root' })
export class UserProgressService {
  private url = 'http://localhost:5000/progress/UserProgress';
  constructor(private http: HttpClient) {}

  getProgress(userId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.url}/${userId}`);
  }
}
