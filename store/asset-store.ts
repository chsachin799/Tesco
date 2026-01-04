import { create } from 'zustand';
import { Asset, BrandKit } from '@/types';

interface AssetStore {
    assets: Asset[];
    brandKits: BrandKit[];
    selectedBrandKit: BrandKit | null;

    // Asset actions
    addAsset: (asset: Asset) => void;
    removeAsset: (id: string) => void;
    updateAsset: (id: string, updates: Partial<Asset>) => void;
    getAssetsByType: (type: Asset['type']) => Asset[];

    // Brand kit actions
    addBrandKit: (kit: BrandKit) => void;
    removeBrandKit: (id: string) => void;
    selectBrandKit: (id: string) => void;
    updateBrandKit: (id: string, updates: Partial<BrandKit>) => void;
}

export const useAssetStore = create<AssetStore>((set, get) => ({
    assets: [],
    brandKits: [],
    selectedBrandKit: null,

    addAsset: (asset) => {
        set((state) => ({
            assets: [...state.assets, asset],
        }));
    },

    removeAsset: (id) => {
        set((state) => ({
            assets: state.assets.filter((asset) => asset.id !== id),
        }));
    },

    updateAsset: (id, updates) => {
        set((state) => ({
            assets: state.assets.map((asset) =>
                asset.id === id ? { ...asset, ...updates } : asset
            ),
        }));
    },

    getAssetsByType: (type) => {
        return get().assets.filter((asset) => asset.type === type);
    },

    addBrandKit: (kit) => {
        set((state) => ({
            brandKits: [...state.brandKits, kit],
        }));
    },

    removeBrandKit: (id) => {
        set((state) => ({
            brandKits: state.brandKits.filter((kit) => kit.id !== id),
            selectedBrandKit: state.selectedBrandKit?.id === id ? null : state.selectedBrandKit,
        }));
    },

    selectBrandKit: (id) => {
        const kit = get().brandKits.find((k) => k.id === id);
        set({ selectedBrandKit: kit || null });
    },

    updateBrandKit: (id, updates) => {
        set((state) => ({
            brandKits: state.brandKits.map((kit) =>
                kit.id === id ? { ...kit, ...updates } : kit
            ),
            selectedBrandKit:
                state.selectedBrandKit?.id === id
                    ? { ...state.selectedBrandKit, ...updates }
                    : state.selectedBrandKit,
        }));
    },
}));
