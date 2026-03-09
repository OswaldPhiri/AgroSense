import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';
import Crop from '@/models/Crop';

// GET all crops for current user
export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user.email }).populate('crops');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ crops: user.crops });
    } catch (error: any) {
        console.error('Crops API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST to add a new crop to user's list
export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { cropName } = await req.json();
        if (!cropName) {
            return NextResponse.json({ error: 'Crop name is required' }, { status: 400 });
        }

        await dbConnect();

        // Find or create the crop in master list
        let crop = await Crop.findOne({ name: cropName });
        if (!crop) {
            crop = await Crop.create({ name: cropName });
        }

        // Add to user if not already there
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (!user.crops.some((id: any) => id.toString() === crop._id.toString())) {
            user.crops.push(crop._id);
            await user.save();
        }

        return NextResponse.json({ message: 'Crop added', crop });
    } catch (error: any) {
        console.error('Crops API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE a crop from user's list
export async function DELETE(req: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const cropId = searchParams.get('id');

        if (!cropId) {
            return NextResponse.json({ error: 'Crop ID is required' }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        user.crops = user.crops.filter((id: any) => id.toString() !== cropId);
        await user.save();

        return NextResponse.json({ message: 'Crop removed' });
    } catch (error: any) {
        console.error('Crops API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
