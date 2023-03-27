import  asyncHandler from 'express-async-handler';
import { Router } from "express"
import { createPostHandler, deletePostHandler, listPostsHandler, updatePostHandler } from '../handlers/postHandler';
import { jwtParseMiddleware } from '../middlewares/authMiddleware';

const router = Router()
router.get('/list-posts' , jwtParseMiddleware, asyncHandler(listPostsHandler))
router.post('/create' , jwtParseMiddleware, asyncHandler( createPostHandler))
router.delete('/delete' , jwtParseMiddleware, asyncHandler( deletePostHandler))
router.patch('/update' , jwtParseMiddleware, asyncHandler(updatePostHandler))
module.exports = router

