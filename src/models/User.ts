import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: {type: String, required: true }
}, {timestamps: true});

export const User = models.User|| mongoose.model('User', UserSchema);

export type UserType = {
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
};
