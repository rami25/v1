import { ObjectId } from "../../../shared/src/connection";
import { 
        AcceptRequest,
        AcceptResponse,
        CreateGroupRequest,
        CreateGroupResponse,
        DeleteGroupRequest,
        DeleteGroupResponse,
        DeleteInvitationRequest,
        DeleteInvitationResponse,
        RejectRequest,
        RejectResponse,
        DeleteSendRequest,
        DeleteSendResponse,
        InviteToRequest,
        InviteToResponse,
        JoinGroupRequest,
        JoinGroupResponse,
        LeaveGroupRequest,
        LeaveGroupResponse,
        ListGroupsRequest,
        ListGroupsResponse,
        RemoveInvitationRequest,
        RemoveInvitationResponse,
        SendGroupRequest,
        SendGroupResponse,
        UpdateGroupRequest,
        UpdateGroupResponse,
        RejectUserRequest,
        RejectUserResponse,
        GetGroupRequest,
        GetGroupResponse
} from "../../../shared/src/APIs/api";
import { ERRORS } from "../../../shared/src/errors";
import { Group } from "../../../shared/src/types/Group";
import { db } from "../dao";
import { ExpressHandler, ExpressHandlerWithParams } from "../types";
import { RequestHandler } from "express";
import { getUserIdMiddleware } from "../middlewares/authMiddleware";

export const createGroup : ExpressHandler<// as an admin
CreateGroupRequest,
CreateGroupResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { groupName , description } = req.body
    if(!groupName || !description)
        return res.status(400).send({message:'all fields are required'})
    if(await db.getGroupByGroupName(groupName))    
      return res.status(403).send({ message: ERRORS.DUPLICATE_GROUP_NAME });

    const newGroup: Group = {
        groupName,
        description,
        userAdmin : userId,
        createdAt : new Date()
    }
    const group = await db.createGroup(newGroup)
    const user = await db.getUserById(userId)
    res.status(200).send({
        group : {
            _id : group._id,
            groupName: group.groupName,
            description: group.description,
            userAdmin: group.userAdmin,
            usersId: group.usersId,
            createdAt: group.createdAt
        },
        grps : user!.grps,
        message : 'group created successfully'
    })
}
export const deleteGroup : ExpressHandler<// as an admin
DeleteGroupRequest,
DeleteGroupResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { groupId } = req.body
    if(!groupId)
        return res.sendStatus(400)
    const group = await db.getGroup(new ObjectId(groupId), userId)
    if(group){
        await db.deleteGroup(groupId)    
        return res.status(200).send({message : 'Group deleted successfully!'})
    }
    res.status(403).send({error: ERRORS.GROUP_NOT_FOUND})
}

export const updateGroup : ExpressHandler<// as an admin
UpdateGroupRequest,
UpdateGroupResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { groupId , groupName , description } = req.body
    if(!groupId)
        return res.status(403).send({error: 'unauthorized'})
    if(!groupName && !description)    
        return res.status(403).send({message: 'minimum one field is required'})
    const group = await db.getGroup(new ObjectId(groupId),userId)    
    if(group){
        if(groupName) {
            if(await db.getGroupByGroupName(groupName))    
                return res.status(403).send({ error: ERRORS.DUPLICATE_GROUP_NAME });
            group.groupName = groupName
        }
        if(description) group.description = description
        await db.updateGroup(group)
        return res.status(200).send({message : 'group updated successfully!!!'})
    }
}

export const countGroups : ExpressHandler<{},{groups: number}> = async(req, res) =>{
    res.status(200).send({groups : await db.countGroups()})
}

export const getGroupHandler : RequestHandler = async (req,res) => {
    const groupId = req.params.id
    const group = await db.getGroup(new ObjectId(groupId))
    if(group)
        return res.status(200).send({group})
    res.sendStatus(404)
}

export const listUserGroups : RequestHandler = async (req,res) => {
    const userId = req.params.id
    const groups = await db.listUserGroups(new ObjectId(userId))
    if(groups)
        return res.status(200).send({groups})
    res.sendStatus(404)    
}
export const listGroupUsers : RequestHandler = async (req,res) => {
    const { groupId } = req.params
    const users = await db.listGroupUsers(new ObjectId(groupId))
    if(users)
        return res.status(200).send({users})
    res.sendStatus(404)    
}

export const listGroups : ExpressHandler<// for all (publics)
ListGroupsRequest,
ListGroupsResponse
> = async (req, res) => {
    const groups = await db.listGroups()
    res.status(200).send({groups})
}

export const listSharedGroups : ExpressHandler<{},
{
    groups : Group[];
}
> = async (req, res) => {
    const userId = res.locals.userId
    const groups = await db.listUserGroups(userId)
    res.status(200).send({groups})
}

export const getGroup : ExpressHandlerWithParams<{all : string},// only admin
GetGroupRequest,
GetGroupResponse
> = async (req, res) => {
    // const userId = res.locals.userId
    const { all } = req.params
    const { groupId } = req.body
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    let userId = undefined
    if(token)
        userId = await getUserIdMiddleware(token)
    if(userId) userId = new ObjectId(userId) 
    if(!userId)
        return res.status(403).send({error: 'unauthorized'})

    if(!groupId && (all === 'all')){
        const groups = await db.listAdminGroups(userId)
        if(groups){
            return res.status(200).send({groups})
        }
        return res.status(403).send({error: ERRORS.GROUP_NOT_FOUND})
    }
    if(groupId && !all){
        const adminGroup = await db.getGroup(new ObjectId(groupId), userId)    
        if(adminGroup){
            return res.status(200).send({adminGroup})
        }
        res.status(403).send({error: ERRORS.GROUP_NOT_FOUND})
    }
}

