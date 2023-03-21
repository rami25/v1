import { 
        SignInRequest, 
        SignInResponse, 
        SignUpRequest,
        SignUpResponse
} from './../../../shared/src/APIs/api';
import { ExpressHandler } from "../types"
import { User } from '../../../shared/src/types/User';
import { db } from '../dao';

export const signInHandler : ExpressHandler<
SignInRequest,
SignInResponse
> = async (req, res) => {
    const { login , password } = req.body
    if(!login || !password){
        return res.status(400).send('all fields are required')
    }
    const existing = (await db.getUserByUsername(login)) || (await db.getUserByEmail(login))
    if(!existing || existing.password !== password){
        return res.status(403).send('not authorized')
    }
    return res.status(200).send({
        userName: existing.userName,
        email: existing.email,
        description : existing.description
    })    
}

export const signUpHandler : ExpressHandler<
SignUpRequest,
SignUpResponse
> = async (req, res) => {
    if(!req.body.userName || !req.body.email || !req.body.password)
        return res.sendStatus(400)
    const newUser: User = {
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        createdAt: Date.now()
    }    
    await db.createUser(newUser)
    res.sendStatus(200)
}

export const deleteUserHandler : ExpressHandler<{},{}> = async (req, res) => {

}