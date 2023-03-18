import { Post } from '../../../shared/src/types/Post';
import { User } from '../../../shared/src/types/User';
import { Group } from './../../../shared/src/types/Group';

export interface GroupDao {
    listGroups(userId?: string) : Group[];
    listGroupPosts(id: string, groupName?:string, privacy?: string) : Promise<Post[]>;
    listUsers(userId?: string) : User[];
    createGroup(group : Group) : void;
    addUser(user: User) : void;
    getGroup(id : string , userId?:string) : Group | undefined;
    getGroupByGroupName(groupName : string) : Promise<Group | undefined>;
    deleteGroup(id : string) : void;
    existUserById(id: any) : Promise<boolean | undefined>; 
    //deleteGroupPost(id:string,groupId:string) : Promise<void>;
    //addGroupPost(post: Post, groupName?:string, id?: string) :Promise<void>;
}