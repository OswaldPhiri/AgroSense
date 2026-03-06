import { NextRequest, NextResponse } from 'next/server';
import { AIRecommendationRequest, AIRecommendationResponse } from '@/types/ai';
import { auth } from '@/auth';
import dbConnect from '@/lib/db/mongoose';
import RecommendationLog from '@/models/RecommendationLog';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const body: AIRecommendationRequest = await request.json();
        const { weather, crops, location } = body;

        if (!weather || !crops || crops.length === 0) {
            return NextResponse.json(
                { error: 'Weather data and crops are required' },
                { status: 400 }
            );
        }

        const aiApiKey = process.env.AI_API_KEY;
        const aiBaseUrl = process.env.AI_BASE_URL || 'https://api.openai.com/v1';
        const aiModel = process.env.AI_MODEL || 'gpt-4o';

        let recommendation: AIRecommendationResponse;

        if (!aiApiKey) {
            // Fallback for demo purposes if API key is not set
            recommendation = {
                risk_level: 'moderate',
                summary: `Farming advice for ${crops.join(', ')} in ${location}. (Demo Mode)`,
                recommendations: [
                    'Monitor soil moisture due to current temperature.',
                    'Consider supplemental irrigation if rainfall remains low.',
                    'Check for pests commonly active in these conditions.'
                ],
                warnings: [
                    'High wind speeds might affect delicate crops.',
                    'Rainfall probability is low, preserve water.'
                ]
            };
        } else {
            const prompt = `
        You are an expert agricultural advisor. Based on the following data, provide actionable farming recommendations.
        
        Location: ${location}
        Crops: ${crops.join(', ')}
        
        Current Weather:
        - Temperature: ${weather.temperature}°C
        - Rainfall Probability: ${weather.rainfall_probability}%
        - Humidity: ${weather.humidity}%
        - Wind Speed: ${weather.wind_speed} km/h
        - Conditions: ${weather.forecast_summary}

        Return a JSON object exactly following this schema:
        {
          "risk_level": "low" | "moderate" | "high",
          "summary": "A brief overview of the situation",
          "recommendations": ["list of 3-5 specific actions"],
          "warnings": ["list of alerts or potential issues"]
        }

        Focus on irrigation, pesticide timing, and general crop health.
      `;

            const response = await fetch(`${aiBaseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${aiApiKey}`,
                },
                body: JSON.stringify({
                    model: aiModel,
                    messages: [
                        { role: 'system', content: 'You are a precise agricultural AI assistant.' },
                        { role: 'user', content: prompt }
                    ],
                    response_format: { type: 'json_object' }
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`AI service failed: ${response.status} ${JSON.stringify(errorData)}`);
            }

            const aiData = await response.json();
            const content = aiData.choices[0].message.content;

            try {
                recommendation = JSON.parse(content);
            } catch (parseError) {
                console.error('Failed to parse AI response:', content);
                throw new Error('AI returned invalid JSON format');
            }
        }

        // Log the recommendation to MongoDB
        try {
            await RecommendationLog.create({
                user_id: session.user.id || (session.user as any).sub, // Auth.js might provide id or sub
                weather_snapshot: weather,
                ai_response: recommendation,
            });
        } catch (logError) {
            console.error('Failed to log recommendation:', logError);
            // We don't block the response if logging fails
        }

        return NextResponse.json(recommendation);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
