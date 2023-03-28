import { Types } from 'mongoose';
import { Post } from '../../../shared/src/types/Post';
import { User } from '../../../shared/src/types/User';
import { Group } from './../../../shared/src/types/Group';

export interface GroupDao {
    listGroups() : Promise<Group[] | undefined>;
    listGroupPosts(id: string, groupName?:string, privacy?: string) : Promise<Post[]>;
    listUsers(userId?: string) : User[];
    createGroup(group : Group) : Promise<Group>;
    sendGroupRequest(id : Types.ObjectId, userId : Types.ObjectId): Promise<void>;
    deleteSendGroupRequest(id : Types.ObjectId, userId : Types.ObjectId): Promise<void>;
    addUser(user: User) : void;
    getGroup(id : Types.ObjectId , userId?:Types.ObjectId) : Promise<Group | undefined>;
    getGroupByGroupName(groupName : string) : Promise<Group | undefined>;
    deleteGroup(id : string) : Promise<void>;
    deleteUserRequest(id : Types.ObjectId , profileId : Types.ObjectId): Promise<void>;
    updateGroup(group : Group) : Promise<void>;
    inviteUserToGroup(id : Types.ObjectId , userId : Types.ObjectId): Promise<void>;
    existsUserById(groupId: string, userId: Types.ObjectId) : Promise<boolean | undefined>; 
    //deleteGroupPost(id:string,groupId:string) : Promise<void>;
    //addGroupPost(post: Post, groupName?:string, id?: string) :Promise<void>;
}