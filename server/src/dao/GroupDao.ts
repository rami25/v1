import { User } from '../../../shared/src/types/User';
import { Group } from './../../../shared/src/types/Group';

export interface GroupDao {
    listGroups(userId?: string) : Group[];
    listUsers(userId?: string) : User[];
    createGroup(group : Group) : void;
    addUser(user: User) : void;
    getGroup(id : string , userId?:string) : Group | undefined;
    deleteGroup(id : string) : void;
}