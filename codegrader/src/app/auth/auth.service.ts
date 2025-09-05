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
  private refreshTokenKey = 'refresh_token';
  private usernameKey = 'username';
  private fullnameKey = 'fullname';
  private avatarKey = 'avatar';
  private isRefreshingToken = false;
  private authStateSubject = new BehaviorSubject<boolean>(false);
  private refreshToken = new BehaviorSubject<string | null>(null);

  constructor(private httpClient: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    // Chỉ khởi tạo trạng thái nếu đang ở browser
    if (isPlatformBrowser(this.platformId)) {
      this.authStateSubject.next(this.isLoggedIn());
    }
  }

  // Cookie helper methods
  private setCookie(name: string, value: string, days: number = 7): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    const secure = window.location.protocol === 'https:';
    const cookieString = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; samesite=strict${secure ? '; secure' : ''}`;
    
    document.cookie = cookieString;
  }

  private getCookie(name: string): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  }

  private removeCookie(name: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
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
            // Lưu vào cookie thay vì localStorage
            if (isPlatformBrowser(this.platformId)) {
              // Lưu access token (15 phút)
              this.setCookie(this.tokenKey, res.data.tokenDto.accessToken, 0.01); // 15 phút
              
              // Lưu refresh token (7 ngày)
              this.setCookie(this.refreshTokenKey, res.data.tokenDto.refreshToken, 7);
              
              // Lưu thông tin user (7 ngày)
              this.setCookie(this.usernameKey, res.data.userDto.userName, 7);
              this.setCookie(this.fullnameKey, res.data.userDto.fullName, 7);
              this.setCookie(this.avatarKey, res.data.userDto.avatar ?? '', 7);
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
      this.removeCookie(this.tokenKey);
      this.removeCookie(this.refreshTokenKey);
      this.removeCookie(this.usernameKey);
      this.removeCookie(this.fullnameKey);
      this.removeCookie(this.avatarKey);
    }
    this.authStateSubject.next(false);
  }

  // Lấy token
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return this.getCookie(this.tokenKey);
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
    return this.getCookie(this.refreshTokenKey);
  }
  
  setAccessToken(accessToken: string) {
    this.setCookie(this.tokenKey, accessToken, 0.01); // 15 phút
  }
  
  setRefreshToken(refreshToken: string) {
    this.setCookie(this.refreshTokenKey, refreshToken, 7); // 7 ngày
  }

  // Kiểm tra đăng nhập
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Lấy thông tin user từ cookie
  getUsername(): string | null {
    return this.getCookie(this.usernameKey);
  }

  getFullname(): string | null {
    return this.getCookie(this.fullnameKey);
  }

  getAvatar(): string | null {
    return this.getCookie(this.avatarKey);
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
