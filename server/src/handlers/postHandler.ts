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


export const listPostsHandler : ExpressHandler<
ListPostsRequest,
ListPostsResponse
> = async (req, res) => {
    if(!req.body.groupId && !req.body.profileId){//as (visitor or user) to main posts
        await db.listPosts('public')
        return res.sendStatus(200)
    }
    if(!req.body.userId && !req.body.groupId && req.body.profileId){//as visitor to specific profile
        await db.listPosts(req.body.profileId, 'public')
        return res.sendStatus(200)
    }
    if(req.body.userId && !req.body.groupId && req.body.profileId){
        if(req.body.userId === req.body.profileId){//owns posts(public and private)
            await db.listPosts(req.body.userId)
            return res.sendStatus(200)
        }
        await db.listPosts(req.body.profileId, 'public')
        return res.sendStatus(200)
    }
    if(!req.body.userId && req.body.groupId){//as visitor search group
        await db.listPosts(req.body.groupId, 'public')
        return res.sendStatus(200)
    }
    if(req.body.userId && req.body.groupId){//as user search group
        const exists:boolean = await db.existUserById(req.body.userId) as boolean
        if(exists){
            await db.listGroupPosts(req.body.groupId)
            return res.sendStatus(200)
        }
        else{
            await db.listGroupPosts(req.body.groupId,'public')
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
            //TODO Validations Fields
            const post: Post = {
            title: req.body.title,
            description: req.body.description,
            urls: req.body.urls,
            files: req.body.files, 
            userId: req.body.userId,
            groupId: req.body.groupId,
            postedAt: Date.now(),
            privacy: req.body.privacy
            } 
        if(req.body.groupId){
            await db.createPost(post,req.body.groupId,req.body.userId)
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
    if(req.body.userId && req.body.postId){
        await db.deletePost(req.body.postId, req.body.userId)
        return res.sendStatus(200)
    }
    if(req.body.groupId && req.body.postId){
        await db.deletePost(req.body.postId, req.body.groupId)
        return res.sendStatus(200)
    }
}