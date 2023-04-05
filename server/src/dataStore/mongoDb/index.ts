import CommentM, { Comment } from "../../../../shared/src/types/Comment";
import GroupM, { Group } from "../../../../shared/src/types/Group";
import PostM, { Post } from "../../../../shared/src/types/Post";
import { Like } from "../../../../shared/src/types/Like";
import UserM, { User } from "../../../../shared/src/types/User";
import { DataStore } from "../../dao";
import { Types } from "mongoose";
import { ObjectId } from "../../../../shared/src/connection";


export class MongoDB implements DataStore {
    /////////////////////////////////////////////////////////////////////////////Users
    async countUsers(): Promise<number> {
        return await UserM.countDocuments()
    }

    async listUsers(): Promise<Partial<User>[] | undefined> {
        return await UserM.find({},{userName: 1 , email: 1, description : 1, createdAt: 1, psts: 1}) || undefined
    }

    async createUser(user: User): Promise<User> {
        const newUser = await UserM.create(user)
        await newUser.save()
        return newUser
    }
    
    async deleteUser(id: Types.ObjectId): Promise<void> {
        const groupIds = UserM.findOne(id).select('groups')
        console.log(groupIds)
        for(let gId in groupIds){
            await GroupM.updateOne({_id: gId}, {$pull : {usersId : id}})
        }
        await UserM.findByIdAndDelete(id)
    }

