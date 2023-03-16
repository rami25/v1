import { commentLike } from './../../../shared/src/types/commentLike';

export interface LikeDao {
  createLike(like: commentLike): void;
  deleteLike(like: commentLike): void;
  getLikes(postId: string): number;
  exists(like: commentLike): boolean;
}