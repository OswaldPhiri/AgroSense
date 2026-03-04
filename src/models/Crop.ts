import mongoose, { Schema, Document } from 'mongoose';

export interface ICrop extends Document {
    name: string;
    category?: string;
    createdAt: Date;
}

const CropSchema: Schema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        category: { type: String },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.Crop || mongoose.model<ICrop>('Crop', CropSchema);
