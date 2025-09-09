import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header';
import { Footer } from './layout/footer';
import { Container } from './layout/container';
import { ProfileUpdate } from './features/user/pages/profile-updates/profile-updates';
import { ProblemDetailSubmissionComponent } from './features/problem/pages/problems/problem-submissions';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  standalone: true,
  // templateUrl: './app.html',
  template: `
    @if(!isAuthPage()) {
    <header-component></header-component>
    }
    <router-outlet></router-outlet>
    @if(!isAuthPage() && !isProblemPage()) {
    <footer-component></footer-component>
    }
  `,
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('codegrader');
  constructor(private router: Router) { }

  isAuthPage(): boolean {
    const authPages = ['/login', '/signup', '/forgotpassword', '/manageuser', '/managetag','/manageproblem'];
    return authPages.includes(this.router.url);
  }
  isProblemPage(): boolean {
    const problemPages = [
      '/problem',
      '/profile/update-profile',
      'change-password',
      'update-avatar',
    ];
    return problemPages.includes(this.router.url);
  }
}
