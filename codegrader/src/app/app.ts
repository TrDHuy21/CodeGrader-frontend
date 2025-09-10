import { Component, signal, ViewContainerRef, AfterViewInit, inject, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header';
import { Footer } from './layout/footer';
import { Container } from './layout/container';
import { ProfileUpdate } from './features/user/pages/profile-updates/profile-updates';
import { ProblemDetailSubmissionComponent } from './features/problem/pages/problems/problem-submissions';
import { Router } from '@angular/router';
import { VerificationUiService } from './shared/verification/verification-ui.service';
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
    <!-- </container> -->
      @if(!isAuthPage()&& !isProblemPage())
      {
         <footer-component></footer-component>
      }
    <!-- Verification component host -->
    <div #verificationHost></div>
  `,
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
  protected readonly title = signal('codegrader');
  private verificationUi = inject(VerificationUiService);
  @ViewChild('verificationHost', { read: ViewContainerRef }) verificationHost!: ViewContainerRef;
  
  constructor(private router: Router) { }

  ngAfterViewInit() {
    // Register the verification host after view init
    this.verificationUi.registerHost(this.verificationHost);
  }

  isAuthPage(): boolean {
    const authPages = [
      '/login', '/signup', '/forgotpassword',
      '/manageuser', '/managetag', '/manageproblem',
      '/updateproblem', '/addProblem'
    ];

    // Kiểm tra URL tĩnh
    if (authPages.includes(this.router.url)) {
      return true;
    }

    // Kiểm tra các route động
    const dynamicRoutes = [
      /^\/addTag\/\d+$/,
      /^\/addExample\/\d+$/
    ];

    return dynamicRoutes.some(route => route.test(this.router.url));
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
