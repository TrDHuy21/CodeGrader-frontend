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
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    let authReq = req;
    if (token) {
      authReq = this.addToken(req, token);
    }
    return next.handle(authReq).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          return this.handle401Error(authReq, next);
        }
        return throwError(() => err);
      })
    );
    // if (token)
    //   if (token) {
    //     // clone request gốc, thêm Authorization header
    //     const cloned = req.clone({
    //       setHeaders: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });
    //     return next.handle(cloned);
    //   }

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
        this.authService.logout();
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
          this.authService.logout();
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
