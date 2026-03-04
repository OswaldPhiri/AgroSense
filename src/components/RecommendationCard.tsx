import { AlertTriangle, CheckCircle, Info, Lightbulb } from 'lucide-react';
import { AIRecommendationResponse } from '@/types/ai';

interface RecommendationCardProps {
    data: AIRecommendationResponse;
    loading?: boolean;
}

export default function RecommendationCard({ data, loading }: RecommendationCardProps) {
    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-xl animate-pulse">
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
        low: 'text-green-600 bg-green-50',
        moderate: 'text-yellow-600 bg-yellow-50',
        high: 'text-red-600 bg-red-50',
    };

    const riskIcons = {
        low: <CheckCircle className="w-5 h-5" />,
        moderate: <Info className="w-5 h-5" />,
        high: <AlertTriangle className="w-5 h-5" />,
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-yellow-500" />
                    AI Farming Advisory
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${riskColors[data.risk_level]}`}>
                    {riskIcons[data.risk_level]}
                    {data.risk_level} Risk
                </span>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
                {data.summary}
            </p>

            <div className="space-y-6 flex-grow">
                <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Key Recommendations</h4>
                    <ul className="space-y-3">
                        {data.recommendations.map((rec, i) => (
                            <li key={i} className="flex gap-3 text-sm text-gray-700">
                                <span className="flex-shrink-0 w-5 h-5 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                                    {i + 1}
                                </span>
                                {rec}
                            </li>
                        ))}
                    </ul>
                </div>

                {data.warnings.length > 0 && (
                    <div>
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Critical Warnings</h4>
                        <ul className="space-y-3">
                            {data.warnings.map((warning, i) => (
                                <li key={i} className="flex gap-3 text-sm text-red-600 bg-red-50/50 p-2 rounded-lg">
                                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                    {warning}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-50">
                <p className="text-[10px] text-gray-400 text-center italic">
                    Powered by AgroSense AI Engine • GPT-4o
                </p>
            </div>
        </div>
    );
}
