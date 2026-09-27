import React, { useState } from 'react';
import { CanvasElement } from '../../types/miro';

interface TextElementProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onUpdateContent: (id: string, content: string) => void;
}

export const TextElement: React.FC<TextElementProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdateContent,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(element.content);

  const fontSize = element.style.fontSize || 18;
  const color = element.style.color || '#1e293b';
  const fontWeight = element.style.fontWeight || 'normal';
  const textAlign = element.style.textAlign || 'left';

  const handleBlur = () => {
    setIsEditing(false);
    onUpdateContent(element.id, content);
  };

  return (
    <div
      onClick={onSelect}
      onDoubleClick={() => setIsEditing(true)}
      className={`absolute select-none p-2 rounded transition-all cursor-move ${
        isSelected ? 'ring-2 ring-blue-600' : 'hover:outline-dashed hover:outline-1 hover:outline-slate-300'
      }`}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        minHeight: `${element.height}px`,
        zIndex: element.zIndex,
      }}
    >
      {isEditing ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          className="w-full bg-transparent border-none outline-none resize-none"
          style={{
            fontSize: `${fontSize}px`,
            color: color,
            fontWeight: fontWeight,
            textAlign: textAlign,
          }}
        />
      ) : (
        <div
          className="whitespace-pre-wrap leading-snug break-words"
          style={{
            fontSize: `${fontSize}px`,
            color: color,
            fontWeight: fontWeight,
            textAlign: textAlign,
          }}
        >
          {element.content || 'Clique 2x para editar texto'}
        </div>
      )}
    </div>
  );
};
