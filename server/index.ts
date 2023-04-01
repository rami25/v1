import { createServer } from './server'

(async () => {
    const server = await createServer()
    server.listen(3000 , () => {console.log("server started")})
})();