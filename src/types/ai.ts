export interface AIRecommendationRequest {
    weather: {
        temperature: number;
        rainfall_probability: number;
        humidity: number;
        wind_speed: number;
        forecast_summary: string;
    };
    crops: string[];
    location: string;
}

export interface AIRecommendationResponse {
    risk_level: 'low' | 'moderate' | 'high';
    summary: string;
    recommendations: string[];
    warnings: string[];
}
