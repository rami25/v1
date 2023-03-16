import { Schema, model, Types} from 'mongoose';

export interface postLike {
    userId?: string;
    postId?: string;
}

const postLikeSchema = new Schema<postLike>({
    userId : {
        type : Types.ObjectId,
        required : true
    },
    postId : {
        type : Types.ObjectId,
        required : true
    }
})

const postLike = model<postLike>('postLike', postLikeSchema)
export default postLike
