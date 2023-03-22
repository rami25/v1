import express from 'express'
import { initDb } from './src/dao';
import { errHandler } from './src/middlewares/errorMiddleware';
import { loggerMiddleware } from './src/middlewares/loggerMiddleware';
import dotenv from 'dotenv'
(async() => {
    await initDb()
    dotenv.config()
    const app = express()
    app.use(express.json())
    app.use(loggerMiddleware)



    app.use('/visitor', require('./src/routes/visitorRoute'))
    app.use('/users', require('./src/routes/userRoute'))
    app.use('/posts', require('./src/routes/postRoute'))



  
    app.use(errHandler)
    app.listen(3000 , () => {console.log("server started")})
})();