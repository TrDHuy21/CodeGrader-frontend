export interface CreatCommentModel {
  problemId: number;
  parentCommentId?: number;
  commentText: string;
}
export interface UpdateCommentModel {
  id: number;
  commentText: string;
}
export interface CommentModel {
  id: number;
  userId: number;
  problemId: number;
  commentText: string;
  parentCommentId?: number;
  like: number;
  createdAt: Date;
  replies: CommentModel[];
}
