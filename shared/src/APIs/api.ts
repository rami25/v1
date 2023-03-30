import { Group } from "../types/Group";
import { Post } from "../types/Post";
import { User } from "../types/User";
import { Comment } from "../types/Comment";
// import { Like } from "../types/Like";
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
   title: string;
   description: string;
   urls?: string[];
   files?: string[];      
   groupId?: string;
   privacy: string;
}
export interface CreatePostResponse {}

export interface DeletePostRequest {
    postId: string;
    groupId?: string;
}
export interface DeletePostResponse {}
export interface UpdatePostRequest {
    title?: string;
    description?: string;
    urls?: string[];
    files?: string[];      
    postId: string;
    privacy?: string;
}
export interface UpdatePostResponse {}
///////////////////////////////////////////////////
/////////////////////////////////////////Auth
export interface SignInRequest {
    login : string;
    password: string;
}
export interface SignInResponse { 
    user : Pick<User, '_id'|
                 'userName'|
                    'email'|
              'description'|
                'createdAt'|
                    'posts'|
                   'groups'|
      'groupsIdInvitations'|
       'groupsIdRequests' >;
    jwt: string;
}

export interface SignUpRequest {
    userName : string;
    email : string;
    password : string;
    description?: string;
}
export interface SignUpResponse {
    user : Pick<User, '_id'|'userName'|'email'|'description'|'createdAt'>;
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
////////////////////////////////////////
///////////////////////////////Group
export interface CreateGroupRequest {
    groupName: string;
    description: string;
}
export interface CreateGroupResponse {
     group: Pick<Group,'_id'|'groupName'|'description'|'userAdmin'|'usersId'|'createdAt'>
}

export interface DeleteGroupRequest {
    groupId: string;
}
export interface DeleteGroupResponse {}     

export interface UpdateGroupRequest {
    groupId: string;
    groupName?: string;
    description? : string;
}
export interface UpdateGroupResponse {}     

export interface ListGroupsRequest {}
export interface ListGroupsResponse {
    groups : Pick<Group,'_id'|'groupName'|'description'|'userAdmin'|'usersId'|'createdAt'>[];
}     

export interface GetGroupRequest {
    groupId : string;
}
export interface GetGroupResponse {
    adminGroup : Group;
}     

export interface SendGroupRequest {
    groupId : string;
}
export interface SendGroupResponse {}     

export interface DeleteSendRequest {
    groupId: string;
}     
export interface DeleteSendResponse {}     

export interface RejectRequest {
    groupId: string;
    profileId: string;
}     
export interface RejectResponse {}     

export interface AcceptRequest {
    groupId : string;
    profileId : string;
}     
export interface AcceptResponse {}     

export interface InviteToRequest {
    groupId: string;
    profileId: string;
}
export interface InviteToResponse {}     

export interface RemoveInvitationRequest {
    groupId: string;
    profileId: string;
}     
export interface RemoveInvitationResponse {}

export interface DeleteInvitationRequest {
    groupId: string;
}
export interface DeleteInvitationResponse {}

export interface JoinGroupRequest {
    groupId : string;
}
export interface JoinGroupResponse {}     

export interface LeaveGroupRequest {
    groupId: string;
}
export interface LeaveGroupResponse {}     

export interface RejectUserRequest {
    groupId: string;
    profileId: string;
}
export interface RejectUserResponse {}
////////////////////////////////////////////
/////////////////Comment

export interface CountCommentsRequest {
    postId : string;
}
export interface CountCommentsResponse {
    numberOfComments : number;
}

export interface ListCommentsRequest {
    postId : string;
}
export interface ListCommentsResponse {
    comments : Comment[];
}

export interface AddCommentRequest {
    postId : string;
    content : string;
}
export interface AddCommentResponse {}

export interface UpdateCommentRequest {
    postId : string;
    commentId : string;
    content : string;
}
export interface UpdateCommentResponse {}

export interface DeleteCommentRequest {
    postId : string;
    commentId : string;
}
export interface DeleteCommentResponse {}