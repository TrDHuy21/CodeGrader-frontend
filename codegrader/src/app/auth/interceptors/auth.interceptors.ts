import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null); //một Subject/BehaviorSubject phát ra access token mới cho các request khác đang chờ (đã bị 401) để retry
  constructor(private authService: AuthService) {}

  // Những URL KHÔNG gắn Authorization (public)
  private readonly PUBLIC_URLS = ['/auth/login', '/auth/register', '/auth/refresh-token'];
  private readonly AUTH_URLS = [
    '/auth/login',
    '/auth/refresh-token',
    'http://localhost:5000/bookmark',
  ];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const token = this.authService.getToken();
    // let authReq = req;

    // if (this.AUTH_URLS.some((u) => req.url.includes(u))) {
    //   return next.handle(req);
    // }
    // const shouldAttachAuth = !this.PUBLIC_URLS.some((u) => req.url.includes(u)); // public thì không gắn token

    // if (token && shouldAttachAuth) {
    //   authReq = this.addToken(req, token);
    // }
    // return next.handle(authReq).pipe(
    //   catchError((err) => {
    //     // if (err instanceof HttpErrorResponse && err.status === 401) {
    //     //   return this.handle401Error(authReq, next);
    //     // }
    //     // return throwError(() => err);
    //     const hadAuthHeader = authReq.headers.has('Authorization');
    //     const isAuthEndpoint = this.AUTH_URLS.some((u) => authReq.url.includes(u));

    //     if (
    //       err instanceof HttpErrorResponse &&
    //       err.status === 401 &&
    //       hadAuthHeader &&
    //       !isAuthEndpoint
    //     ) {
    //       return this.handle401Error(authReq, next);
    //     }

    //     return throwError(() => err);
    //   })
    // );
    const token = this.authService.getToken();
    const isPublic = this.PUBLIC_URLS.some((u) => req.url.includes(u));

    // Gắn token cho mọi endpoint không-public (nếu có token)
    const authReq = !isPublic && token ? this.addToken(req, token) : req;

    return next.handle(authReq).pipe(
      catchError((err) => {
        // Không refresh cho endpoint public (tránh vòng lặp ở /auth/refresh-token)
        if (
          err.status === 401 &&
          !this.authService.hasLoggedOut() &&
          this.authService.getRefreshToken() !== null
        ) {
          return this.handle401Error(authReq, next);
        }
        if (!(err instanceof HttpErrorResponse)) return throwError(() => err);

        const isUnauthorized = err.status === 401;

        // if (isUnauthorized && !isPublic) {
        //   return this.handle401Error(authReq, next);
        // }

        return throwError(() => err);
      })
    );
    // // nếu không có token => gửi request gốc
    // return next.handle(req);
  }
  private addToken(req: HttpRequest<any>, token: string) {
    return req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const rToken = this.authService.getRefreshToken();
      if (!rToken) {
        // this.authService.logout();
        this.isRefreshing = false;
        return throwError(() => new Error('No refresh token'));
      }

      return this.authService.getNewAccessToken(rToken).pipe(
        // Tại đây res đã là RefreshResponse (do map ở service)
        switchMap((res) => {
          const newAccess = res.accessToken;
          const newRefresh = res.refreshToken;

          this.authService.setAccessToken(newAccess);
          if (newRefresh) this.authService.setRefreshToken(newRefresh);

          this.isRefreshing = false;
          this.refreshTokenSubject.next(newAccess);

          return next.handle(this.addToken(req, newAccess));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          // this.authService.logout();
          return throwError(() => err);
        })
      );
    }

    // Nếu đang refresh: đợi token mới rồi retry
    return this.refreshTokenSubject.pipe(
      filter((t): t is string => t !== null),
      take(1),
      switchMap((token) => next.handle(this.addToken(req, token)))
    );
  }
}
