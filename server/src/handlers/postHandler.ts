import { CreatePostRequest, 
         CreatePostResponse, 
         DeletePostRequest, 
         DeletePostResponse, 
         ListPostsRequest, 
         ListPostsResponse, 
         UpdatePostRequest,
         UpdatePostResponse
} from './../../../shared/src/APIs/api';
import { db } from "../dao";
import { ExpressHandler } from "../types";
import { Post } from '../../../shared/src/types/Post';


export const listPostsHandler : ExpressHandler<
ListPostsRequest,
ListPostsResponse
> = async (req, res) => {
    if(!req.body.groupId && !req.body.profileId){//as (visitor or user) to main posts
        const posts = await db.listPosts('public')
        return res.status(200).send({posts})
    }
    if(!req.body.userId && !req.body.groupId && req.body.profileId){//as visitor to specific profile
        await db.listPosts(req.body.profileId, 'public')
        return res.sendStatus(200)
    }
    if(!req.body.userId && req.body.groupId){//as visitor search group
        await db.listPosts(req.body.groupId, 'public')
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
    const { title , description , privacy , urls , files} = req.body
    if(title && description && privacy && (urls || files)){
            //TODO Validations Fields
            const post: Post = {
            title,
            description,
            urls,
            files,
            userId: res.locals.userId,
            groupId: req.body.groupId,
            postedAt: Date.now(),
            privacy
            } 
        if(req.body.groupId){
            await db.createPost(post)//,req.body.groupId,req.body.userId)
            return res.sendStatus(200)
        } 
        else{
            console.log(res.locals.userId)
            console.log('post created')
            await db.createPost(post,res.locals.userId)
            return res.sendStatus(200)
        }
    }
    res.status(200).json({})
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

export const updatePostHandler : ExpressHandler<
UpdatePostRequest,
UpdatePostResponse
> = async (req, res) => {

}
