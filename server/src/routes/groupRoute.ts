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
        removeInvitation,
        sendRequest,
        updateGroup, 
        rejectUser,
        getGroups,
        listSharedGroups
} from '../handlers/groupHandler';
const router = Router()

router.get('/list-shared-groups',jwtParseMiddleware, asyncHandler(listSharedGroups))// as an admin
router.get('/get-group/:all', asyncHandler(getGroups))// as an admin
router.post('/create', jwtParseMiddleware, asyncHandler(createGroup))// as an admin
router.post('/delete', jwtParseMiddleware, asyncHandler(deleteGroup))
router.patch('/update', jwtParseMiddleware, asyncHandler(updateGroup))//users , groupName , description
router.post('/send-request', jwtParseMiddleware, asyncHandler(sendRequest))// to the group
router.post('/delete-request', jwtParseMiddleware, asyncHandler(deleteSendRequest))// as user
router.post('/reject-request', jwtParseMiddleware, asyncHandler(rejectRequest))// of user to the group
router.post('/accept-request', jwtParseMiddleware, asyncHandler(acceptRequest))// as an admin
router.post('/invite', jwtParseMiddleware, asyncHandler(inviteTo))
router.post('/remove-invitation', jwtParseMiddleware, asyncHandler(removeInvitation))
router.post('/join', jwtParseMiddleware, asyncHandler(joinGroup))//accept demande as a user
router.post('/reject-invitation', jwtParseMiddleware, asyncHandler(deleteInvitation))//as a user
router.post('/leave-group', jwtParseMiddleware, asyncHandler(leaveGroup))
router.post('/reject-user', jwtParseMiddleware, asyncHandler(rejectUser))
module.exports = router