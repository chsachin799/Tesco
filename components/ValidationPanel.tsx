'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { useCanvasStore } from '@/store/canvas-store';
import { ValidationResult, ValidationCheck } from '@/types';

export default function ValidationPanel() {
    const canvas = useCanvasStore((state) => state.canvas);
    const [validation, setValidation] = useState<ValidationResult | null>(null);
    const [selectedPlatform, setSelectedPlatform] = useState<'amazon' | 'flipkart' | 'meta'>('amazon');

    useEffect(() => {
        // Run validation whenever canvas changes
        const result = validateCanvas(canvas, selectedPlatform);
        setValidation(result);
    }, [canvas, selectedPlatform]);

    if (!validation) return null;

    const statusColor = {
        compliant: 'text-green-400',
        warning: 'text-yellow-400',
        violation: 'text-red-400',
    }[validation.status];

    const statusIcon = {
        compliant: <CheckCircle className="w-6 h-6" />,
        warning: <AlertTriangle className="w-6 h-6" />,
        violation: <XCircle className="w-6 h-6" />,
    }[validation.status];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Guideline Validator</h3>

                <div className="flex gap-2">
                    <button
                        onClick={() => setSelectedPlatform('amazon')}
                        className={`px-3 py-1 rounded-lg text-sm transition-all ${selectedPlatform === 'amazon' ? 'gradient-primary text-white' : 'glass'
                            }`}
                    >
                        Amazon
                    </button>
                    <button
                        onClick={() => setSelectedPlatform('flipkart')}
                        className={`px-3 py-1 rounded-lg text-sm transition-all ${selectedPlatform === 'flipkart' ? 'gradient-primary text-white' : 'glass'
                            }`}
                    >
                        Flipkart
                    </button>
                    <button
                        onClick={() => setSelectedPlatform('meta')}
                        className={`px-3 py-1 rounded-lg text-sm transition-all ${selectedPlatform === 'meta' ? 'gradient-primary text-white' : 'glass'
                            }`}
                    >
                        Meta
                    </button>
                </div>
            </div>

            {/* Overall Status */}
            <div className={`card ${statusColor}`}>
                <div className="flex items-center gap-3">
                    {statusIcon}
                    <div className="flex-1">
                        <h4 className="font-semibold text-lg">
                            {validation.status === 'compliant' && 'Compliant ✓'}
                            {validation.status === 'warning' && 'Minor Issues'}
                            {validation.status === 'violation' && 'Violations Found'}
                        </h4>
                        <p className="text-sm opacity-80">
                            Compliance Score: {validation.overallScore}%
                        </p>
                    </div>
                </div>
            </div>

            {/* Retailer Checks */}
            <div className="space-y-2">
                <h4 className="font-semibold text-white flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Retailer Guidelines
                </h4>
                {validation.retailerChecks.map((check, index) => (
                    <ValidationCheckItem key={index} check={check} />
                ))}
            </div>

            {/* Brand Checks */}
            <div className="space-y-2">
                <h4 className="font-semibold text-white flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Brand Guidelines
                </h4>
                {validation.brandChecks.map((check, index) => (
                    <ValidationCheckItem key={index} check={check} />
                ))}
            </div>
        </div>
    );
}

function ValidationCheckItem({ check }: { check: ValidationCheck }) {
    const icon = {
        pass: <CheckCircle className="w-4 h-4 text-green-400" />,
        warning: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
        fail: <XCircle className="w-4 h-4 text-red-400" />,
    }[check.status];

    return (
        <div className="glass p-3 rounded-lg">
            <div className="flex items-start gap-2">
                {icon}
                <div className="flex-1">
                    <p className="text-sm font-medium text-white">{check.rule}</p>
                    <p className="text-xs text-gray-400 mt-1">{check.message}</p>
                    {check.suggestion && (
                        <p className="text-xs text-primary-400 mt-1">💡 {check.suggestion}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// Mock validation function
function validateCanvas(canvas: any, platform: string): ValidationResult {
    const retailerChecks: ValidationCheck[] = [];
    const brandChecks: ValidationCheck[] = [];

    // 1. Text Ratio Check (20% limit for Facebook/generic)
    const canvasArea = canvas.width * canvas.height;
    let textArea = 0;

    canvas.elements.forEach((el: any) => {
        if (el.type === 'i-text' || el.type === 'text') {
            // Rough estimation of text area
            textArea += (el.width * el.scaleX) * (el.height * el.scaleY);
        }
    });

    const textRatio = (textArea / canvasArea) * 100;

    retailerChecks.push({
        rule: 'Text Content Ratio',
        status: textRatio > 20 ? 'warning' : 'pass',
        message: `Text covers ${textRatio.toFixed(1)}% of image (Rec: < 20%)`,
        suggestion: textRatio > 20 ? 'Reduce text size or amount' : undefined
    });

    // 2. Safe Margins Check (5% padding)
    const marginX = canvas.width * 0.05;
    const marginY = canvas.height * 0.05;
    let safeZoneViolations = 0;

    canvas.elements.forEach((el: any) => {
        const x = el.x;
        const y = el.y;
        const w = el.width * el.scaleX;
        const h = el.height * el.scaleY;

        if (x < marginX || y < marginY || x + w > canvas.width - marginX || y + h > canvas.height - marginY) {
            safeZoneViolations++;
        }
    });

    retailerChecks.push({
        rule: 'Safe Margins',
        status: safeZoneViolations > 0 ? 'warning' : 'pass',
        message: safeZoneViolations > 0 ? `${safeZoneViolations} elements outside safe zone` : 'All elements within safe zones',
        suggestion: safeZoneViolations > 0 ? 'Move elements away from edges' : undefined
    });

    // 3. Platform Specific Dimensions
    let dimensionsStatus: 'pass' | 'warning' | 'fail' = 'pass';
    let dimMessage = 'Canvas size optimied';

    if (platform === 'amazon' && Math.max(canvas.width, canvas.height) < 1000) {
        dimensionsStatus = 'fail';
        dimMessage = 'Amazon requires at least 1000px on longest side';
    }

    retailerChecks.push({
        rule: 'Image Dimensions',
        status: dimensionsStatus,
        message: dimMessage
    });

    // 4. File Size Estimation
    let estimatedSizeKB = 50; // Base overhead
    canvas.elements.forEach((el: any) => {
        if (el.type === 'image') estimatedSizeKB += 300; // Assume 300KB per image
        else estimatedSizeKB += 5; // Text/Shapes are light
    });

    retailerChecks.push({
        rule: 'Estimated File Size',
        status: estimatedSizeKB > 500 ? 'warning' : 'pass',
        message: `~${estimatedSizeKB} KB (Limit: 500 KB)`,
        suggestion: estimatedSizeKB > 500 ? 'Reduce number of images' : undefined
    });

    // Brand Checks (Mocked for now as we don't have real brand kit analysis)
    brandChecks.push({
        rule: 'Brand Colors',
        status: 'pass',
        message: 'Using default color palette',
    });

    const passCount = [...retailerChecks, ...brandChecks].filter(c => c.status === 'pass').length;
    const totalCount = retailerChecks.length + brandChecks.length;
    const overallScore = Math.round((passCount / totalCount) * 100);

    const hasViolations = [...retailerChecks, ...brandChecks].some(c => c.status === 'fail');
    const hasWarnings = [...retailerChecks, ...brandChecks].some(c => c.status === 'warning');

    return {
        status: hasViolations ? 'violation' : hasWarnings ? 'warning' : 'compliant',
        retailerChecks,
        brandChecks,
        overallScore,
    };
}
