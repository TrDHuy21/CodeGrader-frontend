//Call API user service
import { inject, Injectable } from '@angular/core';
import { Observable, delay, map, timeInterval, timeout } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { mapUserProfile, UserProfileDto, UserProfileModel } from '../models/user-profile';
import { ApiResponse } from '../models/api-respone';
import { HttpInterceptorFn } from '@angular/common/http';
import { HttpHeaders, HttpParams } from '@angular/common/http';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjIiLCJVc2VybmFtZSI6InVzZXIiLCJSb2xlIjoiVXNlciIsIm5iZiI6MTc1NjEzNjY1NCwiZXhwIjoxNzU2MTQwMjU0LCJpYXQiOjE3NTYxMzY2NTQsImlzcyI6Iklzc3VlciIsImF1ZCI6Ik15QXVkaWVuY2UifQ.HsbJc9MpuzCRo8xWPIQTLT-ajE4nQZUlzvBPrazv4QA';
@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private apiUrl = 'http://localhost:5000/user';

  headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  constructor(private http: HttpClient) {}
  getUserProfile(username: string): Observable<UserProfileModel> {
    return this.http.get<ApiResponse<UserProfileDto>>(`${this.apiUrl}/profile/${username}`).pipe(
      // delay(5000),
      map((res) => mapUserProfile(res.data))
    );
  }
  updateUserProfile(userProfile: UserProfileDto) {
    return this.http.put<ApiResponse<UserProfileDto>>(
      `${this.apiUrl}/profile/update-info`,
      userProfile, // <-- gửi dữ liệu form
      { headers: this.headers } // có Authorization thì giữ
    );
  }

  updatePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Observable<ApiResponse> {
    const params = new HttpParams().set('userId', String(userId));
    return this.http.put<ApiResponse>(
      `${this.apiUrl}/change-password`,
      { currentPassword, newPassword },
      { headers: this.headers, params }
    );
  }
}
