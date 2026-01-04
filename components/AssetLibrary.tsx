'use client';

import { useAssetStore } from '@/store/asset-store';
import { Trash2, Download } from 'lucide-react';
import Image from 'next/image';

export default function AssetLibrary() {
    const assets = useAssetStore((state) => state.assets);
    const removeAsset = useAssetStore((state) => state.removeAsset);

    if (assets.length === 0) {
        return (
            <div className="text-center py-12 glass rounded-xl">
                <p className="text-gray-400">No assets uploaded yet</p>
                <p className="text-sm text-gray-500 mt-2">Upload assets to get started</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Asset Library</h3>

            <div className="grid grid-cols-4 gap-4">
                {assets.map((asset) => (
                    <div
                        key={asset.id}
                        className="card group relative overflow-hidden cursor-pointer"
                        draggable
                        onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
                            e.dataTransfer.setData('imageUrl', asset.url);
                            e.dataTransfer.setData('type', 'image');
                        }}
                    >
                        <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden mb-2">
                            {asset.url && (
                                <img
                                    src={asset.url}
                                    alt={asset.name}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>

                        <p className="text-sm text-white truncate">{asset.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(asset.size)}</p>

                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button
                                onClick={() => removeAsset(asset.id)}
                                className="p-2 bg-red-500/80 rounded-lg hover:bg-red-600 transition-colors"
                            >
                                <Trash2 className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
