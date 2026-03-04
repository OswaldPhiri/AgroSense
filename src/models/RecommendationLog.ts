import mongoose, { Schema, Document } from 'mongoose';

export interface IRecommendationLog extends Document {
    user_id: mongoose.Types.ObjectId;
    weather_snapshot: any; // Storing normalized weather data
    ai_response: any; // Storing AI JSON response
    createdAt: Date;
}

const RecommendationLogSchema: Schema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        weather_snapshot: { type: Schema.Types.Mixed, required: true },
        ai_response: { type: Schema.Types.Mixed, required: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.RecommendationLog || mongoose.model<IRecommendationLog>('RecommendationLog', RecommendationLogSchema);
