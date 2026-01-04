'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import TemplateGallery from '@/components/TemplateGallery';
import { Template } from '@/types';
import { useRouter } from 'next/navigation';

export default function TemplatesPage() {
    const router = useRouter();

    const handleSelectTemplate = (template: Template) => {
        // In production, load template into canvas store
        console.log('Selected template:', template);
        router.push('/creator');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
            {/* Header */}
            <header className="glass-dark border-b border-white/10 px-6 py-4 sticky top-0 z-10">
                <div className="container mx-auto flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Templates</h1>
                        <p className="text-sm text-gray-400">Choose a template to get started</p>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="container mx-auto px-6 py-8">
                <TemplateGallery onSelectTemplate={handleSelectTemplate} />
            </div>
        </div>
    );
}
