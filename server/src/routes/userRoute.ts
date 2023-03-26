import asyncHandler from 'express-async-handler';
import { Router } from 'express'
import { 
        deleteUserHandler,
        resetPassword,
        signOutUserHandler, 
        updateUserHandler 
} from '../handlers/userHandler';
import { jwtParseMiddleware } from '../middlewares/authMiddleware';
const router = Router()
router.post('/signout', jwtParseMiddleware, asyncHandler(signOutUserHandler))
router.patch('/update', jwtParseMiddleware, asyncHandler(updateUserHandler))
router.delete('/delete', jwtParseMiddleware, asyncHandler(deleteUserHandler))
router.post('/resetPassword', jwtParseMiddleware, asyncHandler(resetPassword))
module.exports = router

