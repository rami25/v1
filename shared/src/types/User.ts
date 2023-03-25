import { Schema, model, Types } from 'mongoose';

export interface User {
    _id?: Types.ObjectId;
    userName: string;
    email: string;
    password: string;
    createdAt: Date;
    description?: string;
    posts?: Types.ObjectId[];
    groups?: Types.ObjectId[];
}

const userSchema = new Schema<User>({
    userName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    description : {
        type : String
    },
    posts : {
        type : [Types.ObjectId]
    },
    groups : {
        type : [Types.ObjectId]
    }
})

const UserM = model<User>('UserM', userSchema)
export default UserM