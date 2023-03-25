import dotenv from 'dotenv'
import mongoose, { ConnectOptions } from 'mongoose'
dotenv.config()
const config = {
    useNewUrlParser: true
    // useUnifiedTopology:true
}
const  DATABASE_URL= process.env.DATABASE_URL!

export async function connectDb(): Promise<void> {
    const conn = await mongoose.connect(DATABASE_URL, config as ConnectOptions)
    conn.connection.on('error' , (error) => {console.error(error);process.exit(1)})
    conn.connection.once('open', () => console.log('Connected to Database'))
}

// export const ObjectId = mongoose.Types.ObjectId