import { Injectable, signal } from '@angular/core';
import { Problem } from '../models/ProblemModel';
@Injectable({ providedIn: 'root' })
export class ProblemSignalStore {
  readonly problem = signal<Problem | null>(null);
  setProblem(p: Problem | null) {
    this.problem.set(p);
  }
  clear() {
    this.problem.set(null);
  }
}
