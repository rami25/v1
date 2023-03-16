import { Schema, model, Types} from 'mongoose';

export interface Group {
    id?: string;
    groupName : string;
    description : string;
    usersId? : [string];
    userAdmin? : string;
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
    createdAt : {
        type : Date,
        default : Date.now()
    }
})

const Group = model<Group>('Group', groupeSchema)
export default Group