import { Problem } from './ProblemModel';

export interface BookMarkProblemModel {
  ProblemId: number;
  ProblemName: string;
}
export interface BookmarkModel {
  Id: number;
  Lists: Problem[];
}
