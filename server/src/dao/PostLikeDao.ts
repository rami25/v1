import { postLike } from './../../../shared/src/types/postLike';

export interface PostLikeDao {
  createLike(like: postLike): void;
  deleteLike(like: postLike): void;
  getLikes(postId: string): number;
  exists(like: postLike): boolean;
}