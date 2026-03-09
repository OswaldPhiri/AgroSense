'use client';

import { useState } from 'react';
import { Globe, Check, Loader2 } from 'lucide-react';

interface LanguagePromptModalProps {
    onComplete: (lang: 'en' | 'ny') => void;
}

export default function LanguagePromptModal({ onComplete }: LanguagePromptModalProps) {
    const [selectedLang, setSelectedLang] = useState<'en' | 'ny' | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!selectedLang) return;
        setLoading(true);

        try {
            const res = await fetch('/api/user/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ languagePreference: selectedLang }),
            });

            if (res.ok) {
                onComplete(selectedLang);
            } else {
                console.error('Failed to save language preference');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error saving language preference:', error);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-fade-in">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <Globe className="w-8 h-8 text-green-600" />
                </div>

                <h2 className="text-2xl font-black text-center text-gray-900 mb-2">
                    Choose Your Language
                </h2>
                <h3 className="text-xl font-bold text-center text-gray-600 mb-8">
                    Sankhani Chilankhulo Chanu
                </h3>

                <div className="space-y-4 mb-8">
                    <button
                        onClick={() => setSelectedLang('en')}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${selectedLang === 'en'
                                ? 'border-green-600 bg-green-50'
                                : 'border-gray-200 hover:border-green-200 hover:bg-gray-50'
                            }`}
                    >
                        <div className="text-left">
                            <span className="block font-bold text-gray-900">English</span>
                            <span className="block text-sm text-gray-500">UK/US English</span>
                        </div>
                        {selectedLang === 'en' && <Check className="w-6 h-6 text-green-600" />}
                    </button>

                    <button
                        onClick={() => setSelectedLang('ny')}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${selectedLang === 'ny'
                                ? 'border-green-600 bg-green-50'
                                : 'border-gray-200 hover:border-green-200 hover:bg-gray-50'
                            }`}
                    >
                        <div className="text-left">
                            <span className="block font-bold text-gray-900">Chichewa</span>
                            <span className="block text-sm text-gray-500">Malawi</span>
                        </div>
                        {selectedLang === 'ny' && <Check className="w-6 h-6 text-green-600" />}
                    </button>
                </div>

                <button
                    onClick={handleSave}
                    disabled={!selectedLang || loading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        'Continue / Pitirizani'
                    )}
                </button>
            </div>
        </div>
    );
}
