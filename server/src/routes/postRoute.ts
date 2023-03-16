import  asyncHandler from 'express-async-handler';
import { Router } from "express"
import { createPostHandler, deletePostHandler, listPostsHandler } from '../handlers/postHandler';

const router = Router()
router.get('/' , asyncHandler(listPostsHandler))
router.post('/' , asyncHandler( createPostHandler))
router.delete('/' , asyncHandler( deletePostHandler))
module.exports = router

