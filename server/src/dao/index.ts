import { InMemoryDataStore } from "../dataStore/memoryDb";
import { CommentDao } from "./CommentDao";
import { GroupDao } from "./GroupDao";
import { PostDao } from "./PostDao";
import { LikeDao } from "./LikeDao";
import { UserDao } from "./UserDao";
import { connectDb } from "../../../shared"

export interface DataStore extends 
    UserDao, 
    PostDao, 
    GroupDao,
    LikeDao, 
    CommentDao 
{}

export let db: DataStore; 

export async  function initDb() {
    await connectDb().then(() => console.log('connected')).catch((err) => console.log('error'))
    db = new InMemoryDataStore()
}