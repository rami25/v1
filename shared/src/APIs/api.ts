import { Post } from "../types/Post";

export type CreatePostRequest = Pick<Post, "title" | "urls" | "userId">
export interface CreatePostResponse {}

export interface ListPostRequest {}
export interface ListPostResponse {}