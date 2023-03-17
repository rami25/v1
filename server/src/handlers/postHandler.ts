import { RequestHandler } from "express";
import { db } from "../dao";
import { ExpressHandler } from "../types";


export const listPostsHandler : ExpressHandler<{},{}> = (req, res) => {
    res.send({ posts : db.listPosts() })
}

export const createPostHandler : RequestHandler = (req, res) => {
    db.createPost(req.body)
    res.sendStatus(200)
}

export const deletePostHandler : RequestHandler = (req, res) => {
    db.deletePost(req.body.id)
    res.sendStatus(200)
}