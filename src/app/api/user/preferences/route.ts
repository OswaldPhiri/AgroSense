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

        const body = await req.json();
        const { languagePreference, location, themePreference } = body;

        const updateData: any = {};
        if (languagePreference) {
            if (!['en', 'ny'].includes(languagePreference)) {
                return NextResponse.json({ error: 'Invalid language' }, { status: 400 });
            }
            updateData.languagePreference = languagePreference;
            updateData.languagePromptAnswered = true;
        }

        if (themePreference) {
            if (!['light', 'dark'].includes(themePreference)) {
                return NextResponse.json({ error: 'Invalid theme' }, { status: 400 });
            }
            updateData.themePreference = themePreference;
        }

        if (location) {
            updateData.location = location;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No data provided' }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            updateData,
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            languagePreference: user.languagePreference,
            location: user.location,
            themePreference: user.themePreference
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
            languagePromptAnswered: user.languagePromptAnswered || false,
            location: user.location || null,
            themePreference: user.themePreference || 'light'
        });
    } catch (error: any) {
        console.error('Preferences API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
