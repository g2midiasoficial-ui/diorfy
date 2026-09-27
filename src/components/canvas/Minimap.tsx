import React, { useState } from 'react';
import { CanvasElement, CanvasFrame } from '../../types/miro';
import { ArrowDown, ArrowUp, ArrowLeft, ArrowRight, Target, Compass } from 'lucide-react';

interface MinimapProps {
  elements: CanvasElement[];
  frames: CanvasFrame[];
  pan: { x: number; y: number };
  zoom: number;
  viewportWidth: number;
  viewportHeight: number;
  onNavigate: (x: number, y: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Minimap: React.FC<MinimapProps> = ({
  elements,
  frames,
  pan,
  zoom,
  viewportWidth,
  viewportHeight,
  onNavigate,
  isOpen,
  onClose,
}) => {
  const [isDraggingMinimap, setIsDraggingMinimap] = useState(false);

  if (!isOpen) return null;

  // Compute bounding box of all elements and frames
  const allX = [
    ...elements.map((e) => e.x),
    ...elements.map((e) => e.x + e.width),
    ...frames.map((f) => f.x),
    ...frames.map((f) => f.x + f.width),
    0,
    1500,
  ];
  const allY = [
    ...elements.map((e) => e.y),
    ...elements.map((e) => e.y + e.height),
    ...frames.map((f) => f.y),
    ...frames.map((f) => f.y + f.height),
    0,
    1000,
  ];

  const minX = Math.min(...allX) - 100;
  const minY = Math.min(...allY) - 100;
  const maxX = Math.max(...allX) + 100;
  const maxY = Math.max(...allY) + 100;

  const worldWidth = Math.max(1000, maxX - minX);
  const worldHeight = Math.max(800, maxY - minY);

  const mapWidth = 220;
  const mapHeight = 140;

  const scaleX = mapWidth / worldWidth;
  const scaleY = mapHeight / worldHeight;
  const scale = Math.min(scaleX, scaleY);

  // Viewport rect in world coordinates
  const viewWorldX = -pan.x / zoom;
  const viewWorldY = -pan.y / zoom;
  const viewWorldW = viewportWidth / zoom;
  const viewWorldH = viewportHeight / zoom;

  const viewMapX = (viewWorldX - minX) * scale;
  const viewMapY = (viewWorldY - minY) * scale;
  const viewMapW = viewWorldW * scale;
  const viewMapH = viewWorldH * scale;

  const handleMinimapPointer = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const targetWorldX = minX + clickX / scale;
    const targetWorldY = minY + clickY / scale;

    const newPanX = -targetWorldX * zoom + viewportWidth / 2;
    const newPanY = -targetWorldY * zoom + viewportHeight / 2;

    onNavigate(Math.round(newPanX), Math.round(newPanY));
  };

  return (
    <div className="absolute bottom-16 right-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 p-2.5 z-30 select-none animate-in fade-in text-slate-800">
      <div className="flex items-center justify-between pb-1.5 px-1 border-b border-slate-100 text-[11px] font-bold text-slate-700">
        <span className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-blue-600" />
          Radar Minimapa
        </span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5">
          ✕
        </button>
      </div>

      <div
        onMouseDown={(e) => {
          setIsDraggingMinimap(true);
          handleMinimapPointer(e);
        }}
        onMouseMove={(e) => {
          if (isDraggingMinimap && e.buttons === 1) {
            handleMinimapPointer(e);
          }
        }}
        onMouseUp={() => setIsDraggingMinimap(false)}
        className="relative bg-slate-50 border border-slate-200 rounded-xl overflow-hidden cursor-crosshair mt-2 shadow-inner"
        style={{ width: `${mapWidth}px`, height: `${mapHeight}px` }}
      >
        {/* Render Frames on Minimap */}
        {frames.map((f) => (
          <div
            key={f.id}
            className="absolute border border-blue-400/50 bg-blue-100/30 rounded-xs"
            style={{
              left: `${(f.x - minX) * scale}px`,
              top: `${(f.y - minY) * scale}px`,
              width: `${f.width * scale}px`,
              height: `${f.height * scale}px`,
            }}
          />
        ))}

        {/* Render Elements on Minimap */}
        {elements.map((el) => (
          <div
            key={el.id}
            className="absolute rounded-xs opacity-75"
            style={{
              left: `${(el.x - minX) * scale}px`,
              top: `${(el.y - minY) * scale}px`,
              width: `${Math.max(2, el.width * scale)}px`,
              height: `${Math.max(2, el.height * scale)}px`,
              backgroundColor: el.style.backgroundColor || '#fef08a',
            }}
          />
        ))}

        {/* Draggable/Visible Viewport Box */}
        <div
          className="absolute border-2 border-blue-600 bg-blue-500/15 pointer-events-none rounded-xs shadow-xs"
          style={{
            left: `${Math.max(0, viewMapX)}px`,
            top: `${Math.max(0, viewMapY)}px`,
            width: `${Math.min(mapWidth, Math.max(15, viewMapW))}px`,
            height: `${Math.min(mapHeight, Math.max(10, viewMapH))}px`,
          }}
        />
      </div>

      {/* Quick Move Jump Buttons */}
      <div className="flex items-center justify-between gap-1 pt-2 mt-1 border-t border-slate-100">
        <button
          onClick={() => onNavigate(pan.x, pan.y + 200)}
          className="flex-1 py-1 px-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-[10px] font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
          title="Mover tela para Cima"
        >
          <ArrowUp className="w-3 h-3" />
          <span>Cima</span>
        </button>
        <button
          onClick={() => onNavigate(pan.x, pan.y - 200)}
          className="flex-1 py-1 px-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-[10px] font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
          title="Mover tela para Baixo"
        >
          <ArrowDown className="w-3 h-3" />
          <span>Baixo</span>
        </button>
        <button
          onClick={() => onNavigate(100, 100)}
          className="py-1 px-2 bg-slate-100 hover:bg-slate-200 text-[10px] font-bold rounded-lg flex items-center justify-center transition-colors cursor-pointer"
          title="Centralizar Início"
        >
          <Target className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
