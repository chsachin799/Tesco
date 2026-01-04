'use client';

import { useState } from 'react';
import { Sparkles, Wand2, Loader2 } from 'lucide-react';

export default function AIAssistant() {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [streamedText, setStreamedText] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        setStreamedText('');
        setSuggestions([]);

        // Simulate thinking time
        await new Promise(r => setTimeout(r, 800));

        const response = "Based on your prompt, here are some suggestions to improve your design:\n\n• Use a vibrant gradient background to make the product pop\n• Increase font size for better readability on mobile\n• Add a subtle shadow to create depth\n• Consider using your brand's accent color for the CTA button";

        // Simulate streaming
        let currentText = '';
        const chars = response.split('');

        for (let i = 0; i < chars.length; i++) {
            currentText += chars[i];
            setStreamedText(currentText);
            // Random delay for realistic typing effect
            await new Promise(r => setTimeout(r, 15 + Math.random() * 20));
        }

        setIsGenerating(false);
        setSuggestions([
            'Use a vibrant gradient background to make the product pop',
            'Increase font size for better readability on mobile',
            'Add a subtle shadow to create depth',
            'Consider using your brand\'s accent color for the CTA button',
        ]);
        setStreamedText(''); // Clear stream once done to show structured suggestions
    };

    const handleGenerateVariants = () => {
        // Placeholder for future implementation
        console.log("Generating variants...");
    };

    // ... (keep handleGenerateVariants)

    return (
        <div className="space-y-4">
            {/* ... (header and input) */}

            {/* ... (input area) */}
            <div className="space-y-2">
                <label className="text-sm text-gray-400">Describe your design needs</label>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g., 'Create a modern tech product ad with blue tones and minimal design'"
                    className="input-field min-h-[100px] resize-none"
                    disabled={isGenerating}
                />

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Thinking...
                        </>
                    ) : (
                        <>
                            <Wand2 className="w-5 h-5" />
                            Get AI Suggestions
                        </>
                    )}
                </button>
            </div>

            {/* AI Output Stream */}
            {(isGenerating && streamedText) && (
                <div className="glass p-4 rounded-lg animate-in fade-in duration-300">
                    <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                        {streamedText}
                        <span className="inline-block w-2 h-4 bg-primary-500 ml-1 animate-pulse" />
                    </p>
                </div>
            )}

            {/* AI Suggestions (Final Result) */}
            {!isGenerating && suggestions.length > 0 && (
                <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-300">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        AI Suggestions
                    </h4>
                    {suggestions.map((suggestion, index) => (
                        <div key={index} className="glass p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                            <p className="text-sm text-gray-300">{suggestion}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Quick Actions */}
            <div className="space-y-2">
                <h4 className="text-sm font-semibold text-white">Quick Actions</h4>

                <button
                    onClick={handleGenerateVariants}
                    disabled={isGenerating}
                    className="btn-secondary w-full justify-center disabled:opacity-50"
                >
                    <Sparkles className="w-4 h-4" />
                    Generate 10 Auto-Ads
                </button>

                <button className="btn-secondary w-full justify-center">
                    <Wand2 className="w-4 h-4" />
                    Enhance Image Quality
                </button>

                <button className="btn-secondary w-full justify-center">
                    <Sparkles className="w-4 h-4" />
                    Auto-Fix Violations
                </button>
            </div>

            {/* AI Features */}
            <div className="glass p-4 rounded-lg space-y-2">
                <h4 className="text-sm font-semibold text-white mb-2">AI Can Help With:</h4>
                <ul className="text-xs text-gray-400 space-y-1">
                    <li>✨ Better layout suggestions</li>
                    <li>🎨 Font and color pairing</li>
                    <li>📱 Improved readability</li>
                    <li>✅ Brand-safe corrections</li>
                    <li>🖼️ Image enhancement</li>
                </ul>
            </div>
        </div>
    );
}
