import asyncHandler from 'express-async-handler';
import { Router } from 'express'
import { jwtParseMiddleware } from '../middlewares/authMiddleware'
import { 
        createGroup,
        deleteGroup,
        inviteTo,
        joinGroup,
        listGroup,
        sendRequest,
        updateGroup 
} from '../handlers/groupHandler';
const router = Router()

router.post('/create', jwtParseMiddleware, asyncHandler(createGroup))
router.delete('/delete', jwtParseMiddleware, asyncHandler(deleteGroup))
router.get('/', jwtParseMiddleware, asyncHandler(listGroup))
router.patch('/update', jwtParseMiddleware, asyncHandler(updateGroup))
router.post('/request', jwtParseMiddleware, asyncHandler(sendRequest))
router.post('/invite', jwtParseMiddleware, asyncHandler(inviteTo))
router.post('/join', jwtParseMiddleware, asyncHandler(joinGroup))
module.exports = router