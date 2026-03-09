'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import WeatherCard from '@/components/WeatherCard';
import RecommendationCard from '@/components/RecommendationCard';
import ChatPanel from '@/components/ChatPanel';
import LanguagePromptModal from '@/components/LanguagePromptModal';
import { WeatherData } from '@/types/weather';
import { AIRecommendationResponse } from '@/types/ai';
import { Loader2, Sprout, LogOut, RefreshCw, MapPin, Plus, X, MessageSquare, Lightbulb, Search, Navigation } from 'lucide-react';

interface Crop {
    _id: string;
    name: string;
}

export default function DashboardPage() {
    const { data: session } = useSession();
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [recommendation, setRecommendation] = useState<AIRecommendationResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Language State
    const [languagePreference, setLanguagePreference] = useState<'en' | 'ny'>('en');
    const [showLanguagePrompt, setShowLanguagePrompt] = useState(false);

    // Crops State
    const [userCrops, setUserCrops] = useState<Crop[]>([]);
    const [newCropInput, setNewCropInput] = useState('');
    const [addingCrop, setAddingCrop] = useState(false);

    // Location State
    const [userLocation, setUserLocation] = useState<string>('');
    const [isLocating, setIsLocating] = useState(false);
    const [locationInput, setLocationInput] = useState('');
    const [isEditingLocation, setIsEditingLocation] = useState(false);

    // View State
    const [activeTab, setActiveTab] = useState<'advisory' | 'chat'>('advisory');

    const userInitials = session?.user?.name
        ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : 'US';

    async function fetchLanguagePreferences() {
        try {
            const res = await fetch('/api/user/preferences');
            if (res.ok) {
                const data = await res.json();
                setLanguagePreference(data.languagePreference || 'en');
                if (!data.languagePromptAnswered) {
                    setShowLanguagePrompt(true);
                }
            }
        } catch (err) {
            console.error('Failed to fetch language preferences', err);
        }
    }

    async function getUserGeolocation() {
        setIsLocating(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    // Format for Weather API query
                    const query = `${lat},${lon}`;
                    setUserLocation(query);
                    setIsLocating(false);
                    fetchAdvisory(query);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    // Fallback Location
                    setUserLocation('Lusaka, Zambia');
                    setIsLocating(false);
                    fetchAdvisory('Lusaka, Zambia');
                }
            );
        } else {
            // Geolocation not supported fallback
            setUserLocation('Lusaka, Zambia');
            setIsLocating(false);
            fetchAdvisory('Lusaka, Zambia');
        }
    }

    async function handleCustomLocationSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!locationInput.trim()) return;
        setIsEditingLocation(false);
        setUserLocation(locationInput.trim());
        setLoading(true);
        fetchAdvisory(locationInput.trim());
    }

    async function loadCrops() {
        try {
            const res = await fetch('/api/crops');
            if (res.ok) {
                const data = await res.json();
                setUserCrops(data.crops || []);
                return data.crops || [];
            }
        } catch (err) {
            console.error('Failed to load crops', err);
        }
        return [];
    }

    async function addCrop(e: React.FormEvent) {
        e.preventDefault();
        if (!newCropInput.trim() || addingCrop) return;
        setAddingCrop(true);
        try {
            const res = await fetch('/api/crops', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cropName: newCropInput.trim() }),
            });
            if (res.ok) {
                setNewCropInput('');
                await loadCrops();
                fetchAdvisory(userLocation); // Refresh advisory after crop change
            }
        } finally {
            setAddingCrop(false);
        }
    }

    async function removeCrop(id: string) {
        try {
            const res = await fetch(`/api/crops?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setUserCrops(prev => prev.filter(c => c._id !== id));
                fetchAdvisory(userLocation); // Refresh advisory after crop change
            }
        } catch (err) {
            console.error('Failed to remove crop', err);
        }
    }

    async function fetchAdvisory(locToFetch: string) {
        if (!locToFetch) return; // Don't fetch if no location set yet

        try {
            setError(null);

            // Re-fetch crops just in case
            const currentCrops = await loadCrops();
            const cropNames = currentCrops.length > 0 ? currentCrops.map((c: Crop) => c.name) : ['Maize'];

            const weatherRes = await fetch(`/api/weather?query=${encodeURIComponent(locToFetch)}`);
            if (!weatherRes.ok) throw new Error('Failed to fetch weather');
            const weatherData: WeatherData = await weatherRes.json();
            setWeather(weatherData);

            const aiRes = await fetch('/api/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    weather: weatherData,
                    crops: cropNames,
                    location: weatherData.location || locToFetch, // Use normalized location name from weather API
                    language: languagePreference
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
        // Fetch language prefs first
        fetchLanguagePreferences();

        // Initial load starts by getting location
        if (!userLocation && !isLocating) {
            getUserGeolocation();
        }
    }, [userLocation, isLocating]);

    if (loading && !weather) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
                <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
                <p className="text-gray-500 text-sm">
                    {isLocating ? 'Detecting your farm location...' : 'Loading your farm data...'}
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {showLanguagePrompt && (
                <LanguagePromptModal
                    onComplete={(lang) => {
                        setLanguagePreference(lang);
                        setShowLanguagePrompt(false);
                        if (userLocation) {
                            fetchAdvisory(userLocation); // Refetch advisory in new language
                        }
                    }}
                />
            )}

            {/* Header */}
            <header className="bg-white border-b border-gray-200 py-4 mb-8 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg hidden sm:block">
                            <Sprout className="w-7 h-7 text-green-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">AgroSense</h1>
                            <p className="text-xs text-gray-500 hidden sm:block">AI Advisory Dashboard</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Location Editor */}
                        <div className="hidden md:flex items-center bg-gray-50 rounded-lg border border-gray-100 px-2 py-1">
                            {isEditingLocation ? (
                                <form onSubmit={handleCustomLocationSubmit} className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-green-600" />
                                    <input
                                        type="text"
                                        autoFocus
                                        value={locationInput}
                                        onChange={(e) => setLocationInput(e.target.value)}
                                        placeholder="City, Country"
                                        className="bg-transparent border-none focus:outline-none text-sm w-32 placeholder:text-gray-400 text-gray-900"
                                    />
                                    <button type="submit" className="text-green-600 hover:text-green-700 p-1">
                                        <Search className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingLocation(false)}
                                        className="text-gray-400 hover:text-red-500 p-1"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </form>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={getUserGeolocation}
                                        className="p-1 text-gray-400 hover:text-green-600 flex items-center justify-center transition-colors"
                                        title="Use my location"
                                    >
                                        <Navigation className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setLocationInput(weather?.location || userLocation);
                                            setIsEditingLocation(true);
                                        }}
                                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-green-600 transition-colors"
                                    >
                                        <MapPin className="w-4 h-4 text-green-600" />
                                        <span className="truncate max-w-[150px]">{weather?.location || userLocation || 'Location'}</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => { setLoading(true); fetchAdvisory(userLocation); }}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Refresh data"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>

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

                    {/* Mobile Location Display */}
                    <div className="md:hidden mt-4 flex items-center gap-2 text-sm text-gray-600">
                        <button
                            onClick={getUserGeolocation}
                            className="p-1.5 bg-white border border-gray-200 rounded-md text-gray-500 hover:text-green-600 flex items-center justify-center transition-colors"
                        >
                            <Navigation className="w-4 h-4" />
                        </button>
                        <form onSubmit={handleCustomLocationSubmit} className="flex flex-1 items-center bg-white border border-gray-200 rounded-md px-3 py-1.5 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
                            <MapPin className="w-4 h-4 text-green-600 mr-2" />
                            <input
                                type="text"
                                value={locationInput !== '' ? locationInput : (weather?.location || userLocation)}
                                onChange={(e) => setLocationInput(e.target.value)}
                                placeholder="Enter custom location..."
                                className="bg-transparent border-none focus:outline-none w-full text-gray-900"
                            />
                            <button type="submit" className="text-gray-400 hover:text-green-600 ml-2">
                                <Search className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-8 flex items-center justify-between">
                        <span>{error}</span>
                        <button onClick={() => { setLoading(true); fetchAdvisory(userLocation); }} className="text-sm font-bold text-red-600 hover:underline">Retry</button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Weather & Crops */}
                    <div className="lg:col-span-5 space-y-6">
                        {weather && <WeatherCard data={weather} />}

                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Your Active Crops</h3>

                            <form onSubmit={addCrop} className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={newCropInput}
                                    onChange={(e) => setNewCropInput(e.target.value)}
                                    placeholder="Add a new crop..."
                                    className="flex-grow bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                                    disabled={addingCrop}
                                />
                                <button
                                    type="submit"
                                    disabled={!newCropInput.trim() || addingCrop}
                                    className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                                >
                                    {addingCrop ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                    Add
                                </button>
                            </form>

                            <div className="flex flex-wrap gap-2">
                                {userCrops.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic">No crops added yet. Add one above.</p>
                                ) : (
                                    userCrops.map(crop => (
                                        <span key={crop._id} className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg border border-green-200 text-sm font-medium group">
                                            {crop.name}
                                            <button
                                                onClick={() => removeCrop(crop._id)}
                                                className="text-green-600 hover:text-red-500 hover:bg-red-50 rounded p-0.5 opacity-50 group-hover:opacity-100 transition-all"
                                                title="Remove crop"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Quick Stats</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-2xl font-black text-green-600">{userCrops.length}</p>
                                    <p className="text-xs text-gray-500 mt-1">Active Crops</p>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-2xl font-black text-green-600">{recommendation?.risk_level === 'low' ? '✓' : recommendation?.risk_level === 'moderate' ? '⚠' : '!'}</p>
                                    <p className="text-xs text-gray-500 mt-1">Risk Level</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: AI Insights & Chat */}
                    <div className="lg:col-span-7">
                        {/* Tabs */}
                        <div className="flex gap-2 mb-6 bg-white p-1 rounded-xl border border-gray-200 inline-flex shadow-sm">
                            <button
                                onClick={() => setActiveTab('advisory')}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'advisory' ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                <Lightbulb className="w-4 h-4" />
                                Daily Advisory
                            </button>
                            <button
                                onClick={() => setActiveTab('chat')}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'chat' ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                <MessageSquare className="w-4 h-4" />
                                AI Assistant Chat
                            </button>
                        </div>

                        {activeTab === 'advisory' ? (
                            recommendation ? (
                                <RecommendationCard data={recommendation} loading={loading} />
                            ) : (
                                <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
                                    <Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto mb-4" />
                                    <p className="text-gray-500">Analyzing weather patterns and crop requirements...</p>
                                </div>
                            )
                        ) : (
                            <ChatPanel contextData={{
                                crops: userCrops.map(c => c.name),
                                location: weather?.location || userLocation,
                                weather: weather
                            }} />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
