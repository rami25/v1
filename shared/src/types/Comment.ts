import { Schema, model, Types} from 'mongoose';

export interface Comment {
    _id?: Types.ObjectId;
    userId?: Types.ObjectId;
    userName? : string;
    content : string;
    likes? : Types.ObjectId[];
    lks? : number;
    commentedAt: Date;
}

const commentSchema = new Schema<Comment>({
    userId : {
        type : Types.ObjectId,
        ref: 'UserM',
        required : true
    },
    userName : {
        type : String,
        required : true
    },
    content : {
        type : String,
        required : true
    },
    likes : [{
        type : Types.ObjectId,
        ref : 'LikeM'
    }],
    lks : {
        type : Number,
        default : 0
    },
    commentedAt : {
        type : Date,
        default : Date.now()
    }
})

const CommentM = model<Comment>('CommentM', commentSchema)
export default CommentM