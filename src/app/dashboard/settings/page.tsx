'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
    ArrowLeft, 
    Moon, 
    Sun, 
    Globe, 
    User as UserIcon, 
    Settings as SettingsIcon,
    Check,
    Loader2
} from 'lucide-react';
import { useTheme } from '@/components/ThemeContext';

const translations = {
    en: {
        settings: 'Settings',
        backToDashboard: 'Back to Dashboard',
        appearance: 'Appearance',
        darkMode: 'Dark Mode',
        darkModeDescription: 'Switch between light and dark themes.',
        language: 'Language',
        languageDescription: 'Choose your preferred language.',
        profile: 'Profile',
        name: 'Name',
        email: 'Email',
        saving: 'Saving...',
        saved: 'Changes Saved',
        saveChanges: 'Save Changes',
        english: 'English',
        chichewa: 'Chichewa',
        light: 'Light',
        dark: 'Dark'
    },
    ny: {
        settings: 'Zokonda',
        backToDashboard: 'Bwererani ku Dashboard',
        appearance: 'Maonekedwe',
        darkMode: 'Maonekedwe a Mdima',
        darkModeDescription: 'Sinthani pakati pa maonekedwe lowala ndi amdima.',
        language: 'Chilankhulo',
        languageDescription: 'Sankhani chilankhulo chomwe mumakonda.',
        profile: 'Mbiri Yanu',
        name: 'Dzina',
        email: 'Imelo',
        saving: 'Kusunga...',
        saved: 'Zasinthidwa Zasungidwa',
        saveChanges: 'Sungani Zosintha',
        english: 'Chingerezi',
        chichewa: 'Chichewa',
        light: 'Lowala',
        dark: 'Mdima'
    }
};

export default function SettingsPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    
    const [languagePreference, setLanguagePreference] = useState<'en' | 'ny'>('en');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [justSaved, setJustSaved] = useState(false);

    useEffect(() => {
        async function fetchPrefs() {
            try {
                const res = await fetch('/api/user/preferences');
                if (res.ok) {
                    const data = await res.json();
                    setLanguagePreference(data.languagePreference || 'en');
                }
            } catch (err) {
                console.error('Failed to fetch preferences', err);
            } finally {
                setLoading(false);
            }
        }
        fetchPrefs();
    }, []);

    const t = translations[languagePreference];

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/user/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    languagePreference,
                    themePreference: theme
                }),
            });

            if (res.ok) {
                setJustSaved(true);
                setTimeout(() => setJustSaved(false), 3000);
            }
        } catch (error) {
            console.error('Failed to save settings', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-12 transition-colors duration-200">
            <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4 mb-8 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
                    <button 
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">{t.backToDashboard}</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <SettingsIcon className="w-5 h-5 text-green-600" />
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white">{t.settings}</h1>
                    </div>
                    <div className="w-20" /> {/* Spacer */}
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4">
                <div className="space-y-6">
                    {/* Appearance Section */}
                    <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-950 rounded-lg">
                                {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-600" /> : <Sun className="w-5 h-5 text-indigo-600" />}
                            </div>
                            <div>
                                <h2 className="font-bold text-gray-900 dark:text-white">{t.appearance}</h2>
                                <p className="text-xs text-gray-500">{t.darkModeDescription}</p>
                            </div>
                        </div>

                        <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                            <button
                                onClick={() => setTheme('light')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${theme === 'light' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}
                            >
                                <Sun className="w-4 h-4" />
                                {t.light}
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${theme === 'dark' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}
                            >
                                <Moon className="w-4 h-4" />
                                {t.dark}
                            </button>
                        </div>
                    </section>

                    {/* Language Section */}
                    <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                <Globe className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="font-bold text-gray-900 dark:text-white">{t.language}</h2>
                                <p className="text-xs text-gray-500">{t.languageDescription}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => setLanguagePreference('en')}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${languagePreference === 'en'
                                        ? 'border-green-600 bg-green-50 dark:bg-green-950/30 dark:border-green-500'
                                        : 'border-gray-200 dark:border-gray-800 hover:border-green-200 dark:hover:border-green-900'
                                    }`}
                            >
                                <span className={`font-bold ${languagePreference === 'en' ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {t.english}
                                </span>
                                {languagePreference === 'en' && <Check className="w-5 h-5 text-green-600" />}
                            </button>

                            <button
                                onClick={() => setLanguagePreference('ny')}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${languagePreference === 'ny'
                                        ? 'border-green-600 bg-green-50 dark:bg-green-950/30 dark:border-green-500'
                                        : 'border-gray-200 dark:border-gray-800 hover:border-green-200 dark:hover:border-green-900'
                                    }`}
                            >
                                <span className={`font-bold ${languagePreference === 'ny' ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {t.chichewa}
                                </span>
                                {languagePreference === 'ny' && <Check className="w-5 h-5 text-green-600" />}
                            </button>
                        </div>
                    </section>

                    {/* Profile Section */}
                    <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-50 dark:bg-green-950 rounded-lg">
                                <UserIcon className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h2 className="font-bold text-gray-900 dark:text-white">{t.profile}</h2>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t.name}</label>
                                <p className="text-gray-900 dark:text-white font-medium">{session?.user?.name || '---'}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t.email}</label>
                                <p className="text-gray-900 dark:text-white font-medium">{session?.user?.email || '---'}</p>
                            </div>
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 disabled:opacity-50"
                        >
                            {saving ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : justSaved ? (
                                <Check className="w-5 h-5" />
                            ) : null}
                            {saving ? t.saving : justSaved ? t.saved : t.saveChanges}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
