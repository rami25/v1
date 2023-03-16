import { Schema, model, Types} from 'mongoose';

export interface commentLike {
    userId?: string;
    commentId?: string;
}

const commentLikeSchema = new Schema<commentLike>({
    userId : {
        type : Types.ObjectId,
        required : true
    },
    commentId : {
        type : Types.ObjectId,
        required : true
    }
})

const commentLike = model<commentLike>('commentLike', commentLikeSchema)
export default commentLike
