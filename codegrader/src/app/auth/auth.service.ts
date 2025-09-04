import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import {
  Observable,
  tap,
  BehaviorSubject,
  map,
} from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import {
  LoginRequest,
  LoginResponse,
  ConfirmEmailRequest,
  ApiErrorResponse,
  RequestUpdateNewPassword,
} from './auth.model';
import { ApiResponse } from '../features/user/models/api-respone';

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/auth'; // base URL
  private tokenKey = 'access_token';
  private isRefreshingToken = false;
  private authStateSubject = new BehaviorSubject<boolean>(false);
  private refreshToken = new BehaviorSubject<string | null>(null);

  constructor(private httpClient: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    // Chỉ khởi tạo trạng thái nếu đang ở browser
    if (isPlatformBrowser(this.platformId)) {
      this.authStateSubject.next(this.isLoggedIn());
    }
  }

  // Đăng nhập
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.httpClient
      .post<LoginResponse>(`${this.apiUrl}/login`, request, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        tap((res) => {
          if (res.isSuccess && res.data) {
            console.log(res.data);
            // Chỉ lưu vào localStorage nếu đang ở browser
            if (isPlatformBrowser(this.platformId)) {
              // Lưu token
              localStorage.setItem(this.tokenKey, res.data.tokenDto.accessToken);

              //refresh token
              localStorage.setItem('refresh_token', res.data.tokenDto.refreshToken);
              // Lưu thông tin user
              localStorage.setItem('username', res.data.userDto.userName);
              localStorage.setItem('fullname', res.data.userDto.fullName);
              localStorage.setItem('avatar', res.data.userDto.avatar ?? '');
            }

            // Cập nhật trạng thái đăng nhập
            this.authStateSubject.next(true);
          }
        })
      );
  }

  // Đăng ký
  signup(request: any): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/register`, request, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Xác nhận email
  verifyEmail(request: ConfirmEmailRequest): Observable<ApiErrorResponse> {
    return this.httpClient.post<ApiErrorResponse>(`${this.apiUrl}/confirm-email`, request, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Gửi lại OTP
  resendOtp(email: string): Observable<ApiErrorResponse> {
    return this.httpClient.post<ApiErrorResponse>(
      `${this.apiUrl}/send-otp-email`,
      { email },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Quên mật khẩu
  forgotPassword(email: string): Observable<ApiErrorResponse> {
    return this.httpClient.post<ApiErrorResponse>(
      `${this.apiUrl}/forgot-password`,
      { email },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Cập nhật mật khẩu mới
  updateNewPassword(request: RequestUpdateNewPassword): Observable<ApiErrorResponse> {
    return this.httpClient.post<ApiErrorResponse>(`${this.apiUrl}/update-password`, request, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Đăng xuất
  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      // localStorage.removeItem('refresh_token');
      localStorage.removeItem('username');
      localStorage.removeItem('fullname');
      localStorage.removeItem('avatar');
    }
    this.authStateSubject.next(false);
  }

  // Lấy token
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  //get refresh token
  getNewAccessToken(refreshToken: string): Observable<RefreshResponse> {
    return this.httpClient
      .post<ApiResponse<RefreshResponse>>(`${this.apiUrl}/refresh-token`, { token: refreshToken })
      .pipe(
        // Ép backend trả về đúng shape
        map((res) => {
          if (!res?.isSuccess || !res.data?.accessToken) {
            throw new Error(res?.message || 'Refresh token failed');
          }
          return res.data; // ==> { accessToken, refreshToken? }
        })
      );
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }
  setAccessToken(accessToken: string) {
    localStorage.setItem(this.tokenKey, accessToken);
  }
  setRefreshToken(refreshToken: string) {
    localStorage.setItem('refresh_token', refreshToken);
  }

  // Kiểm tra đăng nhập
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Lấy trạng thái đăng nhập
  getAuthState(): Observable<boolean> {
    return this.authStateSubject.asObservable();
  }

  // Cập nhật trạng thái đăng nhập
  updateAuthState() {
    this.authStateSubject.next(this.isLoggedIn());
  }

  // private withAuth(req: HttpRequest<any>, token: string) {
  //   return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  // }

  // handleUnauthorized(req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> {
  //   if (!this.isRefreshingToken) {
  //     this.isRefreshingToken = true;
  //     this.refreshToken.next(null);
  //     const refreshTokenValue = this.refreshToken.value;
  //     if (!refreshTokenValue) {
  //       this.logout();
  //       return throwError(() => new Error('No refresh token'));
  //     }

  //     return this.getNewAccessToken(refreshTokenValue).pipe(
  //       tap((res) => {
  //         // res: RefreshResponse
  //         localStorage.setItem(this.tokenKey, res.accessToken);
  //         localStorage.setItem('refresh_token', res.refreshToken);
  //         this.refreshToken.next(res.accessToken);
  //       }),
  //       switchMap((res) => next(this.withAuth(req, res.accessToken))),
  //       catchError((err) => {
  //         this.logout();
  //         return throwError(() => err);
  //       }),
  //       finalize(() => {
  //         this.isRefreshingToken = false;
  //       })
  //     );
  //   }
  //   return this.refreshToken.pipe(
  //     filter((token): token is string => token !== null),
  //     take(1),
  //     switchMap((token) => next(this.withAuth(req, token)))
  //   );
  // }
}
