import { Schema, model, Types} from 'mongoose';
import { Like } from './Like';
import { Comment } from './Comment';

export interface Post {
    id?: Types.ObjectId;
    title: string;
    description: string;
    urls: string[];
    files: string[];
    userId?: Types.ObjectId;
    groupId?: Types.ObjectId;
    comments? : Comment[];
    likes? : Like[];
    postedAt?: number;
    privacy: string;
}

const postSchema = new Schema<Post>({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String
    },
    urls : {
        type : [String]
    },
    files : {
        type : [String]
    },
    userId : {
        type : Types.ObjectId,
        required : true
    },
    groupId : {
        type : Types.ObjectId
    },
    comments : {
        type : [Types.ObjectId]
    },
    likes : {
        type : [Types.ObjectId]
    },
    postedAt : {
        type : Date,
        default : Date.now()
    },
    privacy : {
        type : String,
        required : true
    }

})

const Post = model<Post>('Post', postSchema)
export default Post