export const sendRequest : ExpressHandler<// as a user to a group
SendGroupRequest,
SendGroupResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { groupId } = req.body
    if(groupId){
        const group = await db.getGroup(new ObjectId(groupId))
        if(group){
            await db.sendGroupRequest(new ObjectId(groupId), userId)
            return res.status(200).send({message : 'request sent seccessfully'})
        }
        return res.status(403).send({error: ERRORS.GROUP_NOT_FOUND})
    }
    res.status(403).send({error: 'unauthorized'})
}

export const deleteSendRequest : ExpressHandler<//as u user for group
DeleteSendRequest,
DeleteSendResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { groupId } = req.body
    if(!groupId)
        return res.status(403).send({error: 'unauthorized'})
    const group = await db.getGroup(new ObjectId(groupId))
    if(group){
        await db.deleteSendGroupRequest(new ObjectId(groupId), userId)
        res.status(200).send({message : 'request canceled seccessfully'})
    }
    res.status(403).send({error: ERRORS.GROUP_NOT_FOUND})
}

export const rejectRequest : ExpressHandler<//as an admin
RejectRequest,
RejectResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { groupId , profileId } = req.body
    if(!profileId || !groupId)
        return res.status(403).send({error: 'unauthorized'})
    const group = await db.getGroup(new ObjectId(groupId), userId)
    if(group){
        await db.deleteUserRequest(new ObjectId(groupId), new ObjectId(profileId))
        return res.status(200).send({message : 'request deleted successfully'})
    }
    res.status(403).send({error: ERRORS.GROUP_NOT_FOUND})
}

export const acceptRequest : ExpressHandler<// as an admin
AcceptRequest,
AcceptResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { groupId , profileId } = req.body
    if(!profileId || !groupId)
        return res.status(403).send({error: 'unauthorized'})
    const group = await db.getGroup(new ObjectId(groupId), userId)
    if(group){
        await db.acceptUserRequest(new ObjectId(groupId) , new ObjectId(profileId))
        await db.notification(new ObjectId(groupId), new ObjectId(profileId), true)
        const user = await db.getUserById(new ObjectId(profileId))
        return res.status(200).send({ message : `${user!.userName} has been a member of ${group.groupName} group`})
    }
    res.status(403).send({error: ERRORS.GROUP_NOT_FOUND})
}

export const inviteTo : ExpressHandler<// as an admin
InviteToRequest,
InviteToResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { groupId , profileId} = req.body
    if(!groupId || !profileId)
        return res.status(403).send({error: 'unauthorized'})
    const group = await db.getGroupByUser(new ObjectId(groupId), userId)
    if(group){
        await db.inviteUserToGroup(new ObjectId(groupId) , new ObjectId(profileId))
        return res.status(200).send({message : 'user invited successfully'})
    }
    res.status(403).send({error: ERRORS.GROUP_NOT_FOUND})
}

export const removeInvitation : ExpressHandler<// as an admin
RemoveInvitationRequest,
RemoveInvitationResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { groupId , profileId } = req.body
    if(!groupId || !profileId)
        return res.status(403).send({error: 'All fields are required'})
    const group = await db.getGroup(new ObjectId(groupId), userId)
    if(group){
        await db.deleteInvitationUserToGroup(new ObjectId(groupId), new ObjectId(profileId))
        return res.status(200).send({message : 'request removed successfully'})
    }
    res.status(403).send({error: ERRORS.GROUP_NOT_FOUND})
}

export const deleteInvitation : ExpressHandler<// as a user
DeleteInvitationRequest,
DeleteInvitationResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { groupId } = req.body
    if(!groupId)
        return res.status(403).send({error: 'unauthorized'})
    const group = await db.getGroup(new ObjectId(groupId))
    if(group){
        await db.deleteGroupInvitation(new ObjectId(groupId),userId)
        res.sendStatus(200)
    }
    res.status(403).send({error: ERRORS.GROUP_NOT_FOUND})
}

export const joinGroup : ExpressHandler<// as a user
JoinGroupRequest,
JoinGroupResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { groupId } = req.body
    if(!groupId)
        return res.status(403).send({error: 'unauthorized'})
    const group = await db.getGroup(new ObjectId(groupId))
    if(group){
        await db.joinGroup(new ObjectId(groupId), userId)
        await db.notification(new ObjectId(groupId), userId, false)
        return res.status(200).send({message : `you have joined ${group.groupName} group`})
    }
    res.status(403).send({error: ERRORS.GROUP_NOT_FOUND})
}

export const leaveGroup : ExpressHandler<//as a user
LeaveGroupRequest,
LeaveGroupResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { groupId } = req.body
    if(!groupId)
        return res.status(403).send({error: 'unauthorized'})
    const group = await db.getGroup(new ObjectId(groupId))
    if(group){
        await db.leaveGroup(new ObjectId(groupId), userId)
        return res.status(200).send({message : `you leaved ${group.groupName} group`})
    }
    res.status(403).send({error: ERRORS.GROUP_NOT_FOUND})
}

export const rejectUser : ExpressHandler<//as a user
RejectUserRequest,
RejectUserResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { groupId , profileId } = req.body
    if(!groupId || !profileId)
        return res.status(403).send({error: 'unauthorized'})
    const group = await db.getGroup(new ObjectId(groupId), userId)
    if(group){
        await db.rejectUserFromGroup(new ObjectId(groupId), new ObjectId(profileId))
        return res.sendStatus(200)
    }
    res.status(403).send({error: ERRORS.GROUP_NOT_FOUND})
}