'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import WeatherCard from '@/components/WeatherCard';
import RecommendationCard from '@/components/RecommendationCard';
import { WeatherData } from '@/types/weather';
import { AIRecommendationResponse } from '@/types/ai';
import { Loader2, Sprout, LogOut, RefreshCw, MapPin } from 'lucide-react';

export default function DashboardPage() {
    const { data: session } = useSession();
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [recommendation, setRecommendation] = useState<AIRecommendationResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const userCrops = ['Maize', 'Soybeans', 'Wheat'];
    const userLocation = 'Lusaka, Zambia';
    const userInitials = session?.user?.name
        ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : 'AU';

    async function fetchData() {
        try {
            setLoading(true);
            setError(null);

            const weatherRes = await fetch(`/api/weather?query=${encodeURIComponent(userLocation)}`);
            if (!weatherRes.ok) throw new Error('Failed to fetch weather');
            const weatherData: WeatherData = await weatherRes.json();
            setWeather(weatherData);

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

    useEffect(() => {
        fetchData();
    }, []);

    if (loading && !weather) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
                <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
                <p className="text-gray-500 text-sm">Loading your farm data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 py-4 mb-8 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <Sprout className="w-7 h-7 text-green-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">AgroSense</h1>
                            <p className="text-xs text-gray-500">AI Advisory Dashboard</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => fetchData()}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Refresh data"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                            <MapPin className="w-4 h-4 text-green-600" />
                            {userLocation}
                        </div>
                        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {userInitials}
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Sign out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {session?.user?.name || 'Farmer'} 👋
                    </h2>
                    <p className="text-gray-500 mt-1">Here&apos;s your latest farm advisory for today.</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-8 flex items-center justify-between">
                        <span>{error}</span>
                        <button onClick={() => fetchData()} className="text-sm font-bold text-red-600 hover:underline">Retry</button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Weather & Crops */}
                    <div className="lg:col-span-5 space-y-6">
                        {weather && <WeatherCard data={weather} />}

                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Your Active Crops</h3>
                            <div className="flex flex-wrap gap-2">
                                {userCrops.map(crop => (
                                    <span key={crop} className="px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 text-sm font-medium">
                                        {crop}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Quick Stats</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-gray-50 rounded-xl">
                                    <p className="text-2xl font-black text-green-600">{userCrops.length}</p>
                                    <p className="text-xs text-gray-500 mt-1">Active Crops</p>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-xl">
                                    <p className="text-2xl font-black text-green-600">{recommendation?.risk_level === 'low' ? '✓' : recommendation?.risk_level === 'moderate' ? '⚠' : '!'}</p>
                                    <p className="text-xs text-gray-500 mt-1">Risk Level</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: AI Insights */}
                    <div className="lg:col-span-7">
                        {recommendation ? (
                            <RecommendationCard data={recommendation} loading={loading} />
                        ) : (
                            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
                                <Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto mb-4" />
                                <p className="text-gray-500">Analyzing weather patterns and crop requirements...</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
