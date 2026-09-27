import React from 'react';
import { CanvasElement, CanvasFrame } from '../../types/miro';

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

  const mapWidth = 200;
  const mapHeight = 130;

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

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const targetWorldX = minX + clickX / scale;
    const targetWorldY = minY + clickY / scale;

    const newPanX = -targetWorldX * zoom + viewportWidth / 2;
    const newPanY = -targetWorldY * zoom + viewportHeight / 2;

    onNavigate(newPanX, newPanY);
  };

  return (
    <div className="absolute bottom-16 right-4 bg-white/95 backdrop-blur-xs rounded-xl shadow-xl border border-slate-200 p-2 z-30 select-none animate-in fade-in">
      <div className="flex items-center justify-between pb-1.5 px-1 border-b border-slate-100 text-[11px] font-bold text-slate-700">
        <span>Minimapa</span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
          ✕
        </button>
      </div>
      <div
        onClick={handleClick}
        className="relative bg-slate-50 border border-slate-200 rounded-lg overflow-hidden cursor-crosshair mt-1.5"
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
          className="absolute border-2 border-blue-600 bg-blue-500/10 pointer-events-none rounded-xs shadow-xs"
          style={{
            left: `${Math.max(0, viewMapX)}px`,
            top: `${Math.max(0, viewMapY)}px`,
            width: `${Math.min(mapWidth, Math.max(15, viewMapW))}px`,
            height: `${Math.min(mapHeight, Math.max(10, viewMapH))}px`,
          }}
        />
      </div>
    </div>
  );
};
