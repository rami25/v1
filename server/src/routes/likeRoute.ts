import asyncHandler from 'express-async-handler';
import { Router } from 'express'
import { jwtParseMiddleware } from '../middlewares/authMiddleware';
import { 
        likeComment,
        likePost,
        listCommentLikes,
        listPostLikes,
        removeLikeComment,
        removeLikePost 
} from '../handlers/likeHandler';
const router = Router()

router.get('/post', jwtParseMiddleware, asyncHandler(listPostLikes))
router.get('/comment', jwtParseMiddleware, asyncHandler(listCommentLikes))
router.post('/post', jwtParseMiddleware, asyncHandler(likePost))
router.post('/comment', jwtParseMiddleware, asyncHandler(likeComment))
router.delete('/post', jwtParseMiddleware, asyncHandler(removeLikePost))
router.delete('/comment', jwtParseMiddleware, asyncHandler(removeLikeComment))