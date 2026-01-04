'use client';

import { useState } from 'react';
import { Template, PRODUCT_CATEGORIES } from '@/types';
import { TrendingUp, Search } from 'lucide-react';

// Mock templates data
const MOCK_TEMPLATES: Template[] = [
    {
        id: '1',
        name: 'Modern Product Showcase',
        category: 'Electronics',
        thumbnailUrl: '/templates/template1.jpg',
        trending: true,
        tags: ['minimal', 'modern', 'product'],
        canvasState: {
            width: 1080,
            height: 1080,
            elements: [],
            selectedElementIds: [],
            backgroundColor: '#ffffff',
            safeZones: true,
            gridEnabled: false,
        },
    },
    {
        id: '2',
        name: 'Fashion Sale Banner',
        category: 'Fashion & Apparel',
        thumbnailUrl: '/templates/template2.jpg',
        trending: true,
        tags: ['sale', 'fashion', 'bold'],
        canvasState: {
            width: 1080,
            height: 1080,
            elements: [],
            selectedElementIds: [],
            backgroundColor: '#000000',
            safeZones: true,
            gridEnabled: false,
        },
    },
    {
        id: '3',
        name: 'Food & Beverage Promo',
        category: 'Food & Beverage',
        thumbnailUrl: '/templates/template3.jpg',
        trending: false,
        tags: ['food', 'colorful', 'appetizing'],
        canvasState: {
            width: 1080,
            height: 1080,
            elements: [],
            selectedElementIds: [],
            backgroundColor: '#fef3c7',
            safeZones: true,
            gridEnabled: false,
        },
    },
];

interface TemplateGalleryProps {
    onSelectTemplate?: (template: Template) => void;
}

export default function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTemplates = MOCK_TEMPLATES.filter((template) => {
        const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const trendingTemplates = filteredTemplates.filter(t => t.trending);

    return (
        <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field pl-10"
                    />
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                    onClick={() => setSelectedCategory('All')}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${selectedCategory === 'All'
                            ? 'gradient-primary text-white'
                            : 'glass hover-lift'
                        }`}
                >
                    All
                </button>
                {PRODUCT_CATEGORIES.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${selectedCategory === category
                                ? 'gradient-primary text-white'
                                : 'glass hover-lift'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Trending Templates */}
            {trendingTemplates.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-primary-400" />
                        <h3 className="text-xl font-semibold text-white">Trending Templates</h3>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {trendingTemplates.map((template) => (
                            <TemplateCard
                                key={template.id}
                                template={template}
                                onSelect={onSelectTemplate}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* All Templates */}
            <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                    {selectedCategory === 'All' ? 'All Templates' : selectedCategory}
                </h3>

                <div className="grid grid-cols-3 gap-4">
                    {filteredTemplates.map((template) => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            onSelect={onSelectTemplate}
                        />
                    ))}
                </div>
            </div>

            {filteredTemplates.length === 0 && (
                <div className="text-center py-12 glass rounded-xl">
                    <p className="text-gray-400">No templates found</p>
                    <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    );
}

function TemplateCard({ template, onSelect }: { template: Template; onSelect?: (template: Template) => void }) {
    return (
        <div
            onClick={() => onSelect?.(template)}
            className="card cursor-pointer group"
        >
            <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-3 overflow-hidden">
                {/* Placeholder for template thumbnail */}
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <div className="text-center">
                        <div className="text-4xl mb-2">🎨</div>
                        <div className="text-xs">Preview</div>
                    </div>
                </div>
            </div>

            <h4 className="font-semibold text-white mb-1 group-hover:text-primary-400 transition-colors">
                {template.name}
            </h4>

            <p className="text-sm text-gray-400 mb-2">{template.category}</p>

            <div className="flex gap-1 flex-wrap">
                {template.tags.slice(0, 3).map((tag) => (
                    <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full bg-primary-500/20 text-primary-300"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}
