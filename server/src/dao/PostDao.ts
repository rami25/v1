import { Post } from '../../../shared/src/types/Post';
export interface PostDao {
  listPosts(userId?: string, groupId?: string, profileId?:string, privacy?: string): Promise<Post[]>;
  createPost(post: Post, groupeId?:string, userId?:string): Promise<void>;
  getPost(id: string, userId?: string): Post | undefined;
  getPostByUrl(url: string): Post | undefined;
  deletePost(postId: any, userId?:any, groupId?: any): Promise<void>;
}