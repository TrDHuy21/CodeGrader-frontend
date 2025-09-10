export interface CommentForAdminGet {
  id: number;
  userId: number;
  problemId: number;
  commentText: string;
  parentCommentId: number | null;
  like: number;
  createdAt: string;
  replies: CommentForAdminGet[];
}


export interface AdminGetCommentResponse {
  isSuccess: boolean;
  message: string;
  data: CommentForAdminGet[];
  errorDetail?: string | null;
}
