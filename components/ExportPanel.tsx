'use client';

import { useState } from 'react';
import { Download, Share2, X } from 'lucide-react';
import { EXPORT_FORMATS } from '@/types';

interface ExportPanelProps {
    onClose?: () => void;
    onExport?: (format: string, multiplier?: number) => void;
}

export default function ExportPanel({ onClose, onExport }: ExportPanelProps) {
    const [selectedFormats, setSelectedFormats] = useState<string[]>(['INSTAGRAM_POST']);
    const [isExporting, setIsExporting] = useState(false);

    const toggleFormat = (formatKey: string) => {
        setSelectedFormats(prev =>
            prev.includes(formatKey)
                ? prev.filter(k => k !== formatKey)
                : [...prev, formatKey]
        );
    };

    const handleExport = async () => {
        if (!onExport) return;
        setIsExporting(true);

        // Process exports sequentially
        for (const format of selectedFormats) {
            // For now, multiplier is static, but logic could adjust based on format size vs canvas size
            onExport(format, 2);
            // Small delay between downloads to ensure browser handles them
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        setIsExporting(false);
    };

    const handlePublish = () => {
        alert('Publishing to social media... (API integration required)');
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-dark rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 glass-dark">
                    <h2 className="text-2xl font-bold text-white">Export & Publish</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Format Selection */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Select Export Formats</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {Object.entries(EXPORT_FORMATS).map(([key, format]) => (
                                <button
                                    key={key}
                                    onClick={() => toggleFormat(key)}
                                    className={`p-4 rounded-lg text-left transition-all ${selectedFormats.includes(key)
                                        ? 'gradient-primary text-white'
                                        : 'glass hover-lift'
                                        }`}
                                >
                                    <div className="font-semibold mb-1">{format.name}</div>
                                    <div className="text-sm opacity-80">
                                        {format.width} × {format.height}
                                    </div>
                                    {format.maxSize && (
                                        <div className="text-xs opacity-60 mt-1">
                                            Max: {format.maxSize} KB
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Export Options */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Export Options</h3>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 glass p-3 rounded-lg cursor-pointer">
                                <input type="checkbox" className="w-4 h-4" defaultChecked />
                                <span className="text-sm text-gray-300">Optimize for web (compress images)</span>
                            </label>
                            <label className="flex items-center gap-3 glass p-3 rounded-lg cursor-pointer">
                                <input type="checkbox" className="w-4 h-4" />
                                <span className="text-sm text-gray-300">Include transparent background (PNG)</span>
                            </label>
                            <label className="flex items-center gap-3 glass p-3 rounded-lg cursor-pointer">
                                <input type="checkbox" className="w-4 h-4" />
                                <span className="text-sm text-gray-300">Generate PDF for print</span>
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleExport}
                            disabled={isExporting || selectedFormats.length === 0}
                            className="btn-primary flex-1 disabled:opacity-50"
                        >
                            <Download className="w-5 h-5" />
                            {isExporting ? 'Exporting...' : `Export ${selectedFormats.length} Format(s)`}
                        </button>

                        <button
                            onClick={handlePublish}
                            className="btn-secondary flex-1"
                        >
                            <Share2 className="w-5 h-5" />
                            Publish to Social Media
                        </button>
                    </div>

                    {/* Preview */}
                    <div className="glass p-4 rounded-lg">
                        <h4 className="text-sm font-semibold text-white mb-2">Export Preview</h4>
                        <div className="grid grid-cols-3 gap-2">
                            {selectedFormats.slice(0, 3).map((formatKey) => (
                                <div key={formatKey} className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center">
                                    <span className="text-xs text-gray-500">{EXPORT_FORMATS[formatKey].name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
