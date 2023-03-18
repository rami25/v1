import { CreatePostRequest, 
         CreatePostResponse, 
         DeletePostRequest, 
         DeletePostResponse, 
         ListPostsRequest, 
         ListPostsResponse 
} from './../../../shared/src/APIs/api';
import { db } from "../dao";
import { ExpressHandler } from "../types";
import { Post } from '../../../shared/src/types/Post';
import { User } from '../../../shared/src/types/User';


export const listPostsHandler : ExpressHandler<
ListPostsRequest,
ListPostsResponse
> = async (req, res) => {
    if(!req.body.groupName && !req.body.userName){//as (visitor or user) to main posts
        await db.listPosts('public')
        return res.sendStatus(200)
    }
    if(!req.body.userId && !req.body.groupName && req.body.userName){//as visitor to specific profile
        await db.listPosts(req.body.userName, 'public')
        return res.sendStatus(200)
    }
    if(req.body.userId && !req.body.groupName && req.body.userName){
        const USER = await db.getUserById(req.body.userId) as User
        if(USER && (USER.userName === req.body.userName)){//owns posts(public and private)
            await db.listPosts(req.body.userId)
            return res.sendStatus(200)
        }
        await db.listPosts(req.body.userName, 'public')
        return res.sendStatus(200)
    }
    if(!req.body.userId && req.body.groupName){//as visitor search group
        await db.listPosts(req.body.groupName, 'public')
        return res.sendStatus(200)
    }
    if(req.body.userId && req.body.groupName){//as user search group
        const exists:boolean = await db.existUserById(req.body.userId) as boolean
        if(exists){
            await db.listGroupPosts(req.body.groupName)
            return res.sendStatus(200)
        }
        else{
            await db.listGroupPosts(req.body.groupName,'public')
            return res.sendStatus(200)
        }
    }
}

export const createPostHandler : ExpressHandler<
CreatePostRequest,
CreatePostResponse
> = async (req, res) => {
    if(req.body.title && 
       req.body.description && 
       req.body.privacy &&
       (req.body.urls || 
       req.body.files)){
            const post: Post = {
            title: req.body.title,
            description: req.body.description,
            urls: req.body.urls,
            files: req.body.files, 
            userId: req.body.userId,
            postedAt: Date.now(),
            privacy: req.body.privacy
            } 
        if(req.body.groupName){
            await db.createPost(post,req.body.groupName,req.body.userId)
            return res.sendStatus(200)
        } 
        else{
            await db.createPost(post,req.body.userId)
            return res.sendStatus(200)
        }
    }
}

export const deletePostHandler : ExpressHandler<
DeletePostRequest,
DeletePostResponse
> = async (req, res) => {
    if(req.body.userId && !req.body.groupName && req.body.postId){
        await db.deletePost(req.body.postId)
        return res.sendStatus(200)
    }
    if(req.body.userId && req.body.groupName && req.body.postId){
        await db.deleteGroupPost(req.body.postId)
        return res.sendStatus(200)
    }
}