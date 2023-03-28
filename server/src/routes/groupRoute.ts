import asyncHandler from 'express-async-handler';
import { Router } from 'express'
import { jwtParseMiddleware } from '../middlewares/authMiddleware'
import { 
        createGroup,
        deleteGroup,
        deleteRequest,
        deleteSendRequest,
        inviteTo,
        joinGroup,
        leaveGroup,
        listGroups,
        sendRequest,
        updateGroup 
} from '../handlers/groupHandler';
const router = Router()

router.post('/create', jwtParseMiddleware, asyncHandler(createGroup))
router.delete('/delete', jwtParseMiddleware, asyncHandler(deleteGroup))
router.get('/', asyncHandler(listGroups))//groupName , description , users
router.patch('/update', jwtParseMiddleware, asyncHandler(updateGroup))//users , groupName , description
router.post('/send-request', jwtParseMiddleware, asyncHandler(sendRequest))// to the group
router.delete('/delete-request', jwtParseMiddleware, asyncHandler(deleteRequest))// to the group
router.delete('/delete-send-request', jwtParseMiddleware, asyncHandler(deleteSendRequest))// as user
router.post('/invite', jwtParseMiddleware, asyncHandler(inviteTo))
router.post('/join', jwtParseMiddleware, asyncHandler(joinGroup))//accept demande
router.post('/leave', jwtParseMiddleware, asyncHandler(leaveGroup))
module.exports = router