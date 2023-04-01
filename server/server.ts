import express from 'express'
import { initDb } from './src/dao';
import { errHandler } from './src/middlewares/errorMiddleware';
import { loggerMiddleware } from './src/middlewares/loggerMiddleware';
import { config } from 'dotenv'
export async function createServer(logRequests = true) {
    await initDb()
    config()
    const app = express()
    app.use(express.json())
    if(logRequests)
        app.use(loggerMiddleware)



    app.use('/',        require('./src/routes/listRoute'))// for user or visitor OnInit
    app.use('/visitors',require('./src/routes/visitorRoute'))
    app.use('/users',   require('./src/routes/userRoute'))
    app.use('/posts',   require('./src/routes/postRoute'))
    app.use('/groups',  require('./src/routes/groupRoute'))
    app.use('/comments',require('./src/routes/commentRoute'))
    app.use('/likes',   require('./src/routes/likeRoute'))



  
    app.use(errHandler)
    // app.listen(3000 , () => {console.log("server started")})
    return app
}