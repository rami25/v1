import { DataStore } from "..";
import { User, Post, Like, Comment } from "../../types";

export class InMemmoryDataStore implements DataStore{
    private users : User[] = [];
    private posts : Post[] = [];
    private likes : Like[] = [];
    private comments : Comment[] = [];

    createUser(user: User): void {
        this.users.push(user)
    }
    updateCurrentUser(user: Partial<User>): void {
        throw new Error("Method not implemented.");
    }
    getUserById(id: string): User | undefined {
       return this.users.find(u => u.id === id); 
    }
    getUserByEmail(email: string): User | undefined {
       return this.users.find(u => u.email === email); 
    }
    getUserByUsername(userName: string): User | undefined {
       return this.users.find(u => u.userName === userName); 
    }
    listPosts(userId?: string | undefined): Post[] {
        return this.posts
    }
    createPost(post: Post): void {
        this.posts.push(post)
    }
    getPost(id: string, userId?: string | undefined): Post | undefined {
        return this.posts.find(p => p.id === id); 
    }
    getPostByUrl(url: string): Post | undefined {
        return this.posts.find(p => p.url === url); 
    }
    deletePost(id: string): void {
        const index = this.posts.findIndex(p => p.id === id);
        if(index > -1) {
            this.posts.splice(index, 1)
        }
    }
    createLike(like: Like): void {
        this.likes.push(like)
    }
    deleteLike(like: Like): void {
        const index = this.likes.findIndex(like => like.userId === like.userId && like.postId === like.postId);
        if(index > -1) {
            this.likes.splice(index, 1)
        }
    }
    getLikes(postId: string): number {
        let count = 0
        for(let i = 0; i < this.likes.length; i++) {
            if(this.likes[i].postId === postId) { count += 1 }
        }
        return count
    }
    exists(like: Like): boolean {
        const index = this.comments.findIndex(c => c.userId === like.userId && c.postId === like.postId)
        if(index > -1) { return true}
        return false
    }
    createComment(comment: Comment): void {
        this.comments.push(comment)
    }
    countComments(postId: string): number {
        let count = 0
        for(let i = 0; i < this.comments.length; i++) {
            if(this.comments[i].postId === postId) { count += 1 }
        }
        return count
    }
    listComments(postId: string): Comment[] {
        return this.comments
    }
    deleteComment(id: string): void {
        const index = this.comments.findIndex(c => c.id === id)
        if(index > -1 ) { this.comments.splice(index, 1) }
    }

}