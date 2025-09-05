import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/profile-updates/profile-user').then((m) => m.ProfileHomepageComponent),
    children: [
      {
        path: '',
        redirectTo: 'update-profile',
        pathMatch: 'full',
      },
      {
        path: 'update-profile',
        loadComponent: () =>
          import('./pages/profile-updates/profile-updates').then((m) => m.ProfileUpdate),
      },
      {
        path: 'change-password',
        loadComponent: () =>
          import('./pages/profile-updates/change-password').then((m) => m.ChangePasswordComponent),
      },
      {
        path: 'update-avatar',
        loadComponent: () =>
          import('./pages/profile-updates/update-avatar').then((m) => m.UpdateAvatarComponent),
      },
    ],
  },
];
