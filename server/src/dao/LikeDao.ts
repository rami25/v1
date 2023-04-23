import { Types } from 'mongoose';
import { User} from '../../../shared/src/types/User';
import { Like } from './../../../shared/src/types/Like';

export interface LikeDao {
  createLike(user: User, postId : string): Promise<void>;
  deleteLike(userId : Types.ObjectId , postId : string): Promise<boolean>;
  getLikes(postId: string): Promise<Like[]>;
  exists(userId : Types.ObjectId, postId : string): Promise<boolean>;
}