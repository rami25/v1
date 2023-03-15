import { Post } from "./types";

export type CreatePostRequest = Pick<Post, "title" | "url" | "userId">
export interface CreatePostResponse {}

export interface ListPostRequest {}
export interface ListPostResponse {}