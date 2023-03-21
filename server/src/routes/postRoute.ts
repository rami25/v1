import  asyncHandler from 'express-async-handler';
import { Router } from "express"
import { createPostHandler, deletePostHandler, listPostsHandler, updatePostHandler } from '../handlers/postHandler';

const router = Router()
router.get('/' , asyncHandler(listPostsHandler))
router.post('/' , asyncHandler( createPostHandler))
router.delete('/' , asyncHandler( deletePostHandler))
router.patch('/' , asyncHandler(updatePostHandler))
module.exports = router

