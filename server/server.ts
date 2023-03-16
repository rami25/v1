import express, { ErrorRequestHandler } from 'express'
const app = express()
app.use(express.json())
app.use((req, res, next) => {
    console.log("req meth : ", req.method , " -request path : " , req.path , " -body : " , req.body)
    next()
})
app.use('/posts', require('./src/routes/postRoute'))

const errHandler : ErrorRequestHandler = (err, req, res, next) => {
    console.error('Uncaught exception', err)
    return res.status(500).send('Oops, an expected error occured')
}
app.use(errHandler)
app.listen(3000 , () => {console.log("server started")})