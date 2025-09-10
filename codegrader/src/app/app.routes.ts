import { Routes, RouterModule } from '@angular/router';
import { ProfileUpdate } from './features/user/pages/profile-updates/profile-updates';
import { App } from './app';
import { Container } from './layout/container';
import { ProblemHomepage } from './features/problem/pages/problems/problem-homepage';
import { ProblemDetailComponent } from './features/problem/pages/problems/problem-detail';
import { ProblemDescriptionComponent } from './features/problem/components/problem-description';
import { ProblemSubmissionComponent } from './features/problem/components/problem-submission';
import { ProfileHomepageComponent } from './features/user/pages/profile-updates/profile-user';
import { ChangePasswordComponent } from './features/user/pages/profile-updates/change-password';
import { LoginApp } from './auth/login/login';
import { RegisterApp } from './auth/register/register';
import { UserManage } from './features/admin/userManage/userManage';
import { TagManage } from './features/admin/tagManage/tagManage';
import { ForgotPassword } from './auth/forgotPassword/forgotPassword';
import { UpdateAvatarComponent } from './features/user/pages/profile-updates/update-avatar';
import { identity } from 'rxjs';
import { ProblemManage } from './features/admin/problemManage/problemManage';
import { NgModule } from '@angular/core';
import { GeneralComponent } from './features/user/pages/profile-updates/general';

export const routes: Routes = [
  {
    path: '',
    component: Container,
    children: [
      { path: '', redirectTo: 'description', pathMatch: 'full' }, //default route
      { path: 'description', component: ProblemDescriptionComponent },
      { path: 'submissions', component: ProblemSubmissionComponent },
    ],
  },
  {
    path: 'profile',
    //with out lazy loading
    component: ProfileHomepageComponent,
    children: [
      { path: '', redirectTo: 'general', pathMatch: 'full' }, //default route
      { path: 'update-profile', component: ProfileUpdate },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'update-avatar', component: UpdateAvatarComponent },
      { path: 'general', component: GeneralComponent },
    ],

    //with lazy loading
    // loadChildren: () => import('./features/user/user-profile-routes').then((m) => m.routes),
  },
  {
    path: 'problem',
    component: ProblemHomepage,
    // loadComponent: () =>
    //   import('./features/problem/pages/problems/problem-homepage').then((m) => m.ProblemHomepage),
    // loadChildren: () => import('./features/problem/problem-routes').then((m) => m.routes),
  },
  {
    path: 'problem/:id',
    component: ProblemDetailComponent,
    children: [
      { path: '', redirectTo: 'description', pathMatch: 'full' }, // default route
      { path: 'description', component: ProblemDescriptionComponent },
      { path: 'submissions', component: ProblemSubmissionComponent },
    ],
  },
  { path: 'home', component: Container },
  {
    path: 'login',
    // component: LoginApp,
    loadComponent: () => import('./auth/login/login').then((m) => m.LoginApp),
  },
  {
    path: 'signup',
    // component: RegisterApp,
    loadComponent: () => import('./auth/register/register').then((m) => m.RegisterApp),
  },
  {
    path: 'manageuser',
    // component: UserManage,
    loadComponent: () => import('./features/admin/userManage/userManage').then((m) => m.UserManage),
  },
  {
    path: 'managetag',
    // component: TagManage,
    loadComponent: () => import('./features/admin/tagManage/tagManage').then((m) => m.TagManage),
  },
  {
    path: 'forgotpassword',
    loadComponent: () =>
      import('./auth/forgotPassword/forgotPassword').then((m) => m.ForgotPassword),
    // component: ForgotPassword,
  },
  { path: 'manageproblem', component: ProblemManage },
  {
    path: 'commentmanage',
    // component: TagManage,
    loadComponent: () =>
      import('./features/admin/commentManage/commentManage').then((m) => m.CommentManage),
  },
];
