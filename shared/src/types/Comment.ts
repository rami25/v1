import { Schema, model, Types} from 'mongoose';

export interface Comment {
    _id?: Types.ObjectId;
    userId?: Types.ObjectId;
    content : string;
    likes? : Types.ObjectId[];
    commentedAt: Date;
}

const commentSchema = new Schema<Comment>({
    userId : {
        type : Types.ObjectId,
        required : true
    },
    content : {
        type : String,
        required : true
    },
    likes : {
        type : [Types.ObjectId]
    },
    commentedAt : {
        type : Date,
        default : Date.now()
    }
})

const CommentM = model<Comment>('CommentM', commentSchema)
export default CommentM