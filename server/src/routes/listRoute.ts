import asyncHandler from 'express-async-handler';
import { Router } from "express"
import { listPostsHandler } from '../handlers/postHandler';
import { listUserHandler } from '../handlers/authHandler';

const router = Router()
router.get('/list-posts', asyncHandler(listPostsHandler))
router.get('/list-users', asyncHandler(listUserHandler))
// router.get('/list-groups', asyncHandler(listGroupsHandler))
module.exports = router