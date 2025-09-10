import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit, signal } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { UserProfileService } from '../../features/user/services/user-profile-serive';

@Injectable({ providedIn: 'root' })
export class ShareUserAvatarService implements OnInit {
  avatar = signal<string | null>(null);
  username = signal<string | null>(null);
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private userProfileService: UserProfileService
  ) {
    const uname = this.authService.getUsername();
    if (!uname) return;

    this.username.set(uname);

    this.userProfileService.getUserProfile(uname).subscribe({
      next: (res) => {
        // nếu API gói trong data thì đổi res.avatar -> res.data.avatar
        this.avatar.set(res.avatar ?? '');
      },
      error: (err) => console.error(err),
    });
  }

  ngOnInit(): void {
    const uname = this.authService.getUsername();
    if (!uname) return;

    this.username.set(uname);

    this.userProfileService.getUserProfile(uname).subscribe({
      next: (res) => {
        // nếu API gói trong data thì đổi res.avatar -> res.data.avatar
        this.avatar.set(res.avatar ?? '');
      },
      error: (err) => console.error(err),
    });
  }
  updateAvatar(stringUrl: string) {
    this.avatar.set(stringUrl);
  }
}
