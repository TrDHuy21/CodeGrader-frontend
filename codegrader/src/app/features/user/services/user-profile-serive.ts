//Call API user service
import { inject, Injectable } from '@angular/core';
import { Observable, delay, map, timeInterval, timeout } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { mapUserProfile, UserProfileDto, UserProfileModel } from '../models/user-profile';
import { ApiResponse } from '../models/api-respone';
import { HttpInterceptorFn } from '@angular/common/http';
import { HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private apiUrl = 'http://localhost:5000/user';

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
      // { headers: this.headers, params }
    );
  }
  updateAvatar(file: File): Observable<ApiResponse> {
    const form = new FormData();
    form.append('Avatar', file, file.name); // 👈 TÊN FIELD phải đúng 'Avatar'

    return this.http.put<ApiResponse>(`${this.apiUrl}/update-avatar`, form, {});
  }
}
