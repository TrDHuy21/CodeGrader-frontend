export interface Tag {
  id: number;
  name: string;
}

export type ProblemLevel = 1 | 2 | 3 | 4 | 5; // hoặc: enum ProblemLevel { Easy=1, ... }
export enum ProblemLevelEnum {
  Easy = 1,
  Medium = 2,
  Hard = 3,
}

export interface InOutExample {
  id: number;
  inputExample: string;
  outputExample: string;
  explanation: string;
  problemId?: number; // optional nếu nó luôn nằm trong Problem
  isDeleted?: boolean; // nếu backend trả
}

export interface Problem {
  id: number;
  name: string;
  content: string;
  prompt: string;
  level: ProblemLevelEnum; // hoặc: number
  tags: Tag[];
  inOutExamples: InOutExample[];
  isDeleted?: boolean; // nếu backend trả
}
