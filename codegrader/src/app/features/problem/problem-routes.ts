import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../../layout/container').then((m) => m.Container), // lazy load Container
    children: [
      { path: '', redirectTo: 'description', pathMatch: 'full' },
      {
        path: 'description',
        loadComponent: () =>
          import('./components/problem-description').then((m) => m.ProblemDescriptionComponent),
      },
      {
        path: 'submissions',
        loadComponent: () =>
          import('./components/problem-submission').then((m) => m.ProblemSubmissionComponent),
      },
    ],
  },
];
