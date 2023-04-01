import { Schema, model, Types} from 'mongoose';

export interface Like {
    _id?: Types.ObjectId;
    userId?: Types.ObjectId;
    likedAt : Date;
}

const LikeSchema = new Schema<Like>({
    userId : {
        type : Types.ObjectId,
        ref: 'UserM',
        required : true
    },
    likedAt : {
        type : Date,
        default : Date.now()
    }
})

const LikeM = model<Like>('LikeM', LikeSchema)
export default LikeM