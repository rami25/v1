import CommentM, { Comment } from "../../../../shared/src/types/Comment";
import GroupM, { Group } from "../../../../shared/src/types/Group";
import PostM, { Post } from "../../../../shared/src/types/Post";
import LikeM, { Like } from "../../../../shared/src/types/Like";
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
        return await UserM.find({},{userName: 1 , email: 1, description : 1, createdAt: 1, psts: 1, grps : 1}) || undefined
    }

    async createUser(user: User): Promise<User> {
        const newUser = await UserM.create(user)
        await newUser.save()
        return newUser
    }
    
    async deleteUser(id: Types.ObjectId): Promise<void> {
        const user = await UserM.findOne(id).select('groups')
        if(user && user.groups)
            for(let gId of user.groups){
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
            return await PostM.find({userId : new ObjectId(profileId),privacy :'public'})
        }
        //visit group as (visitor or user)    
        else if(!userId && groupId && !profileId && (privacy === 'public')){
            return await PostM.find({groupId : new ObjectId(groupId),privacy :'public'})
        }

        //visit your own profile as (user)
        else if(userId && !groupId && !profileId && !privacy){
            return await PostM.find().where("userId").equals(userId)
        }

        //vist your own group
        else if(!userId && groupId && !profileId && !privacy){
            return await PostM.find({groupId : new ObjectId(groupId)})
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
    async getPostById(postId: string): Promise<Post | undefined> {
        return await PostM.findOne({_id: new ObjectId(postId)}) || undefined
    }


    getPostByUrl(url: string): Post | undefined {
        throw new Error("Method not implemented.");
    }

    async deletePost(postId: string, userId?: Types.ObjectId, groupId?: string): Promise<void> {
        const post = await this.getPost(postId,userId)
        if(post){
            await UserM.updateOne({_id : userId}, {$pull: {posts:new ObjectId(postId)}, $inc : {psts : -1}})
            if(!!post.groupId){
                await GroupM.updateOne({_id: post.groupId}, {$pull: {posts: post!._id}, $inc : {psts : -1}})
            }
            await PostM.deleteOne(new ObjectId(postId))
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
            await UserM.updateOne({_id : user._id}, {$inc : {grps:1}})
            await user.save()
        }
        await GroupM.updateOne({_id: newGroup._id}, {admin : user?.userName, $push : {usersId : newGroup.userAdmin}, $inc : {users : 1}})
        const sendGroup = await GroupM.findById(newGroup._id).exec()
        return sendGroup!
    }

    async deleteGroup(id: string): Promise<void> {
        const groupId = new ObjectId(id)
        await UserM.updateMany({groups : {$in : groupId}}, {$pull : {groups : groupId}, $inc:{grps:-1}})
        await GroupM.findByIdAndDelete(groupId)
    }

    async updateGroup(group: Group): Promise<void> {
        await GroupM.findByIdAndUpdate(group._id , group , {new: true})
    }

    async countGroups(): Promise<number> {
        return await GroupM.countDocuments()
    }

    async listGroups(): Promise<Group[] | undefined> {
        // return await GroupM.find({},{groupName : 1 , description : 1 , userAdmin : 1 , admin: 1 , usersId : 1 ,users : 1,psts : 1, createdAt : 1}) || undefined
        return await GroupM.find()
    }
    async listUserGroups(userId: Types.ObjectId) : Promise<Group[] | undefined> {
        return await GroupM.find({ usersId : { $in:[userId]}}) || undefined
    }
    async listGroupUsers(groupId: Types.ObjectId) : Promise<User[] | undefined> {
        return await UserM.find({ groups : { $in:[groupId]}}) || undefined
    }

    async listAdminGroups(userId: Types.ObjectId) : Promise<Group[] | undefined> {
        return await GroupM.find({ userAdmin : userId}) || undefined
    }

    async getGroup(id: Types.ObjectId, userId?: Types.ObjectId): Promise<Group | undefined> {
        if(!userId)
            return await GroupM.findOne().where("_id").equals(id) || undefined
        return await GroupM.findOne({_id:id , userAdmin : userId}) || undefined

    }
    async getGroupByUser(id: Types.ObjectId, userId: Types.ObjectId): Promise<Group | undefined> {
        return await GroupM.findOne({_id:id , usersId : {$in:[userId]} }) || undefined

    }
//interact with other
    async sendGroupRequest(id: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
        await GroupM.findByIdAndUpdate(id , {$push : {usersIdDemandes : userId},$inc :{uIdDs:1}}, {new : true})
        await UserM.findByIdAndUpdate(userId , {$push : {groupsIdRequests : id},$inc:{gIdRs:1}}, {new : true})
    }

    async deleteSendGroupRequest(id: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
        await GroupM.findByIdAndUpdate(id , {$pull : {usersIdDemandes : userId},$inc:{uIdDs:-1}}, {new : true})
        await UserM.findByIdAndUpdate(userId , {$pull : {groupsIdRequests : id},$inc:{gIdRs:-1}}, {new : true})
    }

    async deleteUserRequest(id: Types.ObjectId, profileId: Types.ObjectId): Promise<void> {// as an admin
        await this.deleteSendGroupRequest(id,profileId)
    }

    async acceptUserRequest(id: Types.ObjectId, profileId: Types.ObjectId): Promise<void> {// as an admin
        await this.deleteUserRequest(id,profileId)
        await GroupM.updateOne({_id: id}, { $push : {usersId : profileId}, $inc : {users : 1}})
        await UserM.findByIdAndUpdate(profileId, {$push : {groups : id}, $inc:{grps:1}})
    }

    async inviteUserToGroup(id: Types.ObjectId, userId: Types.ObjectId): Promise<Group | undefined> {
        await UserM.findByIdAndUpdate(userId , {$push : {groupsIdDemandes:id},$inc:{gIdDs:1}},{new : true}).exec()
        const group = await GroupM.findByIdAndUpdate(id , {$push : {usersIdRequests : userId},$inc:{uIdRs:1}}, {new : true})
        return group || undefined
    }

    async deleteInvitationUserToGroup(id: Types.ObjectId, userId: Types.ObjectId): Promise<Group | undefined> {
        await UserM.findByIdAndUpdate(userId , {$pull : {groupsIdDemandes:id},$inc:{gIdDs:-1}},{new : true}).exec()
        const group = await GroupM.findByIdAndUpdate(id , {$pull : {usersIdRequests : userId},$inc:{uIdRs:-1}}, {new : true})
        return group || undefined
    }

    async deleteGroupInvitation(id: Types.ObjectId, userId: Types.ObjectId): Promise<void> {//as a user
        await this.deleteInvitationUserToGroup(id,userId)
    }

    async joinGroup(id: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
        await this.deleteGroupInvitation(id,userId)
        await GroupM.updateOne({_id: id}, { $push : {usersId : userId}, $inc : {users : 1}})
        await UserM.findByIdAndUpdate(userId, {$push : {groups : id}, $inc:{grps:1}})
    }

    async leaveGroup(id: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
        await GroupM.updateOne({_id: id}, { $pull : {usersId : userId}, $inc : {users : -1}})
        await UserM.findByIdAndUpdate(userId, {$pull : {groups : id}, $inc:{grps:-1}})
    }
    async rejectUserFromGroup(id: Types.ObjectId, profileId: Types.ObjectId): Promise<void> {//as an admin
        await this.leaveGroup(id,profileId)
    }



    async notification(id : Types.ObjectId, profileId : Types.ObjectId, target:boolean) : Promise<void> {
        const group = await this.getGroup(id)
        const user = await this.getUserById(profileId)
        if(user && group){
            if(target){//admin accept user
                const message1 = `You have accepted in "${group.groupName}" group`
                const message2 = `"${user!.userName}" has been a member in "${group.groupName}" group`
                // user!.acceptedRequests?.push(message)
                await UserM.findByIdAndUpdate(profileId , {$push : {acceptedRequests : message1}, $inc : {notif : 1}})
                for(let uId of group.usersId!){
                    console.log(uId === group.userAdmin) 
                    if((uId === group.userAdmin) || (uId === profileId)) continue
                    await UserM.findByIdAndUpdate(uId , {$push : {acceptedRequests : message2}, $inc : {notif : 1}})
                }
                return
            }
            const message = `"${user!.userName}" accepted your invitation to "${group.groupName}" group`
            // group!.acceptedRequests?.push(message)
            await GroupM.findByIdAndUpdate(id , {$push : {acceptedRequests : message}, $inc : {notif : 1}})
        }
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
        await PostM.findByIdAndUpdate(new ObjectId(postId), {$push : {comments: newComment._id}, $inc : {cmnts : 1}},{new : true})
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
        await PostM.findByIdAndUpdate(new ObjectId(postId), {$pull : {comments: new ObjectId(commentId)} , $inc : {cmnts : -1}},{new : true})
    }

    async getComment(commentId: string): Promise<Comment | undefined> {
        return await CommentM.findById(new ObjectId(commentId)) || undefined
    }



////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////Likes
    async getLike(likeId : Types.ObjectId) : Promise<Like | undefined> {
        return await LikeM.findOne(likeId) || undefined
    }
    async createLike(user : User , postId : string): Promise<void> {
        const like = await LikeM.create({
            userId : user._id,
            userName : user.userName,
            likedAt : new Date()
        })
        like.save()
        // const post = await this.getPost(postId)
        const post = await PostM.findOne(new ObjectId(postId))
        if(post){
            const likes = await this.getLikes(post._id.toString())
            for(let Like of likes){
                if(Like.userId!.toString() === user._id!.toString())
                    return
            }
            post.likes?.push(like._id)
            post.lks = post.likes?.length
            await post.save()
        }
    }
    async deleteLike(userId : Types.ObjectId , postId : string): Promise<boolean> {
        const likes = await this.getLikes(postId)
        if(likes.length){
            for(let like of likes){
                if(like.userId!.toString() === userId.toString()){
                    await PostM.updateOne({_id : new ObjectId(postId)}, {$pull : {likes : like._id}})
                    const post = await PostM.findOne(new ObjectId(postId))
                    if(post){
                        post.lks = post.likes?.length
                        await post.save()
                    }
                    await LikeM.deleteOne(like._id)
                    return true
                }
                    
            }
        }
        return false
        
    }
    async getLikes(postId: string): Promise<Like[]> {
        let likesList : Like[] = []
        const post = await this.getPost(postId)
        if(post){
            if(post.lks === 0)
                return []
            for(let likeId of post.likes!){
                const like = await this.getLike(likeId)
                if(like) likesList.push(like)
            }
            return likesList
        }
        return []
    }
    
    async exists(userId : Types.ObjectId , postId : string): Promise<boolean> {
        const likes = await this.getLikes(postId)
        if(likes.length){
            for(let like of likes){
                if(like.userId!.toString() === userId.toString()){
                    return true
                }
            }
        }
        return false
    }







}

