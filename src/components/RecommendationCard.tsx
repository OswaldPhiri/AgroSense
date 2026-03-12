import { AlertTriangle, CheckCircle, Info, Lightbulb } from 'lucide-react';
import { AIRecommendationResponse } from '@/types/ai';

interface RecommendationCardProps {
    data: AIRecommendationResponse;
    loading?: boolean;
    language?: 'en' | 'ny';
}

const translations = {
    en: {
        aiFarmingAdvisory: 'AI Farming Advisory',
        risk: 'Risk',
        keyRecommendations: 'Key Recommendations',
        criticalWarnings: 'Critical Warnings',
        poweredBy: 'Powered by AgroSense AI Engine',
        low: 'Low',
        moderate: 'Moderate',
        high: 'High',
    },
    ny: {
        aiFarmingAdvisory: 'Uphungu wa Ulimi wa AI',
        risk: 'Ngozi',
        keyRecommendations: 'Zofunika Kuchita',
        criticalWarnings: 'Machenjezo Ofunika',
        poweredBy: 'Mphamvu ndi AgroSense AI Engine',
        low: 'Patsika',
        moderate: 'Pakatikati',
        high: 'Pali Ngoyipa',
    }
};

export default function RecommendationCard({ data, loading, language = 'en' }: RecommendationCardProps) {
    const t = translations[language];

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    const riskColors = {
        low: 'text-green-700 bg-green-50 border-green-200',
        moderate: 'text-yellow-700 bg-yellow-50 border-yellow-200',
        high: 'text-red-700 bg-red-50 border-red-200',
    };

    const riskIcons = {
        low: <CheckCircle className="w-5 h-5" />,
        moderate: <Info className="w-5 h-5" />,
        high: <AlertTriangle className="w-5 h-5" />,
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 h-full flex flex-col transition-colors">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center items-start gap-4 mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-amber-500 flex-shrink-0" />
                    {t.aiFarmingAdvisory}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border w-fit ${riskColors[data.risk_level]}`}>
                    {riskIcons[data.risk_level]}
                    {t[data.risk_level]} {t.risk}
                </span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {data.summary}
            </p>

            <div className="space-y-6 flex-grow">
                <div>
                    <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">{t.keyRecommendations}</h4>
                    <ul className="space-y-3">
                        {data.recommendations.map((rec, i) => (
                            <li key={i} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                                <span className="flex-shrink-0 w-5 h-5 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-[10px] font-bold border border-green-200 dark:border-green-800">
                                    {i + 1}
                                </span>
                                {rec}
                            </li>
                        ))}
                    </ul>
                </div>

                {data.warnings.length > 0 && (
                    <div>
                        <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">{t.criticalWarnings}</h4>
                        <ul className="space-y-3">
                            {data.warnings.map((warning, i) => (
                                <li key={i} className="flex gap-3 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30">
                                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    {warning}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
                <p className="text-[10px] text-gray-400 dark:text-gray-600 text-center italic">
                    {t.poweredBy}
                </p>
            </div>
        </div>
    );
}
