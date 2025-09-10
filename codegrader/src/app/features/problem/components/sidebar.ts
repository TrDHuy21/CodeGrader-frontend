import { Component, effect, inject, Input, OnInit, signal } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { BookmarkModel } from '../models/bookmark-model';
import { ShareBookmarkService } from '../../../shared/services/share-bookmark-service';
import { ProblemService } from '../services/problem-service';
import { Problem } from '../models/ProblemModel';
import { RouterModule } from '@angular/router';
@Component({
  selector: `sidebar-component`,
  imports: [ButtonModule, DrawerModule, TableModule, InputTextModule, CommonModule, RouterModule],
  template: `
    <p-drawer [(visible)]="visible" header="Problem List" class="w-2xl" contenteditable="true">
      <ul class="w-full">
        @for (p of problems(); track $index) {
        <a [routerLink]="['/problem', p.id]">
          <li
            class="flex items-center justify-between hover:bg-gray-200 transition w-full px-2 py-4 rounded-lg cursor-pointer"
          >
            <span class="font-medium">{{ p.id }}. {{ p.name }}</span>
            <span [ngClass]="styleDifficult(p.level)" class="mr-10">{{
              textDifficult(p.level)
            }}</span>
          </li>
        </a>
        }
      </ul>
    </p-drawer>
    <p-button
      (click)="visible = true"
      label="Problem List"
      icon="pi pi-align-justify"
      severity="secondary"
      styleClass="!bg-gray-100 !text-black  hover:!bg-gray-200"
    />
  `,
})
export class SideBarProblem implements OnInit {
  problems = signal<Problem[] | null>([]);
  constructor(private problemService: ProblemService) {}

  ngOnInit(): void {
    this.problemService.getProblems({ PageSize: 10 }).subscribe({
      next: (res) => this.problems.set(res.data ?? []),
      error: (err) => console.log(err),
    });
  }

  textDifficult(level?: number) {
    switch (level) {
      case 1:
        return 'Easy';
      case 2:
        return 'Medium';
      case 3:
        return 'Hard';
      default:
        return '';
    }
  }
  styleDifficult(level: number) {
    switch (level) {
      case 1:
        return 'inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 px-2.5 py-0.5 text-xs font-medium';
      case 2:
        return 'inline-flex items-center rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 px-2.5 py-0.5 text-xs font-medium';
      case 3:
        return 'inline-flex items-center rounded-full bg-rose-50 text-rose-700 ring-1 ring-rose-600/20 px-2.5 py-0.5 text-xs font-medium';
      default:
        return 'inline-flex items-center rounded-full bg-gray-50 text-gray-700 ring-1 ring-gray-600/20 px-2.5 py-0.5 text-xs font-medium';
    }
  }
  visible: any;
}
