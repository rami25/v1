import asyncHandler from 'express-async-handler';
import { Router } from 'express'
import { jwtParseMiddleware } from '../middlewares/authMiddleware'
import { 
        acceptRequest,
        createGroup,
        deleteGroup,
        deleteInvitation,
        rejectRequest,
        deleteSendRequest,
        inviteTo,
        joinGroup,
        leaveGroup,
        listGroups,
        removeInvitation,
        sendRequest,
        updateGroup, 
        rejectUser,
        getGroup
} from '../handlers/groupHandler';
const router = Router()

router.get('/', asyncHandler(listGroups))//groupName , description , users
router.get('/get',jwtParseMiddleware, asyncHandler(getGroup))// as an admin
router.post('/create', jwtParseMiddleware, asyncHandler(createGroup))// as an admin
router.delete('/delete', jwtParseMiddleware, asyncHandler(deleteGroup))
router.patch('/update', jwtParseMiddleware, asyncHandler(updateGroup))//users , groupName , description
router.post('/send-request', jwtParseMiddleware, asyncHandler(sendRequest))// to the group
router.delete('/delete-request', jwtParseMiddleware, asyncHandler(deleteSendRequest))// as user
router.delete('/reject-request', jwtParseMiddleware, asyncHandler(rejectRequest))// of user to the group
router.post('/accept-request', jwtParseMiddleware, asyncHandler(acceptRequest))
router.post('/invite', jwtParseMiddleware, asyncHandler(inviteTo))
router.delete('/remove-invitation', jwtParseMiddleware, asyncHandler(removeInvitation))
router.post('/join', jwtParseMiddleware, asyncHandler(joinGroup))//accept demande
router.delete('/reject-invitation', jwtParseMiddleware, asyncHandler(deleteInvitation))//as a user
router.delete('/leave-group', jwtParseMiddleware, asyncHandler(leaveGroup))
router.delete('/reject-user', jwtParseMiddleware, asyncHandler(rejectUser))
module.exports = router