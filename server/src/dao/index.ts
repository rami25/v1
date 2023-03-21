import { CommentDao } from "./CommentDao";
import { GroupDao } from "./GroupDao";
import { PostDao } from "./PostDao";
import { LikeDao } from "./LikeDao";
import { UserDao } from "./UserDao";
import { MongoDB } from "../dataStore/mongoDb";
import { connectDb } from "../../../shared"

export interface DataStore extends 
    UserDao, 
    PostDao, 
    GroupDao,
    LikeDao, 
    CommentDao 
{}

export let db: DataStore; 

export async  function initDb(): Promise<void> {
    connectDb()
    .then(() => db = new MongoDB())
    .catch((e) => console.log(e))
}