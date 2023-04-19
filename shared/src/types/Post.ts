import { Schema, model, Types} from 'mongoose';


// interface IFile extends Document {
//   name: string;
//   data: Buffer;
//   contenttype : string;
//   size : number;
// }

// const fileSchema = new Schema<IFile>({
//   name: String,
//   data: Buffer,
//   contentType: String,
//   size: Number
// });

export interface Post {
    _id?: Types.ObjectId;
    title: string;
    description: string;
    urls: string[];
    nurls? : number;
    files: string[];
    nfiles? : number;
    userId?: Types.ObjectId;
    userName?: string;
    groupId?: Types.ObjectId;
    groupName?:string;
    comments? : Types.ObjectId[];
    cmnts? : number;
    likes? : Types.ObjectId[];
    lks?:number;
    postedAt?: Date;
    privacy: string;
}

const postSchema = new Schema<Post>({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String
    },
    urls : [{
        type : String
    }],
    nurls : {
        type : Number,
        default : 0
    },
    files : [{
        type : String
    }],
    nfiles : {
        type : Number,
        default : 0
    },
    userId : {
        type : Types.ObjectId,
        ref: 'UserM',
        required : true
    },
    userName : {
        type : String
    },
    groupId : {
        type : Types.ObjectId,
        ref: 'GroupM'
    },
    groupName : {
        type : String
    },
    comments :[{
        type : Types.ObjectId,
        ref: 'CommentM'
    }],
    cmnts : {
        type : Number,
        default : 0
    },
    likes : [{
        type : Types.ObjectId,
        ref: 'LikeM'
    }],
    lks : {
        type : Number,
        default : 0
    },
    postedAt : {
        type : Date,
        default : Date.now()
    },
    privacy : {
        type : String,
        required : true
    }

})

const PostM = model<Post>('PostM', postSchema)
export default PostM