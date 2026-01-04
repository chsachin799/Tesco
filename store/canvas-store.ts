import { create } from 'zustand';
import { CanvasElement, CanvasState } from '@/types';

interface CanvasStore {
    canvas: CanvasState;
    history: CanvasState[];
    historyIndex: number;

    // Canvas actions
    setCanvasSize: (width: number, height: number) => void;
    setBackgroundColor: (color: string) => void;
    toggleSafeZones: () => void;
    toggleGrid: () => void;

    // Element actions
    addElement: (element: CanvasElement) => void;
    updateElement: (id: string, updates: Partial<CanvasElement>) => void;
    deleteElement: (id: string) => void;
    duplicateElement: (id: string) => void;

    // Selection actions
    selectElement: (id: string) => void;
    selectMultiple: (ids: string[]) => void;
    clearSelection: () => void;

    // Layer actions
    bringToFront: (id: string) => void;
    sendToBack: (id: string) => void;
    bringForward: (id: string) => void;
    sendBackward: (id: string) => void;

    // History actions
    undo: () => void;
    redo: () => void;
    saveToHistory: () => void;

    // Utility actions
    clearCanvas: () => void;
    loadCanvas: (state: CanvasState) => void;
    setElements: (elements: CanvasElement[]) => void;
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
    canvas: {
        width: 1080,
        height: 1080,
        elements: [],
        selectedElementIds: [],
        backgroundColor: '#ffffff',
        safeZones: true,
        gridEnabled: false,
    },
    history: [],
    historyIndex: -1,

    setElements: (elements) => {
        set((state: CanvasStore) => ({
            canvas: { ...state.canvas, elements },
        }));
    },

    setCanvasSize: (width, height) => {
        set((state: CanvasStore) => ({
            canvas: { ...state.canvas, width, height },
        }));
    },

    setBackgroundColor: (color) => {
        set((state: CanvasStore) => ({
            canvas: { ...state.canvas, backgroundColor: color },
        }));
    },

    toggleSafeZones: () => {
        set((state: CanvasStore) => ({
            canvas: { ...state.canvas, safeZones: !state.canvas.safeZones },
        }));
    },

    toggleGrid: () => {
        set((state: CanvasStore) => ({
            canvas: { ...state.canvas, gridEnabled: !state.canvas.gridEnabled },
        }));
    },

    addElement: (element) => {
        set((state: CanvasStore) => ({
            canvas: {
                ...state.canvas,
                elements: [...state.canvas.elements, element],
                selectedElementIds: [element.id],
            },
        }));
        get().saveToHistory();
    },

    updateElement: (id, updates) => {
        set((state: CanvasStore) => ({
            canvas: {
                ...state.canvas,
                elements: state.canvas.elements.map((el: CanvasElement) =>
                    el.id === id ? { ...el, ...updates } : el
                ),
            },
        }));
        get().saveToHistory();
    },

    deleteElement: (id) => {
        set((state: CanvasStore) => ({
            canvas: {
                ...state.canvas,
                elements: state.canvas.elements.filter((el: CanvasElement) => el.id !== id),
                selectedElementIds: state.canvas.selectedElementIds.filter((selectedId: string) => selectedId !== id),
            },
        }));
        get().saveToHistory();
    },

    duplicateElement: (id) => {
        const state = get();
        const elementToDuplicate = state.canvas.elements.find((el: CanvasElement) => el.id === id);

        if (elementToDuplicate) {
            const newElement = {
                ...elementToDuplicate,
                id: Math.random().toString(),
                x: elementToDuplicate.x + 20,
                y: elementToDuplicate.y + 20,
            };
            get().addElement(newElement);
        }
    },

    selectElement: (id) => {
        set((state: CanvasStore) => ({
            canvas: {
                ...state.canvas,
                selectedElementIds: [id],
            },
        }));
    },

    selectMultiple: (ids) => {
        set((state: CanvasStore) => ({
            canvas: {
                ...state.canvas,
                selectedElementIds: ids,
            },
        }));
    },

    clearSelection: () => {
        set((state: CanvasStore) => ({
            canvas: {
                ...state.canvas,
                selectedElementIds: [],
            },
        }));
    },

    bringToFront: (id) => {
        set((state: CanvasStore) => {
            const elements = [...state.canvas.elements];
            const index = elements.findIndex((el: CanvasElement) => el.id === id);
            if (index !== -1) {
                const [element] = elements.splice(index, 1);
                elements.push(element);
            }
            return { canvas: { ...state.canvas, elements } };
        });
    },

    sendToBack: (id) => {
        set((state: CanvasStore) => {
            const elements = [...state.canvas.elements];
            const index = elements.findIndex((el) => el.id === id);
            if (index !== -1) {
                const [element] = elements.splice(index, 1);
                elements.unshift(element);
            }
            return { canvas: { ...state.canvas, elements } };
        });
    },

    bringForward: (id) => {
        set((state: CanvasStore) => {
            const elements = [...state.canvas.elements];
            const index = elements.findIndex((el) => el.id === id);
            if (index !== -1 && index < elements.length - 1) {
                [elements[index], elements[index + 1]] = [elements[index + 1], elements[index]];
            }
            return { canvas: { ...state.canvas, elements } };
        });
    },

    sendBackward: (id) => {
        set((state: CanvasStore) => {
            const elements = [...state.canvas.elements];
            const index = elements.findIndex((el) => el.id === id);
            if (index > 0) {
                [elements[index], elements[index - 1]] = [elements[index - 1], elements[index]];
            }
            return { canvas: { ...state.canvas, elements } };
        });
    },

    undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
            set({
                historyIndex: historyIndex - 1,
                canvas: history[historyIndex - 1],
            });
        }
    },

    redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
            set({
                historyIndex: historyIndex + 1,
                canvas: history[historyIndex + 1],
            });
        }
    },

    saveToHistory: () => {
        set((state: CanvasStore) => {
            const newHistory = state.history.slice(0, state.historyIndex + 1);
            newHistory.push(state.canvas);
            return {
                history: newHistory,
                historyIndex: newHistory.length - 1,
            };
        });
    },

    clearCanvas: () => {
        set((state: CanvasStore) => ({
            canvas: { ...state.canvas, elements: [], selectedElementIds: [] },
        }));
        get().saveToHistory();
    },

    loadCanvas: (canvasState) => {
        set((state: CanvasStore) => ({
            canvas: canvasState,
        }));
        get().saveToHistory();
    },
}));
