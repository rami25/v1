import { TokenExpiredError, VerifyErrors } from "jsonwebtoken";
import { ERRORS } from "../../../shared/src/errors";
import { verifyJwt } from "../auth";
import { db } from "../dao";
import { ExpressHandler, JwtObject } from "../types";

export const jwtParseMiddleware: ExpressHandler<any,any> = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        return res.sendStatus(401)
    }

    let payload: JwtObject;
    try {
      payload = verifyJwt(token);
    } catch(e) {
      const verifyErr = e as VerifyErrors;
      if (verifyErr instanceof TokenExpiredError) {
        return res.status(401).send({ error: ERRORS.TOKEN_EXPIRED });
      }
      return res.status(401).send({ error: ERRORS.BAD_TOKEN });
    }
    const user = await db.getUserById(payload.userId);
    if (!user) {
      return res.status(401).send({ error: ERRORS.USER_NOT_FOUND })
    }
    res.locals.userId = user._id
    next()
}