import asyncHandler from 'express-async-handler';
import { Router } from 'express'
import { deleteUserHandler, signInHandler, signUpHandler } from '../handlers/userHandler';
const router = Router()
router.get('/signin', asyncHandler(signInHandler))
router.post('/signup', asyncHandler(signUpHandler))
router.delete('/', asyncHandler(deleteUserHandler))
module.exports = router

