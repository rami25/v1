import asyncHandler from 'express-async-handler';
import { Router } from "express";
import { listPostsHandler } from '../handlers/postHandler';
import { forgotPassword, resetPassword, signInHandler, signUpHandler } from '../handlers/authHandler';

const router = Router()
router.get('/sign-in', asyncHandler(signInHandler))
router.post('/sign-up', asyncHandler(signUpHandler))
router.post('/forgot-Password', asyncHandler(forgotPassword))
router.post('/reset-Password', asyncHandler(resetPassword))
router.get('/list-posts', asyncHandler(listPostsHandler))
module.exports = router

