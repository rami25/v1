import { Types } from 'mongoose';
import { Post } from '../../../shared/src/types/Post';
import { User } from '../../../shared/src/types/User';
import { Group } from './../../../shared/src/types/Group';

export interface GroupDao {
    listGroups(userId?: string) : Group[];
    listGroupPosts(id: string, groupName?:string, privacy?: string) : Promise<Post[]>;
    listUsers(userId?: string) : User[];
    createGroup(group : Group) : Promise<Group>;
    addUser(user: User) : void;
    getGroup(id : Types.ObjectId , userId?:Types.ObjectId) : Promise<Group | undefined>;
    getGroupByGroupName(groupName : string) : Promise<Group | undefined>;
    deleteGroup(id : string) : void;
    existsUserById(groupId: string, userId: Types.ObjectId) : Promise<boolean | undefined>; 
    //deleteGroupPost(id:string,groupId:string) : Promise<void>;
    //addGroupPost(post: Post, groupName?:string, id?: string) :Promise<void>;
}