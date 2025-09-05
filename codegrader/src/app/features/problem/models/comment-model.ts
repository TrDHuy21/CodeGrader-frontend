export interface CommentModel {
  id: number;
  author: string; // username
  content: string;
  replies?: CommentModel[];
}
