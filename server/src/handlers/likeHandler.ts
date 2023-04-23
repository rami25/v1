import { Like } from "../../../shared/src/types/Like";
import { db } from "../dao";
import { ExpressHandler } from "../types";

export const countPostLikes : ExpressHandler<{},{}> = async (req, res) => {

}

export const listPostLikes : ExpressHandler<{postId : string},{likes : Like[]}> = async (req, res) => {
    const { postId } = req.body
    res.status(200).send({likes : await db.getLikes(postId!)})
}

export const countCommentLikes : ExpressHandler<{},{}> = async (req, res) => {

}

export const listCommentLikes : ExpressHandler<{},{}> = async (req, res) => {

}
export const likePost : ExpressHandler<{postId : string},{}> = async (req, res) => {
    const userId = res.locals.userId
    const { postId } = req.body
    const user = await db.getUserById(userId)
    await db.createLike(user!, postId!)

}

export const checkPostLike : ExpressHandler<{postId : string},{exists : boolean}> = async (req, res) => {
    const userId = res.locals.userId
    const { postId } = req.body
    res.status(200).send({exists : await db.exists(userId , postId!)})
}

export const likeComment : ExpressHandler<{},{}> = async (req, res) => {

}
export const removeLikePost : ExpressHandler<{postId : string},{check : boolean}> = async (req, res) => {
    const userId = res.locals.userId
    const { postId } = req.body
    res.status(200).send({check : await db.deleteLike(userId , postId!)})

}
export const removeLikeComment : ExpressHandler<{},{}> = async (req, res) => {

}