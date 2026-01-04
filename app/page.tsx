import Link from 'next/link';
import { Sparkles, Palette, Zap, CheckCircle, ArrowRight } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-purple-300">Powered by Generative AI</span>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-display font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Retail Media Creative Tool
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                        Create guideline-compliant, multi-format creatives in minutes with AI-powered design assistance
                    </p>

                    <div className="flex gap-4 justify-center">
                        <Link href="/creator" className="btn-primary inline-flex items-center gap-2">
                            Start Creating
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/templates" className="btn-secondary inline-flex items-center gap-2">
                            Browse Templates
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    <FeatureCard
                        icon={<Palette className="w-8 h-8 text-blue-400" />}
                        title="Smart Canvas Editor"
                        description="Drag, drop, and design with intelligent layout suggestions"
                    />
                    <FeatureCard
                        icon={<CheckCircle className="w-8 h-8 text-green-400" />}
                        title="Guideline Validator"
                        description="Real-time compliance checking for Amazon, Flipkart, Meta"
                    />
                    <FeatureCard
                        icon={<Sparkles className="w-8 h-8 text-purple-400" />}
                        title="AI Assistance"
                        description="Generate 10 ad variants instantly with GPT-4o"
                    />
                    <FeatureCard
                        icon={<Zap className="w-8 h-8 text-yellow-400" />}
                        title="Multi-Format Export"
                        description="Auto-generate all social media sizes in one click"
                    />
                </div>

                {/* How It Works */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-display font-bold mb-4 text-white">
                        How It Works
                    </h2>
                    <p className="text-gray-400 text-lg">
                        From idea to post in 5 simple steps
                    </p>
                </div>

                <div className="grid md:grid-cols-5 gap-4 max-w-6xl mx-auto">
                    <StepCard number="1" title="Upload Assets" description="Packshots, logos, brand kit" />
                    <StepCard number="2" title="Edit & Design" description="Smart canvas with AI layouts" />
                    <StepCard number="3" title="Validate" description="Check compliance rules" />
                    <StepCard number="4" title="AI Enhance" description="Generate variants" />
                    <StepCard number="5" title="Export & Post" description="Multi-format publishing" />
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-white/10 py-8">
                <div className="container mx-auto px-4 text-center text-gray-400">
                    <p>© 2025 Binary Brains - Retail Media Creative Tool</p>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="card group cursor-pointer">
            <div className="mb-4 transform group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </div>
    );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
    return (
        <div className="card text-center">
            <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                {number}
            </div>
            <h4 className="font-semibold text-white mb-1">{title}</h4>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
    );
}
