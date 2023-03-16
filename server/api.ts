import { Post } from "../shared/src/types/Post";

export type CreatePostRequest = Pick<Post, "title" | "url" | "userId">
export interface CreatePostResponse {}

export interface ListPostRequest {}
export interface ListPostResponse {}