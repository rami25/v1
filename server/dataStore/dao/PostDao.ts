import { Post } from '../../types';

export interface PostDao {
  listPosts(userId?: string): Post[];
  createPost(post: Post): void;
  getPost(id: string, userId?: string): Post | undefined;
  getPostByUrl(url: string): Post | undefined;
  deletePost(id: string): void;
}