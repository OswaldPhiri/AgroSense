'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import WeatherCard from '@/components/WeatherCard';
import RecommendationCard from '@/components/RecommendationCard';
import { WeatherData } from '@/types/weather';
import { AIRecommendationResponse } from '@/types/ai';
import { Loader2, Sprout } from 'lucide-react';

export default function DashboardPage() {
    const { data: session } = useSession();
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [recommendation, setRecommendation] = useState<AIRecommendationResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initial data for demonstration - in production these would come from the database
    const userCrops = ['Maize', 'Soybeans', 'Wheat'];
    const userLocation = 'Lusaka, Zambia';
    const userInitials = session?.user?.name
        ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : 'US';

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                // 1. Fetch Weather
                const weatherRes = await fetch(`/api/weather?query=${encodeURIComponent(userLocation)}`);
                if (!weatherRes.ok) throw new Error('Failed to fetch weather');
                const weatherData: WeatherData = await weatherRes.json();
                setWeather(weatherData);

                // 2. Fetch AI Recommendations
                const aiRes = await fetch('/api/recommend', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        weather: weatherData,
                        crops: userCrops,
                        location: userLocation,
                    }),
                });
                if (!aiRes.ok) throw new Error('Failed to fetch AI recommendations');
                const aiData: AIRecommendationResponse = await aiRes.json();
                setRecommendation(aiData);

            } catch (err: any) {
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading && !weather) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 pb-12">
            {/* Header */}
            <header className="bg-slate-800/50 border-b border-white/5 py-6 mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-500/20 p-2 rounded-lg">
                            <Sprout className="w-8 h-8 text-green-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">AgroSense</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-bold uppercase tracking-widest">
                            Premium Tier
                        </span>
                        <div className="w-10 h-10 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center text-white font-bold">
                            OP
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Weather & Status */}
                    <div className="lg:col-span-5 space-y-8">
                        {weather && <WeatherCard data={weather} />}

                        <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-6">
                            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Your Active Crops</h3>
                            <div className="flex flex-wrap gap-2">
                                {userCrops.map(crop => (
                                    <span key={crop} className="px-4 py-2 bg-slate-700/50 text-white rounded-lg border border-white/5 text-sm font-medium">
                                        {crop}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: AI Insights */}
                    <div className="lg:col-span-7">
                        {recommendation ? (
                            <RecommendationCard data={recommendation} loading={loading} />
                        ) : (
                            <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-12 text-center">
                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
                                <p className="text-gray-400">Analyzing weather patterns and crop requirements...</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
