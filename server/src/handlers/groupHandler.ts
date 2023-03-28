import { ObjectId } from "../../../shared";
import { 
        AcceptRequest,
        AcceptResponse,
        CreateGroupRequest,
        CreateGroupResponse,
        DeleteGroupRequest,
        DeleteGroupResponse,
        DeleteInvitationRequest,
        DeleteInvitationResponse,
        DeleteRequest,
        DeleteResponse,
        DeleteSendRequest,
        DeleteSendResponse,
        InviteToRequest,
        InviteToResponse,
        JoinGroupRequest,
        JoinGroupResponse,
        LeaveGroupRequest,
        LeaveGroupResponse,
        ListGroupRequest,
        ListGroupResponse,
        RemoveInvitationRequest,
        RemoveInvitationResponse,
        SendGroupRequest,
        SendGroupResponse,
        UpdateGroupRequest,
        UpdateGroupResponse
} from "../../../shared/src/APIs/api";
import { ERRORS } from "../../../shared/src/errors";
import { Group } from "../../../shared/src/types/Group";
import { db } from "../dao";
import { ExpressHandler } from "../types";

export const createGroup : ExpressHandler<// as an admin
CreateGroupRequest,
CreateGroupResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { groupName , description } = req.body
    if(!groupName || !description || !userId)
        return res.status(400).send({error:'all fields are required'})
    if(await db.getGroupByGroupName(groupName))    
      return res.status(403).send({ error: ERRORS.DUPLICATE_GROUP_NAME });

    const newGroup: Group = {
        groupName,
        description,
        userAdmin : userId,
        createdAt : new Date()
    }
    const group = await db.createGroup(newGroup)
    res.status(200).send({
        group : {
            _id : group._id,
            groupName: group.groupName,
            description: group.description,
            userAdmin: group.userAdmin,
            usersId: group.usersId,
            createdAt: group.createdAt
        }
    })
}
export const deleteGroup : ExpressHandler<// as an admin
DeleteGroupRequest,
DeleteGroupResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { groupId } = req.body
    if(!userId || !groupId)
        return res.sendStatus(400)
    const group = await db.getGroup(new ObjectId(groupId), userId)
    if(group){
        await db.deleteGroup(groupId)    
        return res.sendStatus(200)
    }
    res.status(403).send({error: ERRORS.GROUP_NOT_FOUND})
}

export const updateGroup : ExpressHandler<// as an admin
UpdateGroupRequest,
UpdateGroupResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { groupId , groupName , description } = req.body
    if(!userId || !groupId)
        return res.status(403).send({error: 'unauthorized'})
    if(!groupName && !description)    
        return res.status(403).send({error: 'minimum one field is required'})
    const group = await db.getGroup(new ObjectId(groupId),userId)    
    if(group){
        if(groupName) group.groupName = groupName
        if(description) group.description = description
        await db.updateGroup(group)
        return res.sendStatus(200)
    }

    res.status(403).send({error: ERRORS.GROUP_NOT_FOUND})
}
export const listGroups : ExpressHandler<
ListGroupRequest,
ListGroupResponse
> = async (req, res) => {
    const groups = await db.listGroups()
    res.status(200).send({groups})
}
export const sendRequest : ExpressHandler<// as a user to a group
SendGroupRequest,
SendGroupResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { groupId } = req.body
    if(userId && groupId){
        const group = await db.getGroup(new ObjectId(groupId))
        if(group){
            await db.sendGroupRequest(new ObjectId(groupId), userId)
            return res.sendStatus(200)
        }
        res.status(403).send({error: ERRORS.GROUP_NOT_FOUND})
    }
    res.status(403).send({error: 'unauthorized'})
}

export const deleteSendRequest : ExpressHandler<//as u user for group
DeleteSendRequest,
DeleteSendResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { groupId } = req.body
    if(!userId || !groupId)
        return res.status(403).send({error: 'unauthorized'})
    const group = await db.getGroup(new ObjectId(groupId))
    if(group){
        await db.deleteSendGroupRequest(new ObjectId(groupId), userId)
        res.sendStatus(200)
    }
    res.status(403).send({error: ERRORS.GROUP_NOT_FOUND})
}

export const deleteRequest : ExpressHandler<//as an admin
DeleteRequest,
DeleteResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { groupId , profileId } = req.body
    if(!userId || !profileId)
        return res.status(403).send({error: 'unauthorized'})
    const group = await db.getGroup(new ObjectId(groupId), userId)
    if(group){
        await db.deleteUserRequest(new ObjectId(groupId), new ObjectId(profileId))
        return res.sendStatus(200)
    }
    res.status(403).send({error: ERRORS.GROUP_NOT_FOUND})
}

export const acceptRequest : ExpressHandler<// as an admin
AcceptRequest,
AcceptResponse
> = async (req, res) => {

}

export const inviteTo : ExpressHandler<// as an admin
InviteToRequest,
InviteToResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { groupId , profileId} = req.body
    if(!userId || !profileId)
        return res.status(403).send({error: 'unauthorized'})
    const group = await db.getGroup(new ObjectId(groupId), userId)
    if(group){
        await await db.inviteUserToGroup(new ObjectId(groupId) , new ObjectId(profileId))
        return res.sendStatus(200)
    }
    res.status(403).send({error: ERRORS.GROUP_NOT_FOUND})
}

export const removeInvitation : ExpressHandler<// as an admin
RemoveInvitationRequest,
RemoveInvitationResponse
> = async (req, res) => {

}

export const deleteInvitation : ExpressHandler<// as an admin
DeleteInvitationRequest,
DeleteInvitationResponse
> = async (req, res) => {

}

export const joinGroup : ExpressHandler<// as a user
JoinGroupRequest,
JoinGroupResponse
> = async (req, res) => {

}

export const leaveGroup : ExpressHandler<//as a user
LeaveGroupRequest,
LeaveGroupResponse
> = async (req, res) => {

}