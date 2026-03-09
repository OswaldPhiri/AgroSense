import { NextRequest, NextResponse } from 'next/server';
import { WeatherStackResponse, WeatherData } from '@/types/weather';
import { auth } from '@/auth';
import dbConnect from '@/lib/db/mongoose';

export async function GET(request: NextRequest) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const query = searchParams.get('query');

    if ((!lat || !lon) && !query) {
        return NextResponse.json(
            { error: 'Latitude and Longitude or Query are required' },
            { status: 400 }
        );
    }

    const apiKey = process.env.WEATHERSTACK_API_KEY;
    const locationQuery = query || `${lat},${lon}`;

    // Note: WeatherStack free tier might not support https, using fallback logic if needed
    const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${encodeURIComponent(locationQuery)}`;

    try {
        const response = await fetch(url, {
            next: { revalidate: 1800 }, // Cache for 30 minutes
        });

        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const data: WeatherStackResponse = await response.json();

        if ('success' in data && (data as any).success === false) {
            return NextResponse.json(
                { error: (data as any).error.info || 'Weather API error' },
                { status: 500 }
            );
        }

        // Normalize the data
        const normalizedData: WeatherData = {
            temperature: data.current.temperature,
            rainfall_probability: data.current.precip > 0 ? 100 : 0,
            humidity: data.current.humidity,
            wind_speed: data.current.wind_speed,
            forecast_summary: data.current.weather_descriptions[0],
            location: `${data.location.name}, ${data.location.region}, ${data.location.country}`,
            observation_time: data.location.localtime, // Use local time instead of UTC observation time
        };

        return NextResponse.json(normalizedData);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
