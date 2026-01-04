'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, FileText, Palette } from 'lucide-react';
import { useAssetStore } from '@/store/asset-store';
import { Asset } from '@/types';

export default function AssetUploader() {
    const addAsset = useAssetStore((state) => state.addAsset);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        for (const file of acceptedFiles) {
            // In production, upload to Cloudinary/S3
            // For now, create local URL
            const url = URL.createObjectURL(file);

            const asset: Asset = {
                id: `${Date.now()}-${Math.random()}`,
                name: file.name,
                type: getAssetType(file.type),
                url,
                thumbnailUrl: url,
                size: file.size,
                uploadedAt: new Date(),
            };

            addAsset(asset);
        }
    }, [addAsset]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
        },
    });

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`
          border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-300 hover-lift
          ${isDragActive
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-gray-600 glass hover:border-primary-400'
                    }
        `}
            >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 mx-auto mb-4 text-primary-400" />

                {isDragActive ? (
                    <p className="text-lg text-primary-300">Drop files here...</p>
                ) : (
                    <>
                        <p className="text-lg font-semibold mb-2 text-white">
                            Upload Your Brand Assets
                        </p>
                        <p className="text-gray-400 mb-4">
                            Drag & drop or click to select files
                        </p>
                        <div className="flex gap-4 justify-center text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <Image className="w-4 h-4" />
                                Packshots
                            </span>
                            <span className="flex items-center gap-1">
                                <Palette className="w-4 h-4" />
                                Backgrounds
                            </span>
                            <span className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                Logos
                            </span>
                        </div>
                    </>
                )}
            </div>

            <div className="grid grid-cols-4 gap-2">
                <AssetTypeCard icon={<Image />} label="Packshots" type="packshot" />
                <AssetTypeCard icon={<Palette />} label="Backgrounds" type="background" />
                <AssetTypeCard icon={<FileText />} label="Logos" type="logo" />
                <AssetTypeCard icon={<FileText />} label="Other" type="other" />
            </div>
        </div>
    );
}

function AssetTypeCard({ icon, label, type }: { icon: React.ReactNode; label: string; type: Asset['type'] }) {
    const count = useAssetStore((state) => state.assets.filter(a => a.type === type).length);

    return (
        <div className="glass rounded-lg p-3 text-center">
            <div className="text-primary-400 mb-1 flex justify-center">{icon}</div>
            <div className="text-xs text-gray-400">{label}</div>
            <div className="text-lg font-bold text-white">{count}</div>
        </div>
    );
}

function getAssetType(mimeType: string): Asset['type'] {
    if (mimeType.startsWith('image/')) return 'packshot';
    if (mimeType.startsWith('font/')) return 'font';
    return 'other';
}
