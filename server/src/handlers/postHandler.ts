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
import { ObjectId } from '../../../shared';
import { ERRORS } from '../../../shared/src/errors';


export const listPostsHandler : ExpressHandler<
ListPostsRequest,
ListPostsResponse
> = async (req, res) => {
    if(!req.body.groupId && !req.body.profileId){//as (visitor or user) to main posts
        const posts = await db.listPosts(undefined, undefined, undefined,'public')
        return res.status(200).send({posts})
    }
    const userId = res.locals.userId
    if(!userId && !req.body.groupId && req.body.profileId){//as visitor to specific profile
        await db.listPosts(undefined, undefined, req.body.profileId, 'public')
        return res.sendStatus(200)
    }
    if(!userId && req.body.groupId && !req.body.profileId){//as visitor search group
        await db.listPosts(undefined, req.body.groupId,undefined, 'public')
        return res.sendStatus(200)
    }
    if(userId && !req.body.groupId && req.body.profileId){
        if(userId === new ObjectId(req.body.profileId)){//owns posts(public and private)
            await db.listPosts(userId)
            return res.sendStatus(200)
        }
        await db.listPosts(undefined, undefined, req.body.profileId, 'public')
        return res.sendStatus(200)
    }
    if(userId && req.body.groupId){//as user search group or belong group
        const exists:boolean = await db.existsUserById(req.body.groupId,userId) as boolean
        if(exists){
            await db.listPosts(undefined,req.body.groupId)
            return res.sendStatus(200)
        }
        else{
            await db.listPosts(undefined, req.body.groupId,undefined, 'public')
            return res.sendStatus(200)
        }
    }
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
            files: files as string[],
            userId,
            postedAt: new Date(),
            privacy
        } 
        if(req.body.groupId)
            post.groupId = new ObjectId(req.body.groupId)
        await db.createPost(post)
        return res.sendStatus(200)
    }
    res.status(400).send({error:'all fields are required'})
}

export const deletePostHandler : ExpressHandler<
DeletePostRequest,
DeletePostResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { postId , groupId} = req.body
    if(postId){
        const post = await db.getPost(postId, userId)
        if(!post)
            return res.status(400).send({error:'User not authorized to delete this post'})
        if(!groupId){                                      //tab9a fel group
            await db.deletePost(postId, userId)   //w tetfasa5 fel main posts
            return res.sendStatus(200)                     // if eli heya public post
        }
        else{//tab9a fel user profile w fel main public posts w ken user owner ydelety
            await db.deletePost(postId, userId , req.body.groupId)
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
    if(userId && postId){
        const post = await db.getPost(postId, userId)
        if(post){
            if(title) post.title = title
            if(description) post.description = description
            if(urls) post.urls = urls
            if(files) post.files = files
            if(privacy) post.privacy = privacy
            await db.updatePost(post)
        }
        return res.status(401).send({ error: ERRORS.POST_NOT_FOUND })
    }
    return res.status(401).send({ error: ERRORS.BAD_TOKEN }); 
}
