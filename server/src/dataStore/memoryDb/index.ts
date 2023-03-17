import { Comment } from "../../../../shared/src/types/Comment";
import { Group } from "../../../../shared/src/types/Group";
import { Like } from "../../../../shared/src/types/Like";
import { Post } from "../../../../shared/src/types/Post";
import { User } from "../../../../shared/src/types/User";
import { DataStore } from "../../dao";

export class InMemoryDataStore implements DataStore {
    createUser(user: User): void {
        throw new Error("Method not implemented.");
    }
    updateCurrentUser(user: Partial<User>): void {
        throw new Error("Method not implemented.");
    }
    getUserById(id: string): User | undefined {
        throw new Error("Method not implemented.");
    }
    getUserByEmail(email: string): User | undefined {
        throw new Error("Method not implemented.");
    }
    getUserByUsername(userName: string): User | undefined {
        throw new Error("Method not implemented.");
    }
    searchUser(userName: string): User | undefined {
        throw new Error("Method not implemented.");
    }
    sendRequestToUser(userName: string): void {
        throw new Error("Method not implemented.");
    }
    addGroup(group: Group): void {
        throw new Error("Method not implemented.");
    }
    addFriend(user: User): void {
        throw new Error("Method not implemented.");
    }
    addUserPost(post: Post): void {
        throw new Error("Method not implemented.");
    }
    listPosts(userId?: string | undefined): Post[] {
        throw new Error("Method not implemented.");
    }
    createPost(post: Post): void {
        throw new Error("Method not implemented.");
    }
    getPost(id: string, userId?: string | undefined): Post | undefined {
        throw new Error("Method not implemented.");
    }
    getPostByUrl(url: string): Post | undefined {
        throw new Error("Method not implemented.");
    }
    deletePost(id: string): void {
        throw new Error("Method not implemented.");
    }
    listGroups(userId?: string | undefined): Group[] {
        throw new Error("Method not implemented.");
    }
    listUsers(userId?: string | undefined): User[] {
        throw new Error("Method not implemented.");
    }
    createGroup(group: Group): void {
        throw new Error("Method not implemented.");
    }
    addUser(user: User): void {
        throw new Error("Method not implemented.");
    }
    getGroup(id: string, userId?: string | undefined): Group | undefined {
        throw new Error("Method not implemented.");
    }
    deleteGroup(id: string): void {
        throw new Error("Method not implemented.");
    }
    createLike(like: Like): void {
        throw new Error("Method not implemented.");
    }
    deleteLike(like: Like): void {
        throw new Error("Method not implemented.");
    }
    getLikes(postId: string): number {
        throw new Error("Method not implemented.");
    }
    exists(like: Like): boolean {
        throw new Error("Method not implemented.");
    }
    createComment(comment: Comment): void {
        throw new Error("Method not implemented.");
    }
    countComments(postId: string): number {
        throw new Error("Method not implemented.");
    }
    listComments(postId: string): Comment[] {
        throw new Error("Method not implemented.");
    }
    deleteComment(id: string): void {
        throw new Error("Method not implemented.");
    }
    

}