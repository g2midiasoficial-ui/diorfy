import React from 'react';
import { CanvasElement, Point } from '../../types/miro';

export type ResizeHandleType = 'nw' | 'ne' | 'se' | 'sw' | 'n' | 'e' | 's' | 'w' | 'rotate';

interface TransformBoundingBoxProps {
  selectedElements: CanvasElement[];
  zoom: number;
  onStartResize: (e: React.MouseEvent, handle: ResizeHandleType) => void;
  onStartRotate?: (e: React.MouseEvent) => void;
}

export const TransformBoundingBox: React.FC<TransformBoundingBoxProps> = ({
  selectedElements,
  zoom,
  onStartResize,
}) => {
  if (selectedElements.length === 0) return null;

  // Compute unified bounding box
  const minX = Math.min(...selectedElements.map((el) => el.x));
  const minY = Math.min(...selectedElements.map((el) => el.y));
  const maxX = Math.max(...selectedElements.map((el) => el.x + el.width));
  const maxY = Math.max(...selectedElements.map((el) => el.y + el.height));

  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);

  const isSingle = selectedElements.length === 1;
  const rotation = isSingle ? (selectedElements[0].rotation || 0) : 0;

  // Handle styles
  const handleSize = 10;
  const handleStyle = {
    width: `${handleSize}px`,
    height: `${handleSize}px`,
    backgroundColor: '#ffffff',
    border: '1.5px solid #2563eb',
    borderRadius: '2px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  };

  return (
    <div
      className="absolute pointer-events-none z-40 select-none"
      style={{
        left: `${minX}px`,
        top: `${minY}px`,
        width: `${width}px`,
        height: `${height}px`,
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
        transformOrigin: 'center center',
      }}
    >
      {/* Outer bounding outline */}
      <div className="absolute inset-0 border border-blue-600/80 pointer-events-none" />

      {/* Dimension Tag */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-mono px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap pointer-events-none">
        {Math.round(width)} × {Math.round(height)} px
      </div>

      {/* Corner Handles */}
      {/* Top-Left (NW) */}
      <div
        onMouseDown={(e) => {
          e.stopPropagation();
          onStartResize(e, 'nw');
        }}
        className="absolute pointer-events-auto cursor-nwse-resize -top-1.5 -left-1.5 hover:scale-125 transition-transform"
        style={handleStyle}
        title="Ajustar tamanho (Noroeste)"
      />

      {/* Top-Right (NE) */}
      <div
        onMouseDown={(e) => {
          e.stopPropagation();
          onStartResize(e, 'ne');
        }}
        className="absolute pointer-events-auto cursor-nesw-resize -top-1.5 -right-1.5 hover:scale-125 transition-transform"
        style={handleStyle}
        title="Ajustar tamanho (Nordeste)"
      />

      {/* Bottom-Right (SE) */}
      <div
        onMouseDown={(e) => {
          e.stopPropagation();
          onStartResize(e, 'se');
        }}
        className="absolute pointer-events-auto cursor-nwse-resize -bottom-1.5 -right-1.5 hover:scale-125 transition-transform"
        style={handleStyle}
        title="Ajustar tamanho (Sudeste)"
      />

      {/* Bottom-Left (SW) */}
      <div
        onMouseDown={(e) => {
          e.stopPropagation();
          onStartResize(e, 'sw');
        }}
        className="absolute pointer-events-auto cursor-nesw-resize -bottom-1.5 -left-1.5 hover:scale-125 transition-transform"
        style={handleStyle}
        title="Ajustar tamanho (Sudoeste)"
      />

      {/* Edge Midpoint Handles */}
      {/* Top (N) */}
      <div
        onMouseDown={(e) => {
          e.stopPropagation();
          onStartResize(e, 'n');
        }}
        className="absolute pointer-events-auto cursor-ns-resize -top-1.5 left-1/2 -translate-x-1/2 hover:scale-125 transition-transform"
        style={handleStyle}
        title="Ajustar altura (Superior)"
      />

      {/* Bottom (S) */}
      <div
        onMouseDown={(e) => {
          e.stopPropagation();
          onStartResize(e, 's');
        }}
        className="absolute pointer-events-auto cursor-ns-resize -bottom-1.5 left-1/2 -translate-x-1/2 hover:scale-125 transition-transform"
        style={handleStyle}
        title="Ajustar altura (Inferior)"
      />

      {/* Left (W) */}
      <div
        onMouseDown={(e) => {
          e.stopPropagation();
          onStartResize(e, 'w');
        }}
        className="absolute pointer-events-auto cursor-ew-resize top-1/2 -translate-y-1/2 -left-1.5 hover:scale-125 transition-transform"
        style={handleStyle}
        title="Ajustar largura (Esquerda)"
      />

      {/* Right (E) */}
      <div
        onMouseDown={(e) => {
          e.stopPropagation();
          onStartResize(e, 'e');
        }}
        className="absolute pointer-events-auto cursor-ew-resize top-1/2 -translate-y-1/2 -right-1.5 hover:scale-125 transition-transform"
        style={handleStyle}
        title="Ajustar largura (Direita)"
      />

      {/* Rotation Handle on Top */}
      {isSingle && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              onStartResize(e, 'rotate');
            }}
            className="w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
            title="Girar elemento com o mouse"
          />
          <div className="w-px h-3.5 bg-blue-500" />
        </div>
      )}
    </div>
  );
};
