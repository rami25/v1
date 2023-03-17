import { Schema, model, Types} from 'mongoose';

export interface User {
    id?: string;
    userName: string;
    email: string;
    password: string;
    createdAt: Date;
    posts: string[];
    friends: string[];
    groups: string[];
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
    posts : {
        type : [Types.ObjectId]
    },
    friends : {
        type : [Types.ObjectId]
    },
    groups : {
        type : [Types.ObjectId]
    }
})

const UserM = model<User>('UserM', userSchema)
export default UserM