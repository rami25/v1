import { db } from "../dataStore"
import { ExpressHandler, Post } from "../types"
import crypto from 'crypto'
import { CreatePostRequest, CreatePostResponse, ListPostRequest, ListPostResponse } from "../api"



export const listPostsHandler : ExpressHandler<ListPostRequest , ListPostResponse> = (req, res) => {
    res.send({ posts : db.listPosts() })
}


export const createPostHandler : ExpressHandler<CreatePostRequest, CreatePostResponse> = (req, res) =>{
    if(!req.body.title ||!req.body.url ||!req.body.userId){ 
        return res.sendStatus(400)
    }

    const post: Post = {
        id: crypto.randomUUID(),
        postedAt: Date.now(),
        title: req.body.title,
        url: req.body.url,
        userId: req.body.userId,
    }
    db.createPost(post)
    res.sendStatus(200)
}

interface DeletePostRequest {
    id: string
}
interface DeletePostResponse {}

export const deletePostHandler : ExpressHandler<DeletePostRequest, DeletePostResponse> = (req, res) => {
    if(!req.body.id) return res.sendStatus(400)
    db.deletePost(req.body.id)
    res.send( {message : "deleted"} )
}