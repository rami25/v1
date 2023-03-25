import { Types } from 'mongoose';
import { Post } from '../../../shared/src/types/Post';
export interface PostDao {
  listPosts(userId?: Types.ObjectId, groupId?: string, profileId?:string, privacy?: string): Promise<Post[] | undefined>;
  createPost(post: Post, groupId?:string): Promise<void>;
  getPost(id: string, userId?: string): Post | undefined;
  getPostByUrl(url: string): Post | undefined;
  deletePost(postId: any, userId?:any, groupId?: any): Promise<void>;
}