import express, { ErrorRequestHandler, RequestHandler } from 'express'
import { createPostHandler, deletePostHandler, listPostsHandler } from './handlers/postHandler'
import asyncHandler from 'express-async-handler'
const app = express()

app.use(express.json())


const requestMiddleWare : RequestHandler = (req, res, next) => {
    console.log("req meth : ", req.method , " -request path : " , req.path , " -body : " , req.body)
    res.status(200)
    next()
}

app.use(requestMiddleWare)

app.get('/posts' , asyncHandler(listPostsHandler))
app.post('/posts' , asyncHandler( createPostHandler))
app.delete('/posts' , asyncHandler( deletePostHandler))

const errHandler : ErrorRequestHandler = (err, req, res, next) => {
    console.error('Uncaught exception', err)
    return res.status(500).send('Oops, an expected error occured')
}
app.use(errHandler)
app.listen(3000 , () => {console.log("server started")})