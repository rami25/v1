import { CommentDao } from "./CommentDao";
import { GroupDao } from "./GroupDao";
import { PostDao } from "./PostDao";
import { PostLikeDao } from "./PostLikeDao";
import { UserDao } from "./UserDao";

export interface DataStore extends 
    UserDao, 
    PostDao, 
    CommentDao, 
    GroupDao, 
    PostLikeDao, 
    CommentDao 
{}