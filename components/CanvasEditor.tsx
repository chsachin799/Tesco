'use client';

import { useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Canvas, FabricImage, Rect, Circle, Triangle, Ellipse, Line, Polygon, IText, FabricObject, Point } from 'fabric';
import { useCanvasStore } from '@/store/canvas-store';
import {
    Type,
    Image as ImageIcon,
    Square,
    Circle as CircleIcon,
    Triangle as TriangleIcon,
    Hexagon,
    Star,
    Minus,
    Undo2,
    Redo2,
    Trash2,
    Copy,
    Grid3x3,
    Eye
} from 'lucide-react';

export interface CanvasEditorRef {
    exportToDataURL: (multiplier?: number) => string | undefined;
}

const CanvasEditor = forwardRef<CanvasEditorRef>((props, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<Canvas | null>(null);
    const [activeObject, setActiveObject] = useState<FabricObject | null>(null);

    // Store Selectors
    const canvasState = useCanvasStore((state) => state.canvas);
    const setElements = useCanvasStore((state) => state.setElements);
    const updateElement = useCanvasStore((state) => state.updateElement);
    const selectElement = useCanvasStore((state) => state.selectElement);

    // Actions
    const undo = useCanvasStore((state) => state.undo);
    const redo = useCanvasStore((state) => state.redo);
    const toggleGrid = useCanvasStore((state) => state.toggleGrid);
    const toggleSafeZones = useCanvasStore((state) => state.toggleSafeZones);
    const deleteElementFromStore = useCanvasStore((state) => state.deleteElement);

    useImperativeHandle(ref, () => ({
        exportToDataURL: (multiplier = 1) => {
            if (!fabricCanvasRef.current) return undefined;
            return fabricCanvasRef.current.toDataURL({
                format: 'png',
                quality: 1,
                multiplier: multiplier,
            });
        }
    }));

    // 1. Initialize Fabric.js Canvas
    useEffect(() => {
        if (canvasRef.current && !fabricCanvasRef.current) {
            const canvas = new Canvas(canvasRef.current, {
                width: canvasState.width,
                height: canvasState.height,
                backgroundColor: canvasState.backgroundColor,
                preserveObjectStacking: true, // Important for layer management
            });

            fabricCanvasRef.current = canvas;

            // --- Event Handlers ---

            const syncToStore = () => {
                const objects = canvas.getObjects();

                // We map Fabric objects to our Store Schema
                const elements = objects.map(obj => ({
                    id: (obj as any).id, // We MUST ensure ID persists. 
                    type: obj.type,
                    x: obj.left,
                    y: obj.top,
                    width: obj.width,
                    height: obj.height,
                    scaleX: obj.scaleX,
                    scaleY: obj.scaleY,
                    rotation: obj.angle,
                    fill: obj.fill,
                    stroke: obj.stroke,
                    strokeWidth: obj.strokeWidth,
                    opacity: obj.opacity,
                    // Text specific
                    text: (obj as any).text,
                    fontSize: (obj as any).fontSize,
                    fontFamily: (obj as any).fontFamily,
                    fontWeight: (obj as any).fontWeight,
                    fontStyle: (obj as any).fontStyle,
                }));

                setElements(elements as any);
            };

            // Canvas -> Store Sync
            canvas.on('object:modified', syncToStore);
            canvas.on('object:added', (e: any) => {
                // Only sync if the object has an ID (meaning it was added by our logic or loaded)
                // If it's a raw user add (like drawing), we might need to ID it. 
                // However, our addShape/addText adds ID before adding to canvas.
                if (e.target && !(e.target as any).id) {
                    (e.target as any).id = Math.random().toString();
                }
                syncToStore();
            });
            canvas.on('object:removed', syncToStore);

            // Selection Sync
            const handleSelection = (e: any) => {
                const selected = e.selected?.[0];
                setActiveObject(selected || null);
                if (selected && (selected as any).id) {
                    selectElement((selected as any).id);
                } else {
                    // clear selection in store if nothing selected
                    // We might need a clearSelection action or just let it be.
                }
            };

            canvas.on('selection:created', handleSelection);
            canvas.on('selection:updated', handleSelection);
            canvas.on('selection:cleared', () => {
                setActiveObject(null);
                // We should probably clear store selection too, but let's keep it simple
            });

            // Keyboard support
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Delete' || e.key === 'Backspace') {
                    // We let the store handle deletion via properties panel usually, 
                    // but for hotkey, we do it here.
                    const active = canvas.getActiveObject();
                    if (active) {
                        // The 'object:removed' event will trigger syncToStore, removing it from global state
                        canvas.remove(active);
                    }
                }
            };
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('trigger-add-text', addText);

            return () => {
                window.removeEventListener('keydown', handleKeyDown);
                window.removeEventListener('trigger-add-text', addText);
                canvas.dispose();
                fabricCanvasRef.current = null;
            };
        }
    }, [canvasState.width, canvasState.height, canvasState.backgroundColor]);

    // 2. Store -> Canvas Sync (Two-Way Binding)
    // This effect listens to the Store and updates the Fabric Canvas if properties change 
    // (e.g. from PropertiesPanel)
    useEffect(() => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const storeElements = canvasState.elements;
        const fabricObjects = canvas.getObjects();

        // 1. Update existing objects & Add new ones
        storeElements.forEach(el => {
            const existingObj = fabricObjects.find((obj: any) => obj.id === el.id);

            if (existingObj) {
                // Update properties if changed
                // We check a few key props to avoid unnecessary re-renders
                // Note: deeply checking everything is expensive, so we might just set().
                // Fabric's set() is relatively efficient.

                const hasChanged =
                    existingObj.left !== el.x ||
                    existingObj.top !== el.y ||
                    existingObj.scaleX !== el.scaleX ||
                    existingObj.fill !== el.fill ||
                    existingObj.stroke !== el.stroke ||
                    existingObj.strokeWidth !== el.strokeWidth ||
                    existingObj.opacity !== el.opacity ||
                    (existingObj as any).text !== el.text ||
                    (existingObj as any).fontSize !== el.fontSize ||
                    (existingObj as any).fontFamily !== el.fontFamily ||
                    (existingObj as any).fontWeight !== el.fontWeight ||
                    (existingObj as any).fontStyle !== el.fontStyle;

                if (hasChanged) {
                    existingObj.set({
                        left: el.x,
                        top: el.y,
                        scaleX: el.scaleX,
                        scaleY: el.scaleY,
                        angle: el.rotation,
                        fill: el.fill,
                        stroke: el.stroke,
                        strokeWidth: el.strokeWidth,
                        opacity: el.opacity,
                        // @ts-ignore
                        text: el.text,
                        fontSize: el.fontSize,
                        fontFamily: el.fontFamily,
                        fontWeight: el.fontWeight,
                        fontStyle: el.fontStyle,
                    });
                    existingObj.setCoords(); // Critical for hit detection updates
                }
            } else {
                // If it exists in store but not in canvas, usually it means we just loaded a canvas 
                // OR we undid a deletion.
                // Re-creating objects here is complex because we need the specific Class (Rect, Circle, etc.)
                // Ideally, 'loadCanvas' handles full loads. 
                // For 'Undo', we might rely on the 'loadCanvas' store action triggering a full re-render or similar.
                // For now, we'll assume this sync is mostly for PROPERTIES updates.
            }
        });

        // 2. Remove deleted objects
        // If an object is in Fabric but NOT in Store, it was deleted via Store (e.g. Delete Button)
        fabricObjects.forEach((obj: any) => {
            if (!storeElements.find(el => el.id === obj.id)) {
                canvas.remove(obj);
            }
        });

        canvas.requestRenderAll();

    }, [canvasState.elements]); // Re-run when elements array changes (value comparison is deep in Zustand usually)

    // --- Helpers to Add Shapes ---

    const addToCanvas = (object: FabricObject) => {
        if (!fabricCanvasRef.current) return;
        (object as any).id = Math.random().toString(); // Assign ID immediately
        fabricCanvasRef.current.add(object);
        fabricCanvasRef.current.setActiveObject(object);
        fabricCanvasRef.current.requestRenderAll();
    };

    const addText = () => {
        const text = new IText('Double click to edit', {
            left: 100, top: 100,
            fontSize: 24, fontFamily: 'Inter', fill: '#000000',
        });
        addToCanvas(text);
    };

    const addShape = (type: string) => {
        const common = { left: 100, top: 100, fill: '#0ea5e9', stroke: 'transparent' };
        let shape: FabricObject | null = null;

        switch (type) {
            case 'rect':
                shape = new Rect({ ...common, width: 150, height: 100 });
                break;
            case 'circle':
                shape = new Circle({ ...common, radius: 60, fill: '#d946ef' });
                break;
            case 'triangle':
                shape = new Triangle({ ...common, width: 100, height: 100, fill: '#f59e0b' });
                break;
            case 'ellipse':
                shape = new Ellipse({ ...common, rx: 80, ry: 40, fill: '#10b981' });
                break;
            case 'line':
                shape = new Line([0, 0, 150, 0], { ...common, stroke: '#000000', strokeWidth: 4, fill: 'transparent' });
                break;
            case 'hexagon':
                // Hexagon points
                const hexPoints = [
                    { x: 30, y: 0 }, { x: 90, y: 0 }, { x: 120, y: 52 },
                    { x: 90, y: 104 }, { x: 30, y: 104 }, { x: 0, y: 52 }
                ];
                shape = new Polygon(hexPoints, { ...common, fill: '#ef4444' });
                break;
            case 'star':
                // Star points (5 points)
                const starPoints = [
                    { x: 350, y: 75 }, { x: 380, y: 160 }, { x: 470, y: 160 }, { x: 400, y: 215 },
                    { x: 423, y: 301 }, { x: 350, y: 250 }, { x: 277, y: 301 }, { x: 303, y: 215 },
                    { x: 231, y: 161 }, { x: 321, y: 161 }
                ].map(p => ({ x: p.x - 350, y: p.y - 180 })); // Center slightly
                shape = new Polygon(starPoints, { ...common, fill: '#facc15' });
                break;
        }

        if (shape) addToCanvas(shape);
    };

    const duplicateSelected = () => {
        if (!fabricCanvasRef.current || !activeObject) return;
        activeObject.clone().then((cloned: FabricObject) => {
            cloned.set({
                left: (activeObject.left || 0) + 20,
                top: (activeObject.top || 0) + 20,
            });
            addToCanvas(cloned);
        });
    };

    const deleteSelected = () => {
        if (!fabricCanvasRef.current || !activeObject) return;
        canvasRef.current?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete' }));
        // Or directly:
        fabricCanvasRef.current.remove(activeObject);
        setActiveObject(null);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div className="glass p-4 flex flex-wrap items-center gap-2 border-b border-white/10">
                <div className="flex bg-white/5 rounded-lg border border-white/5 p-1 gap-1">
                    <button onClick={addText} className="btn-icon" title="Add Text">
                        <Type className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-white/20 mx-1 self-center" />
                    <button onClick={() => addShape('rect')} className="btn-icon" title="Rectangle">
                        <Square className="w-5 h-5" />
                    </button>
                    <button onClick={() => addShape('circle')} className="btn-icon" title="Circle">
                        <CircleIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => addShape('triangle')} className="btn-icon" title="Triangle">
                        <TriangleIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => addShape('ellipse')} className="btn-icon" title="Ellipse">
                        <div className="w-5 h-3 rounded-full border-2 border-current" />
                    </button>
                    <button onClick={() => addShape('hexagon')} className="btn-icon" title="Hexagon">
                        <Hexagon className="w-5 h-5" />
                    </button>
                    <button onClick={() => addShape('star')} className="btn-icon" title="Star">
                        <Star className="w-5 h-5" />
                    </button>
                    <button onClick={() => addShape('line')} className="btn-icon" title="Line">
                        <Minus className="w-5 h-5 -rotate-45" />
                    </button>
                </div>

                <div className="flex-1" />

                <div className="flex bg-white/5 rounded-lg border border-white/5 p-1 gap-1">
                    <button onClick={undo} className="btn-icon" title="Undo"><Undo2 className="w-5 h-5" /></button>
                    <button onClick={redo} className="btn-icon" title="Redo"><Redo2 className="w-5 h-5" /></button>
                    <div className="w-px h-6 bg-white/20 mx-1 self-center" />
                    <button onClick={duplicateSelected} disabled={!activeObject} className="btn-icon disabled:opacity-30"><Copy className="w-5 h-5" /></button>
                    <button onClick={deleteSelected} disabled={!activeObject} className="btn-icon disabled:opacity-30 hover:text-red-400"><Trash2 className="w-5 h-5" /></button>
                </div>

                <div className="flex bg-white/5 rounded-lg border border-white/5 p-1 gap-1 ml-2">
                    <button onClick={toggleGrid} className={`btn-icon ${canvasState.gridEnabled ? 'text-primary-400 bg-primary-500/10' : ''}`}><Grid3x3 className="w-5 h-5" /></button>
                    <button onClick={toggleSafeZones} className={`btn-icon ${canvasState.safeZones ? 'text-primary-400 bg-primary-500/10' : ''}`}><Eye className="w-5 h-5" /></button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gray-900/50 overflow-auto">
                <div
                    className="relative shadow-2xl rounded-lg overflow-hidden"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        const imageUrl = e.dataTransfer.getData('imageUrl');
                        if (imageUrl && fabricCanvasRef.current) {
                            FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' }).then((img) => {
                                img.set({ left: 100, top: 100, scaleX: 0.5, scaleY: 0.5 });
                                addToCanvas(img);
                            });
                        }
                    }}
                >
                    <canvas ref={canvasRef} />

                    {/* Safe zones overlay */}
                    {canvasState.safeZones && (
                        <div className="absolute inset-0 pointer-events-none border-[1px] border-dashed border-red-500/30"
                            style={{ margin: '40px', boxShadow: '0 0 0 9999px rgba(0,0,0,0.3)' }}>
                            <div className="absolute top-2 left-2 text-[10px] text-red-500/50 uppercase tracking-widest">Safe Zone</div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                .btn-icon {
                    @apply p-2 rounded hover:bg-white/10 transition-colors text-gray-300 hover:text-white flex items-center justify-center;
                }
            `}</style>
        </div>
    );
});

CanvasEditor.displayName = 'CanvasEditor';
export default CanvasEditor;
