import { Cloud, Droplets, Thermometer, Wind } from 'lucide-react';
import { WeatherData } from '@/types/weather';

interface WeatherCardProps {
    data: WeatherData;
}

export default function WeatherCard({ data }: WeatherCardProps) {
    return (
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-sm font-medium text-green-100 uppercase tracking-wider">Current Weather</h3>
                    <p className="text-2xl font-bold">{data.location}</p>
                </div>
                <Cloud className="w-10 h-10 text-green-200" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 bg-white/15 p-3 rounded-xl backdrop-blur-sm">
                    <Thermometer className="w-6 h-6 text-orange-300" />
                    <div>
                        <p className="text-xs text-green-100">Temperature</p>
                        <p className="text-lg font-semibold">{data.temperature}°C</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3 bg-white/15 p-3 rounded-xl backdrop-blur-sm">
                    <Droplets className="w-6 h-6 text-blue-300" />
                    <div>
                        <p className="text-xs text-green-100">Rain Prob.</p>
                        <p className="text-lg font-semibold">{data.rainfall_probability}%</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3 bg-white/15 p-3 rounded-xl backdrop-blur-sm">
                    <Cloud className="w-6 h-6 text-white/70" />
                    <div>
                        <p className="text-xs text-green-100">Humidity</p>
                        <p className="text-lg font-semibold">{data.humidity}%</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3 bg-white/15 p-3 rounded-xl backdrop-blur-sm">
                    <Wind className="w-6 h-6 text-teal-200" />
                    <div>
                        <p className="text-xs text-green-100">Wind Speed</p>
                        <p className="text-lg font-semibold">{data.wind_speed} km/h</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 p-4 bg-white/10 border border-white/20 rounded-xl backdrop-blur-sm">
                <p className="text-sm text-green-50 italic">&quot;{data.forecast_summary}&quot;</p>
            </div>

            <p className="mt-4 text-[10px] text-green-200 text-right uppercase tracking-widest">
                Updated: {data.observation_time}
            </p>
        </div>
    );
}
