'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, Save, Download, Sparkles } from 'lucide-react';
import Link from 'next/link';
import CanvasEditor, { CanvasEditorRef } from '@/components/CanvasEditor';
import AssetUploader from '@/components/AssetUploader';
import AssetLibrary from '@/components/AssetLibrary';
import ValidationPanel from '@/components/ValidationPanel';
import AIAssistant from '@/components/AIAssistant';
import ExportPanel from '@/components/ExportPanel';

import PropertiesPanel from '@/components/PropertiesPanel';

export default function CreatorPage() {
    const [activeTab, setActiveTab] = useState<'assets' | 'ai' | 'validate'>('assets');
    const [showExportPanel, setShowExportPanel] = useState(false);
    const canvasRef = useRef<CanvasEditorRef>(null);

    const handleExport = (format: string, multiplier: number = 2) => {
        if (!canvasRef.current) return;
        const dataUrl = canvasRef.current.exportToDataURL(multiplier);
        if (dataUrl) {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `creative-${format.toLowerCase().replace('_', '-')}-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
            {/* Header */}
            <header className="glass-dark border-b border-white/10 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-white">Creative Builder</h1>
                            <p className="text-sm text-gray-400">Untitled Project</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="btn-secondary">
                            <Save className="w-5 h-5" />
                            Save
                        </button>
                        <button
                            onClick={() => setShowExportPanel(true)}
                            className="btn-primary"
                        >
                            <Download className="w-5 h-5" />
                            Export
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Tools */}
                <div className="w-80 glass-dark border-r border-white/10 flex flex-col">
                    {/* Tabs */}
                    <div className="flex border-b border-white/10">
                        <button
                            onClick={() => setActiveTab('assets')}
                            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'assets'
                                ? 'text-white border-b-2 border-primary-500'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Assets
                        </button>
                        <button
                            onClick={() => setActiveTab('ai')}
                            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'ai'
                                ? 'text-white border-b-2 border-primary-500'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <Sparkles className="w-4 h-4 inline mr-1" />
                            AI
                        </button>
                        <button
                            onClick={() => setActiveTab('validate')}
                            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'validate'
                                ? 'text-white border-b-2 border-primary-500'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Validate
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {activeTab === 'assets' && (
                            <div className="space-y-6">
                                <AssetUploader />
                                <AssetLibrary />
                            </div>
                        )}

                        {activeTab === 'ai' && <AIAssistant />}

                        {activeTab === 'validate' && <ValidationPanel />}
                    </div>
                </div>

                {/* Center - Canvas */}
                <div className="flex-1 overflow-auto bg-gray-900/50 flex items-center justify-center p-8">
                    <CanvasEditor ref={canvasRef} />
                </div>

                {/* Right Sidebar - Properties */}
                <div className="w-64 glass-dark border-l border-white/10 p-4 overflow-y-auto">
                    <PropertiesPanel />
                </div>
            </div>

            {/* Export Panel Modal */}
            {
                showExportPanel && (
                    <ExportPanel
                        onClose={() => setShowExportPanel(false)}
                        onExport={handleExport}
                    />
                )
            }
        </div >
    );
}
