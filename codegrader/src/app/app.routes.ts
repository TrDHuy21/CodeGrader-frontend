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
export const routes: Routes = [
  {
    path: '',
    component: ProblemDetailComponent,
    children: [
      { path: '', redirectTo: 'description', pathMatch: 'full' }, //default route
      { path: 'description', component: ProblemDescriptionComponent },
      { path: 'submissions', component: ProblemSubmissionComponent },
    ],
  },
  {
    path: 'profile',
    component: ProfileHomepageComponent,
    children: [
      { path: '', redirectTo: 'update-profile', pathMatch: 'full' },
      { path: 'update-profile', component: ProfileUpdate },
      { path: 'change-password', component: ChangePasswordComponent }, //default route
    ],
  },
  { path: 'home', component: Container },
  { path: 'problem', component: ProblemHomepage },
   {path: "login", component: LoginApp }, 
    {path: "signup", component: RegisterApp},
    {path: "manageuser", component: UserManage},
    {path: "managetag", component: TagManage},
    {path: "forgotpassword", component: ForgotPassword}
];
