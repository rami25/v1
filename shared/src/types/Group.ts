import { Schema, model, Types} from 'mongoose';

export interface Group {
    _id?: Types.ObjectId;
    groupName? : string;
    description? : string;
    usersId? : Types.ObjectId[];
    users? : number;
    userAdmin? : Types.ObjectId;
    admin? : string;
    posts? : Types.ObjectId[];
    psts? : number;
    createdAt : Date;
    usersIdInvitations?: Types.ObjectId[];
    usersIdRequests?: Types.ObjectId[];
    acceptedRequests? : string[];
}

const groupeSchema = new Schema<Group>({
    groupName : {
        type : String,
        required : true
    },
    description : {
        type : String
    },
    usersId : [{
        type : Types.ObjectId,
        ref: 'UserM'
    }],
    users : {
        type : Number,
        default : 0
    },
    userAdmin : {
        type : Types.ObjectId,
        ref: 'UserM',
        required : true
    },
    admin : {
        type : String
    },
    posts : [{
        type : Types.ObjectId,
        ref: 'PostM'
    }],
    psts : {
        type : Number,
        default : 0
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    usersIdInvitations : [{
        type : Types.ObjectId,
        ref: 'UserM'
    }],
    usersIdRequests : [{
        type : Types.ObjectId,
        ref: 'UserM'
    }],
    acceptedRequests : [{
        type : String
    }]
})

const GroupM = model<Group>('GroupM', groupeSchema)
export default GroupM