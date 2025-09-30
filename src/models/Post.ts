import mongoose, { Schema, models } from "mongoose";
import { UserType } from './User';

const PostSchema = new Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    caption: { type: String, required: true, minLength: 3, maxLength: 1000 },
    createdAt: {type: Date, default: Date.now}
});

export const Post = models.Post || mongoose.model('Post', PostSchema);

export type PostType = {
    user: UserType;
    caption: string;
    createdAt: Date;
}
