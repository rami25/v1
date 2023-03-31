import { Types } from 'mongoose';
import { Group } from '../../../shared/src/types/Group';
import { User } from './../../../shared/src/types/User';

export interface UserDao {
  listUsers() : Promise<Partial<User>[] | undefined>;
  createUser(user: User): Promise<User>;//
  deleteUser(id: Types.ObjectId) : Promise<void>;//
  updateCurrentUser(user: Partial<User>): Promise<void>;//
  getUserById(id: Types.ObjectId): Promise<User | undefined>;//
  getUserByToken(token: string) : Promise<User | undefined>;//
  getUserByEmail(email: string): Promise<User | undefined>;//
  getUserByUsername(userName: string): Promise<User | undefined>;//
  searchUser(userName : string) : Promise<User | undefined>;
  sendRequestToUser(userName : string) : Promise<void>;
  sendRequestToGroup(group : Group) : Promise<void>;
  addGroup(group : Group) : Promise<void>;
  addFriend(user : User) : Promise<void>;
  //addUserPost(post : Post, userId?:string) : Promise<void>;
}
