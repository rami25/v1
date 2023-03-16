import { Comment } from './../../../shared/src/types/Comment';

export interface CommentDao {
  createComment(comment: Comment): void;
  countComments(postId: string): number;
  listComments(postId: string): Comment[];
  deleteComment(id: string): void;
}