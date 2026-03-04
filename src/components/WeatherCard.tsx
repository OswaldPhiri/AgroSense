import { Cloud, Droplets, Thermometer, Wind } from 'lucide-react';
import { WeatherData } from '@/types/weather';

interface WeatherCardProps {
    data: WeatherData;
}

export default function WeatherCard({ data }: WeatherCardProps) {
    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-sm font-medium text-blue-200 uppercase tracking-wider">Current Weather</h3>
                    <p className="text-2xl font-bold">{data.location}</p>
                </div>
                <Cloud className="w-10 h-10 text-blue-300" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl">
                    <Thermometer className="w-6 h-6 text-orange-400" />
                    <div>
                        <p className="text-xs text-gray-400">Temperature</p>
                        <p className="text-lg font-semibold">{data.temperature}°C</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl">
                    <Droplets className="w-6 h-6 text-blue-400" />
                    <div>
                        <p className="text-xs text-gray-400">Rain Prob.</p>
                        <p className="text-lg font-semibold">{data.rainfall_probability}%</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl">
                    <Cloud className="w-6 h-6 text-gray-300" />
                    <div>
                        <p className="text-xs text-gray-400">Humidity</p>
                        <p className="text-lg font-semibold">{data.humidity}%</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl">
                    <Wind className="w-6 h-6 text-green-400" />
                    <div>
                        <p className="text-xs text-gray-400">Wind Speed</p>
                        <p className="text-lg font-semibold">{data.wind_speed} km/h</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl">
                <p className="text-sm text-blue-100 italic">"{data.forecast_summary}"</p>
            </div>

            <p className="mt-4 text-[10px] text-gray-400 text-right uppercase tracking-widest">
                Updated: {data.observation_time}
            </p>
        </div>
    );
}
