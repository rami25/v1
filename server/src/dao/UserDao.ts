import { Group } from '../../../shared/src/types/Group';
import { User } from './../../../shared/src/types/User';

export interface UserDao {
  createUser(user: User): Promise<void>;
  deleteUser(user: User) : Promise<void>;
  updateCurrentUser(user: Partial<User>): Promise<void>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(userName: string): Promise<User | undefined>;
  searchUser(userName : string) : Promise<User | undefined>;
  sendRequestToUser(userName : string) : Promise<void>;
  sendRequestToGroup(group : Group) : Promise<void>;
  joinGroup(group : Group) : Promise<void>;
  addGroup(group : Group) : Promise<void>;
  addFriend(user : User) : Promise<void>;
  //addUserPost(post : Post, userId?:string) : Promise<void>;
}
