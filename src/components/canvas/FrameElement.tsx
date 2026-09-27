import React, { useState } from 'react';
import { CanvasFrame } from '../../types/miro';
import { Frame, Play } from 'lucide-react';

interface FrameElementProps {
  frame: CanvasFrame;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onPresentFrame?: (frameId: string) => void;
}

export const FrameElement: React.FC<FrameElementProps> = ({
  frame,
  isSelected,
  onSelect,
  onUpdateTitle,
  onPresentFrame,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(frame.title);

  const handleBlur = () => {
    setIsEditing(false);
    if (title.trim()) {
      onUpdateTitle(frame.id, title.trim());
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`absolute rounded-xl transition-all select-none ${
        isSelected ? 'ring-2 ring-blue-600 shadow-xl' : 'shadow-xs'
      }`}
      style={{
        left: `${frame.x}px`,
        top: `${frame.y}px`,
        width: `${frame.width}px`,
        height: `${frame.height}px`,
        backgroundColor: frame.backgroundColor || '#ffffff',
        border: `2px solid ${frame.borderColor || '#cbd5e1'}`,
        zIndex: frame.zIndex,
      }}
    >
      {/* Frame Top Header / Label */}
      <div className="absolute -top-8 left-0 flex items-center gap-2 z-10">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-xs border border-slate-300 rounded-lg shadow-xs">
          <Frame className="w-3.5 h-3.5 text-blue-600" />
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleBlur();
              }}
              autoFocus
              className="text-xs font-bold text-slate-900 border-none outline-none bg-transparent"
            />
          ) : (
            <span
              onDoubleClick={() => setIsEditing(true)}
              className="text-xs font-bold text-slate-800 cursor-text"
              title="Clique 2x para renomear frame"
            >
              {frame.title}
            </span>
          )}
        </div>

        {onPresentFrame && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPresentFrame(frame.id);
            }}
            className="p-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-xs text-slate-600 hover:text-blue-600 transition-colors"
            title="Apresentar este frame em tela cheia"
          >
            <Play className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
