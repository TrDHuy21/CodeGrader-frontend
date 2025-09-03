export interface BookMarkProblemModel {
  ProblemId: number;
  ProblemName: string;
}
export interface BookmarkModel {
  Id: number;
  Lists: BookMarkProblemModel[];
}
