import { 
        SignInRequest, 
        SignInResponse, 
        SignUpRequest,
        SignUpResponse
} from './../../../shared/src/APIs/api'
import { ERRORS } from './../../../shared/src/errors'
import { ExpressHandler } from "../types"
import { User } from '../../../shared/src/types/User'
import { db } from '../dao';
import { signJwt } from '../auth'
import { hashPassword } from '../env';

export const signInHandler : ExpressHandler<
SignInRequest,
SignInResponse
> = async (req, res) => {
    const { login , password } = req.body
    if(!login || !password){
        return res.status(400).send({error:'all fields are required'})
    }
    const existing = (await db.getUserByUsername(login)) || (await db.getUserByEmail(login))
    if(!existing || existing.password !== hashPassword(password)){
        return res.status(403).send({error: 'unauthorized'})
    }
    const jwt = signJwt({userId : existing._id!})
    return res.status(200).send({
        user: {
            _id: existing._id,
            userName: existing.userName,
            email: existing.email,
            description : existing.description,
            createdAt: existing.createdAt,
            posts: existing.posts,
            groups: existing.groups
        },
        jwt,
    })    
}

export const signUpHandler : ExpressHandler<
SignUpRequest,
SignUpResponse
> = async (req, res) => {
    const { userName , email, password ,description } = req.body
    if(!userName || !email || !password)
        return res.sendStatus(400)

    //TODO verified req.body and duplicated fields
    if (await db.getUserByEmail(email)) {
      return res.status(403).send({ error: ERRORS.DUPLICATE_EMAIL });
    }
    if (await db.getUserByUsername(userName)) {
      return res.status(403).send({ error: ERRORS.DUPLICATE_USERNAME });
    }
    const newUser: User = {
        userName,
        email,
        password: hashPassword(password),
        createdAt: new Date(),
        description
    }    
    const user = await db.createUser(newUser)
    const jwt = signJwt({userId : user._id!})
    res.status(200).send({
        user : {
            userName: user.userName,
            email: user.email,
            description: user.description,
            createdAt: user.createdAt
        },
        jwt,
    })
}

export const signOutUserHandler : ExpressHandler<{},{}> = async (req, res) => {

}

export const deleteUserHandler : ExpressHandler<{},{}> = async (req, res) => {
}
export const updateUserHandler : ExpressHandler<{},{}> = async (req, res) => {
}

export const resetPassword : ExpressHandler<{},{}> = async (req, res) => {
}
