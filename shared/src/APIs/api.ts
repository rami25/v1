import { Post } from "../types/Post";
////////////////////////////posts
export type CreatePostRequest = {
 title: string;
 description: string;
 urls?: any;
 files?: any;      
 userId?: string;
 groupName?: string;
 privacy?: string;
}

export interface CreatePostResponse {}

export interface ListPostsRequest {
    userId : string;
    groupName : string;
    userName : string;
}
export interface ListPostsResponse {
    posts : Post[];
}
export interface DeletePostRequest {
    userId: string;
    postId: string;
    groupName?: string;
}
export interface DeletePostResponse {}
///////////////////////////////////////////////////