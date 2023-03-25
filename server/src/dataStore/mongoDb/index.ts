import { Comment } from "../../../../shared/src/types/Comment";
import { Group } from "../../../../shared/src/types/Group";
import PostM, { Post } from "../../../../shared/src/types/Post";
import { Like } from "../../../../shared/src/types/Like";
import UserM, { User } from "../../../../shared/src/types/User";
import { DataStore } from "../../dao";
import { Types } from "mongoose";


export class MongoDB implements DataStore {

    async createUser(user: User): Promise<void> {
        const newUser = await UserM.create(user)
        await (await newUser).save()
    }
    async deleteUser(user: User, userName?: string): Promise<void> {
        const USER = UserM.find().where('userName').equals(userName)
        await USER.deleteOne()
 
    }
    updateCurrentUser(user: Partial<User>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async getUserById(id: Types.ObjectId): Promise<User | undefined> {
        const userDoc = await UserM.findById(id).exec()
        // .then(doc => { user = doc })
        // .catch((err) => { console.error(err)})
        // const user = await UserM.findById(id) || undefined//.where("_id").equals(id) || undefined
        // const user = await UserM.findOne().where("_id").equals(id) || undefined
        if(!userDoc) return undefined
        return userDoc
    }
    async getUserByEmail(email: string): Promise<User | undefined> {
        const user = await UserM.findOne().where("email").equals(email) || undefined
        // const user = await UserM.findOne({email : { $eq : email}},function(err:any, user:any){
        //     if(err) return console.error(err)
        //     console.log(user)
        // }) || undefined
        return user
    }
    async getUserByUsername(userName: string): Promise<User | undefined> {
        const user = await UserM.findOne().where("userName").equals(userName) || undefined
        return user
    }
    searchUser(userName: string): Promise<User | undefined> {
        throw new Error("Method not implemented.");
    }
    sendRequestToUser(userName: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    sendRequestToGroup(group: Group): Promise<void> {
        throw new Error("Method not implemented.");
    }
    joinGroup(group: Group): Promise<void> {
        throw new Error("Method not implemented.");
    }
    addGroup(group: Group): Promise<void> {
        throw new Error("Method not implemented.");
    }
    addFriend(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async listPosts(userId?: Types.ObjectId, groupId?: string, profileId?: string, privacy?: string): Promise<Post[] | undefined> {
        /////////////////////Handle tests
        // publics main posts as (visitor or user)
        if(!userId && !groupId && !profileId && (privacy === 'public'))
            return await PostM.find().where("privacy").equals("public")

        //visit profile as (visitor or user)
        // else if(!userId && !groupId && profileId && (privacy === 'public')){
        //     // const pId = {profileId : new ObjectId(profileId)}
        //     return await PostM.find({
        //          $and: [{userId : {$eq : new ObjectId(profileId)}},{privacy : {$eq : 'public'}}]
        //     },function(err:any, doc:any){
        //         if(err) return console.error(err)
        //         console.log(doc)
        //     })
        // }
        // //visit group as (visitor or user)    
        // else if(!userId && groupId && !profileId && (privacy === 'public'))
        //     return await PostM.find({
        //         $and : [{groupId : {$eq : new ObjectId(groupId)}}, {privacy : {$eq : 'public'}}]
        //     },function(err:any, doc:any){
        //         if(err) return console.error(err)
        //         console.log(doc)
        //     })
        // //visit your own profile as (user)
        // else if(userId && !groupId && !profileId && !privacy){
        //     return await PostM.find({
        //         $and : [{userId : {$eq : new ObjectId(userId)}},
        //         {$or : [{privacy : {$eq : 'public'}}, {privacy: {$eq : 'private'}}]}]
        //     },function(err:any, doc:any){
        //         if(err) return console.error(err)
        //         console.log(doc)
        //     })
        // }
        // //vist your own group
        // else if(!userId && groupId && !profileId && !privacy){
        //     return await PostM.find({
        //         $and : [{groupId : {$eq : new ObjectId(groupId)}},
        //         {$or : [{privacy : {$eq : 'public'}}, {privacy : {$eq : 'private'}}]}]
        //     },function(err:any, doc:any){
        //         if(err) return console.error(err)
        //         console.log(doc)
        //     })
        // }
        else return undefined
    }

    async createPost(post: Post, groupId?: string): Promise<void> {
        if(!groupId){
            const newPost = await PostM.create(post)
            await (await newPost).save()
            return
        }
        //TODO add to use posts
    }
    getPost(id: string, userId?: string | undefined): Post | undefined {
        throw new Error("Method not implemented.");
    }
    getPostByUrl(url: string): Post | undefined {
        throw new Error("Method not implemented.");
    }
    deletePost(postId: any, userId: any): Promise<void> {
        throw new Error("Method not implemented.");
    }
    listGroups(userId?: string | undefined): Group[] {
        throw new Error("Method not implemented.");
    }
    listGroupPosts(id: string, groupName?: string | undefined, privacy?: string | undefined): Promise<Post[]> {
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
    getGroupByGroupName(groupName: string): Promise<Group | undefined> {
        throw new Error("Method not implemented.");
    }
    deleteGroup(id: string): void {
        throw new Error("Method not implemented.");
    }
    existUserById(id: any): Promise<boolean | undefined> {
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

