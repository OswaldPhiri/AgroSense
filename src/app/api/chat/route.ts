import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db/mongoose';
import ChatMessage from '@/models/ChatMessage';

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const userId = session.user.id || (session.user as any).sub;

        // Fetch last 50 messages to keep UI performant
        const messages = await ChatMessage.find({ user_id: userId })
            .sort({ createdAt: 1 })
            .limit(50);

        return NextResponse.json({ messages });
    } catch (error: any) {
        console.error('Chat History Fetch Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { messages, context } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
        }

        const aiApiKey = process.env.AI_API_KEY;
        const aiBaseUrl = process.env.AI_BASE_URL || 'https://api.openai.com/v1';
        const aiModel = process.env.AI_MODEL || 'gpt-4o';

        if (!aiApiKey) {
            return NextResponse.json({ error: 'AI API key not configured' }, { status: 500 });
        }

        await dbConnect();
        const userId = session.user.id || (session.user as any).sub;

        // Save the latest user message to DB if it's new
        const lastUserMessage = messages[messages.length - 1];
        if (lastUserMessage && lastUserMessage.role === 'user') {
            await ChatMessage.create({
                user_id: userId,
                role: 'user',
                content: lastUserMessage.content
            });
        }

        const systemMessage = {
            role: 'system',
            content: `You are an expert agricultural AI assistant named AgroSense. 
You help farmers with advice on crop management, pest control, irrigation, and general agriculture.
Keep responses concise, actionable, and friendly.

Context about the farmer:
Location: ${context?.location || 'Unknown'}
Active Crops: ${context?.crops?.join(', ') || 'Unknown'}
Current Weather: ${context?.weather ? `${context.weather.temperature}°C, ${context.weather.forecast_summary}` : 'Unknown'}

${context?.language === 'ny' ? 'IMPORTANT: You MUST respond entirely in Chichewa (Nyanja). Do NOT reply in English.' : ''}
`,
        };

        const response = await fetch(`${aiBaseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${aiApiKey}`,
            },
            body: JSON.stringify({
                model: aiModel,
                messages: [systemMessage, ...messages],
                stream: false,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Groq AI Error:', errorData);
            throw new Error(`AI service failed: ${response.status}`);
        }

        const aiData = await response.json();
        const reply = aiData.choices[0]?.message || { role: 'assistant', content: 'Sorry, I could not generate a response.' };

        // Save AI response to DB
        if (reply && reply.content) {
            await ChatMessage.create({
                user_id: userId,
                role: 'assistant',
                content: reply.content
            });
        }

        return NextResponse.json({ message: reply });

    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
