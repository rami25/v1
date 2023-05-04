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
    usersIdDemandes?: Types.ObjectId[];// as an admin
    uIdDs? : number;
    usersIdRequests?: Types.ObjectId[];// as a user
    uIdRs? : number;
    acceptedRequests? : string[];
    notif? : number;
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
    usersIdDemandes : [{
        type : Types.ObjectId,
        ref: 'UserM'
    }],
    uIdDs : {
        type : Number,
        defautl : 0
    },
    usersIdRequests : [{
        type : Types.ObjectId,
        ref: 'UserM'
    }],
    uIdRs : {
        type : Number,
        defautl : 0
    },
    acceptedRequests : [{
        type : String
    }],
    notif : {
        type : Number,
        defautl : 0
    },
})

const GroupM = model<Group>('GroupM', groupeSchema)
export default GroupM