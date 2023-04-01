import { RequestHandler } from 'express';
export const loggerMiddleware : RequestHandler = (req, _, next) => {
    console.log("req meth : ", req.method , " -req path : " , req.path , " -req body : " , req.body)
    next()
}
