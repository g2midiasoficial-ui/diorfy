import React, { useState, useRef, useEffect } from 'react';
import { BoardItem, CanvasElement, CanvasFrame, CommentPin, ShapeType, Point } from '../../types/miro';
import { CanvasTopNav } from './CanvasTopNav';
import { CanvasToolbar, CanvasTool } from './CanvasToolbar';
import { StickyNoteElement } from './StickyNoteElement';
import { ShapeElement } from './ShapeElement';
import { ImageElement } from './ImageElement';
import { ConnectorElement } from './ConnectorElement';
import { TextElement } from './TextElement';
import { FrameElement } from './FrameElement';
import { CommentPinElement } from './CommentPinElement';
import { SelectionToolbar } from './SelectionToolbar';
import { TransformBoundingBox, ResizeHandleType } from './TransformBoundingBox';
import { ZoomControlsMenu } from './ZoomControlsMenu';
import { NanoBananaStudio } from './NanoBananaStudio';
import { AiAgentPanel } from './AiAgentPanel';
import { SlideMotionStudio } from './SlideMotionStudio';
import { MindmapStudio } from './MindmapStudio';
import { CommandPalette } from './CommandPalette';
import { Minimap } from './Minimap';
import { TimerWidget } from './TimerWidget';
import { VotingWidget } from './VotingWidget';
import { AIModal } from './AIModal';
import { PresentationMode } from './PresentationMode';
import { ShareModal } from './ShareModal';
import { ShortcutsModal } from './ShortcutsModal';
import {
  CustomShortcutMap,
  DEFAULT_SHORTCUTS,
} from '../../types/shortcuts';
import { playSound, isSoundEnabled, setSoundEnabled } from '../../utils/soundEffects';
import {
  Minus,
  Plus,
  HelpCircle,
  Map,
  Layers,
  Sparkles,
  Download,
  X,
  FileImage,
  FileCode,
  Check,
  ChevronDown,
  Copy,
  ClipboardPaste,
  Scissors,
  FileUp,
  Maximize2,
  Link,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BoardCanvasProps {
  board: BoardItem;
  onBackToDashboard: () => void;
  onUpdateBoard: (board: BoardItem) => void;
  onOpenUpgrade: () => void;
}

export const BoardCanvas: React.FC<BoardCanvasProps> = ({
  board,
  onBackToDashboard,
  onUpdateBoard,
  onOpenUpgrade,
}) => {
  // Canvas Viewport & Zoom state
  const [pan, setPan] = useState(
    board.viewState ? { x: board.viewState.panX, y: board.viewState.panY } : { x: 50, y: 50 }
  );
  const [zoom, setZoom] = useState(board.viewState ? board.viewState.zoom : 0.85);
  const [wheelZoomMode, setWheelZoomMode] = useState<'zoom' | 'pan'>('pan');
  const [isZoomMenuOpen, setIsZoomMenuOpen] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  // Active Tool
  const [activeTool, setActiveTool] = useState<CanvasTool>('select');

  // Board Data Elements & Frames
  const [elements, setElements] = useState<CanvasElement[]>(board.elements || []);
  const [frames, setFrames] = useState<CanvasFrame[]>(board.frames || []);
  const [comments, setComments] = useState<CommentPin[]>(board.comments || []);

  // Selection state
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);

  // Marquee Box Selection state
  const [isMarqueeSelecting, setIsMarqueeSelecting] = useState(false);
  const [marqueeStart, setMarqueeStart] = useState<Point>({ x: 0, y: 0 });
  const [marqueeCurrent, setMarqueeCurrent] = useState<Point>({ x: 0, y: 0 });

  // Custom Shortcuts & Preferences State
  const [customShortcuts, setCustomShortcuts] = useState<CustomShortcutMap>(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('diorfy_custom_shortcuts');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return {};
  });

  const [isSoundOn, setIsSoundOn] = useState<boolean>(() => isSoundEnabled());
  const [gridSnapSize, setGridSnapSize] = useState<number>(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('diorfy_grid_snap');
      if (saved) return Number(saved);
    }
    return 0;
  });

  const [canvasBgStyle, setCanvasBgStyle] = useState<'grid' | 'dots' | 'blueprint' | 'dark' | 'clean'>(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('diorfy_canvas_bg');
      if (saved) return saved as any;
    }
    return 'grid';
  });

  // History stack for Undo / Redo
  const [history, setHistory] = useState<{ elements: CanvasElement[]; frames: CanvasFrame[] }[]>([
    { elements: board.elements || [], frames: board.frames || [] },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Clipboard & Mouse position references for seamless copy/paste
  const internalClipboardRef = useRef<CanvasElement[]>([]);
  const lastPointerPosRef = useRef<{ x: number; y: number }>({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  // Drag and Drop & Context Menu & Toast states
  const [isDraggingFileOver, setIsDraggingFileOver] = useState(false);
  const [toastNotification, setToastNotification] = useState<{ id: string; message: string; icon?: string } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; worldX: number; worldY: number; elementId?: string } | null>(null);

  const showToast = (message: string, icon: string = '📋') => {
    setToastNotification({ id: String(Date.now()), message, icon });
    setTimeout(() => setToastNotification(null), 2500);
  };

  // Dragging & Interaction refs
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Point>({ x: 0, y: 0 });

  // Moving elements
  const [isDraggingElements, setIsDraggingElements] = useState(false);
  const [dragStartPos, setDragStartPos] = useState<Point>({ x: 0, y: 0 });
  const [dragInitialElements, setDragInitialElements] = useState<Record<string, { x: number; y: number }>>({});

  // Mouse Resizing with Handles
  const [isResizing, setIsResizing] = useState<ResizeHandleType | null>(null);
  const [resizeStartPos, setResizeStartPos] = useState<Point>({ x: 0, y: 0 });
  const [resizeInitialBounds, setResizeInitialBounds] = useState<
    Record<string, { x: number; y: number; width: number; height: number; rotation: number }>
  >({});

  // Freehand Drawing (Pen / Highlighter)
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStrokePoints, setCurrentStrokePoints] = useState<Point[]>([]);

  // Connector drawing state
  const [connectorStartId, setConnectorStartId] = useState<string | null>(null);
  const [connectorAnchor, setConnectorAnchor] = useState<'top' | 'right' | 'bottom' | 'left'>('right');

  // Modals & Studios
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const [isVotingActive, setIsVotingActive] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isNanoBananaOpen, setIsNanoBananaOpen] = useState(false);
  const [isAiAgentOpen, setIsAiAgentOpen] = useState(false);
  const [isSlideMotionOpen, setIsSlideMotionOpen] = useState(false);
  const [isMindmapStudioOpen, setIsMindmapStudioOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isMinimapOpen, setIsMinimapOpen] = useState(false);
  const [isFramesListOpen, setIsFramesListOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Simulated Collaborator Cursors
  const [showCollabCursors, setShowCollabCursors] = useState(true);
  const [collabCursors, setCollabCursors] = useState([
    { id: 'mariana', name: 'Mariana Silva', color: '#3b82f6', x: 580, y: 340 },
    { id: 'carlos', name: 'Carlos Mendes', color: '#10b981', x: 890, y: 460 },
  ]);

  // Sync back to storage on changes
  useEffect(() => {
    onUpdateBoard({
      ...board,
      elements,
      frames,
      comments,
      viewState: { panX: pan.x, panY: pan.y, zoom },
    });
  }, [elements, frames, comments, pan, zoom]);

  // Push history on major state change
  const pushHistory = (newElements: CanvasElement[], newFrames: CanvasFrame[]) => {
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push({
      elements: JSON.parse(JSON.stringify(newElements)),
      frames: JSON.parse(JSON.stringify(newFrames)),
    });
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      playSound.click();
      const prev = history[historyIndex - 1];
      setElements(prev.elements);
      setFrames(prev.frames);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      playSound.click();
      const next = history[historyIndex + 1];
      setElements(next.elements);
      setFrames(next.frames);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Preference Handlers
  const handleToggleSound = () => {
    const nextState = !isSoundOn;
    setIsSoundOn(nextState);
    setSoundEnabled(nextState);
  };

  const handleChangeGridSnap = (size: number) => {
    setGridSnapSize(size);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('diorfy_grid_snap', String(size));
    }
  };

  const handleChangeCanvasBg = (style: 'grid' | 'dots' | 'blueprint' | 'dark' | 'clean') => {
    setCanvasBgStyle(style);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('diorfy_canvas_bg', style);
    }
  };

  const handleUpdateShortcut = (actionId: string, shortcut: { key: string; ctrlKey?: boolean; shiftKey?: boolean; altKey?: boolean; metaKey?: boolean }) => {
    const updated = { ...customShortcuts, [actionId]: shortcut };
    setCustomShortcuts(updated);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('diorfy_custom_shortcuts', JSON.stringify(updated));
    }
  };

  const handleResetAllShortcuts = () => {
    setCustomShortcuts({});
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('diorfy_custom_shortcuts');
    }
  };

  // Grid Snapping Helper
  const snapVal = (val: number) => {
    if (gridSnapSize <= 0) return Math.round(val);
    return Math.round(val / gridSnapSize) * gridSnapSize;
  };

  // Lock / Unlock Selection Handler
  const handleToggleLockSelection = () => {
    if (selectedElementIds.length === 0) return;
    playSound.lock();
    const someLocked = elements.some((el) => selectedElementIds.includes(el.id) && el.style.isLocked);
    const nextLockState = !someLocked;
    const updated = elements.map((el) => {
      if (selectedElementIds.includes(el.id)) {
        return {
          ...el,
          style: { ...el.style, isLocked: nextLockState },
        };
      }
      return el;
    });
    setElements(updated);
    pushHistory(updated, frames);
  };

  // Live cursor animation loop
  useEffect(() => {
    if (!showCollabCursors) return;
    const interval = setInterval(() => {
      setCollabCursors((prev) =>
        prev.map((c) => ({
          ...c,
          x: c.x + (Math.random() - 0.5) * 40,
          y: c.y + (Math.random() - 0.5) * 30,
        }))
      );
    }, 2500);
    return () => clearInterval(interval);
  }, [showCollabCursors]);

  // Screen to World Coordinates conversion
  const screenToWorld = (screenX: number, screenY: number): Point => {
    if (!canvasRef.current) return { x: screenX, y: screenY };
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (screenX - rect.left - pan.x) / zoom;
    const y = (screenY - rect.top - pan.y) / zoom;
    return { x, y };
  };

  // Zoom helpers
  const handleZoomChange = (delta: number) => {
    playSound.click();
    setZoom((prev) => Math.min(3.0, Math.max(0.15, Number((prev + delta).toFixed(2)))));
  };

  const resetZoom = () => {
    playSound.click();
    setZoom(1);
    setPan({ x: 100, y: 100 });
  };

  // Fit all elements to screen (Ajustar à tela)
  const fitToContent = () => {
    playSound.click();
    if (elements.length === 0 && frames.length === 0) {
      resetZoom();
      return;
    }

    const allItems = [
      ...elements.map((el) => ({ x: el.x, y: el.y, width: el.width, height: el.height })),
      ...frames.map((f) => ({ x: f.x, y: f.y, width: f.width, height: f.height })),
    ];

    const minX = Math.min(...allItems.map((i) => i.x));
    const minY = Math.min(...allItems.map((i) => i.y));
    const maxX = Math.max(...allItems.map((i) => i.x + i.width));
    const maxY = Math.max(...allItems.map((i) => i.y + i.height));

    const contentWidth = Math.max(100, maxX - minX);
    const contentHeight = Math.max(100, maxY - minY);

    const vpWidth = canvasRef.current?.clientWidth || window.innerWidth;
    const vpHeight = canvasRef.current?.clientHeight || window.innerHeight;

    const scaleX = (vpWidth * 0.8) / contentWidth;
    const scaleY = (vpHeight * 0.8) / contentHeight;
    const optimalZoom = Math.min(2.0, Math.max(0.2, Number(Math.min(scaleX, scaleY).toFixed(2))));

    const centerContentX = minX + contentWidth / 2;
    const centerContentY = minY + contentHeight / 2;

    const newPanX = vpWidth / 2 - centerContentX * optimalZoom;
    const newPanY = vpHeight / 2 - centerContentY * optimalZoom;

    setZoom(optimalZoom);
    setPan({ x: Math.round(newPanX), y: Math.round(newPanY) });
  };

  // Zoom to Selected Elements
  const zoomToSelection = () => {
    playSound.click();
    if (selectedElementIds.length === 0) {
      fitToContent();
      return;
    }

    const selected = elements.filter((el) => selectedElementIds.includes(el.id));
    if (selected.length === 0) return;

    const minX = Math.min(...selected.map((i) => i.x));
    const minY = Math.min(...selected.map((i) => i.y));
    const maxX = Math.max(...selected.map((i) => i.x + i.width));
    const maxY = Math.max(...selected.map((i) => i.y + i.height));

    const contentWidth = Math.max(80, maxX - minX);
    const contentHeight = Math.max(80, maxY - minY);

    const vpWidth = canvasRef.current?.clientWidth || window.innerWidth;
    const vpHeight = canvasRef.current?.clientHeight || window.innerHeight;

    const scaleX = (vpWidth * 0.65) / contentWidth;
    const scaleY = (vpHeight * 0.65) / contentHeight;
    const optimalZoom = Math.min(2.5, Math.max(0.3, Number(Math.min(scaleX, scaleY).toFixed(2))));

    const centerContentX = minX + contentWidth / 2;
    const centerContentY = minY + contentHeight / 2;

    const newPanX = vpWidth / 2 - centerContentX * optimalZoom;
    const newPanY = vpHeight / 2 - centerContentY * optimalZoom;

    setZoom(optimalZoom);
    setPan({ x: Math.round(newPanX), y: Math.round(newPanY) });
  };

  // Directional Pan helper
  const handlePanBy = (dx: number, dy: number) => {
    playSound.click();
    setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  // Focal-Point Mouse Wheel Zoom & Pan
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    if (wheelZoomMode === 'zoom' || e.ctrlKey || e.metaKey) {
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      const newZoom = Math.min(3.0, Math.max(0.15, Number((zoom * zoomFactor).toFixed(2))));

      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const worldX = (mouseX - pan.x) / zoom;
        const worldY = (mouseY - pan.y) / zoom;

        const newPanX = mouseX - worldX * newZoom;
        const newPanY = mouseY - worldY * newZoom;

        setPan({ x: Math.round(newPanX), y: Math.round(newPanY) });
        setZoom(newZoom);
      } else {
        setZoom(newZoom);
      }
    } else {
      // Natural two-axis Pan (smooth trackpad & mouse wheel)
      // Scrolling down (deltaY > 0) moves view down so you see elements below!
      if (e.shiftKey) {
        setPan((prev) => ({
          x: prev.x - e.deltaY * 0.9,
          y: prev.y,
        }));
      } else {
        setPan((prev) => ({
          x: prev.x - (e.deltaX ? e.deltaX * 0.9 : 0),
          y: prev.y - e.deltaY * 0.9,
        }));
      }
    }
  };

  // Helper to match custom or default key shortcuts
  const matchShortcut = (actionId: string, e: KeyboardEvent): boolean => {
    const def = DEFAULT_SHORTCUTS.find((s) => s.id === actionId);
    const custom = customShortcuts[actionId];

    const keyToMatch = custom ? custom.key : def?.defaultKey;
    const needsCtrl = custom ? !!custom.ctrlKey : !!def?.ctrlKey;
    const needsShift = custom ? !!custom.shiftKey : !!def?.shiftKey;
    const needsAlt = custom ? !!custom.altKey : !!def?.altKey;

    if (!keyToMatch) return false;

    const eventKey = e.key.toLowerCase();
    const targetKey = keyToMatch.toLowerCase();

    const hasCtrl = e.ctrlKey || e.metaKey;
    const hasShift = e.shiftKey;
    const hasAlt = e.altKey;

    return (
      eventKey === targetKey &&
      hasCtrl === needsCtrl &&
      hasShift === needsShift &&
      hasAlt === needsAlt
    );
  };

  // Spacebar and Global Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl as HTMLElement).isContentEditable);

      if (isInput) return;

      // Spacebar for hand / pan mode
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setIsSpacePressed(true);
        return;
      }

      // Arrow Keys: Nudge selected elements or Pan viewport
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? 20 : 4;
        const panStep = e.shiftKey ? 150 : 50;

        if (selectedElementIds.length > 0) {
          let dx = 0;
          let dy = 0;
          if (e.key === 'ArrowUp') dy = -step;
          if (e.key === 'ArrowDown') dy = step;
          if (e.key === 'ArrowLeft') dx = -step;
          if (e.key === 'ArrowRight') dx = step;

          setElements((prev) =>
            prev.map((el) => {
              if (selectedElementIds.includes(el.id) && !el.style.isLocked) {
                return { ...el, x: snapVal(el.x + dx), y: snapVal(el.y + dy) };
              }
              return el;
            })
          );
        } else {
          // Pan canvas viewport
          if (e.key === 'ArrowUp') setPan((p) => ({ ...p, y: p.y + panStep }));
          if (e.key === 'ArrowDown') setPan((p) => ({ ...p, y: p.y - panStep }));
          if (e.key === 'ArrowLeft') setPan((p) => ({ ...p, x: p.x + panStep }));
          if (e.key === 'ArrowRight') setPan((p) => ({ ...p, x: p.x - panStep }));
        }
        return;
      }

      // Command Palette
      if (matchShortcut('action_command_palette', e)) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // AI Copilot
      if (matchShortcut('action_ai_copilot', e)) {
        e.preventDefault();
        setIsAiAgentOpen((prev) => !prev);
        return;
      }

      // Nano Banana
      if (matchShortcut('action_nano_banana', e)) {
        e.preventDefault();
        setIsNanoBananaOpen(true);
        return;
      }

      // Motion Slides
      if (matchShortcut('action_motion_slides', e)) {
        e.preventDefault();
        setIsSlideMotionOpen(true);
        return;
      }

      // Mindmap Studio
      if (matchShortcut('action_mindmap_studio', e)) {
        e.preventDefault();
        setIsMindmapStudioOpen(true);
        return;
      }

      // Tools
      if (matchShortcut('tool_select', e)) {
        e.preventDefault();
        setActiveTool('select');
        return;
      }
      if (matchShortcut('tool_pan', e) || e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setActiveTool('pan');
        return;
      }
      if (matchShortcut('tool_sticky', e)) {
        e.preventDefault();
        const world = screenToWorld(window.innerWidth / 2, window.innerHeight / 2);
        handleAddSticky(world.x - 100, world.y - 90);
        return;
      }
      if (matchShortcut('tool_shape', e)) {
        e.preventDefault();
        handleAddShape('rectangle');
        return;
      }
      if (matchShortcut('tool_text', e)) {
        e.preventDefault();
        const world = screenToWorld(window.innerWidth / 2, window.innerHeight / 2);
        handleAddText(world.x - 130, world.y - 25);
        return;
      }
      if (matchShortcut('tool_connector', e)) {
        e.preventDefault();
        setActiveTool('connector');
        return;
      }
      if (matchShortcut('tool_pen', e)) {
        e.preventDefault();
        setActiveTool('pen');
        return;
      }
      if (matchShortcut('tool_frame', e)) {
        e.preventDefault();
        const world = screenToWorld(window.innerWidth / 2, window.innerHeight / 2);
        handleAddFrame(world.x - 450, world.y - 300);
        return;
      }
      if (matchShortcut('tool_comment', e)) {
        e.preventDefault();
        setActiveTool('comment');
        return;
      }

      // Zoom
      if (matchShortcut('zoom_in', e)) {
        e.preventDefault();
        handleZoomChange(0.15);
        return;
      }
      if (matchShortcut('zoom_out', e)) {
        e.preventDefault();
        handleZoomChange(-0.15);
        return;
      }
      if (matchShortcut('zoom_reset', e)) {
        e.preventDefault();
        resetZoom();
        return;
      }
      if (matchShortcut('zoom_fit', e)) {
        e.preventDefault();
        fitToContent();
        return;
      }
      if (matchShortcut('zoom_selection', e)) {
        e.preventDefault();
        zoomToSelection();
        return;
      }

      // Edit Actions
      if (matchShortcut('edit_undo', e)) {
        e.preventDefault();
        handleUndo();
        return;
      }
      if (matchShortcut('edit_redo', e)) {
        e.preventDefault();
        handleRedo();
        return;
      }
      if (matchShortcut('edit_copy', e)) {
        e.preventDefault();
        handleCopySelection();
        return;
      }
      if (matchShortcut('edit_cut', e)) {
        e.preventDefault();
        handleCutSelection();
        return;
      }
      if (matchShortcut('edit_paste', e)) {
        e.preventDefault();
        handlePasteSelection();
        return;
      }
      if (matchShortcut('edit_duplicate', e)) {
        e.preventDefault();
        handleDuplicateSelection();
        return;
      }
      if (matchShortcut('edit_delete', e)) {
        e.preventDefault();
        handleDeleteSelection();
        return;
      }
      if (matchShortcut('edit_lock', e)) {
        e.preventDefault();
        handleToggleLockSelection();
        return;
      }

      // View
      if (matchShortcut('view_toggle_grid', e)) {
        e.preventDefault();
        handleChangeGridSnap(gridSnapSize === 0 ? 20 : 0);
        playSound.click();
        return;
      }
      if (matchShortcut('view_toggle_minimap', e)) {
        e.preventDefault();
        setIsMinimapOpen((prev) => !prev);
        playSound.click();
        return;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Global Paste Event Listener (supports pasting image files, URLs, elements, and text)
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl as HTMLElement).isContentEditable)
      ) {
        return;
      }

      const clipboardData = e.clipboardData;
      if (!clipboardData) return;

      const world = screenToWorld(lastPointerPosRef.current.x, lastPointerPosRef.current.y);

      // 1. Image Files from clipboard (e.g. copied screenshots, snipping tool, copied files)
      const files = clipboardData.files;
      if (files && files.length > 0) {
        let hasImage = false;
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (file.type.startsWith('image/')) {
            e.preventDefault();
            hasImage = true;
            const reader = new FileReader();
            reader.onload = (re) => {
              if (re.target?.result) {
                createImageElementFromUrl(
                  re.target.result as string,
                  world.x + i * 35,
                  world.y + i * 35,
                  file.name || 'Imagem Colada'
                );
              }
            };
            reader.readAsDataURL(file);
          }
        }
        if (hasImage) return;
      }

      // 2. Clipboard Items with image mime type
      const items = clipboardData.items;
      if (items && items.length > 0) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.kind === 'file' && item.type.startsWith('image/')) {
            const blob = item.getAsFile();
            if (blob) {
              e.preventDefault();
              const reader = new FileReader();
              reader.onload = (re) => {
                if (re.target?.result) {
                  createImageElementFromUrl(
                    re.target.result as string,
                    world.x,
                    world.y,
                    'Imagem Colada'
                  );
                }
              };
              reader.readAsDataURL(blob);
              return;
            }
          }
        }
      }

      // 3. Text data in clipboard
      const pastedText = clipboardData.getData('text/plain')?.trim();
      if (pastedText) {
        // Is text an image URL or base64 data URI?
        const isImgUrl =
          /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|svg|avif|bmp)(\?.*)?$/i.test(pastedText) ||
          pastedText.startsWith('data:image/') ||
          pastedText.includes('images.unsplash.com') ||
          pastedText.includes('googleusercontent.com');

        if (isImgUrl) {
          e.preventDefault();
          createImageElementFromUrl(pastedText, world.x, world.y, 'Imagem da Web');
          return;
        }

        // Is text serialized Diorfy JSON elements?
        try {
          const parsed = JSON.parse(pastedText);
          if (parsed?.type === 'diorfy-elements' && Array.isArray(parsed.elements)) {
            e.preventDefault();
            pasteElementsArray(parsed.elements, world);
            return;
          }
        } catch {}

        // If user previously copied elements internally in this session
        if (internalClipboardRef.current.length > 0) {
          e.preventDefault();
          pasteElementsArray(internalClipboardRef.current, world);
          return;
        }

        // Fallback: create sticky note with pasted text
        if (pastedText.length > 0) {
          e.preventDefault();
          handleAddSticky(world.x - 100, world.y - 90, '#fef08a', pastedText);
          showToast('Texto colado em Nota Adesiva!', '📝');
        }
      }
    };

    window.addEventListener('paste', handleGlobalPaste);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('paste', handleGlobalPaste);
    };
  }, [
    customShortcuts,
    selectedElementIds,
    elements,
    zoom,
    pan,
    historyIndex,
    gridSnapSize,
  ]);

  // Window-level Mouse Move and Mouse Up Listeners for Flawless Dragging & Panning
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      lastPointerPosRef.current = { x: e.clientX, y: e.clientY };

      // 1. Panning Canvas
      if (isPanning) {
        setPan({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
        return;
      }

      // 2. Freehand Drawing
      if (isDrawing) {
        const world = screenToWorld(e.clientX, e.clientY);
        setCurrentStrokePoints((prev) => [...prev, world]);
        return;
      }

      // 3. Marquee Selection
      if (isMarqueeSelecting) {
        const world = screenToWorld(e.clientX, e.clientY);
        setMarqueeCurrent(world);

        const selMinX = Math.min(marqueeStart.x, world.x);
        const selMaxX = Math.max(marqueeStart.x, world.x);
        const selMinY = Math.min(marqueeStart.y, world.y);
        const selMaxY = Math.max(marqueeStart.y, world.y);

        const insideIds = elements
          .filter((el) => {
            const elRight = el.x + el.width;
            const elBottom = el.y + el.height;
            return el.x < selMaxX && elRight > selMinX && el.y < selMaxY && elBottom > selMinY;
          })
          .map((el) => el.id);

        setSelectedElementIds(insideIds);
        return;
      }

      // 4. Resizing Element
      if (isResizing && selectedElementIds.length > 0) {
        const dx = (e.clientX - resizeStartPos.x) / zoom;
        const dy = (e.clientY - resizeStartPos.y) / zoom;

        if (isResizing === 'rotate' && selectedElementIds.length === 1) {
          const id = selectedElementIds[0];
          const initial = resizeInitialBounds[id];
          if (initial) {
            const world = screenToWorld(e.clientX, e.clientY);
            const centerX = initial.x + initial.width / 2;
            const centerY = initial.y + initial.height / 2;
            const radians = Math.atan2(world.y - centerY, world.x - centerX);
            const degrees = Math.round(radians * (180 / Math.PI) + 90);
            setElements((prev) =>
              prev.map((el) => (el.id === id ? { ...el, rotation: degrees } : el))
            );
          }
          return;
        }

        setElements((prev) =>
          prev.map((el) => {
            if (!selectedElementIds.includes(el.id) || el.style.isLocked) return el;
            const initial = resizeInitialBounds[el.id];
            if (!initial) return el;

            let newWidth = initial.width;
            let newHeight = initial.height;
            let newX = initial.x;
            let newY = initial.y;

            if (isResizing === 'se') {
              newWidth = Math.max(40, initial.width + dx);
              newHeight = Math.max(40, initial.height + dy);
            } else if (isResizing === 'sw') {
              newWidth = Math.max(40, initial.width - dx);
              newHeight = Math.max(40, initial.height + dy);
              newX = initial.x + (initial.width - newWidth);
            } else if (isResizing === 'ne') {
              newWidth = Math.max(40, initial.width + dx);
              newHeight = Math.max(40, initial.height - dy);
              newY = initial.y + (initial.height - newHeight);
            } else if (isResizing === 'nw') {
              newWidth = Math.max(40, initial.width - dx);
              newHeight = Math.max(40, initial.height - dy);
              newX = initial.x + (initial.width - newWidth);
              newY = initial.y + (initial.height - newHeight);
            } else if (isResizing === 'e') {
              newWidth = Math.max(40, initial.width + dx);
            } else if (isResizing === 'w') {
              newWidth = Math.max(40, initial.width - dx);
              newX = initial.x + (initial.width - newWidth);
            } else if (isResizing === 's') {
              newHeight = Math.max(40, initial.height + dy);
            } else if (isResizing === 'n') {
              newHeight = Math.max(40, initial.height - dy);
              newY = initial.y + (initial.height - newHeight);
            }

            return {
              ...el,
              width: snapVal(newWidth),
              height: snapVal(newHeight),
              x: snapVal(newX),
              y: snapVal(newY),
            };
          })
        );
        return;
      }

      // 5. Dragging Elements (with auto-pan near screen boundaries so you can move down endlessly!)
      if (isDraggingElements && selectedElementIds.length > 0) {
        const dx = (e.clientX - dragStartPos.x) / zoom;
        const dy = (e.clientY - dragStartPos.y) / zoom;

        // Auto-pan viewport if dragging near edge (e.g. moving down)
        const edgeMargin = 60;
        const speed = 12;
        if (e.clientY > window.innerHeight - edgeMargin) {
          setPan((p) => ({ ...p, y: p.y - speed }));
        } else if (e.clientY < edgeMargin) {
          setPan((p) => ({ ...p, y: p.y + speed }));
        }
        if (e.clientX > window.innerWidth - edgeMargin) {
          setPan((p) => ({ ...p, x: p.x - speed }));
        } else if (e.clientX < edgeMargin) {
          setPan((p) => ({ ...p, x: p.x + speed }));
        }

        setElements((prev) =>
          prev.map((el) => {
            if (selectedElementIds.includes(el.id) && !el.style.isLocked) {
              const initial = dragInitialElements[el.id];
              if (!initial) return el;
              return {
                ...el,
                x: snapVal(initial.x + dx),
                y: snapVal(initial.y + dy),
              };
            }
            return el;
          })
        );
      }
    };

    const handleGlobalMouseUp = () => {
      if (isPanning) {
        setIsPanning(false);
      }

      if (isMarqueeSelecting) {
        setIsMarqueeSelecting(false);
      }

      if (isResizing) {
        setIsResizing(null);
        pushHistory(elements, frames);
      }

      if (isDrawing && currentStrokePoints.length > 1) {
        setIsDrawing(false);
        playSound.click();
        const minX = Math.min(...currentStrokePoints.map((p) => p.x));
        const minY = Math.min(...currentStrokePoints.map((p) => p.y));
        const maxX = Math.max(...currentStrokePoints.map((p) => p.x));
        const maxY = Math.max(...currentStrokePoints.map((p) => p.y));

        const drawElement: CanvasElement = {
          id: `draw-${Date.now()}`,
          type: 'draw',
          x: minX,
          y: minY,
          width: Math.max(20, maxX - minX),
          height: Math.max(20, maxY - minY),
          zIndex: 10,
          content: '',
          style: {
            points: currentStrokePoints,
            color: activeTool === 'highlighter' ? '#fde047' : '#3b82f6',
            strokeWidth: activeTool === 'highlighter' ? 12 : 3,
            opacity: activeTool === 'highlighter' ? 0.45 : 1,
          },
          createdAt: Date.now(),
        };

        const updated = [...elements, drawElement];
        setElements(updated);
        pushHistory(updated, frames);
        setCurrentStrokePoints([]);
      }

      if (isDraggingElements) {
        setIsDraggingElements(false);
        pushHistory(elements, frames);
      }
    };

    if (isPanning || isDrawing || isMarqueeSelecting || isResizing || isDraggingElements) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [
    isPanning,
    panStart,
    isDrawing,
    currentStrokePoints,
    isMarqueeSelecting,
    marqueeStart,
    isResizing,
    resizeStartPos,
    resizeInitialBounds,
    isDraggingElements,
    dragStartPos,
    dragInitialElements,
    selectedElementIds,
    zoom,
    pan,
    elements,
    frames,
    activeTool,
  ]);

  // Start Resizing Element with Mouse Handle
  const handleStartResize = (e: React.MouseEvent, handle: ResizeHandleType) => {
    e.stopPropagation();
    setIsResizing(handle);
    setResizeStartPos({ x: e.clientX, y: e.clientY });

    const initialBounds: Record<
      string,
      { x: number; y: number; width: number; height: number; rotation: number }
    > = {};
    elements.forEach((el) => {
      if (selectedElementIds.includes(el.id) && !el.style.isLocked) {
        initialBounds[el.id] = {
          x: el.x,
          y: el.y,
          width: el.width,
          height: el.height,
          rotation: el.rotation || 0,
        };
      }
    });
    setResizeInitialBounds(initialBounds);
  };

  // Canvas Mouse Down
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    setIsZoomMenuOpen(false);

    // Pan with Hand tool, Space pressed, Middle Click, Right Click or Alt+Click
    if (
      activeTool === 'pan' ||
      isSpacePressed ||
      e.button === 1 ||
      (e.button === 0 && e.altKey) ||
      e.button === 2
    ) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }

    const world = screenToWorld(e.clientX, e.clientY);

    // Drawing tool
    if (activeTool === 'pen' || activeTool === 'highlighter') {
      setIsDrawing(true);
      setCurrentStrokePoints([world]);
      return;
    }

    // Comment pin tool
    if (activeTool === 'comment') {
      playSound.pop();
      const newComment: CommentPin = {
        id: `comm-${Date.now()}`,
        x: world.x,
        y: world.y,
        author: 'G2 midias',
        avatar: 'G2',
        text: 'Novo ponto de discussão adicionado.',
        timestamp: 'Agora',
        resolved: false,
        replies: [],
      };
      setComments((prev) => [...prev, newComment]);
      setActiveTool('select');
      return;
    }

    // Click to add sticky note
    if (activeTool === 'sticky') {
      handleAddSticky(world.x - 100, world.y - 90, '#fef08a');
      setActiveTool('select');
      return;
    }

    // Click to add text
    if (activeTool === 'text') {
      handleAddText(world.x - 130, world.y - 25);
      setActiveTool('select');
      return;
    }

    // Click to add frame
    if (activeTool === 'frame') {
      handleAddFrame(world.x - 450, world.y - 300);
      setActiveTool('select');
      return;
    }

    // If clicking on empty canvas with select tool => start marquee selection
    if (activeTool === 'select' && e.target === canvasRef.current) {
      setIsMarqueeSelecting(true);
      setMarqueeStart(world);
      setMarqueeCurrent(world);
      setSelectedElementIds([]);
      setSelectedFrameId(null);
    }
  };

  // Add Brainstorming 4-Pack of Colored Stickies
  const handleAddBrainstormPack = () => {
    playSound.pop();
    const world = screenToWorld(window.innerWidth / 2, window.innerHeight / 2);
    const packColors = ['#fef08a', '#bbf7d0', '#bae6fd', '#fbcfe8'];
    const packTitles = [
      '💡 Ideia Principal & Visão',
      '🎯 Objetivos & Metas Q1',
      '⚡ Desafios & Soluções',
      '🚀 Próximos Passos de Ação',
    ];

    const newStickies: CanvasElement[] = packColors.map((color, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      return {
        id: `sticky-${Date.now()}-${idx}`,
        type: 'sticky',
        x: snapVal(world.x - 220 + col * 230),
        y: snapVal(world.y - 190 + row * 200),
        width: 210,
        height: 180,
        zIndex: elements.length + idx + 2,
        content: packTitles[idx],
        style: {
          backgroundColor: color,
          color: '#1e293b',
          fontSize: 14,
          author: 'G2 midias',
        },
        createdAt: Date.now() + idx,
      };
    });

    const updated = [...elements, ...newStickies];
    setElements(updated);
    setSelectedElementIds(newStickies.map((s) => s.id));
    pushHistory(updated, frames);
    showToast('Pack de 4 Notas criado!', '💡');
  };

  // Add Sticky Note Helper
  const handleAddSticky = (x: number, y: number, color: string = '#fef08a', customContent?: string) => {
    playSound.pop();
    const newSticky: CanvasElement = {
      id: `sticky-${Date.now()}`,
      type: 'sticky',
      x: snapVal(x),
      y: snapVal(y),
      width: 200,
      height: 180,
      zIndex: elements.length + 2,
      content: customContent || 'Escreva sua ideia aqui...',
      style: {
        backgroundColor: color,
        color: '#1e293b',
        fontSize: 14,
        author: 'G2 midias',
      },
      createdAt: Date.now(),
    };
    const updated = [...elements, newSticky];
    setElements(updated);
    setSelectedElementIds([newSticky.id]);
    pushHistory(updated, frames);
  };

  // Add Shape Helper
  const handleAddShape = (shapeType: ShapeType, color: string = '#ffffff') => {
    playSound.pop();
    const world = screenToWorld(window.innerWidth / 2, window.innerHeight / 2);
    const newShape: CanvasElement = {
      id: `shape-${Date.now()}`,
      type: 'shape',
      x: snapVal(world.x - 90),
      y: snapVal(world.y - 45),
      width: shapeType === 'diamond' ? 140 : shapeType === 'arrow-right' || shapeType === 'arrow-left' ? 180 : 160,
      height: shapeType === 'diamond' ? 120 : shapeType === 'arrow-up' || shapeType === 'arrow-down' ? 140 : 80,
      zIndex: elements.length + 2,
      content: 'Novo Passo',
      style: {
        shapeType,
        backgroundColor: shapeType === 'diamond' ? '#fef08a' : color,
        borderColor: '#3b82f6',
        borderWidth: 2,
        color: '#1e293b',
        fontSize: 14,
        textAlign: 'center',
      },
      createdAt: Date.now(),
    };
    const updated = [...elements, newShape];
    setElements(updated);
    setSelectedElementIds([newShape.id]);
    pushHistory(updated, frames);
  };

  // Quick Mindmap Child Node Addition (+ button on shape hover)
  const handleAddChildMindmapNode = (parentId: string, direction: 'right' | 'left' | 'top' | 'bottom') => {
    const parent = elements.find((el) => el.id === parentId);
    if (!parent) return;

    playSound.pop();
    const childId = `mm-node-${Date.now()}`;
    const colors = ['#fee2e2', '#fef3c7', '#dcfce7', '#e0e7ff', '#f3e8ff', '#ffedd5'];
    const borderColors = ['#ef4444', '#f59e0b', '#22c55e', '#6366f1', '#a855f7', '#ea580c'];
    const colorIdx = Math.floor(Math.random() * colors.length);

    let childX = parent.x + parent.width + 120;
    let childY = parent.y;

    if (direction === 'left') {
      childX = parent.x - 220;
      childY = parent.y;
    } else if (direction === 'top') {
      childX = parent.x;
      childY = parent.y - 100;
    } else if (direction === 'bottom') {
      childX = parent.x;
      childY = parent.y + parent.height + 80;
    }

    const newChildNode: CanvasElement = {
      id: childId,
      type: 'shape',
      x: snapVal(childX),
      y: snapVal(childY),
      width: 170,
      height: 50,
      zIndex: 10,
      content: 'Novo Subtópico',
      style: {
        shapeType: 'rounded',
        backgroundColor: colors[colorIdx],
        borderColor: borderColors[colorIdx],
        borderWidth: 2,
        color: '#1e293b',
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
        parentId: parent.id,
      },
      createdAt: Date.now(),
    };

    const newConnector: CanvasElement = {
      id: `conn-mm-${Date.now()}`,
      type: 'connector',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      zIndex: 4,
      content: '',
      style: {
        sourceId: parent.id,
        targetId: childId,
        sourceAnchor: direction === 'left' ? 'left' : direction === 'top' ? 'top' : direction === 'bottom' ? 'bottom' : 'right',
        targetAnchor: direction === 'left' ? 'right' : direction === 'top' ? 'bottom' : direction === 'bottom' ? 'top' : 'left',
        color: borderColors[colorIdx],
        strokeWidth: 2.5,
        arrowEnd: 'arrow',
      },
      createdAt: Date.now(),
    };

    const updated = [...elements, newChildNode, newConnector];
    setElements(updated);
    setSelectedElementIds([newChildNode.id]);
    pushHistory(updated, frames);
  };

  // Quick Central Mindmap Node Insertion
  const handleAddMindmapRootNode = () => {
    playSound.pop();
    const world = screenToWorld(window.innerWidth / 2, window.innerHeight / 2);
    const newRoot: CanvasElement = {
      id: `mm-root-${Date.now()}`,
      type: 'shape',
      x: snapVal(world.x - 110),
      y: snapVal(world.y - 40),
      width: 220,
      height: 75,
      zIndex: elements.length + 3,
      content: 'Tópico Central',
      style: {
        shapeType: 'pill',
        backgroundColor: '#4f46e5',
        borderColor: '#3730a3',
        borderWidth: 3,
        color: '#ffffff',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        isMindmapRoot: true,
      },
      createdAt: Date.now(),
    };
    const updated = [...elements, newRoot];
    setElements(updated);
    setSelectedElementIds([newRoot.id]);
    pushHistory(updated, frames);
  };

  // Add Text Box Helper
  const handleAddText = (x: number, y: number) => {
    playSound.pop();
    const newText: CanvasElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      x: snapVal(x),
      y: snapVal(y),
      width: 260,
      height: 50,
      zIndex: elements.length + 2,
      content: 'Título / Descrição',
      style: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e293b',
      },
      createdAt: Date.now(),
    };
    const updated = [...elements, newText];
    setElements(updated);
    setSelectedElementIds([newText.id]);
    pushHistory(updated, frames);
  };

  // Add Frame Helper
  const handleAddFrame = (x: number, y: number) => {
    playSound.pop();
    const newFrame: CanvasFrame = {
      id: `frame-${Date.now()}`,
      title: `Quadro ${frames.length + 1}`,
      x: snapVal(x),
      y: snapVal(y),
      width: 900,
      height: 600,
      backgroundColor: '#ffffff',
      borderColor: '#cbd5e1',
      zIndex: 0,
    };
    const updated = [...frames, newFrame];
    setFrames(updated);
    setSelectedFrameId(newFrame.id);
    pushHistory(elements, updated);
  };

  // Add Sticker Emoji Helper
  const handleAddStickerEmoji = (emoji: string) => {
    playSound.pop();
    const world = screenToWorld(window.innerWidth / 2, window.innerHeight / 2);
    const newSticker: CanvasElement = {
      id: `sticker-${Date.now()}`,
      type: 'text',
      x: snapVal(world.x),
      y: snapVal(world.y),
      width: 60,
      height: 60,
      zIndex: elements.length + 5,
      content: emoji,
      style: {
        fontSize: 36,
        textAlign: 'center',
      },
      createdAt: Date.now(),
    };
    const updated = [...elements, newSticker];
    setElements(updated);
    setSelectedElementIds([newSticker.id]);
    pushHistory(updated, frames);
  };

  // Add Image Helper & Smart Image Loader with Aspect Ratio
  const createImageElementFromUrl = (
    url: string,
    worldX: number,
    worldY: number,
    title: string = 'Imagem'
  ) => {
    const img = new Image();
    img.onload = () => {
      const natW = img.naturalWidth || 340;
      const natH = img.naturalHeight || 240;
      const maxBound = 440;
      let targetW = natW;
      let targetH = natH;

      if (natW > maxBound || natH > maxBound) {
        if (natW >= natH) {
          targetW = maxBound;
          targetH = Math.round((natH / natW) * maxBound);
        } else {
          targetH = maxBound;
          targetW = Math.round((natW / natH) * maxBound);
        }
      }

      const newImageEl: CanvasElement = {
        id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: 'image',
        x: snapVal(worldX - targetW / 2),
        y: snapVal(worldY - targetH / 2),
        width: targetW,
        height: targetH,
        zIndex: elements.length + 5,
        content: title,
        style: {
          imageUrl: url,
          backgroundColor: '#ffffff',
        },
        createdAt: Date.now(),
      };

      setElements((prev) => {
        const next = [...prev, newImageEl];
        pushHistory(next, frames);
        return next;
      });
      setSelectedElementIds([newImageEl.id]);
      playSound.pop();
      showToast('Imagem colada com sucesso!', '🖼️');
    };

    img.onerror = () => {
      const newImageEl: CanvasElement = {
        id: `img-${Date.now()}`,
        type: 'image',
        x: snapVal(worldX - 150),
        y: snapVal(worldY - 110),
        width: 300,
        height: 220,
        zIndex: elements.length + 5,
        content: title,
        style: {
          imageUrl: url,
          backgroundColor: '#ffffff',
        },
        createdAt: Date.now(),
      };
      setElements((prev) => {
        const next = [...prev, newImageEl];
        pushHistory(next, frames);
        return next;
      });
      setSelectedElementIds([newImageEl.id]);
      playSound.pop();
      showToast('Imagem inserida no quadro!', '🖼️');
    };

    img.src = url;
  };

  const handleAddImage = (url: string, title?: string) => {
    const world = screenToWorld(window.innerWidth / 2, window.innerHeight / 2);
    createImageElementFromUrl(url, world.x, world.y, title || 'Imagem importada');
  };

  // Start drag on an element
  const handleElementMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();

    // If using Hand tool or space pressed or middle click, pan canvas instead of dragging element
    if (activeTool === 'pan' || isSpacePressed || e.button === 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }

    const targetEl = elements.find((el) => el.id === elementId);
    if (targetEl?.style.isLocked) {
      playSound.lock();
      setSelectedElementIds([elementId]);
      return;
    }

    playSound.click();

    let nextSelected = selectedElementIds;
    if (!selectedElementIds.includes(elementId)) {
      nextSelected = [elementId];
      setSelectedElementIds([elementId]);
    }

    // Alt + Drag: Instantly clone/duplicate selected elements on drag start
    if (e.altKey) {
      const duplicated: CanvasElement[] = [];
      const newIds: string[] = [];
      elements.forEach((el) => {
        if (nextSelected.includes(el.id)) {
          const newId = `${el.type}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
          newIds.push(newId);
          duplicated.push({
            ...el,
            id: newId,
            x: snapVal(el.x + 10),
            y: snapVal(el.y + 10),
            style: { ...el.style, isLocked: false },
            createdAt: Date.now(),
          });
        }
      });
      const updated = [...elements, ...duplicated];
      setElements(updated);
      setSelectedElementIds(newIds);
      nextSelected = newIds;
      pushHistory(updated, frames);
      showToast('Elemento(s) duplicado(s) via Alt+Arrastar!', '✨');
    }

    setIsDraggingElements(true);
    setDragStartPos({ x: e.clientX, y: e.clientY });

    const initials: Record<string, { x: number; y: number }> = {};
    elements.forEach((el) => {
      if (nextSelected.includes(el.id)) {
        initials[el.id] = { x: el.x, y: el.y };
      }
    });
    setDragInitialElements(initials);
  };

  // Update element content
  const handleUpdateContent = (id: string, newContent: string) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, content: newContent } : el))
    );
  };

  // Add emoji reaction
  const handleAddReaction = (id: string, emoji: string) => {
    playSound.pop();
    setElements((prev) =>
      prev.map((el) => {
        if (el.id !== id) return el;
        const reactions = el.reactions || [];
        const existing = reactions.find((r) => r.emoji === emoji);
        if (existing) {
          existing.count += 1;
        } else {
          reactions.push({ emoji, count: 1, users: ['G2 midias'] });
        }
        return { ...el, reactions: [...reactions] };
      })
    );
  };

  // Cast vote on sticky note
  const handleVote = (id: string) => {
    playSound.click();
    setElements((prev) =>
      prev.map((el) => {
        if (el.id !== id) return el;
        const currentVotes = el.style.votes || 0;
        return {
          ...el,
          style: { ...el.style, votes: currentVotes + 1 },
        };
      })
    );
  };

  // Connecting shapes
  const handleStartConnect = (elementId: string, anchor: 'top' | 'right' | 'bottom' | 'left') => {
    if (!connectorStartId) {
      playSound.click();
      setConnectorStartId(elementId);
      setConnectorAnchor(anchor);
    } else {
      if (connectorStartId !== elementId) {
        playSound.pop();
        const newConnector: CanvasElement = {
          id: `conn-${Date.now()}`,
          type: 'connector',
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          zIndex: 5,
          content: '',
          style: {
            sourceId: connectorStartId,
            targetId: elementId,
            sourceAnchor: connectorAnchor,
            targetAnchor: anchor,
            color: '#3b82f6',
            strokeWidth: 2,
            arrowEnd: 'arrow',
          },
          createdAt: Date.now(),
        };
        const updated = [...elements, newConnector];
        setElements(updated);
        pushHistory(updated, frames);
      }
      setConnectorStartId(null);
    }
  };

  // Selection actions
  const selectedElements = elements.filter((el) => selectedElementIds.includes(el.id));

  const handleUpdateSelectionStyle = (styleUpdates: Partial<CanvasElement['style']>) => {
    playSound.click();
    const updated = elements.map((el) => {
      if (selectedElementIds.includes(el.id)) {
        return {
          ...el,
          style: { ...el.style, ...styleUpdates },
        };
      }
      return el;
    });
    setElements(updated);
    pushHistory(updated, frames);
  };

  // Quick Size Preset Update from Selection Toolbar
  const handleUpdateSize = (newWidth: number, newHeight: number) => {
    playSound.click();
    const updated = elements.map((el) => {
      if (selectedElementIds.includes(el.id) && !el.style.isLocked) {
        return {
          ...el,
          width: snapVal(newWidth),
          height: snapVal(newHeight),
        };
      }
      return el;
    });
    setElements(updated);
    pushHistory(updated, frames);
  };

  // Align & Distribute elements helper
  const handleAlign = (
    alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom' | 'distribute-h' | 'distribute-v'
  ) => {
    if (selectedElements.length < 2) return;
    playSound.click();

    if (alignment === 'distribute-h' && selectedElements.length > 2) {
      const sorted = [...selectedElements].sort((a, b) => a.x - b.x);
      const minX = sorted[0].x;
      const maxX = sorted[sorted.length - 1].x + sorted[sorted.length - 1].width;
      const totalWidths = sorted.reduce((sum, el) => sum + el.width, 0);
      const remainingGap = Math.max(0, (maxX - minX - totalWidths) / (sorted.length - 1));
      let currentX = minX;
      const posMap: Record<string, number> = {};
      sorted.forEach((el) => {
        posMap[el.id] = snapVal(currentX);
        currentX += el.width + remainingGap;
      });
      const updated = elements.map((el) =>
        posMap[el.id] !== undefined ? { ...el, x: posMap[el.id] } : el
      );
      setElements(updated);
      pushHistory(updated, frames);
      showToast('Elementos distribuídos horizontalmente!', '📐');
      return;
    }

    if (alignment === 'distribute-v' && selectedElements.length > 2) {
      const sorted = [...selectedElements].sort((a, b) => a.y - b.y);
      const minY = sorted[0].y;
      const maxY = sorted[sorted.length - 1].y + sorted[sorted.length - 1].height;
      const totalHeights = sorted.reduce((sum, el) => sum + el.height, 0);
      const remainingGap = Math.max(0, (maxY - minY - totalHeights) / (sorted.length - 1));
      let currentY = minY;
      const posMap: Record<string, number> = {};
      sorted.forEach((el) => {
        posMap[el.id] = snapVal(currentY);
        currentY += el.height + remainingGap;
      });
      const updated = elements.map((el) =>
        posMap[el.id] !== undefined ? { ...el, y: posMap[el.id] } : el
      );
      setElements(updated);
      pushHistory(updated, frames);
      showToast('Elementos distribuídos verticalmente!', '📐');
      return;
    }

    const minX = Math.min(...selectedElements.map((el) => el.x));
    const maxX = Math.max(...selectedElements.map((el) => el.x + el.width));
    const minY = Math.min(...selectedElements.map((el) => el.y));
    const maxY = Math.max(...selectedElements.map((el) => el.y + el.height));
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const updated = elements.map((el) => {
      if (!selectedElementIds.includes(el.id) || el.style.isLocked) return el;

      let x = el.x;
      let y = el.y;

      if (alignment === 'left') x = minX;
      else if (alignment === 'center') x = Math.round(centerX - el.width / 2);
      else if (alignment === 'right') x = maxX - el.width;
      else if (alignment === 'top') y = minY;
      else if (alignment === 'middle') y = Math.round(centerY - el.height / 2);
      else if (alignment === 'bottom') y = maxY - el.height;

      return { ...el, x: snapVal(x), y: snapVal(y) };
    });

    setElements(updated);
    pushHistory(updated, frames);
    showToast('Elementos alinhados com sucesso!', '📐');
  };

  // Copy Selection to internal clipboard and system clipboard
  const handleCopySelection = () => {
    if (selectedElements.length === 0) return;
    playSound.click();

    internalClipboardRef.current = selectedElements.map((el) => ({
      ...el,
      style: { ...el.style },
    }));

    // If a single image is selected, write its direct URL
    if (selectedElements.length === 1 && selectedElements[0].type === 'image') {
      const url = selectedElements[0].style.imageUrl || selectedElements[0].content;
      if (url) {
        try {
          navigator.clipboard.writeText(url);
        } catch {}
      }
    } else {
      // Write JSON representation
      try {
        navigator.clipboard.writeText(
          JSON.stringify({ type: 'diorfy-elements', elements: selectedElements })
        );
      } catch {}
    }

    showToast(`${selectedElements.length} elemento(s) copiado(s)!`, '📋');
  };

  // Cut Selection
  const handleCutSelection = () => {
    if (selectedElements.length === 0) return;
    handleCopySelection();
    handleDeleteSelection();
    showToast('Elemento(s) recortado(s)!', '✂️');
  };

  // Helper to paste an array of elements around a target coordinate
  const pasteElementsArray = (sourceElements: CanvasElement[], targetPos: { x: number; y: number }) => {
    if (sourceElements.length === 0) return;
    playSound.pop();

    const minX = Math.min(...sourceElements.map((el) => el.x));
    const minY = Math.min(...sourceElements.map((el) => el.y));
    const maxX = Math.max(...sourceElements.map((el) => el.x + el.width));
    const maxY = Math.max(...sourceElements.map((el) => el.y + el.height));
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const idMap: Record<string, string> = {};
    const newElements: CanvasElement[] = [];

    sourceElements.forEach((el) => {
      const newId = `${el.type}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      idMap[el.id] = newId;

      const offsetX = el.x - centerX;
      const offsetY = el.y - centerY;

      newElements.push({
        ...el,
        id: newId,
        x: snapVal(targetPos.x + offsetX + 25),
        y: snapVal(targetPos.y + offsetY + 25),
        zIndex: elements.length + 5,
        style: { ...el.style, isLocked: false },
        createdAt: Date.now(),
      });
    });

    // Update connector references if source/target were in duplicated group
    newElements.forEach((el) => {
      if (el.type === 'connector' && el.style) {
        if (el.style.sourceId && idMap[el.style.sourceId]) {
          el.style.sourceId = idMap[el.style.sourceId];
        }
        if (el.style.targetId && idMap[el.style.targetId]) {
          el.style.targetId = idMap[el.style.targetId];
        }
      }
    });

    const updated = [...elements, ...newElements];
    setElements(updated);
    setSelectedElementIds(newElements.map((d) => d.id));
    pushHistory(updated, frames);
    showToast(`${newElements.length} elemento(s) colado(s)!`, '📋');
  };

  // Paste Action
  const handlePasteSelection = async (customWorldPos?: { x: number; y: number }) => {
    const target =
      customWorldPos || screenToWorld(lastPointerPosRef.current.x, lastPointerPosRef.current.y);

    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const clipItems = await navigator.clipboard.read();
        for (const item of clipItems) {
          const imageType = item.types.find((t) => t.startsWith('image/'));
          if (imageType) {
            const blob = await item.getType(imageType);
            const reader = new FileReader();
            reader.onload = (re) => {
              if (re.target?.result) {
                createImageElementFromUrl(re.target.result as string, target.x, target.y, 'Imagem Colada');
              }
            };
            reader.readAsDataURL(blob);
            return;
          }
        }
      }
    } catch {}

    // Check system clipboard text
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = (await navigator.clipboard.readText()).trim();
        if (text) {
          const isImgUrl =
            /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|svg|avif|bmp)(\?.*)?$/i.test(text) ||
            text.startsWith('data:image/') ||
            text.includes('images.unsplash.com');

          if (isImgUrl) {
            createImageElementFromUrl(text, target.x, target.y, 'Imagem Web');
            return;
          }

          try {
            const parsed = JSON.parse(text);
            if (parsed?.type === 'diorfy-elements' && Array.isArray(parsed.elements)) {
              pasteElementsArray(parsed.elements, target);
              return;
            }
          } catch {}
        }
      }
    } catch {}

    // If internal clipboard contains elements
    if (internalClipboardRef.current.length > 0) {
      pasteElementsArray(internalClipboardRef.current, target);
      return;
    }

    showToast('Área de transferência vazia', '⚠️');
  };

  const handleDuplicateSelection = () => {
    if (selectedElements.length === 0) return;
    playSound.pop();
    const duplicated: CanvasElement[] = [];
    selectedElements.forEach((el) => {
      duplicated.push({
        ...el,
        id: `${el.type}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        x: snapVal(el.x + 30),
        y: snapVal(el.y + 30),
        style: { ...el.style, isLocked: false },
        createdAt: Date.now(),
      });
    });
    const updated = [...elements, ...duplicated];
    setElements(updated);
    setSelectedElementIds(duplicated.map((d) => d.id));
    pushHistory(updated, frames);
  };

  const handleDeleteSelection = () => {
    if (selectedElementIds.length === 0) return;
    playSound.trash();
    const updated = elements.filter((el) => !selectedElementIds.includes(el.id));
    setElements(updated);
    setSelectedElementIds([]);
    pushHistory(updated, frames);
  };

  const handleBringForward = () => {
    playSound.click();
    const maxZ = Math.max(...elements.map((e) => e.zIndex || 0), 0);
    const updated = elements.map((el) =>
      selectedElementIds.includes(el.id) ? { ...el, zIndex: maxZ + 1 } : el
    );
    setElements(updated);
    pushHistory(updated, frames);
  };

  const handleSendBackward = () => {
    playSound.click();
    const minZ = Math.min(...elements.map((e) => e.zIndex || 0), 1);
    const updated = elements.map((el) =>
      selectedElementIds.includes(el.id) ? { ...el, zIndex: Math.max(1, minZ - 1) } : el
    );
    setElements(updated);
    pushHistory(updated, frames);
  };

  // Convert selected elements on canvas into a Slide frame and open Slide Motion Studio
  const handleConvertSelectionToSlide = () => {
    if (selectedElements.length === 0) return;
    playSound.success();
    const minX = Math.min(...selectedElements.map((el) => el.x));
    const minY = Math.min(...selectedElements.map((el) => el.y));
    const maxX = Math.max(...selectedElements.map((el) => el.x + el.width));
    const maxY = Math.max(...selectedElements.map((el) => el.y + el.height));

    const padding = 40;
    const newFrame: CanvasFrame = {
      id: `frame-${Date.now()}`,
      title: `Slide: ${selectedElements[0].content?.substring(0, 24) || 'Seção Apresentação'}`,
      x: minX - padding,
      y: minY - padding - 40,
      width: Math.max(500, maxX - minX + padding * 2),
      height: Math.max(350, maxY - minY + padding * 2 + 40),
      backgroundColor: '#ffffff',
      borderColor: '#8b5cf6',
      zIndex: 0,
    };

    const updatedFrames = [...frames, newFrame];
    setFrames(updatedFrames);
    pushHistory(elements, updatedFrames);
    setIsSlideMotionOpen(true);
    showToast('Seleção convertida em Slide!', '🎬');
  };

  // Drag & Drop Image Files Directly on Canvas
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes('Files') || e.dataTransfer.types.includes('text/uri-list')) {
      setIsDraggingFileOver(true);
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setIsDraggingFileOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFileOver(false);

    const world = screenToWorld(e.clientX, e.clientY);

    // Dropped local files from desktop/explorer
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const file = e.dataTransfer.files[i];
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (re) => {
            if (re.target?.result) {
              createImageElementFromUrl(
                re.target.result as string,
                world.x + i * 35,
                world.y + i * 35,
                file.name
              );
            }
          };
          reader.readAsDataURL(file);
        }
      }
      return;
    }

    // Dropped image URI from web browser
    const droppedUri = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
    if (droppedUri) {
      createImageElementFromUrl(droppedUri.trim(), world.x, world.y, 'Imagem arrastada');
    }
  };

  // Right-Click Context Menu
  const handleCanvasContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const world = screenToWorld(e.clientX, e.clientY);
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      worldX: world.x,
      worldY: world.y,
    });
  };
  const handleExportJSON = () => {
    playSound.success();
    const exportData = {
      ...board,
      elements,
      frames,
      comments,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = `${board.title.replace(/\s+/g, '-').toLowerCase()}-diorfy.json`;
    downloadAnchor.click();
    downloadAnchor.remove();
    setIsExportModalOpen(false);
  };

  // Background and Cursor CSS class calculator
  const getCursorClass = () => {
    if (isPanning) return 'cursor-grabbing';
    if (isSpacePressed || activeTool === 'pan') return 'cursor-grab';
    if (activeTool === 'pen' || activeTool === 'highlighter') return 'cursor-crosshair';
    if (activeTool === 'text') return 'cursor-text';
    if (activeTool === 'connector') return 'cursor-crosshair';
    if (activeTool === 'comment') return 'cursor-pointer';
    if (activeTool === 'sticky' || activeTool === 'shape' || activeTool === 'frame') return 'cursor-crosshair';
    return 'cursor-default';
  };

  const getCanvasBgClass = () => {
    switch (canvasBgStyle) {
      case 'dots':
        return 'bg-[#f4f6f8] bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]';
      case 'blueprint':
        return 'bg-[#0f284e] bg-[linear-gradient(to_right,#1a3c6d_1px,transparent_1px),linear-gradient(to_bottom,#1a3c6d_1px,transparent_1px)] [background-size:24px_24px] text-white';
      case 'dark':
        return 'bg-[#0b0f17] bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] [background-size:20px_20px] text-white';
      case 'clean':
        return 'bg-[#f8fafc]';
      case 'grid':
      default:
        return 'bg-[#f0f2f5] canvas-grid-lines';
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col bg-[#f0f2f5] select-none">
      {/* Diorfy Canvas Top Navigation Bar with AI & Slide Generator Suite */}
      <CanvasTopNav
        board={board}
        onBackToDashboard={onBackToDashboard}
        onRenameBoard={(newTitle) => onUpdateBoard({ ...board, title: newTitle })}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenUpgrade={onOpenUpgrade}
        onToggleTimer={() => setIsTimerOpen(!isTimerOpen)}
        isTimerActive={isTimerOpen}
        onToggleVoting={() => setIsVotingOpen(!isVotingOpen)}
        isVotingActive={isVotingActive}
        onStartPresentation={() => setIsSlideMotionOpen(true)}
        collaboratorCount={collabCursors.length + 1}
        onToggleCollabCursors={() => setShowCollabCursors(!showCollabCursors)}
        showCollabCursors={showCollabCursors}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        isSoundOn={isSoundOn}
        onToggleSound={handleToggleSound}
        onOpenAI={() => setIsAIOpen(true)}
        onOpenSlideMotion={() => setIsSlideMotionOpen(true)}
        onOpenNanoBanana={() => setIsNanoBananaOpen(true)}
        onOpenMindmapStudio={() => setIsMindmapStudioOpen(true)}
        onOpenAiAgent={() => setIsAiAgentOpen(true)}
      />

      {/* Main Canvas Infinite Workspace Stage */}
      <div
        ref={canvasRef}
        onMouseDown={handleCanvasMouseDown}
        onWheel={handleWheel}
        className={`flex-1 relative overflow-hidden select-none ${getCursorClass()} ${getCanvasBgClass()}`}
      >
        {/* Transform Container with Pan & Zoom */}
        <div
          className="absolute origin-top-left will-change-transform"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          {/* Layer 0: Frames */}
          {frames.map((frame) => (
            <FrameElement
              key={frame.id}
              frame={frame}
              isSelected={selectedFrameId === frame.id}
              onSelect={(e) => {
                e.stopPropagation();
                setSelectedFrameId(frame.id);
                setSelectedElementIds([]);
              }}
              onUpdateTitle={(id, title) => {
                setFrames((prev) => prev.map((f) => (f.id === id ? { ...f, title } : f)));
              }}
              onPresentFrame={() => setIsSlideMotionOpen(true)}
            />
          ))}

          {/* Layer 1: SVG Connectors & Dynamic Lines */}
          <svg className="absolute inset-0 w-[5000px] h-[5000px] pointer-events-none overflow-visible">
            {elements
              .filter((el) => el.type === 'connector')
              .map((conn) => {
                const sourceEl = elements.find((el) => el.id === conn.style.sourceId);
                const targetEl = elements.find((el) => el.id === conn.style.targetId);
                return (
                  <ConnectorElement
                    key={conn.id}
                    element={conn}
                    sourceEl={sourceEl}
                    targetEl={targetEl}
                    isSelected={selectedElementIds.includes(conn.id)}
                    onSelect={(e) => {
                      e.stopPropagation();
                      setSelectedElementIds([conn.id]);
                    }}
                  />
                );
              })}

            {/* Freehand drawing strokes */}
            {elements
              .filter((el) => el.type === 'draw' && el.style.points)
              .map((draw) => {
                const pts = draw.style.points!;
                if (pts.length < 2) return null;
                const pathD = `M ${pts[0].x} ${pts[0].y} ` + pts.slice(1).map((p) => `L ${p.x} ${p.y}`).join(' ');
                return (
                  <path
                    key={draw.id}
                    d={pathD}
                    fill="none"
                    stroke={draw.style.color || '#3b82f6'}
                    strokeWidth={draw.style.strokeWidth || 3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={draw.style.opacity || 1}
                  />
                );
              })}

            {/* Current in-progress drawing stroke */}
            {isDrawing && currentStrokePoints.length > 1 && (
              <path
                d={
                  `M ${currentStrokePoints[0].x} ${currentStrokePoints[0].y} ` +
                  currentStrokePoints.slice(1).map((p) => `L ${p.x} ${p.y}`).join(' ')
                }
                fill="none"
                stroke={activeTool === 'highlighter' ? '#fde047' : '#3b82f6'}
                strokeWidth={activeTool === 'highlighter' ? 14 : 3}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={activeTool === 'highlighter' ? 0.5 : 1}
              />
            )}
          </svg>

          {/* Layer 2: Interactive Whiteboard Elements */}
          {elements.map((el) => {
            const isSelected = selectedElementIds.includes(el.id);

            if (el.type === 'sticky') {
              return (
                <div
                  key={el.id}
                  onMouseDown={(e) => handleElementMouseDown(e, el.id)}
                >
                  <StickyNoteElement
                    element={el}
                    isSelected={isSelected}
                    onSelect={(e) => {
                      e.stopPropagation();
                      setSelectedElementIds([el.id]);
                    }}
                    onUpdateContent={handleUpdateContent}
                    onAddReaction={handleAddReaction}
                    onVote={handleVote}
                    isVotingActive={isVotingActive}
                  />
                </div>
              );
            }

            if (el.type === 'shape') {
              return (
                <div
                  key={el.id}
                  onMouseDown={(e) => handleElementMouseDown(e, el.id)}
                >
                  <ShapeElement
                    element={el}
                    isSelected={isSelected}
                    onSelect={(e) => {
                      e.stopPropagation();
                      setSelectedElementIds([el.id]);
                    }}
                    onUpdateContent={handleUpdateContent}
                    onStartConnect={handleStartConnect}
                    onAddChildMindmapNode={handleAddChildMindmapNode}
                  />
                </div>
              );
            }

            if (el.type === 'text') {
              return (
                <div
                  key={el.id}
                  onMouseDown={(e) => handleElementMouseDown(e, el.id)}
                >
                  <TextElement
                    element={el}
                    isSelected={isSelected}
                    onSelect={(e) => {
                      e.stopPropagation();
                      setSelectedElementIds([el.id]);
                    }}
                    onUpdateContent={handleUpdateContent}
                  />
                </div>
              );
            }

            if (el.type === 'image') {
              return (
                <div
                  key={el.id}
                  onMouseDown={(e) => handleElementMouseDown(e, el.id)}
                >
                  <ImageElement
                    element={el}
                    isSelected={isSelected}
                    onSelect={(e) => {
                      e.stopPropagation();
                      setSelectedElementIds([el.id]);
                    }}
                    onUpdateContent={handleUpdateContent}
                    onDelete={(id) => {
                      const updated = elements.filter((item) => item.id !== id);
                      setElements(updated);
                      setSelectedElementIds([]);
                      pushHistory(updated, frames);
                    }}
                  />
                </div>
              );
            }

            return null;
          })}

          {/* Layer 3: Pinned Comment Markers */}
          {comments.map((comm) => (
            <CommentPinElement
              key={comm.id}
              comment={comm}
              isSelected={false}
              onSelect={() => {}}
              onAddReply={(commentId, replyText) => {
                setComments((prev) =>
                  prev.map((c) =>
                    c.id === commentId
                      ? {
                          ...c,
                          replies: [
                            ...c.replies,
                            {
                              id: `rep-${Date.now()}`,
                              author: 'G2 midias',
                              avatar: 'G2',
                              text: replyText,
                              timestamp: 'Agora',
                            },
                          ],
                        }
                      : c
                  )
                );
              }}
              onResolve={(commentId) => {
                setComments((prev) =>
                  prev.map((c) => (c.id === commentId ? { ...c, resolved: !c.resolved } : c))
                );
              }}
            />
          ))}

          {/* Layer 4: Simulated Collaborator Cursors */}
          {showCollabCursors &&
            collabCursors.map((cursor) => (
              <div
                key={cursor.id}
                className="absolute pointer-events-none transition-all duration-700 ease-out z-50 flex items-start gap-1"
                style={{
                  left: `${cursor.x}px`,
                  top: `${cursor.y}px`,
                }}
              >
                <svg
                  className="w-4 h-4 -rotate-45"
                  viewBox="0 0 24 24"
                  fill={cursor.color}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                >
                  <polygon points="3 3, 21 9, 12 12, 9 21" />
                </svg>
                <span
                  className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap"
                  style={{ backgroundColor: cursor.color }}
                >
                  {cursor.name}
                </span>
              </div>
            ))}

          {/* Layer 5: Mouse Resize Handles & Transform Bounding Box */}
          {selectedElements.length > 0 && (
            <TransformBoundingBox
              selectedElements={selectedElements}
              zoom={zoom}
              onStartResize={handleStartResize}
            />
          )}

          {/* Layer 6: Floating Selection Toolbar */}
          {selectedElements.length > 0 && (
            <SelectionToolbar
              selectedElements={selectedElements}
              onUpdateStyle={handleUpdateSelectionStyle}
              onUpdateSize={handleUpdateSize}
              onAlign={handleAlign}
              onCopy={handleCopySelection}
              onDuplicate={handleDuplicateSelection}
              onDelete={handleDeleteSelection}
              onBringForward={handleBringForward}
              onSendBackward={handleSendBackward}
              onToggleLock={handleToggleLockSelection}
              onConvertToSlide={handleConvertSelectionToSlide}
            />
          )}

          {/* Marquee Selection Rectangle */}
          {isMarqueeSelecting && (
            <div
              className="absolute pointer-events-none border border-blue-500 bg-blue-500/15 rounded-xs"
              style={{
                left: `${Math.min(marqueeStart.x, marqueeCurrent.x)}px`,
                top: `${Math.min(marqueeStart.y, marqueeCurrent.y)}px`,
                width: `${Math.abs(marqueeCurrent.x - marqueeStart.x)}px`,
                height: `${Math.abs(marqueeCurrent.y - marqueeStart.y)}px`,
              }}
            />
          )}
        </div>

        {/* Drag Over File Dropzone Overlay Indicator */}
        {isDraggingFileOver && (
          <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-2xs border-4 border-dashed border-blue-500 z-50 flex items-center justify-center pointer-events-none animate-in fade-in duration-150">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-blue-200 flex flex-col items-center gap-3 text-center max-w-sm">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner animate-bounce">
                <FileUp className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Solte a imagem aqui</h3>
              <p className="text-xs text-slate-500">
                A imagem será inserida instantaneamente nas coordenadas exatas do cursor.
              </p>
            </div>
          </div>
        )}

        {/* Floating Context Menu */}
        {contextMenu && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed z-50 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 py-1.5 w-56 text-xs select-none animate-in fade-in duration-100"
            style={{
              left: `${Math.min(window.innerWidth - 230, contextMenu.x)}px`,
              top: `${Math.min(window.innerHeight - 300, contextMenu.y)}px`,
            }}
          >
            <button
              onClick={() => {
                handlePasteSelection({ x: contextMenu.worldX, y: contextMenu.worldY });
                setContextMenu(null);
              }}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-semibold cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ClipboardPaste className="w-4 h-4 text-blue-600" />
                <span>Colar Imagem / Conteúdo</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Ctrl+V</span>
            </button>

            {selectedElements.length > 0 && (
              <>
                <div className="h-px bg-slate-100 my-1" />
                <button
                  onClick={() => {
                    handleCopySelection();
                    setContextMenu(null);
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-100 text-slate-700 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copiar</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Ctrl+C</span>
                </button>
                <button
                  onClick={() => {
                    handleCutSelection();
                    setContextMenu(null);
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-100 text-slate-700 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Scissors className="w-3.5 h-3.5 text-slate-500" />
                    <span>Recortar</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Ctrl+X</span>
                </button>
                <button
                  onClick={() => {
                    handleDuplicateSelection();
                    setContextMenu(null);
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-100 text-slate-700 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-500 text-[11px]">2x</span>
                    <span>Duplicar</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Ctrl+D</span>
                </button>
                <button
                  onClick={() => {
                    handleToggleLockSelection();
                    setContextMenu(null);
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-100 text-slate-700 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span>🔒</span>
                    <span>Bloquear / Destravar</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Ctrl+L</span>
                </button>
                <div className="h-px bg-slate-100 my-1" />
                <button
                  onClick={() => {
                    handleDeleteSelection();
                    setContextMenu(null);
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-rose-50 text-rose-600 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span>🗑️</span>
                    <span>Excluir Seleção</span>
                  </div>
                  <span className="text-[10px] text-rose-400 font-mono">Del</span>
                </button>
              </>
            )}

            <div className="h-px bg-slate-100 my-1" />
            <button
              onClick={() => {
                setIsNanoBananaOpen(true);
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-amber-50 text-amber-900 cursor-pointer text-left"
            >
              <span>🍌</span>
              <span>Gerar Imagem com IA</span>
            </button>
          </div>
        )}

        {/* Global Toast Notification */}
        {toastNotification && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-2 fade-in duration-200 pointer-events-none border border-slate-700">
            <span className="text-base">{toastNotification.icon || '📋'}</span>
            <span>{toastNotification.message}</span>
          </div>
        )}
      </div>

      {/* Floating Vertical Toolbar at Left */}
      <CanvasToolbar
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        onOpenAI={() => setIsAIOpen(true)}
        onOpenNanoBanana={() => setIsNanoBananaOpen(true)}
        onOpenAiAgent={() => setIsAiAgentOpen(true)}
        onOpenSlideMotion={() => setIsSlideMotionOpen(true)}
        onOpenMindmapStudio={() => setIsMindmapStudioOpen(true)}
        onOpenTemplates={() => setIsAIOpen(true)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onAddStickyWithColor={(color) => {
          const world = screenToWorld(window.innerWidth / 2, window.innerHeight / 2);
          handleAddSticky(world.x - 100, world.y - 90, color);
        }}
        onAddShapeWithType={(type) => handleAddShape(type)}
        onAddStickerEmoji={handleAddStickerEmoji}
        onAddImage={handleAddImage}
        onAddMindmapRootNode={handleAddMindmapRootNode}
      />

      {/* Floating Bottom-Right Canvas Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-1 select-none">
        {/* Frame Navigator Drawer toggle */}
        <button
          onClick={() => setIsFramesListOpen(!isFramesListOpen)}
          className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
            isFramesListOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Frames do quadro"
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Minimap toggle */}
        <button
          onClick={() => setIsMinimapOpen(!isMinimapOpen)}
          className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
            isMinimapOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Minimapa (Ctrl+M)"
        >
          <Map className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-200" />

        {/* Zoom Out (-) */}
        <button
          onClick={() => handleZoomChange(-0.15)}
          className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Diminuir Zoom (-) / Atalho: -"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        {/* Zoom Percentage Dropdown Trigger */}
        <button
          onClick={() => setIsZoomMenuOpen(!isZoomMenuOpen)}
          className="px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg font-mono flex items-center gap-1 transition-colors cursor-pointer"
          title="Opções de Zoom e Ajuste à Tela"
        >
          <span>{Math.round(zoom * 100)}%</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {/* Zoom In (+) */}
        <button
          onClick={() => handleZoomChange(0.15)}
          className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Aumentar Zoom (+) / Atalho: +"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-slate-200" />

        {/* Keyboard Shortcuts & Preferences (?) */}
        <button
          onClick={() => setIsShortcutsOpen(true)}
          className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Escolher Teclas de Atalhos & Preferências"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Rich Zoom Controls Popup Menu */}
      <ZoomControlsMenu
        isOpen={isZoomMenuOpen}
        onClose={() => setIsZoomMenuOpen(false)}
        zoom={zoom}
        onSetZoom={(z) => setZoom(z)}
        onFitToContent={fitToContent}
        onZoomToSelection={zoomToSelection}
        onResetZoom={resetZoom}
        wheelZoomMode={wheelZoomMode}
        onToggleWheelMode={() => setWheelZoomMode((prev) => (prev === 'zoom' ? 'pan' : 'zoom'))}
        onPanBy={handlePanBy}
      />

      {/* Command Palette (Spotlight Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTool={setActiveTool}
        onOpenNanoBanana={() => setIsNanoBananaOpen(true)}
        onOpenAiAgent={() => setIsAiAgentOpen(true)}
        onOpenSlideMotion={() => setIsSlideMotionOpen(true)}
        onOpenTemplates={() => setIsAIOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onFitContent={fitToContent}
        onResetZoom={resetZoom}
        onToggleGridSnap={() => handleChangeGridSnap(gridSnapSize === 0 ? 20 : 0)}
        onToggleSound={handleToggleSound}
        isSoundOn={isSoundOn}
        isGridSnapOn={gridSnapSize > 0}
        selectedCount={selectedElements.length}
        onDuplicate={handleDuplicateSelection}
        onDelete={handleDeleteSelection}
        onToggleLock={handleToggleLockSelection}
      />

      {/* Frames Drawer Popover */}
      {isFramesListOpen && (
        <div className="absolute bottom-16 right-4 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-30 w-64 select-none animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-bold text-slate-900">
            <span>Frames ({frames.length})</span>
            <button onClick={() => setIsFramesListOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
              ✕
            </button>
          </div>
          <div className="mt-2 space-y-1 max-h-52 overflow-y-auto">
            {frames.map((f, i) => (
              <button
                key={f.id}
                onClick={() => {
                  setPan({
                    x: -f.x * zoom + window.innerWidth / 3,
                    y: -f.y * zoom + window.innerHeight / 3,
                  });
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-100 text-slate-700 flex items-center justify-between cursor-pointer"
              >
                <span className="truncate">
                  {i + 1}. {f.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Minimap Radar */}
      <Minimap
        elements={elements}
        frames={frames}
        pan={pan}
        zoom={zoom}
        viewportWidth={typeof window !== 'undefined' ? window.innerWidth : 1200}
        viewportHeight={typeof window !== 'undefined' ? window.innerHeight : 800}
        onNavigate={(newPanX, newPanY) => setPan({ x: newPanX, y: newPanY })}
        isOpen={isMinimapOpen}
        onClose={() => setIsMinimapOpen(false)}
      />

      {/* Timer Widget */}
      <TimerWidget isOpen={isTimerOpen} onClose={() => setIsTimerOpen(false)} />

      {/* Voting Widget */}
      <VotingWidget
        isOpen={isVotingOpen}
        onClose={() => setIsVotingOpen(false)}
        elements={elements}
        isVotingActive={isVotingActive}
        onStartVoting={() => setIsVotingActive(true)}
        onEndVoting={() => setIsVotingActive(false)}
      />

      {/* Presentation Mode (Classic frame-by-frame) */}
      <PresentationMode
        frames={frames}
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        onFocusFrame={(frame) => {
          setPan({
            x: -frame.x * zoom + (window.innerWidth - frame.width * zoom) / 2,
            y: -frame.y * zoom + (window.innerHeight - frame.height * zoom) / 2,
          });
        }}
      />

      {/* 🍌 Nano Banana Image Studio Modal */}
      <NanoBananaStudio
        isOpen={isNanoBananaOpen}
        onClose={() => setIsNanoBananaOpen(false)}
        onInsertImageToCanvas={(imageUrl, title) => {
          handleAddImage(imageUrl, title);
        }}
      />

      {/* 🧠 Mindmap Studio Modal */}
      <MindmapStudio
        isOpen={isMindmapStudioOpen}
        onClose={() => setIsMindmapStudioOpen(false)}
        onInsertMindmapToCanvas={(newElements) => {
          playSound.success();
          const updatedElements = [...elements, ...newElements];
          setElements(updatedElements);
          pushHistory(updatedElements, frames);
        }}
      />

      {/* 🤖 Interactive AI Agent Panel (Copilot) */}
      <AiAgentPanel
        isOpen={isAiAgentOpen}
        onClose={() => setIsAiAgentOpen(false)}
        currentElementsCount={elements.length}
        onOpenSlideMotionStudio={() => setIsSlideMotionOpen(true)}
        onApplyElements={(newElements, newFrames) => {
          playSound.success();
          const updatedElements = [...elements, ...newElements];
          const updatedFrames = newFrames ? [...frames, ...newFrames] : frames;
          setElements(updatedElements);
          setFrames(updatedFrames);
          pushHistory(updatedElements, updatedFrames);
        }}
      />

      {/* 🎬 Slide Motion Design Studio */}
      <SlideMotionStudio
        isOpen={isSlideMotionOpen}
        onClose={() => setIsSlideMotionOpen(false)}
        frames={frames}
        elements={elements}
        onExportSlidesToBoard={(newFrames, newElements) => {
          playSound.success();
          const updatedFrames = [...frames, ...newFrames];
          const updatedElements = [...elements, ...newElements];
          setFrames(updatedFrames);
          setElements(updatedElements);
          pushHistory(updatedElements, updatedFrames);
        }}
      />

      {/* AI Assistant Modal */}
      <AIModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onApplyAIGenerated={(aiElements, aiFrames) => {
          playSound.success();
          const updatedElements = [...elements, ...aiElements];
          const updatedFrames = [...frames, ...aiFrames];
          setElements(updatedElements);
          setFrames(updatedFrames);
          pushHistory(updatedElements, updatedFrames);
          try {
            confetti({ particleCount: 70, spread: 70 });
          } catch {}
        }}
      />

      {/* Share Modal */}
      <ShareModal
        board={board}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      {/* ⌨️ Custom Shortcuts & Workspace Preferences Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        customShortcuts={customShortcuts}
        onUpdateShortcut={handleUpdateShortcut}
        onResetAllShortcuts={handleResetAllShortcuts}
        isSoundOn={isSoundOn}
        onToggleSound={handleToggleSound}
        gridSnapSize={gridSnapSize}
        onChangeGridSnap={handleChangeGridSnap}
        canvasBgStyle={canvasBgStyle}
        onChangeCanvasBg={handleChangeCanvasBg}
        showCollabCursors={showCollabCursors}
        onToggleCollabCursors={() => setShowCollabCursors(!showCollabCursors)}
      />

      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in select-none">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Download className="w-4 h-4 text-blue-600" />
                Exportar Quadro
              </h3>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-2">
              <button
                onClick={handleExportJSON}
                className="w-full p-3 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex items-center gap-3 transition-colors text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                  JSON
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Salvar como Diorfy JSON</p>
                  <p className="text-[11px] text-slate-500">Backup completo de elementos e posições</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
