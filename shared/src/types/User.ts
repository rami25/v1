import { Schema, model, Types } from 'mongoose';

export interface User {
    _id?: Types.ObjectId;
    userName: string;
    email: string;
    password: string;
    createdAt: Date;
    description?: string;
    posts?: Types.ObjectId[];
    psts? : number;
    groups?: Types.ObjectId[];
    grps? : number;
    groupsIdInvitations? : Types.ObjectId[];
    groupsIdRequests? : Types.ObjectId[];
    acceptedRequests? : string[];
    resetPasswordToken? : string;
    resetPasswordExpires?: number;
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
    posts : [{
        type : Types.ObjectId,
        ref : 'PostM'
    }],
    groups : [{
        type : Types.ObjectId,
        ref : 'GroupM'
    }],
    psts : {
        type : Number,
        default : 0
    },
    grps : {
        type : Number,
        default : 0
    },
    groupsIdInvitations : [{
        type : Types.ObjectId,
        ref : 'GroupM'
    }],
    groupsIdRequests : [{
        type : Types.ObjectId,
        ref : 'GroupM'
    }],
    acceptedRequests : [{
        type : String
    }],
    //reset password
    resetPasswordToken : {
        type : String
    },
    resetPasswordExpires : {
        type : Date
    }
})

const UserM = model<User>('UserM', userSchema)
export default UserM