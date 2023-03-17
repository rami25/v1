import { Schema, model, Types} from 'mongoose';
import { Like } from './Like';

export interface Comment {
    id?: string;
    userId?: string;
    content : string;
    likes : Like[];
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

const Comment = model<Comment>('Comment', commentSchema)
export default Comment