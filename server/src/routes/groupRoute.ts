import asyncHandler from 'express-async-handler';
import { Router } from 'express'
import { jwtParseMiddleware } from '../middlewares/authMiddleware'
import { 
        acceptRequest,
        createGroup,
        deleteGroup,
        deleteInvitation,
        deleteRequest,
        deleteSendRequest,
        inviteTo,
        joinGroup,
        leaveGroup,
        listGroups,
        removeInvitation,
        sendRequest,
        updateGroup 
} from '../handlers/groupHandler';
const router = Router()

router.post('/create', jwtParseMiddleware, asyncHandler(createGroup))
router.delete('/delete', jwtParseMiddleware, asyncHandler(deleteGroup))
router.get('/', asyncHandler(listGroups))//groupName , description , users
router.patch('/update', jwtParseMiddleware, asyncHandler(updateGroup))//users , groupName , description
router.post('/send-request', jwtParseMiddleware, asyncHandler(sendRequest))// to the group
router.delete('/delete-send-request', jwtParseMiddleware, asyncHandler(deleteSendRequest))// as user
router.delete('/delete-request', jwtParseMiddleware, asyncHandler(deleteRequest))// of user to the group
router.post('/accept-request', jwtParseMiddleware, asyncHandler(acceptRequest))
router.post('/invite', jwtParseMiddleware, asyncHandler(inviteTo))
router.delete('/remove-invitation', jwtParseMiddleware, asyncHandler(removeInvitation))
router.post('/join', jwtParseMiddleware, asyncHandler(joinGroup))//accept demande
router.delete('/delete-invitation', jwtParseMiddleware, asyncHandler(deleteInvitation))//as a user
router.delete('/leave-group', jwtParseMiddleware, asyncHandler(leaveGroup))
module.exports = router