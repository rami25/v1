import { Types } from 'mongoose';
import { Post } from '../../../shared/src/types/Post';
export interface PostDao {
  listPosts(userId?: Types.ObjectId|undefined, groupId?: string|undefined, profileId?:string|undefined, privacy?: string|undefined): Promise<Post[] | undefined>;
  countPosts(): Promise<number>;
  createPost(post: Post): Promise<void>;
  getPost(id: string, userId?: Types.ObjectId): Promise<Post | undefined>;
  getPostById(id: string): Promise<Post | undefined>;
  updatePost(post: Post, userId?: Types.ObjectId, groupId?: string): Promise<void>;
  getPostByUrl(url: string): Post | undefined;
  deletePost(postId: string, userId?:Types.ObjectId, groupId?: string): Promise<void>;
}