import asyncHandler from 'express-async-handler';
import { Router } from "express"
import { countPostsHandler, listPostsHandler } from '../handlers/postHandler';
import { countUserHandler, listUserHandler } from '../handlers/authHandler';
import { countGroups, listGroups } from '../handlers/groupHandler';
import { countComments, listComments } from '../handlers/commentHandler';
import { countCommentLikes, countPostLikes, listCommentLikes, listPostLikes } from '../handlers/likeHandler';

const router = Router()
router.get('/list-posts', asyncHandler(listPostsHandler))
router.get('/count-posts', asyncHandler(countPostsHandler))
router.get('/list-users', asyncHandler(listUserHandler))
router.get('/count-users', asyncHandler(countUserHandler))
router.get('/list-groups', asyncHandler(listGroups))
router.get('/count-groups', asyncHandler(countGroups))
router.get('/list-comments', asyncHandler(listComments))
router.get('/count-comments', asyncHandler(countComments))
router.get('/list-commentLikes', asyncHandler(listCommentLikes))
router.get('/count-commentLikes', asyncHandler(countCommentLikes))
router.get('/list-postLikes', asyncHandler(listPostLikes))
router.get('/count-postLikes', asyncHandler(countPostLikes))
module.exports = router