    async updateCurrentUser(user: Partial<User>): Promise<void> {
        await UserM.findByIdAndUpdate(user._id, user , {new : true})
    }
    async getUserById(id: Types.ObjectId): Promise<User | undefined> {
        return await UserM.findOne().where("_id").equals(id) || undefined
    }
    async getUserByEmail(email: string): Promise<User | undefined> {
        return await UserM.findOne().where("email").equals(email) || undefined
    }
    async getUserByUsername(userName: string): Promise<User | undefined> {
        return await UserM.findOne().where("userName").equals(userName) || undefined
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
    addGroup(group: Group): Promise<void> {
        throw new Error("Method not implemented.");
    }
    addFriend(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }
///////////////////////////////////////////////////////////////////////////////Posts
    async countPosts(): Promise<number> {
        return  await PostM.countDocuments()
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
        const user = await UserM.findById(post.userId)
        if(user){
            await user.posts?.push(newPost._id)
            await UserM.updateOne({_id : user._id}, {$inc : {psts:1}})
            await user.save()
            newPost.userName = user.userName
        }
        // in group 
        const groupId = post.groupId
        if(groupId){
            const group = await this.getGroup(groupId)
            if(group){
                await GroupM.updateOne({_id: groupId},{
                    $push: {posts: newPost._id},
                    $inc : {psts : 1}
                })
                newPost.groupName = group.groupName
            }
        }
        await newPost.save()
    }

    async getPost(id: string, Iduser?: Types.ObjectId): Promise<Post | undefined> {
        if(!Iduser)
            return await PostM.findOne({_id: new ObjectId(id)}) || undefined
        return await PostM.findOne({_id: new ObjectId(id), userId: Iduser}) || undefined
    }


    getPostByUrl(url: string): Post | undefined {
        throw new Error("Method not implemented.");
    }

    async deletePost(postId: string, userId?: Types.ObjectId, groupId?: string): Promise<void> {
        const post = await this.getPost(postId,userId)
        if(postId && userId && !groupId){//removing from user profile
            await UserM.updateOne({_id : userId}, {$pull: {posts:new ObjectId(postId)}, $inc : {psts : -1}})
            if(post && post.privacy === 'public')
                await PostM.deleteOne({_id : new ObjectId(postId)}, (err:any) => {
                        if (err) {
                          console.error(err)
                        } else {
                          console.log(`Deleted document with ID ${postId}`)
                        }})
            return
        }
        if(postId && userId && groupId){
            await GroupM.updateOne({_id: new ObjectId(groupId)}, {$pull: {posts: post!._id}, $inc : {psts : -1}})
        }
    }

    async updatePost(post: Post, userId?: Types.ObjectId | undefined): Promise<void> {
        // const groupId = post.groupId || undefined
        // if(groupId){
        //     await GroupM.updateOne({_id:groupId, posts:{$in:[post._id]}}, {$set:{'posts.$': post}}, {new:true})
        // }
        // else{
        //     await UserM.updateOne({_id: userId , posts: {$in:[post._id]}}, {$set:{'posts.$': post}},{new:true})
        //     await PostM.findByIdAndUpdate(post._id, post , {new : true})
        // }
        await PostM.findByIdAndUpdate(post._id , post , {new : true})

    }




    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async createGroup(group: Group): Promise<Group> {
        const newGroup = await GroupM.create(group)
        await newGroup.save()
        const user = await UserM.findById(newGroup.userAdmin)
        if(user){
            await user.groups?.push(newGroup._id)
            await user.save()
        }
        await GroupM.updateOne({_id: newGroup._id}, {admin : user?.userName, $push : {usersId : newGroup.userAdmin}, $inc : {users : 1}})
        const sendGroup = await GroupM.findById(newGroup._id).exec()
        return sendGroup!
    }

    async deleteGroup(id: string): Promise<void> {
        const groupId = new ObjectId(id)
        await UserM.updateMany({groups : {$in : groupId}}, {$pull : {groups : groupId}})
        await GroupM.findByIdAndDelete(groupId)
    }

    async updateGroup(group: Group): Promise<void> {
        await GroupM.findByIdAndUpdate(group._id , group , {new: true})
    }

    async countGroups(): Promise<number> {
        return await GroupM.countDocuments()
    }

    async listGroups(): Promise<Group[] | undefined> {
        return await GroupM.find({},{groupName : 1 , description : 1 , userAdmin : 1 , usersId : 1 ,users : 1,psts : 1, createdAt : 1}) || undefined
    }

    async getGroup(id: Types.ObjectId, userId?: Types.ObjectId): Promise<Group | undefined> {
        if(!userId)
            return await GroupM.findOne().where("_id").equals(id) || undefined
        return await GroupM.findOne({_id:id , userAdmin : userId}) || undefined

    }
//interact with other
    async sendGroupRequest(id: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
        await GroupM.findByIdAndUpdate(id , {$push : {usersIdInvitations : userId}}, {new : true})
        await UserM.findByIdAndUpdate(userId , {$push : {groupsIdRequests : id}}, {new : true})
    }

    async deleteSendGroupRequest(id: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
        await GroupM.findByIdAndUpdate(id , {$pull : {usersIdInvitations : userId}}, {new : true})
        await UserM.findByIdAndUpdate(userId , {$pull : {groupsIdRequests : id}}, {new : true})
    }

    async deleteUserRequest(id: Types.ObjectId, profileId: Types.ObjectId): Promise<void> {
        await this.deleteSendGroupRequest(id,profileId)
        // await GroupM.findByIdAndUpdate(id, {$pull : {usersIdInvitations : profileId}}, {new : true}).exec() 
        // await UserM.findByIdAndUpdate(profileId , {$pull : {groupsIdRequests : id}}, {new : true})
    }

    async acceptUserRequest(id: Types.ObjectId, profileId: Types.ObjectId): Promise<void> {
        await this.deleteUserRequest(id,profileId)
        await GroupM.updateOne({_id: id}, { $push : {usersId : profileId}, $inc : {users : 1}})
        await UserM.findByIdAndUpdate(profileId, {$push : {groups : id}})
    }

    async notification(id : Types.ObjectId, profileId : Types.ObjectId, target:boolean) : Promise<void> {
        const group = await this.getGroup(id)
        const user = await this.getUserById(profileId)
        if(target){
            const message = `hi ${user!.userName}, you have accepted in ${group!.groupName} group`
            user!.acceptedRequests?.push(message)
            await UserM.findByIdAndUpdate(profileId , user , {new : true})
            return
        }
        const message = `hi ${group!.groupName}, ${user!.userName} have been a member of ${group!.groupName} group`
        group!.acceptedRequests?.push(message)
        await GroupM.findByIdAndUpdate(id , group , {new : true})
    }
    async inviteUserToGroup(id: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
        await GroupM.findByIdAndUpdate(id , {$push : {usersIdRequests : userId}}, {new : true})
        await UserM.findByIdAndUpdate(userId , {$push : {groupsIdInvitations:id}},{new : true}).exec()
    }

    async deleteInvitationUserToGroup(id: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
        await GroupM.findByIdAndUpdate(id , {$pull : {usersIdRequests : userId}}, {new : true})
        await UserM.findByIdAndUpdate(userId , {$pull : {groupsIdInvitations:id}},{new : true}).exec()
    }

    async deleteGroupInvitation(id: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
        await this.deleteInvitationUserToGroup(id,userId)
        // await GroupM.findByIdAndUpdate(id , {$pull : {usersIdRequests : userId}}, {new : true})
        // await UserM.findByIdAndUpdate(userId , {$pull : {groupsIdInvitations : id}}, {new : true})
    }

    async joinGroup(id: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
        // await UserM.findByIdAndUpdate(userId, {$pull : {groupsIdInvitations: id}},{new : true})
        // await GroupM.findByIdAndUpdate(id, {$pull : {usersIdRequests : userId}},{new : true})
        await this.deleteGroupInvitation(id,userId)
        await this.acceptUserRequest(id,userId)
        // await GroupM.updateOne({_id: id}, { $push : {usersId : userId}})
        // await UserM.findByIdAndUpdate(userId, {$push : {groups : id}})
    }

    async leaveGroup(id: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
        await GroupM.updateOne({_id: id}, { $pull : {usersId : userId}, $inc : {users : -1}})
        await UserM.findByIdAndUpdate(userId, {$pull : {groups : id}})
    }
    async rejectUserFromGroup(id: Types.ObjectId, profileId: Types.ObjectId): Promise<void> {
        await this.leaveGroup(id,profileId)
    }











    listGroupPosts(id: string, groupName?: string | undefined, privacy?: string | undefined): Promise<Post[]> {
        throw new Error("Method not implemented.");
    }


    addUser(user: User): void {
        throw new Error("Method not implemented.");
    }
    async getGroupByGroupName(groupName: string): Promise<Group | undefined> {
        return await GroupM.findOne().where("groupName").equals(groupName) || undefined
    }




    async existsUserById(groupId: string, userId: Types.ObjectId): Promise<boolean | undefined> {
        const group = await GroupM.findOne({_id : new ObjectId(groupId), usersId : { $in:[userId]}})
        if(group) return true
        return false
    }

///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////Comments
    async createComment(postId: string, comment: Comment): Promise<void> {
        const newComment = await CommentM.create(comment)
        newComment.save()
        await PostM.findByIdAndUpdate(new ObjectId(postId), {$push : {comments: newComment._id}},{new : true})
    }
    async updateComment(comment: Partial<Comment>): Promise<void> {
        await CommentM.findByIdAndUpdate(comment._id, comment , {new : true})
    }
    async countComments(postId: string): Promise<number> {
        const post = await this.getPost(postId)
        if(post){
            return post.comments!.length
        } else {
            throw new Error(`No post found with ID ${postId}`);
        }
    }
    async listComments(postId: string): Promise<any[] | undefined> {
        const post = await PostM.findOne({_id: new ObjectId(postId)}).populate('comments')
        return post!.comments
    }

    async deleteComment(postId: string, commentId: string): Promise<void> {
        await CommentM.deleteOne({_id: new ObjectId(commentId)})
        await PostM.findByIdAndUpdate(new ObjectId(postId), {$pull : {comments: new ObjectId(commentId)}},{new : true})
    }

    async getComment(commentId: string): Promise<Comment | undefined> {
        return await CommentM.findById(new ObjectId(commentId)) || undefined
    }



////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////Likes
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







}

