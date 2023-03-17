import { InMemoryDataStore } from "../dataStore/memoryDb";
import { CommentDao } from "./CommentDao";
import { GroupDao } from "./GroupDao";
import { PostDao } from "./PostDao";
import { LikeDao } from "./LikeDao";
import { UserDao } from "./UserDao";

export interface DataStore extends 
    UserDao, 
    PostDao, 
    GroupDao,
    LikeDao, 
    CommentDao 
{}

export let db: DataStore; 

export async  function initDb() {
    db = new InMemoryDataStore()
}