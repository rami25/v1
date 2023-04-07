import express from 'express'
import { initDb } from './src/dao';
import { errHandler } from './src/middlewares/errorMiddleware';
import { loggerMiddleware } from './src/middlewares/loggerMiddleware';
import { config } from 'dotenv'
const cors = require('cors')
export async function createServer(logRequests = true) {
    await initDb()
    config()
    const app = express()
    app.use(cors())
    app.use(express.json())
    if(logRequests)
        app.use(loggerMiddleware)



    app.use('/',        require('./src/routes/listRoute'))// for user or visitor OnInit
    app.use('/api/v1/visitors',require('./src/routes/visitorRoute'))
    app.use('/api/v1/users',   require('./src/routes/userRoute'))
    app.use('/api/v1/posts',   require('./src/routes/postRoute'))
    app.use('/api/v1/groups',  require('./src/routes/groupRoute'))
    app.use('/api/v1/comments',require('./src/routes/commentRoute'))
    app.use('/api/v1/likes',   require('./src/routes/likeRoute'))



  
    app.use(errHandler)
    // app.listen(3000 , () => {console.log("server started")})
    return app
}