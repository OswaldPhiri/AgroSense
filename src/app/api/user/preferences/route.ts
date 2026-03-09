import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { languagePreference } = await req.json();

        if (!['en', 'ny'].includes(languagePreference)) {
            return NextResponse.json({ error: 'Invalid language' }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            {
                languagePreference,
                languagePromptAnswered: true
            },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            languagePreference: user.languagePreference
        });
    } catch (error: any) {
        console.error('Preferences API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            languagePreference: user.languagePreference || 'en',
            languagePromptAnswered: user.languagePromptAnswered || false
        });
    } catch (error: any) {
        console.error('Preferences API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
