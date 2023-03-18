import { Post } from '../../../shared/src/types/Post';
export interface PostDao {
  listPosts(userId?: string, groupId?: string, userName?:string, privacy?: string): Promise<Post[]>;
  createPost(post: Post, groupeName?:string, userId?:string): Promise<void>;
  getPost(id: string, userId?: string): Post | undefined;
  getPostByUrl(url: string): Post | undefined;
  deletePost(id: string): Promise<void>;
}