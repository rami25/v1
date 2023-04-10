import asyncHandler from 'express-async-handler';
import { Router } from 'express'
import { 
        deleteUserHandler,
        getUserHandler,
        signOutUserHandler, 
        updateUserHandler 
} from '../handlers/authHandler';
import { jwtParseMiddleware } from '../middlewares/authMiddleware';
const router = Router()
router.get('/get-by-id', jwtParseMiddleware, asyncHandler(getUserHandler))
router.post('/sign-out', jwtParseMiddleware, asyncHandler(signOutUserHandler))
router.patch('/update-user', jwtParseMiddleware, asyncHandler(updateUserHandler))
router.delete('/delete-user', jwtParseMiddleware, asyncHandler(deleteUserHandler))
module.exports = router

