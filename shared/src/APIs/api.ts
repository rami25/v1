// import { Types } from "mongoose";
import { Post } from "../types/Post";
import { User } from "../types/User";
////////////////////////////posts
export interface ListPostsRequest {
    // userId? : string;
    groupId? : string;
    profileId? : string;
}
export interface ListPostsResponse {
    posts : Post[];
}
//
export type CreatePostRequest = {
//  userId?: string;
   title: string;
   description: string;
   urls?: string[];
   files?: string[];      
   groupId?: string;
   privacy: string;
}
export interface CreatePostResponse {}
//
export interface DeletePostRequest {
    // userId?: any;
    postId: any;
    groupId?: any;
}
export interface DeletePostResponse {}
export interface UpdatePostRequest {}
export interface UpdatePostResponse {}
///////////////////////////////////////////////////
/////////////////////////////////////////Auth
export interface SignInRequest {
    login : string;
    password: string;
}
export interface SignInResponse { 
    user : Pick<User, '_id'|'userName'|'email'|'description'|'createdAt'|'posts'|'groups'>;
    jwt: string;
}

export interface SignUpRequest {
    userName : string;
    email : string;
    password : string;
    description?: string;
}
export interface SignUpResponse {
    user : Pick<User, 'userName'|'email'|'description'|'createdAt'>;
    jwt: string;
}
export interface SignOutRequest {}
export interface SignOutResponse {
    message: string;
}

export interface ForgotPasswordRequest {
    email: string;
}
export interface ForgotPasswordResponse {
    message: string;
}

export interface ResetPasswordRequest {
    newPassword: string;
}
export interface ResetPasswordResponse {
    message: string;
}
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////User
export interface DeleteUserRequest {
    // userId: string;
    password: string;
}
export interface DeleteUserResponse {}
export interface UpdateUserRequest {
    userName : string;
    email : string;
    description?: string;
}
export interface UpdateUserResponse {}
