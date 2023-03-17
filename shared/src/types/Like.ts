import { Schema, model, Types} from 'mongoose';

export interface Like {
    userId?: string;
    likedAt : Date;
}

const LikeSchema = new Schema<Like>({
    userId : {
        type : Types.ObjectId,
        required : true
    },
    likedAt : {
        type : Date,
        default : Date.now()
    }
})

const Like = model<Like>('postLike', LikeSchema)
export default Like