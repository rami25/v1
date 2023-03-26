import asyncHandler from 'express-async-handler';
import { Router } from 'express'
import { jwtParseMiddleware } from '../middlewares/authMiddleware'
import { 
        addComment,
        deleteComment,
        listComment,
        updateComment 
} from '../handlers/commentHandler';
const router = Router()

router.get('/', jwtParseMiddleware, asyncHandler(listComment))
router.post('/', jwtParseMiddleware, asyncHandler(addComment))
router.patch('/', jwtParseMiddleware, asyncHandler(updateComment))
router.delete('/', jwtParseMiddleware, asyncHandler(deleteComment))