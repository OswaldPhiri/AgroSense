import Link from 'next/link';
import { Sprout, Cloud, ShieldCheck, Zap, ArrowRight, BarChart3, MapPin, Leaf, Sun } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-green-200">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold tracking-tighter text-gray-900">AgroSense</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">
              How It Works
            </Link>
            <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Login
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold text-sm transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-green-600/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-100 via-transparent to-transparent -z-10 opacity-60" />

        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 border border-green-200 rounded-full text-green-700 text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
            <Zap className="w-3 h-3" />
            AI-Powered Agriculture
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.95] text-gray-900">
            Smarter Farming, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500">
              Better Harvests.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-gray-500 text-lg md:text-xl mb-12 leading-relaxed">
            Get location-aware AI advisory powered by real-time weather data.
            Crop-specific insights, proactive risk alerts, and actionable recommendations
            to maximize your yield.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="group px-8 py-4 bg-green-600 text-white rounded-2xl font-bold text-lg flex items-center gap-2 transition-all hover:bg-green-700 hover:shadow-xl hover:shadow-green-600/20"
            >
              Start Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 bg-gray-50 border border-gray-200 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-black text-green-600">10K+</p>
              <p className="text-sm text-gray-500 mt-1">Farmers Served</p>
            </div>
            <div>
              <p className="text-3xl font-black text-green-600">98%</p>
              <p className="text-sm text-gray-500 mt-1">Accuracy Rate</p>
            </div>
            <div>
              <p className="text-3xl font-black text-green-600">24/7</p>
              <p className="text-sm text-gray-500 mt-1">Weather Monitoring</p>
            </div>
            <div>
              <p className="text-3xl font-black text-green-600">50+</p>
              <p className="text-sm text-gray-500 mt-1">Crop Varieties</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-widest text-green-600 mb-3">Features</p>
            <h2 className="text-4xl font-black tracking-tight text-gray-900">Everything you need to farm smarter</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MapPin className="w-6 h-6 text-blue-600" />}
              title="Location Aware"
              description="Hyper-local data based on your exact farm coordinates for pinpoint accuracy and region-specific advice."
              color="blue"
            />
            <FeatureCard
              icon={<Cloud className="w-6 h-6 text-sky-600" />}
              title="Live Weather Engine"
              description="Real-time monitoring with 30-minute interval updates for rainfall, temperature, humidity, and wind."
              color="sky"
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-amber-600" />}
              title="AI Advisory"
              description="Actionable, personalized insights powered by advanced AI models tailored to your specific crops."
              color="amber"
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6 text-indigo-600" />}
              title="Smart Analytics"
              description="Track recommendation logs and weather history to optimize your long-term farm strategy."
              color="indigo"
            />
            <FeatureCard
              icon={<ShieldCheck className="w-6 h-6 text-green-600" />}
              title="Risk Alerts"
              description="Early warnings for pest outbreaks, droughts, and extreme weather conditions to protect your crops."
              color="green"
            />
            <FeatureCard
              icon={<Leaf className="w-6 h-6 text-emerald-600" />}
              title="Crop Mastery"
              description="Support for maize, soybeans, wheat, groundnuts, and 50+ crop varieties across different regions."
              color="emerald"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-widest text-green-600 mb-3">Simple Process</p>
            <h2 className="text-4xl font-black tracking-tight text-gray-900">How AgroSense Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard step={1} title="Set Your Location" description="Enter your farm location or allow GPS detection for hyper-local weather data and advisory." />
            <StepCard step={2} title="Select Your Crops" description="Choose from 50+ crop varieties. AgroSense tailors every recommendation to your specific crops." />
            <StepCard step={3} title="Get AI Insights" description="Receive real-time, actionable farming advice including irrigation, pest control, and harvest timing." />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Sun className="w-12 h-12 text-green-200 mx-auto mb-6" />
          <h2 className="text-4xl font-black text-white tracking-tight mb-6">Ready to grow smarter?</h2>
          <p className="text-green-100 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of farmers already using AgroSense to increase their yield and reduce crop loss.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-700 rounded-2xl font-bold text-lg hover:bg-green-50 transition-all shadow-xl"
          >
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-100 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sprout className="w-5 h-5 text-green-600" />
          <span className="font-bold tracking-tighter text-gray-700">AgroSense</span>
        </div>
        <p className="text-gray-400 text-sm">© 2026 AgroSense AI. Built for the future of agriculture.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  return (
    <div className="p-8 bg-white border border-gray-100 rounded-3xl hover:border-green-200 hover:shadow-lg transition-all group">
      <div className={`w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100 group-hover:bg-green-50 transition-colors`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}

function StepCard({ step, title, description }: { step: number, title: string, description: string }) {
  return (
    <div className="text-center p-8">
      <div className="w-14 h-14 bg-green-600 text-white rounded-2xl flex items-center justify-center text-xl font-black mx-auto mb-6 shadow-lg shadow-green-600/20">
        {step}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm">{description}</p>
    </div>
  );
}
