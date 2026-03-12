import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name?: string;
    email: string;
    password?: string;
    image?: string;
    location_lat?: number;
    location_lng?: number;
    district?: string;
    subscription_tier: 'free' | 'premium';
    languagePreference: 'en' | 'ny';
    languagePromptAnswered: boolean;
    location?: string;
    themePreference: 'light' | 'dark';
    crops: mongoose.Types.ObjectId[]; // Linked crops from a master list
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        image: { type: String },
        location_lat: { type: Number },
        location_lng: { type: Number },
        district: { type: String },
        subscription_tier: {
            type: String,
            enum: ['free', 'premium'],
            default: 'free'
        },
        languagePreference: {
            type: String,
            enum: ['en', 'ny'],
            default: 'en'
        },
        languagePromptAnswered: {
            type: Boolean,
            default: false
        },
        location: { type: String },
        themePreference: {
            type: String,
            enum: ['light', 'dark'],
            default: 'light'
        },
        crops: [{ type: Schema.Types.ObjectId, ref: 'Crop' }],
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
