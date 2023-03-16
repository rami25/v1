import { Group } from '../../../shared/src/types/Group';
import { User } from './../../../shared/src/types/User';

export interface UserDao {
  createUser(user: User): void;
  updateCurrentUser(user: Partial<User>): void;
  getUserById(id: string): User | undefined;
  getUserByEmail(email: string): User | undefined;
  getUserByUsername(userName: string): User | undefined;
  searchUser(userName : string) : User | undefined;
  sendRequestToUser(userName : string) : void;
  addGroup(group : Group) : void;
  addFriend(user : User) : void;
}