import asyncHandler from 'express-async-handler';
import { Router } from 'express'
import { jwtParseMiddleware } from '../middlewares/authMiddleware';
import { 
        checkPostLike,
        likeComment,
        likePost,
        listCommentLikes,
        // listPostLikes,
        removeLikeComment,
        removeLikePost 
} from '../handlers/likeHandler';
const router = Router()

// router.post('/post', jwtParseMiddleware, asyncHandler(listPostLikes))
router.post('/comment', jwtParseMiddleware, asyncHandler(listCommentLikes))
router.post('/post/add', jwtParseMiddleware, asyncHandler(likePost))
router.post('/post/check', jwtParseMiddleware, asyncHandler(checkPostLike))
router.post('/comment', jwtParseMiddleware, asyncHandler(likeComment))
router.post('/post/remove', jwtParseMiddleware, asyncHandler(removeLikePost))
router.post('/comment', jwtParseMiddleware, asyncHandler(removeLikeComment))
module.exports = router