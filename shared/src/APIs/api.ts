import { Post } from "../types/Post";
////////////////////////////posts
export interface ListPostsRequest {
    userId? : any;
    groupId? : any;
    profileId? : any;
}
export interface ListPostsResponse {
    posts : Post[];
}
//
export type CreatePostRequest = {
 title: string;
 description: string;
 urls?: any;
 files?: any;      
 userId: any;
 groupId?: any;
 privacy: string;
}
export interface CreatePostResponse {}
//
export interface DeletePostRequest {
    userId?: any;
    postId: any;
    groupId?: any;
}
export interface DeletePostResponse {}
///////////////////////////////////////////////////