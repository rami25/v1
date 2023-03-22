import  asyncHandler from 'express-async-handler';
import { Router } from "express"
import { createPostHandler, deletePostHandler, listPostsHandler, updatePostHandler } from '../handlers/postHandler';
import { jwtParseMiddleware } from '../middlewares/authMiddleware';

const router = Router()
router.get('/' , jwtParseMiddleware, asyncHandler(listPostsHandler))
router.post('/' , jwtParseMiddleware, asyncHandler( createPostHandler))
router.delete('/' , jwtParseMiddleware, asyncHandler( deletePostHandler))
router.patch('/' , jwtParseMiddleware, asyncHandler(updatePostHandler))
module.exports = router

