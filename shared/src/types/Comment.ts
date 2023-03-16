import { Schema, model, Types} from 'mongoose';

export interface Comment {
    id?: string;
    userId?: string;
    postId?: string;
    content : string;
    commentedAt: Date;
}

const commentSchema = new Schema<Comment>({
    userId : {
        type : Types.ObjectId,
        required : true
    },
    postId : {
        type : Types.ObjectId,
        required : true
    },
    content : {
        type : String,
        required : true
    },
    commentedAt : {
        type : Date,
        default : Date.now()
    }
})

const Comment = model<Comment>('Comment', commentSchema)
export default Comment