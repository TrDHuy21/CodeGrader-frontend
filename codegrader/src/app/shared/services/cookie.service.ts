import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /**
   * Set a cookie with security options
   */
  setCookie(name: string, value: string, options: CookieOptions = {}): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const {
      expires = 7, // Default 7 days
      path = '/',
      domain = window.location.hostname,
      secure = window.location.protocol === 'https:',
      sameSite = 'strict'
    } = options;

    let cookieString = `${name}=${encodeURIComponent(value)}`;

    // Add expiration
    if (expires) {
      const date = new Date();
      date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));
      cookieString += `; expires=${date.toUTCString()}`;
    }

    // Add path
    cookieString += `; path=${path}`;

    // Add domain
    if (domain) {
      cookieString += `; domain=${domain}`;
    }

    // Add secure flag
    if (secure) {
      cookieString += '; secure';
    }

    // Add sameSite
    cookieString += `; samesite=${sameSite}`;

    document.cookie = cookieString;
  }

  /**
   * Get a cookie value
   */
  getCookie(name: string): string | null {
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

  /**
   * Remove a cookie
   */
  removeCookie(name: string, path: string = '/', domain?: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
    
    if (domain) {
      cookieString += `; domain=${domain}`;
    }

    document.cookie = cookieString;
  }

  /**
   * Check if a cookie exists
   */
  hasCookie(name: string): boolean {
    return this.getCookie(name) !== null;
  }

  /**
   * Get all cookies as an object
   */
  getAllCookies(): { [key: string]: string } {
    if (!isPlatformBrowser(this.platformId)) {
      return {};
    }

    const cookies: { [key: string]: string } = {};
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      const eqPos = c.indexOf('=');
      if (eqPos > 0) {
        const name = c.substring(0, eqPos);
        const value = decodeURIComponent(c.substring(eqPos + 1));
        cookies[name] = value;
      }
    }
    
    return cookies;
  }
}

export interface CookieOptions {
  expires?: number; // Days
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}
