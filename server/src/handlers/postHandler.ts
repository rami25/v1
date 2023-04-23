import {
         CreatePostRequest, 
         CreatePostResponse, 
         DeletePostRequest, 
         DeletePostResponse, 
         ListPostsRequest, 
         ListPostsResponse, 
         UpdatePostRequest,
         UpdatePostResponse
} from './../../../shared/src/APIs/api';
import { db } from "../dao";
import { ExpressHandler, ExpressHandlerWithParams } from "../types";
import { Post } from '../../../shared/src/types/Post';
import { ObjectId } from '../../../shared/src/connection';
import { ERRORS } from '../../../shared/src/errors';
import { getUserIdMiddleware } from '../middlewares/authMiddleware';

export const countPostsHandler : ExpressHandler<{},{posts : number}> = async (req, res) => {
    res.status(200).send({ posts : await db.countPosts()})
}

export const listUP : ExpressHandler<{},ListPostsResponse> = async (req, res) => {
    const userId = res.locals.userId
    const posts = await db.listPosts(userId)
    return res.status(200).send({posts})
}
export const listPostsHandler : ExpressHandlerWithParams<
{
    profileId? : string,
    groupId? : string,
},
ListPostsRequest,
ListPostsResponse
> = async (req, res) => {
    const { groupId , profileId } = req.params
    if(!groupId && !profileId){//as (visitor or user) to main posts
        const posts = await db.listPosts(undefined, undefined, undefined,'public') 
        return res.status(200).send({posts})
    }
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    let userId = null
    if(token)
        userId = await getUserIdMiddleware(token)
    if(userId) userId = new ObjectId(userId)    
    if(!groupId && profileId){//as (visitor or user) to specific profile or own profile
        if(!!userId && (userId.toString() === profileId)){
            const posts = await db.listPosts(userId)
            return res.status(200).send({posts})
        }
        const posts = await db.listPosts(undefined, undefined, profileId, 'public')
        return res.status(200).send({posts})
    }
    if(groupId && !profileId){//as (visitor or user) search group or own group
        if(userId){
            const exists:boolean = await db.existsUserById(groupId,userId) as boolean
            if(exists){
                const posts = await db.listPosts(undefined,groupId)
                return res.status(200).send({posts})
            }
        }
        const posts = await db.listPosts(undefined, groupId,undefined, 'public')
        return res.status(200).send({posts})
    }

    // if(userId && !groupId && profileId){
    //     if(userId === new ObjectId(profileId)){//owns posts(public and private) User
    //         await db.listPosts(userId)
    //         return res.sendStatus(200)
    //     }
    //     await db.listPosts(undefined, undefined, profileId, 'public')
    //     return res.sendStatus(200)
    // }

    // if(userId && groupId && !profileId){//as user search group or belong group
    //     const exists:boolean = await db.existsUserById(groupId,userId) as boolean
    //     if(exists){
    //         await db.listPosts(undefined,groupId)
    //         return res.sendStatus(200)
    //     }
    //     else{
    //         await db.listPosts(undefined, groupId, undefined, 'public')
    //         return res.sendStatus(200)
    //     }
    // }

    res.sendStatus(401)
}

export const createPostHandler : ExpressHandler<
CreatePostRequest,
CreatePostResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { title , description , privacy , urls , files} = req.body
    if(title && description && privacy && (urls || files)){
        //TODO Validations Fields
        const post: Post = {
            title,
            description,
            urls: urls as string[],
            nurls : urls!.length,
            files : files as string[],
            nfiles : files!.length,
            userId,
            postedAt: new Date(),
            privacy
        } 
        if(req.body.groupId)
            post.groupId = new ObjectId(req.body.groupId)
        await db.createPost(post)
        const user = await db.getUserById(userId)
        return res.status(200).send({psts : user!.psts})
    }
    res.status(400).send({error:'all fields are required'})
}

export const deletePostHandler : ExpressHandler<
DeletePostRequest,
DeletePostResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { postId , groupId } = req.body
    if(postId){
        const post = await db.getPost(postId, userId)
        if(!post)
            return res.status(400).send({error:'User not authorized for deleting this post'})
        if(!groupId){                                      //tab9a fel group
            await db.deletePost(postId, userId)            //w tetfasa5 fel main posts
            return res.status(200).send({message :'Post deleted successfully!'})                     // if eli heya public post
        }
        else{//tab9a fel user profile w fel main public posts w ken user owner ydelety
            await db.deletePost(postId, userId , groupId)
            return res.sendStatus(200)
        }
    }
    res.sendStatus(401)
}

export const updatePostHandler : ExpressHandler<
UpdatePostRequest,
UpdatePostResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { title , description, urls, files, postId, privacy} = req.body
    if(userId){
        if(!postId)
            return res.status(401).send({error : 'no identifer'})
        const post = await db.getPost(postId, userId)
        if(post){
            if(title) post.title = title
            if(description) post.description = description
            if(urls) {post.urls = urls; post.nurls = urls.length}
            if(files) {post.files = files; post.nfiles = files.length}
            if(privacy) post.privacy = privacy
            await db.updatePost(post)
            return res.status(200).send({message : 'post updated successfully!!!'})
        }
        return res.status(401).send({ error: ERRORS.POST_NOT_FOUND })
    }
    return res.status(401).send({ error: ERRORS.BAD_TOKEN }); 
}
