import { Component, inject, signal } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabel } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';
import { ProblemDescriptionComponent } from '../../components/problem-description';
import { RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { ProblemService } from '../../services/problem-service';
import { Problem, ProblemLevelEnum } from '../../models/ProblemModel';
import { ProblemSignalStore } from '../../services/problem-signal-store';
@Component({
  selector: `problem-detail-component`,
  imports: [
    FileUploadModule,
    ButtonModule,
    TextareaModule,
    FloatLabel,
    CommonModule,
    ProblemDescriptionComponent,
    RouterOutlet,
    RouterModule,
    SelectModule,
  ],
  standalone: true,
  template: `
    <div class="container w-full w-[1400px] mx-auto">
      <section
        class="header flex items-center justify-between mb-6 p-4 bg-white shadow rounded-lg mt-6"
      >
        <div class="header-text">
          <h2 class="text-xl font-semibold mb-2">{{ problemData()?.content }}</h2>
          <p class="text-gray-600 mb-4">Problem description and details go here.</p>
          <section class="problem-tabs">
            <ul class="flex gap-2 px-2 py-3  bg-gray-100 rounded-full w-fit font-medium text-sm">
              <li
                class="px-4 py-2 rounded-full cursor-pointer transition"
                [ngClass]="{
                  'bg-blue-600 text-white': activeTab === 'description',
                  'text-gray-600 hover:bg-gray-200 hover:text-gray-900': activeTab !== 'description'
                }"
                (click)="setActive('description')"
              >
                <a
                  [routerLink]="['./description']"
                  routerLinkActive=""
                  [routerLinkActiveOptions]="{ exact: true }"
                >
                  Description
                </a>
              </li>

              <li
                class="px-4 py-2 rounded-full cursor-pointer transition"
                [ngClass]="{
                  'bg-blue-600 text-white': activeTab === 'submissions',
                  'text-gray-600 hover:bg-gray-200 hover:text-gray-900': activeTab !== 'submissions'
                }"
                (click)="setActive('submissions')"
              >
                <a [routerLink]="['./submissions']" routerLinkActive=""> Submission </a>
              </li>
            </ul>
          </section>
        </div>
        <div class="header-badege">
          <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {{ LevelEnum[problemData()?.level || 0] }}
          </span>
        </div>
      </section>
      <router-outlet></router-outlet>
    </div>
  `,
})
export class ProblemDetailComponent {
  activeTab = 'description';
  setActive(tab: string) {
    this.activeTab = tab;
    console.log('Active tab:', this.activeTab);
  }
  readonly LevelEnum = ProblemLevelEnum;
  problemData = signal<Problem | null>(null);
  constructor(private problemService: ProblemService, private store: ProblemSignalStore) {}
  private problem = inject(ProblemService);
  ngOnInit() {
    this.problem.getProblemById(1).subscribe((res) => {
      console.log('h2h2' + res);
      this.problemData.set(res.data);
      this.store.setProblem(res.data);
    });
  }
}
