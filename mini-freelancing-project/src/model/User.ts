import mongoose, { Schema, Document } from "mongoose";

// Project Schema
export interface Project extends Document {
    details: string;
    amount: number;  // Changed to number
    createdAt: Date;
    userId: mongoose.Types.ObjectId;
}
const ProjectSchema: Schema<Project> = new mongoose.Schema({
    details: { type: String, required: true },
    amount: { type: Number, required: true }, 
    createdAt: { type: Date, default: Date.now },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Bid Schema
export interface Bid extends Document {
    bidAmount: number;
    message: string;
    createdAt: Date;
    projectId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
}
const BidSchema: Schema<Bid> = new mongoose.Schema({
    bidAmount: { type: Number, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Chat Schema
export interface Chat extends Document {
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    message: string;
    image?: string;
    createdAt: Date;
}
const ChatSchema: Schema<Chat> = new mongoose.Schema({
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    image: { type: String },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// User Schema
export interface User extends Document {
    name: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isSeller: boolean;
    projects: mongoose.Types.ObjectId[];  
    bids: mongoose.Types.ObjectId[];      
    chat: mongoose.Types.ObjectId[];    
}
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    verifyCode: {
        type: String,
        required: [true, 'Verify Code is required'],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verify Code Expiry is required'],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isSeller: {
        type: Boolean,
        default: false,
    },
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    bids: [{ type: Schema.Types.ObjectId, ref: 'Bid' }],
    chat: [{ type: Schema.Types.ObjectId, ref: 'Chat' }] 
}, { timestamps: true });

// User Model
const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", UserSchema);
export default UserModel;