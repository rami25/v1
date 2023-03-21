import { verifyJwt } from "../auth";
import { db } from "../dao";
import { ExpressHandler } from "../types";

export const jwtParseMiddleware : ExpressHandler<any,any> = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if(!token){
        res.sendStatus(401)
    }
    try{
        const payload = verifyJwt(token!)
        const user = await db.getUserById(payload.userId)
        if(!user)
            throw 'user not found'
        next()
    }catch{
        return res.status(401).send({error : 'bad token'})
    }
}