import asyncHandler from 'express-async-handler';
import { Router } from 'express'
import { jwtParseMiddleware } from '../middlewares/authMiddleware'
import { 
        addComment,
        countComments,
        deleteComment,
        listComments,
        updateComment 
} from '../handlers/commentHandler';
const router = Router()

router.get('/list-comments', asyncHandler(listComments))
router.get('/count-comments', asyncHandler(countComments))
router.post('/create', jwtParseMiddleware, asyncHandler(addComment))
router.patch('/update', jwtParseMiddleware, asyncHandler(updateComment))
router.delete('/delete', jwtParseMiddleware, asyncHandler(deleteComment))
module.exports = router