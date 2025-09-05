import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "admin-sidebar",
  standalone: true,
  template: `
    <div class="section1">
      <div class="sidebar-header">
        <h2><i class="fas fa-code" style="color: black"></i><b>Admin CodeGrader</b></h2>
      </div>

      <div class="sidebar-nav">
        <a href="#" class="nav-item" [class.active]="activeRoute === '/dashboard'" (click)="onNavItemClick($event, '/dashboard')">
          <i class="fas fa-tachometer-alt"></i>
          Dashboard
        </a>
        <a href="#" class="nav-item" [class.active]="activeRoute === '/managetag'" (click)="onNavItemClick($event, '/managetag')">
          <i class="fas fa-tag"></i>
          Tag Management
        </a>
        <a href="#" class="nav-item" [class.active]="activeRoute === '/manageuser'" (click)="onNavItemClick($event, '/manageuser')">
          <i class="fas fa-users"></i>
          Users Management
        </a>
        <a href="#" class="nav-item" [class.active]="activeRoute === '/manageproblem'" (click)="onNavItemClick($event, '/manageproblem')">
          <i class="fas fa-question-circle"></i>
          Problem Management
        </a>
        <a href="#" class="nav-item" [class.active]="activeRoute === '/commentmanage'" (click)="onNavItemClick($event, '/commentmanage')">
          <i class="fas fa-comment"></i>
          Comment Management
        </a>
      </div>
    </div>
  `,
  styleUrl: "admin-sidebar.css"
})
export class AdminSidebar {
  @Input() activeRoute: string = '';

  @Output() navItemClick = new EventEmitter<string>();

  onNavItemClick(event: Event, path: string) {
    event.preventDefault();
    this.navItemClick.emit(path);
  }
}
