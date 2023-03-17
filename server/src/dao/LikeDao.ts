import { Like } from './../../../shared/src/types/Like';

export interface LikeDao {
  createLike(like: Like): void;
  deleteLike(like: Like): void;
  getLikes(postId: string): number;
  exists(like: Like): boolean;
}