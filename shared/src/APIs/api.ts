import { Group } from "../types/Group";
import { Post } from "../types/Post";
import { User } from "../types/User";
import { Comment } from "../types/Comment";
// import { Like } from "../types/Like";
////////////////////////////posts
export interface ListPostsRequest {
    // groupId? : string;
    // profileId? : string;
}
// export interface ListPostsResponse {
//     posts : Pick<Post,
//                 '_id'|
//                 'title'|
//                 'description'|
//                 'urls'|
//                 'files'|
//                 'userName'|
//                 'groupName'|
//                 'cmnts'|
//                 'lks'>[];
// }
export type ListPostsResponse = {posts : Post[]}
//
export type CreatePostRequest = {
   title: string;
   description: string;
   urls?: string[];
   files?: string[];      
   groupId?: string;
   privacy: string;
}
export interface CreatePostResponse {
    psts : number;
    gpsts : number;
    message : string;
}

export interface DeletePostRequest {
    postId: string;
    // groupId?: string;
}
export interface DeletePostResponse {
    message?: string;
}
export interface UpdatePostRequest {
    title?: string;
    description?: string;
    urls?: string[];
    files?: string[];      
    postId: string;
    privacy?: string;
}
export interface UpdatePostResponse {
    message? : string;
}
///////////////////////////////////////////////////
/////////////////////////////////////////Auth
export interface ListUserRequest {}
export interface ListUserResponse {
    users : Partial<User>[]
}


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
                     'psts'|
                   'groups'|
                     'grps'|
         'groupsIdDemandes'|
         'groupsIdRequests'| 
         'acceptedRequests'|
                    'gIdDs'|
                    'gIdRs'|
                    'notif'>;
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
    password: string;
}
export interface DeleteUserResponse {
    message? : string;
}

export interface UpdateUserRequest {
    userName? : string;
    email? : string;
    description?: string;
}
export interface UpdateUserResponse {
    user : Pick<User , 'userName'|'email'|'description'>
}
//////////////////////////////////////////////////////////
////////////////////////////////////////////////Group
export interface CreateGroupRequest {
    groupName: string;
    description: string;
}
export interface CreateGroupResponse {
    group: Pick<Group,'_id'|'groupName'|'description'|'userAdmin'|'usersId'|'createdAt'>
    grps : number;
    message : string;
}

export interface DeleteGroupRequest {
    groupId: string;
}
export interface DeleteGroupResponse {
    message : string
}     

export interface UpdateGroupRequest {
    groupId: string;
    groupName?: string;
    description? : string;
}
export interface UpdateGroupResponse {
    message : string;
}     

export interface ListGroupsRequest {}// or list group of profile
export interface ListGroupsResponse {
    // groups : Pick<Group,'_id'|'groupName'|'description'|'userAdmin'|'usersId'|'users'|'psts'|'createdAt'>[];
    groups : Group[];
}     

export interface GetGroupRequest {
    groupId : string;
}
export interface GetGroupResponse {
    adminGroup : Group;
    groups : Group[];
}     

export interface SendGroupRequest {
    groupId : string;
}
export interface SendGroupResponse {
    message : string;
}     

export interface DeleteSendRequest {
    groupId: string;
}     
export interface DeleteSendResponse {    
    message : string;
}

export interface RejectRequest {
    groupId: string;
    profileId: string;
}     
export interface RejectResponse {
    message : string;
}     

export interface AcceptRequest {
    groupId : string;
    profileId : string;
}     
export interface AcceptResponse {
    message : string;
}     

export interface InviteToRequest {
    groupId: string;
    profileId: string;
}
export interface InviteToResponse {
    message : string;
    editedGroup : Group;
}     

export interface RemoveInvitationRequest {
    groupId: string;
    profileId: string;
}     
export interface RemoveInvitationResponse {
    message : string;
    editedGroup : Group;
}

export interface DeleteInvitationRequest {
    groupId: string;
}
export interface DeleteInvitationResponse {
    message : string;
}

export interface JoinGroupRequest {
    groupId : string;
}
export interface JoinGroupResponse {
    message : string;
}     

export interface LeaveGroupRequest {
    groupId: string;
}
export interface LeaveGroupResponse {
    message : string;
}     

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
    commentId : string;
    content : string;
}
export interface UpdateCommentResponse {}

export interface DeleteCommentRequest {
    postId : string;
    commentId : string;
}
export interface DeleteCommentResponse {}