import { Comment } from "../../../../shared/src/types/Comment";
import GroupM, { Group } from "../../../../shared/src/types/Group";
import PostM, { Post } from "../../../../shared/src/types/Post";
import { Like } from "../../../../shared/src/types/Like";
import UserM, { User } from "../../../../shared/src/types/User";
import { DataStore } from "../../dao";
import { Types } from "mongoose";
import { ObjectId } from "../../../../shared";


export class MongoDB implements DataStore {

    async createUser(user: User): Promise<User> {
        const newUser = await UserM.create(user)
        await newUser.save()
        return newUser
    }
    async deleteUser(id: Types.ObjectId): Promise<void> {
        const user = await UserM.findOne().where('_id').equals(id)
        if(user)
            await user.deleteOne()
 
    }
    async updateCurrentUser(user: Partial<User>): Promise<void> {
        await UserM.findByIdAndUpdate(user._id, user , {new : true})
    }
    async getUserById(id: Types.ObjectId): Promise<User | undefined> {
        const userDoc = await UserM.findById(id).exec()
        if(!userDoc) return undefined
        return userDoc
    }
    async getUserByEmail(email: string): Promise<User | undefined> {
        const user = await UserM.findOne().where("email").equals(email) || undefined
        return user
    }
    async getUserByUsername(userName: string): Promise<User | undefined> {
        const user = await UserM.findOne().where("userName").equals(userName) || undefined
        return user
    }
    async getUserByToken(token: string): Promise<User | undefined> {
        const user = await UserM.findOne({
                        resetPasswordToken: token,
                        resetPasswordExpires: { $gt: Date.now() }
                    }) || undefined
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
        // publics main posts as (visitor or user)
        if(!userId && !groupId && !profileId && (privacy === 'public'))
            return await PostM.find().where("privacy").equals("public")

        //visit profile as (visitor or user)
        else if(!userId && !groupId && profileId && (privacy === 'public')){
            return await PostM.find({
                 $and: [{userId : {$eq : new ObjectId(profileId)}},{privacy : {$eq : 'public'}}]
            },function(err:any, doc:any){
                if(err) return console.error(err)
                console.log(doc)
            })
        }
        //visit group as (visitor or user)    
        else if(!userId && groupId && !profileId && (privacy === 'public'))
            return await PostM.find({
                $and : [{groupId : {$eq : new ObjectId(groupId)}}, {privacy : {$eq : 'public'}}]
            },function(err:any, doc:any){
                if(err) return console.error(err)
                console.log(doc)
            })
        //visit your own profile as (user)
        else if(userId && !groupId && !profileId && !privacy){
            return await PostM.find({
                $and : [{userId : {$eq : userId}},
                {$or : [{privacy : {$eq : 'public'}}, {privacy: {$eq : 'private'}}]}]
            },function(err:any, doc:any){
                if(err) return console.error(err)
                console.log(doc)
            })
        }
        //vist your own group
        else if(!userId && groupId && !profileId && !privacy){
            return await PostM.find({
                $and : [{groupId : {$eq : new ObjectId(groupId)}},
                {$or : [{privacy : {$eq : 'public'}}, {privacy : {$eq : 'private'}}]}]
            },function(err:any, doc:any){
                if(err) return console.error(err)
                console.log(doc)
            })
        }
        else return undefined
    }

    async createPost(post: Post): Promise<void> {
        //add to main posts and user profile
        const newPost = await PostM.create(post)
        await newPost.save()
        const user = await UserM.findById(post.userId)
        if(user){
            await user.posts?.push(newPost._id)
            await user.save()
        }
        // in group 
        const groupId = post.groupId
        if(groupId){
            const group = await this.getGroup(groupId)
            if(group){
                await GroupM.updateOne({_id: groupId},{
                    $push: {posts: newPost._id}
                })
            }
        }
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
    async getGroup(id: Types.ObjectId, userId?: string | undefined): Promise<Group | undefined> {
        const group = await GroupM.findOne().where("_id").equals(id)
        if(!group) return undefined
        return group
    }
    getGroupByGroupName(groupName: string): Promise<Group | undefined> {
        throw new Error("Method not implemented.");
    }
    deleteGroup(id: string): void {
        throw new Error("Method not implemented.");
    }
    async existsUserById(groupId: string, userId: Types.ObjectId): Promise<boolean | undefined> {
        const group = await GroupM.findOne({_id : new ObjectId(groupId), usersId : { $in:[userId]}})
        if(group) return true
        return false
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

