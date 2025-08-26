import { Component, signal } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
@Component({
  selector: `sidebar-component`,
  imports: [ButtonModule, DrawerModule, TableModule, InputTextModule, CommonModule],
  template: `
    <p-drawer [(visible)]="visible" header="Problem List" class="w-2xl" contenteditable="true">
      <ul class="w-full">
        @for (p of problems; track $index) {
        <li
          class="flex items-center justify-between hover:bg-gray-200 transition w-full px-2 py-4 rounded-lg cursor-pointer"
        >
          <span class="font-medium">{{ p.id }}. {{ p.title }}</span>
          <span
            class="text-sm"
            [ngClass]="{
              'text-emerald-600': p.difficulty === 'Easy',
              'text-amber-500': p.difficulty === 'Medium',
              'text-rose-600': p.difficulty === 'Hard'
            }"
          >
            {{ p.difficulty }}
          </span>
        </li>
        }
      </ul>
    </p-drawer>
    <p-button (click)="visible = true" icon="pi pi-arrow-right" />
  `,
})
export class SideBarProblem {
  visible: any;
  problems = [
    { id: 175, title: 'Combine Two Tables', difficulty: 'Easy' },
    { id: 176, title: 'Another Problem', difficulty: 'Medium' },
    { id: 177, title: 'Hard One', difficulty: 'Hard' },
  ];
}
