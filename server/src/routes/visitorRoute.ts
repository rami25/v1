import asyncHandler from 'express-async-handler';
import { Router } from "express";
import { listPostsHandler } from '../handlers/postHandler';
import { signInHandler, signUpHandler } from '../handlers/userHandler';

const router = Router()
router.get('/signin', asyncHandler(signInHandler))
router.post('/signup', asyncHandler(signUpHandler))
router.get('/posts', asyncHandler(listPostsHandler))
module.exports = router

