import { Schema, model, Types} from 'mongoose';

export interface Post {
    id?: string;
    title: string;
    description: string;
    urls: string[];
    files: string[];
    userId?: string;
    postedAt: Date;
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