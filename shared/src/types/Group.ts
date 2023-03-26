import { Schema, model, Types} from 'mongoose';

export interface Group {
    _id?: Types.ObjectId;
    groupName : string;
    description : string;
    usersId? : Types.ObjectId[];
    userAdmin? : Types.ObjectId;
    posts : Types.ObjectId[];
    createdAt : Date;
}

const groupeSchema = new Schema<Group>({
    groupName : {
        type : String,
        required : true
    },
    description : {
        type : String
    },
    usersId : {
        type : [Types.ObjectId]
    },
    userAdmin : {
        type : Types.ObjectId,
        required : true
    },
    posts : {
        type : [Types.ObjectId]
    },
    createdAt : {
        type : Date,
        default : Date.now()
    }
})

const GroupM = model<Group>('GroupM', groupeSchema)
export default GroupM