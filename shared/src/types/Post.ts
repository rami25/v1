import { Schema, model, Types} from 'mongoose';

export interface Post {
    _id?: Types.ObjectId;
    title: string;
    description: string;
    urls: string[];
    files: string[];
    userId?: Types.ObjectId;
    groupId?: Types.ObjectId;
    comments? : Types.ObjectId[];
    likes? : Types.ObjectId[];
    postedAt?: Date;
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
    comments :[{
        type : Types.ObjectId,
        ref: 'CommentM'
    }],
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

const PostM = model<Post>('PostM', postSchema)
export default PostM