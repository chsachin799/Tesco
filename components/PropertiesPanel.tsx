'use client';

import { useCanvasStore } from '@/store/canvas-store';
import {
    Type,
    Trash2,
    Layers,
    ArrowUp,
    ArrowDown,
    ArrowUpFromLine,
    ArrowDownToLine,
    Bold,
    Italic,
    Palette,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Type as TypeIcon
} from 'lucide-react';

const FONTS = [
    'Inter',
    'Outfit',
    'Roboto',
    'Lato',
    'Montserrat',
    'Poppins',
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Verdana'
];

export default function PropertiesPanel() {
    const selectedElementIds = useCanvasStore((state) => state.canvas.selectedElementIds);
    const elements = useCanvasStore((state) => state.canvas.elements);
    const updateElement = useCanvasStore((state) => state.updateElement);
    const deleteElement = useCanvasStore((state) => state.deleteElement);

    // Layer actions
    const bringToFront = useCanvasStore((state) => state.bringToFront);
    const sendToBack = useCanvasStore((state) => state.sendToBack);
    const bringForward = useCanvasStore((state) => state.bringForward);
    const sendBackward = useCanvasStore((state) => state.sendBackward);

    // Helper to add text from the panel
    const addTextTrigger = () => {
        // We need a way to trigger addText from here. 
        // Ideally, we shouldn't couple this, but for now, let's just show a hint.
        // OR we can dispatch a custom event.
        const event = new CustomEvent('trigger-add-text');
        window.dispatchEvent(event);
    };

    // We'll adding a listener in CanvasEditor for this custom event

    if (selectedElementIds.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 h-full">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                    <Palette className="w-8 h-8 text-white/20" />
                </div>
                <p className="text-gray-400 text-sm">Select an element to edit properties</p>

                <div className="w-full pt-6 border-t border-white/10">
                    <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-medium">Quick Actions</p>
                    <button
                        onClick={addTextTrigger}
                        className="w-full btn-secondary text-sm flex items-center justify-center gap-2 mb-2"
                    >
                        <TypeIcon className="w-4 h-4" />
                        Add Text
                    </button>
                    <p className="text-xs text-gray-600 mt-2">
                        Use the toolbar or drag & drop assets
                    </p>
                </div>
            </div>
        );
    }

    // For simplicity, handle single selection for now
    const selectedId = selectedElementIds[0];
    const element = elements.find((el) => el.id === selectedId);

    if (!element) return null;

    const isText = element.type === 'i-text' || element.type === 'text';
    const isImage = element.type === 'image';
    const isShape = !isText && !isImage;

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this element?')) {
            deleteElement(selectedId);
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Properties</h3>

            {/* Common Properties: Layout */}
            <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    Layout & Position
                </h4>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-xs text-gray-500">Width</label>
                        <input
                            type="number"
                            value={Math.round(element.width * element.scaleX)}
                            onChange={(e) => updateElement(selectedId, { scaleX: Number(e.target.value) / element.width })}
                            className="input-field py-1 text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">Height</label>
                        <input
                            type="number"
                            value={Math.round(element.height * element.scaleY)}
                            onChange={(e) => updateElement(selectedId, { scaleY: Number(e.target.value) / element.height })}
                            className="input-field py-1 text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">X</label>
                        <input
                            type="number"
                            value={Math.round(element.x)}
                            onChange={(e) => updateElement(selectedId, { x: Number(e.target.value) })}
                            className="input-field py-1 text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">Y</label>
                        <input
                            type="number"
                            value={Math.round(element.y)}
                            onChange={(e) => updateElement(selectedId, { y: Number(e.target.value) })}
                            className="input-field py-1 text-sm"
                        />
                    </div>
                </div>
            </div>

            <hr className="border-white/10" />

            {/* Text Properties */}
            {isText && (
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                        <TypeIcon className="w-4 h-4" />
                        Text Styles
                    </h4>

                    {/* Content */}
                    <textarea
                        value={element.text || ''}
                        onChange={(e) => updateElement(selectedId, { text: e.target.value })}
                        className="input-field min-h-[80px]"
                        placeholder="Edit text content..."
                    />

                    {/* Font Family */}
                    <div>
                        <label className="text-xs text-gray-500">Font Family</label>
                        <select
                            value={(element as any).fontFamily || 'Inter'}
                            onChange={(e) => updateElement(selectedId, { fontFamily: e.target.value } as any)}
                            className="input-field py-2 text-sm"
                        >
                            {FONTS.map(font => (
                                <option key={font} value={font}>{font}</option>
                            ))}
                        </select>
                    </div>

                    {/* Font Size & Color */}
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs text-gray-500">Size</label>
                            <input
                                type="number"
                                value={(element as any).fontSize || 16}
                                onChange={(e) => updateElement(selectedId, { fontSize: Number(e.target.value) } as any)}
                                className="input-field py-1 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500">Color</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={element.fill as string || '#000000'}
                                    onChange={(e) => updateElement(selectedId, { fill: e.target.value })}
                                    className="w-full h-8 rounded cursor-pointer bg-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Style Toggles */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => updateElement(selectedId, { fontWeight: (element as any).fontWeight === 'bold' ? 'normal' : 'bold' } as any)}
                            className={`p-2 rounded hover:bg-white/10 ${(element as any).fontWeight === 'bold' ? 'bg-primary-500/20 text-primary-300' : 'text-gray-400'}`}
                        >
                            <Bold className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => updateElement(selectedId, { fontStyle: (element as any).fontStyle === 'italic' ? 'normal' : 'italic' } as any)}
                            className={`p-2 rounded hover:bg-white/10 ${(element as any).fontStyle === 'italic' ? 'bg-primary-500/20 text-primary-300' : 'text-gray-400'}`}
                        >
                            <Italic className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Shape/Generic Colors */}
            {!isText && !isImage && (
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Appearance
                    </h4>
                    <div>
                        <label className="text-xs text-gray-500">Fill Color</label>
                        <input
                            type="color"
                            value={element.fill as string || '#000000'}
                            onChange={(e) => updateElement(selectedId, { fill: e.target.value })}
                            className="w-full h-8 rounded cursor-pointer"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-gray-500">Border</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={element.stroke as string || '#transparent'}
                                onChange={(e) => updateElement(selectedId, { stroke: e.target.value })}
                                className="w-8 h-8 rounded cursor-pointer shrink-0"
                                title="Border Color"
                            />
                            <input
                                type="number"
                                min="0"
                                max="20"
                                value={element.strokeWidth || 0}
                                onChange={(e) => updateElement(selectedId, { strokeWidth: Number(e.target.value) })}
                                className="input-field py-1 text-sm flex-1"
                                placeholder="Width"
                                title="Border Width"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Image Properties */}
            {isImage && (
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Image Style
                    </h4>
                    <div>
                        <label className="text-xs text-gray-500">Opacity</label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={element.opacity ?? 1}
                            onChange={(e) => updateElement(selectedId, { opacity: Number(e.target.value) })}
                            className="w-full accent-primary-500"
                        />
                    </div>
                </div>
            )}

            <hr className="border-white/10" />

            {/* Layer Management */}
            <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Layers
                </h4>
                <div className="grid grid-cols-4 gap-2">
                    <button onClick={() => bringToFront(selectedId)} className="btn-secondary p-2 flex justify-center" title="Bring to Front">
                        <ArrowUpFromLine className="w-4 h-4" />
                    </button>
                    <button onClick={() => bringForward(selectedId)} className="btn-secondary p-2 flex justify-center" title="Bring Forward">
                        <ArrowUp className="w-4 h-4" />
                    </button>
                    <button onClick={() => sendBackward(selectedId)} className="btn-secondary p-2 flex justify-center" title="Send Backward">
                        <ArrowDown className="w-4 h-4" />
                    </button>
                    <button onClick={() => sendToBack(selectedId)} className="btn-secondary p-2 flex justify-center" title="Send to Back">
                        <ArrowDownToLine className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <hr className="border-white/10" />

            {/* Actions */}
            <div className="pt-2">
                <button
                    onClick={handleDelete}
                    className="w-full btn-secondary text-red-400 hover:bg-red-500/10 hover:border-red-500/50 flex items-center justify-center gap-2"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete Element
                </button>
            </div>
        </div>
    );
}
