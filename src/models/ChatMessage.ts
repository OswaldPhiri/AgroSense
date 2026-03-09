import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
    user_id: mongoose.Types.ObjectId;
    role: 'user' | 'assistant' | 'system';
    content: string;
    createdAt: Date;
}

const ChatMessageSchema: Schema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
        content: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
