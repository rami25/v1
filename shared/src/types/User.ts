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
    //interact
    groupsIdDemandes? : Types.ObjectId[];// as a User
    gIdDs? : number;
    groupsIdRequests? : Types.ObjectId[];//as an admin
    gIdRs? : number;
    acceptedRequests? : string[];
    notif? : number;
    //reset password
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
    groupsIdDemandes : [{
        type : Types.ObjectId,
        ref : 'GroupM'
    }],
    gIdDs : {
        type : Number,
        default : 0
    },
    groupsIdRequests : [{
        type : Types.ObjectId,
        ref : 'GroupM'
    }],
    gIdRs : {
        type : Number,
        default : 0
    },
    acceptedRequests : [{
        type : String
    }],
    notif : {
        type : Number,
        default : 0
    },
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