// Core Types
export interface Asset {
    id: string;
    name: string;
    type: 'packshot' | 'background' | 'logo' | 'font' | 'other';
    url: string;
    thumbnailUrl?: string;
    size: number;
    uploadedAt: Date;
    metadata?: Record<string, any>;
}

export interface BrandKit {
    id: string;
    name: string;
    colors: string[];
    fonts: string[];
    logoUrl: string;
    guidelines?: BrandGuidelines;
}

export interface BrandGuidelines {
    fonts: string[];
    colors: string[];
    tone: string;
    logoSpacing: number;
    contrastRules?: string;
}

export interface RetailerGuidelines {
    platform: 'amazon' | 'flipkart' | 'meta' | 'instagram' | 'facebook' | 'tiktok';
    logoPosition?: { x: number; y: number };
    minFontSize: number;
    safeMargins: { top: number; right: number; bottom: number; left: number };
    maxTextRatio: number;
    maxFileSize: number; // in KB
    restrictedColors?: string[];
    ctaPlacement?: string;
    dimensions?: { width: number; height: number };
}

export interface CanvasElement {
    id: string;
    type: 'text' | 'i-text' | 'image' | 'shape' | 'background';
    x: number;
    y: number;
    width: number;
    height: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
    opacity: number;
    zIndex: number;
    locked: boolean;
    visible: boolean;

    // Text specific
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: 'normal' | 'italic' | 'oblique'; // Added fontStyle
    color?: string;
    textAlign?: 'left' | 'center' | 'right';

    // Image specific
    src?: string;

    // Shape specific
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
}

export interface CanvasState {
    width: number;
    height: number;
    elements: CanvasElement[];
    selectedElementIds: string[];
    backgroundColor: string;
    safeZones: boolean;
    gridEnabled: boolean;
}

export interface Template {
    id: string;
    name: string;
    category: string;
    thumbnailUrl: string;
    canvasState: CanvasState;
    trending: boolean;
    tags: string[];
}

export interface ValidationResult {
    status: 'compliant' | 'warning' | 'violation';
    retailerChecks: ValidationCheck[];
    brandChecks: ValidationCheck[];
    overallScore: number;
}

export interface ValidationCheck {
    rule: string;
    status: 'pass' | 'warning' | 'fail';
    message: string;
    suggestion?: string;
}

export interface ExportFormat {
    name: string;
    width: number;
    height: number;
    format: 'png' | 'jpg' | 'svg' | 'pdf';
    maxSize?: number; // in KB
}

export interface AIGenerationRequest {
    prompt: string;
    baseTemplate?: Template;
    brandKit?: BrandKit;
    variantCount?: number;
}

export interface AIGenerationResult {
    variants: Template[];
    suggestions: string[];
}

export interface PublishTarget {
    platform: 'instagram' | 'facebook' | 'tiktok' | 'linkedin';
    accountId: string;
    caption?: string;
    scheduledTime?: Date;
}

// Export formats for different platforms
export const EXPORT_FORMATS: Record<string, ExportFormat> = {
    INSTAGRAM_POST: { name: 'Instagram Post', width: 1080, height: 1080, format: 'jpg', maxSize: 500 },
    INSTAGRAM_STORY: { name: 'Instagram Story', width: 1080, height: 1920, format: 'jpg', maxSize: 500 },
    FACEBOOK_FEED: { name: 'Facebook Feed', width: 1200, height: 628, format: 'jpg', maxSize: 500 },
    FACEBOOK_STORY: { name: 'Facebook Story', width: 1080, height: 1920, format: 'jpg', maxSize: 500 },
    TIKTOK: { name: 'TikTok', width: 1080, height: 1920, format: 'jpg', maxSize: 500 },
    LINKEDIN_POST: { name: 'LinkedIn Post', width: 1200, height: 627, format: 'jpg', maxSize: 500 },
    TWITTER_POST: { name: 'Twitter Post', width: 1200, height: 675, format: 'jpg', maxSize: 500 },
};

// Product categories
export const PRODUCT_CATEGORIES = [
    'Electronics',
    'Fashion & Apparel',
    'Food & Beverage',
    'Beauty & Cosmetics',
    'Home & Garden',
    'Sports & Fitness',
    'Toys & Games',
    'Books & Media',
    'Health & Wellness',
    'Automotive',
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];
