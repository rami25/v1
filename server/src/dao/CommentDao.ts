import { Comment } from './../../../shared/src/types/Comment';

export interface CommentDao {
  createComment(postId: string, comment: Comment): Promise<void>;
  updateComment(comment: Partial<Comment>): Promise<void>;
  deleteComment(postId: string, commentId: string): Promise<void>;
  countComments(postId: string): Promise<number>;
  listComments(postId: string): Promise<Comment[] | undefined>;
  getComment(postId: string, commentId: string): Promise<Comment | undefined>;
}