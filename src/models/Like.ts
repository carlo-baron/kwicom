import mongoose, { Schema, models } from "mongoose";
import { UserType } from './User';
import { PostType } from "./Post";

const LikeSchema = new Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }
});

LikeSchema.index({ user: 1, post: 1 }, {unique: true});

export const Like = models.Like|| mongoose.model('Like', LikeSchema);

export type LikeType = {
    user: UserType;
    post: PostType;
}
