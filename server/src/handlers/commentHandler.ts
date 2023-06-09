import { 
        AddCommentRequest,
        AddCommentResponse,
        CountCommentsRequest,
        CountCommentsResponse,
        DeleteCommentRequest,
        DeleteCommentResponse,
        ListCommentsRequest,
        ListCommentsResponse, 
        UpdateCommentRequest,
        UpdateCommentResponse
} from "../../../shared/src/APIs/api";
import { ERRORS } from "../../../shared/src/errors";
import { Comment } from "../../../shared/src/types/Comment";
import { db } from "../dao";
import { ExpressHandler } from "../types";

export const countComments : ExpressHandler<
CountCommentsRequest,
CountCommentsResponse
> = async (req, res) => {
    const { postId } = req.body
    if(!postId)
        return res.status(400).send({error : 'unauthorized'})
    const post = await db.getPost(postId)
    if(!post)
        return res.status(400).send({error : ERRORS.POST_NOT_FOUND})
    res.status(200).send( {numberOfComments : await db.countComments(postId)})
}

export const listComments : ExpressHandler<
ListCommentsRequest,
ListCommentsResponse
> = async (req, res) => {
    const { postId } = req.body
    if(!postId)
        return res.status(400).send({error : 'unauthorized'})
    const post = await db.getPost(postId)
    if(!post)
        return res.status(400).send({error : ERRORS.POST_NOT_FOUND})
    res.status(200).send( {comments : await db.listComments(postId)})
}

export const addComment : ExpressHandler<
AddCommentRequest,
AddCommentResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { postId , content} = req.body
    if(!postId)
        return res.status(400).send({error : 'unauthorized'})
    if(!content)
        return res.status(400).send({error : 'content is required'})
    const post = await db.getPost(postId)
    if(!post)
        return res.status(400).send({error : ERRORS.POST_NOT_FOUND})
    const user = await db.getUserById(userId)
    const comment : Comment = {
        userId,
        userName : user!.userName,
        content,
        commentedAt : new Date()
    }
    await db.createComment(postId, comment)    
    res.sendStatus(200)

}

export const updateComment : ExpressHandler<
UpdateCommentRequest,
UpdateCommentResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { commentId , content} = req.body
    if(!commentId)
        return res.status(400).send({error : 'unauthorized'})
    if(!content)
        return res.status(400).send({error : 'content is required'})
    const comment = await db.getComment(commentId)
    if(!comment)
        return res.status(400).send({error : ERRORS.COMMENT_NOT_FOUND})
    if(!userId.equals(comment.userId))
        return res.status(400).send({error : 'unauthorized'})
    comment.content = content   
    await db.updateComment(comment)    
    res.sendStatus(200)

}

export const deleteComment : ExpressHandler<
DeleteCommentRequest,
DeleteCommentResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { postId , commentId } = req.body
    if(!postId || !commentId)
        return res.status(400).send({error : 'unauthorized'})
    const post = await db.getPost(postId)
    if(!post)
        return res.status(400).send({error : ERRORS.POST_NOT_FOUND})
    const comment = await db.getComment(commentId)
    if(!comment)
        return res.status(400).send({error : ERRORS.COMMENT_NOT_FOUND})
    if(!userId.equals(comment.userId))
        return res.status(400).send({error : 'unauthorized'})
    await db.deleteComment(postId, commentId)    
    res.sendStatus(200)

}