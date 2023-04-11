import { Types } from 'mongoose';
import { Post } from '../../../shared/src/types/Post';
import { User } from '../../../shared/src/types/User';
import { Group } from './../../../shared/src/types/Group';

export interface GroupDao {
    createGroup(group : Group) : Promise<Group>;
    deleteGroup(id : string) : Promise<void>;
    updateGroup(group : Group) : Promise<void>;
    listGroups() : Promise<Group[] | undefined>;
    listUserGroups(id : Types.ObjectId) : Promise<Group[] | undefined>;
    countGroups() : Promise<number>;
    getGroup(id : Types.ObjectId , userId?:Types.ObjectId) : Promise<Group | undefined>;
    sendGroupRequest(id : Types.ObjectId, userId : Types.ObjectId): Promise<void>;
    deleteSendGroupRequest(id : Types.ObjectId, userId : Types.ObjectId): Promise<void>;
    deleteUserRequest(id : Types.ObjectId , profileId : Types.ObjectId): Promise<void>;
    acceptUserRequest(id : Types.ObjectId , profileId : Types.ObjectId): Promise<void>;
    inviteUserToGroup(id : Types.ObjectId , userId : Types.ObjectId): Promise<void>;
    deleteInvitationUserToGroup(id : Types.ObjectId , userId : Types.ObjectId): Promise<void>;
    deleteGroupInvitation(id : Types.ObjectId , userId : Types.ObjectId): Promise<void>;
    joinGroup(id : Types.ObjectId , userId : Types.ObjectId): Promise<void>;
    leaveGroup(id : Types.ObjectId , userId : Types.ObjectId): Promise<void>;
    rejectUserFromGroup(id : Types.ObjectId , profileId : Types.ObjectId): Promise<void>;
    notification(id : Types.ObjectId , userId : Types.ObjectId , target : boolean): Promise<void>;

    listGroupPosts(id: string, groupName?:string, privacy?: string) : Promise<Post[]>;
    // listUsers(userId?: string) : User[];
    addUser(user: User) : void;
    getGroupByGroupName(groupName : string) : Promise<Group | undefined>;
    existsUserById(groupId: string, userId: Types.ObjectId) : Promise<boolean | undefined>; 
    //deleteGroupPost(id:string,groupId:string) : Promise<void>;
    //addGroupPost(post: Post, groupName?:string, id?: string) :Promise<void>;
}