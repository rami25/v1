import asyncHandler from 'express-async-handler';
import { Router } from 'express'
import { deleteUserHandler, signOutUserHandler, updateUserHandler } from '../handlers/userHandler';
import { jwtParseMiddleware } from '../middlewares/authMiddleware';
const router = Router()
router.post('/', jwtParseMiddleware, asyncHandler(signOutUserHandler))
router.patch('/', jwtParseMiddleware, asyncHandler(updateUserHandler))
router.delete('/', jwtParseMiddleware, asyncHandler(deleteUserHandler))
module.exports = router

