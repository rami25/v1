import asyncHandler from 'express-async-handler';
import { Router } from "express"
import { countPostsHandler, getPostHandler, listPostsHandler } from '../handlers/postHandler';
import { countUserHandler, listUserHandler, openUserHandler } from '../handlers/authHandler';
import { countGroups, getGroupHandler, listGroups, listUserGroups } from '../handlers/groupHandler';
import { countComments, listComments } from '../handlers/commentHandler';
import { countCommentLikes, countPostLikes, listCommentLikes, listPostLikes } from '../handlers/likeHandler';

const router = Router()
router.get('/user/:id', asyncHandler(openUserHandler))
router.get('/post/:id', asyncHandler(getPostHandler))
router.get('/group/:id', asyncHandler(getGroupHandler))
router.get('/list-posts/:profileId?/:groupId?', asyncHandler(listPostsHandler))
router.get('/count-posts', asyncHandler(countPostsHandler))
router.get('/list-users', asyncHandler(listUserHandler))
router.get('/count-users', asyncHandler(countUserHandler))
router.get('/list-user-groups/:id', asyncHandler(listUserGroups))
router.get('/list-groups', asyncHandler(listGroups))
router.get('/count-groups', asyncHandler(countGroups))
router.post('/list-comments', asyncHandler(listComments))
router.post('/count-comments', asyncHandler(countComments))
router.get('/list-commentLikes', asyncHandler(listCommentLikes))
router.get('/count-commentLikes', asyncHandler(countCommentLikes))
router.post('/list-postLikes', asyncHandler(listPostLikes))
router.get('/count-postLikes', asyncHandler(countPostLikes))
module.exports = router