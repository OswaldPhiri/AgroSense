import Link from 'next/link';
import { Sprout, Cloud, ShieldCheck, Zap, ArrowRight, BarChart3, MapPin } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-green-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold tracking-tighter">AgroSense</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Login
            </Link>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 bg-green-500 hover:bg-green-400 text-slate-950 rounded-full font-bold text-sm transition-all transform hover:scale-105 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent -z-10" />

        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
            <Zap className="w-3 h-3" />
            AI-Powered Agriculture
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
            Farming Intelligence <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-blue-500">
              Redefined.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl mb-12 leading-relaxed">
            Maximize your yield with location-aware AI advisory. Real-time weather integration,
            crop-specific insights, and proactive risk management for modern farmers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="group px-8 py-4 bg-white text-slate-950 rounded-2xl font-bold text-lg flex items-center gap-2 transition-all hover:bg-green-400 hover:shadow-[0_0_40px_-10px_rgba(74,222,128,0.5)]"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 bg-slate-900 border border-white/10 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all"
            >
              How it works
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MapPin className="w-6 h-6 text-blue-400" />}
              title="Location Aware"
              description="Hyper-local data fetched based on your exact farm coordinates for pinpoint accuracy."
            />
            <FeatureCard
              icon={<Cloud className="w-6 h-6 text-sky-400" />}
              title="Weather Engine"
              description="Real-time monitoring and 30-minute interval updates for rainfall and temperature spikes."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-yellow-500" />}
              title="AI Advisory"
              description="Actionable insights powered by GPT-4o, tailored to your specific crop preferences."
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6 text-indigo-400" />}
              title="Analytics"
              description="Track recommendation logs and weather history to optimize long-term farm strategy."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-6 h-6 text-green-400" />}
              title="Risk Alerts"
              description="Early warnings for pest outbreaks and extreme weather conditions to protect your ROI."
            />
            <FeatureCard
              icon={<Sprout className="w-6 h-6 text-emerald-400" />}
              title="Crop Mastery"
              description="Diverse database support for maize, soybeans, wheat, and more standard varieties."
            />
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center text-slate-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sprout className="w-5 h-5 text-green-500/50" />
          <span className="font-bold tracking-tighter text-slate-400">AgroSense</span>
        </div>
        <p>© 2026 AgroSense AI. Built for the future of agriculture.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 bg-slate-900/50 border border-white/5 rounded-3xl hover:border-green-500/20 transition-all group">
      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:bg-green-500/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}
