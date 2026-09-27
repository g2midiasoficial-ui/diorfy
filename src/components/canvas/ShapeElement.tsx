import React, { useState } from 'react';
import { CanvasElement, ShapeType } from '../../types/miro';
import { Plus } from 'lucide-react';

interface ShapeElementProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onUpdateContent: (id: string, content: string) => void;
  onStartConnect?: (elementId: string, anchor: 'top' | 'right' | 'bottom' | 'left') => void;
  onAddChildMindmapNode?: (parentId: string, direction: 'right' | 'left' | 'top' | 'bottom') => void;
}

export const ShapeElement: React.FC<ShapeElementProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdateContent,
  onStartConnect,
  onAddChildMindmapNode,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(element.content);

  const shapeType: ShapeType = element.style.shapeType || 'rectangle';
  const bgColor = element.style.backgroundColor || '#ffffff';
  const borderColor = element.style.borderColor || '#3b82f6';
  const borderWidth = element.style.borderWidth ?? 2;
  const borderStyle = element.style.borderStyle || 'solid';
  const textColor = element.style.color || '#1e293b';
  const fontSize = element.style.fontSize || 14;
  const textAlign = element.style.textAlign || 'center';
  const fontWeight = element.style.fontWeight || 'normal';

  const handleBlur = () => {
    setIsEditing(false);
    onUpdateContent(element.id, content);
  };

  const isCustomSvgShape = ![
    'rectangle',
    'rounded',
    'circle',
    'pill',
  ].includes(shapeType);

  const renderSvgGeometry = () => {
    switch (shapeType) {
      case 'diamond':
        return (
          <polygon
            points="50,2 98,50 50,98 2,50"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth * 1.5}
            strokeDasharray={borderStyle === 'dashed' ? '4,4' : undefined}
          />
        );
      case 'triangle':
        return (
          <polygon
            points="50,4 96,96 4,96"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth * 1.5}
          />
        );
      case 'star':
        return (
          <polygon
            points="50,5 64,36 98,39 72,62 80,95 50,77 20,95 28,62 2,39 36,36"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth * 1.5}
          />
        );
      case 'hexagon':
        return (
          <polygon
            points="25,4 75,4 96,50 75,96 25,96 4,50"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth * 1.5}
          />
        );
      case 'octagon':
        return (
          <polygon
            points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth * 1.5}
          />
        );
      case 'parallelogram':
        return (
          <polygon
            points="20,4 96,4 80,96 4,96"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth * 1.5}
          />
        );
      case 'trapezoid':
        return (
          <polygon
            points="22,4 78,4 96,96 4,96"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth * 1.5}
          />
        );
      case 'arrow-right':
        return (
          <polygon
            points="4,30 65,30 65,10 96,50 65,90 65,70 4,70"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth * 1.5}
          />
        );
      case 'arrow-left':
        return (
          <polygon
            points="96,30 35,30 35,10 4,50 35,90 35,70 96,70"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth * 1.5}
          />
        );
      case 'arrow-up':
        return (
          <polygon
            points="30,96 30,35 10,35 50,4 90,35 70,35 70,96"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth * 1.5}
          />
        );
      case 'arrow-down':
        return (
          <polygon
            points="30,4 30,65 10,65 50,96 90,65 70,65 70,4"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth * 1.5}
          />
        );
      case 'shield':
        return (
          <path
            d="M 50 4 Q 96 15 96 45 Q 96 85 50 98 Q 4 85 4 45 Q 4 15 50 4 Z"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth * 1.5}
          />
        );
      case 'heart':
        return (
          <path
            d="M 50 88 C 20 65 4 45 4 25 C 4 12 14 4 27 4 C 36 4 45 10 50 18 C 55 10 64 4 73 4 C 86 4 96 12 96 25 C 96 45 80 65 50 88 Z"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth * 1.5}
          />
        );
      case 'lightning':
        return (
          <polygon
            points="55,4 15,55 45,55 35,96 85,45 55,45"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth * 1.5}
          />
        );
      case 'document':
        return (
          <polygon
            points="6,4 72,4 94,26 94,96 6,96"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth * 1.5}
          />
        );
      case 'cylinder':
        return (
          <path
            d="M 6 22 A 44 14 0 0 0 94 22 L 94 78 A 44 14 0 0 1 6 78 Z M 6 22 A 44 14 0 0 1 94 22 A 44 14 0 0 1 6 22"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth * 1.5}
          />
        );
      case 'speech':
        return (
          <path
            d="M 10 10 A 10 10 0 0 1 90 10 L 90 65 A 10 10 0 0 1 80 75 L 35 75 L 15 92 L 20 75 L 10 75 A 10 10 0 0 1 0 65 L 0 10 A 10 10 0 0 1 10 10 Z"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth * 1.5}
          />
        );
      case 'cloud':
        return (
          <path
            d="M 25 60 A 18 18 0 0 1 35 30 A 24 24 0 0 1 70 30 A 18 18 0 0 1 80 60 A 15 15 0 0 1 70 85 L 25 85 A 15 15 0 0 1 25 60 Z"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth * 1.5}
          />
        );
      case 'pentagon':
        return (
          <polygon
            points="50,4 96,38 80,96 20,96 4,38"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth * 1.5}
          />
        );
      case 'cross':
        return (
          <polygon
            points="35,4 65,4 65,35 96,35 96,65 65,65 65,96 35,96 35,65 4,65 4,35 35,35"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth * 1.5}
          />
        );
      case 'cube':
        return (
          <g fill={bgColor} stroke={borderColor} strokeWidth={borderWidth * 1.5}>
            {/* 3D Isometric Cube Box */}
            <polygon points="50,4 96,26 50,48 4,26" fillOpacity="0.85" />
            <polygon points="4,26 50,48 50,96 4,74" fillOpacity="0.7" />
            <polygon points="96,26 50,48 50,96 96,74" fillOpacity="0.95" />
          </g>
        );
      case 'tag':
        return (
          <g fill={bgColor} stroke={borderColor} strokeWidth={borderWidth * 1.5}>
            <polygon points="4,4 65,4 96,50 65,96 4,96" />
            <circle cx="24" cy="50" r="6" fill="#ffffff" stroke={borderColor} strokeWidth={borderWidth} />
          </g>
        );
      case 'gear':
        return (
          <path
            d="M 44,4 L 56,4 L 58,16 L 68,20 L 78,12 L 86,20 L 80,30 L 84,40 L 96,44 L 96,56 L 84,60 L 80,70 L 88,80 L 80,88 L 70,82 L 60,86 L 56,96 L 44,96 L 40,84 L 30,80 L 20,88 L 12,80 L 18,70 L 14,60 L 4,56 L 4,44 L 16,40 L 20,30 L 12,20 L 20,12 L 30,18 L 40,14 Z"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth * 1.5}
          />
        );
      case 'badge':
        return (
          <path
            d="M 50,4 L 62,15 L 79,12 L 85,28 L 98,36 L 94,52 L 98,68 L 85,76 L 79,92 L 62,89 L 50,98 L 38,89 L 21,92 L 15,76 L 2,68 L 6,52 L 2,36 L 15,28 L 21,12 L 38,15 Z"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth * 1.5}
          />
        );
      case 'step-chevron':
        return (
          <polygon
            points="4,4 75,4 96,50 75,96 4,96 25,50"
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth * 1.5}
          />
        );
      case 'database':
        return (
          <g fill={bgColor} stroke={borderColor} strokeWidth={borderWidth * 1.5}>
            {/* Top Disk */}
            <ellipse cx="50" cy="20" rx="42" ry="14" />
            {/* Middle Disk Section */}
            <path d="M 8 20 L 8 50 A 42 14 0 0 0 92 50 L 92 20" />
            <ellipse cx="50" cy="50" rx="42" ry="14" fillOpacity="0.4" />
            {/* Bottom Disk Section */}
            <path d="M 8 50 L 8 80 A 42 14 0 0 0 92 80 L 92 50" />
          </g>
        );
      case 'bracket-left':
        return (
          <path
            d="M 70 6 L 36 6 Q 16 6 16 26 L 16 40 Q 16 50 4 50 Q 16 50 16 60 L 16 74 Q 16 94 36 94 L 70 94"
            fill="none"
            stroke={borderColor}
            strokeWidth={borderWidth * 2.5}
            strokeLinecap="round"
          />
        );
      case 'bracket-right':
        return (
          <path
            d="M 30 6 L 64 6 Q 84 6 84 26 L 84 40 Q 84 50 96 50 Q 84 50 84 60 L 84 74 Q 84 94 64 94 L 30 94"
            fill="none"
            stroke={borderColor}
            strokeWidth={borderWidth * 2.5}
            strokeLinecap="round"
          />
        );
      default:
        return null;
    }
  };

  const getBorderRadius = () => {
    if (shapeType === 'rounded') return '16px';
    if (shapeType === 'circle') return '9999px';
    if (shapeType === 'pill') return '9999px';
    return '4px';
  };

  return (
    <div
      onClick={onSelect}
      onDoubleClick={() => setIsEditing(true)}
      className={`absolute select-none flex items-center justify-center p-3 transition-all cursor-move group ${
        isSelected ? 'ring-2 ring-blue-600 shadow-xl' : 'hover:shadow-md'
      }`}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        backgroundColor: isCustomSvgShape ? 'transparent' : bgColor,
        borderColor: isCustomSvgShape ? 'transparent' : borderColor,
        borderWidth: isCustomSvgShape ? 0 : `${borderWidth}px`,
        borderStyle: borderStyle,
        borderRadius: getBorderRadius(),
        color: textColor,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
        zIndex: element.zIndex,
      }}
    >
      {/* SVG Container for Custom Vector Geometries */}
      {isCustomSvgShape && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {renderSvgGeometry()}
        </svg>
      )}

      {/* Content Text */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-2">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleBlur}
            autoFocus
            className="w-full h-full bg-transparent border-none outline-none resize-none text-center font-medium"
            style={{
              fontSize: `${fontSize}px`,
              color: textColor,
              textAlign: textAlign,
              fontWeight: fontWeight,
            }}
          />
        ) : (
          <p
            className="whitespace-pre-wrap leading-tight break-words"
            style={{
              fontSize: `${fontSize}px`,
              textAlign: textAlign,
              fontWeight: fontWeight,
            }}
          >
            {element.content}
          </p>
        )}
      </div>

      {/* Quick Mindmap Child Node Expansion (+) Buttons on Hover */}
      {isSelected && onAddChildMindmapNode && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddChildMindmapNode(element.id, 'right');
            }}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md flex items-center justify-center transition-transform hover:scale-125 z-30 cursor-pointer"
            title="Criar ramo à direita (Mapa Mental)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddChildMindmapNode(element.id, 'left');
            }}
            className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md flex items-center justify-center transition-transform hover:scale-125 z-30 cursor-pointer"
            title="Criar ramo à esquerda (Mapa Mental)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddChildMindmapNode(element.id, 'bottom');
            }}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md flex items-center justify-center transition-transform hover:scale-125 z-30 cursor-pointer"
            title="Criar ramo abaixo (Mapa Mental)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </>
      )}

      {/* Anchor Connection Points for Lines */}
      {isSelected && onStartConnect && (
        <>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onStartConnect(element.id, 'top');
            }}
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full border border-white hover:scale-150 cursor-crosshair z-20 shadow-xs"
            title="Conectar do topo"
          />
          <div
            onClick={(e) => {
              e.stopPropagation();
              onStartConnect(element.id, 'right');
            }}
            className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full border border-white hover:scale-150 cursor-crosshair z-20 shadow-xs"
            title="Conectar da direita"
          />
          <div
            onClick={(e) => {
              e.stopPropagation();
              onStartConnect(element.id, 'bottom');
            }}
            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full border border-white hover:scale-150 cursor-crosshair z-20 shadow-xs"
            title="Conectar da base"
          />
          <div
            onClick={(e) => {
              e.stopPropagation();
              onStartConnect(element.id, 'left');
            }}
            className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full border border-white hover:scale-150 cursor-crosshair z-20 shadow-xs"
            title="Conectar da esquerda"
          />
        </>
      )}
    </div>
  );
};
