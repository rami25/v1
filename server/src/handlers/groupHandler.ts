import { 
        CreateGroupRequest,
        CreateGroupResponse,
        DeleteGroupRequest,
        DeleteGroupResponse,
        InviteToRequest,
        InviteToResponse,
        JoinGroupRequest,
        JoinGroupResponse,
        ListGroupRequest,
        ListGroupResponse,
        SendGroupRequest,
        SendGroupResponse,
        UpdateGroupRequest,
        UpdateGroupResponse
} from "../../../shared/src/APIs/api";
import { ERRORS } from "../../../shared/src/errors";
import { Group } from "../../../shared/src/types/Group";
import { db } from "../dao";
import { ExpressHandler } from "../types";

export const createGroup : ExpressHandler<
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
export const deleteGroup : ExpressHandler<
DeleteGroupRequest,
DeleteGroupResponse
> = async (req, res) => {

}
export const updateGroup : ExpressHandler<
UpdateGroupRequest,
UpdateGroupResponse
> = async (req, res) => {

}
export const listGroup : ExpressHandler<
ListGroupRequest,
ListGroupResponse
> = async (req, res) => {

}
export const sendRequest : ExpressHandler<
SendGroupRequest,
SendGroupResponse
> = async (req, res) => {

}
export const inviteTo : ExpressHandler<
InviteToRequest,
InviteToResponse
> = async (req, res) => {

}
export const joinGroup : ExpressHandler<
JoinGroupRequest,
JoinGroupResponse
> = async (req, res) => {

}