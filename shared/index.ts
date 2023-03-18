require('dotenv').config()
import mongoose, { ConnectOptions } from 'mongoose'
const  DATABASE_URL  = process.env.DATABASE_URL!
export async function connectDb(){
    await mongoose.connect(DATABASE_URL , { useNewUrlParser : true} as ConnectOptions)
    const db = mongoose.connection
    db.on('error' , (error) => console.error(error))
    db.once('open', () => console.log('Conected to Database'))
}