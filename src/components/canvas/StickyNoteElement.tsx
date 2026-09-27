import React, { useState } from 'react';
import { CanvasElement } from '../../types/miro';
import { Tag, Sparkles, Smile, MessageSquare, ThumbsUp } from 'lucide-react';

interface StickyNoteElementProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onUpdateContent: (id: string, content: string) => void;
  onAddReaction: (id: string, emoji: string) => void;
  onVote: (id: string) => void;
  isVotingActive?: boolean;
}

export const StickyNoteElement: React.FC<StickyNoteElementProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdateContent,
  onAddReaction,
  onVote,
  isVotingActive,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(element.content);

  const handleBlur = () => {
    setIsEditing(false);
    onUpdateContent(element.id, content);
  };

  const bgColor = element.style.backgroundColor || '#fef08a';
  const textColor = element.style.color || '#1e293b';
  const fontSize = element.style.fontSize || 14;

  return (
    <div
      onClick={onSelect}
      onDoubleClick={() => setIsEditing(true)}
      className={`absolute select-none p-3.5 flex flex-col justify-between rounded-sm shadow-md transition-shadow cursor-move group ${
        isSelected
          ? 'ring-2 ring-blue-600 shadow-xl'
          : 'hover:shadow-lg'
      }`}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        backgroundColor: bgColor,
        color: textColor,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
        zIndex: element.zIndex,
      }}
    >
      {/* Content Area */}
      <div className="flex-1 w-full overflow-hidden flex flex-col">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleBlur}
            autoFocus
            className="w-full h-full bg-transparent border-none outline-none resize-none font-sans font-medium"
            style={{ fontSize: `${fontSize}px`, color: textColor }}
          />
        ) : (
          <p
            className="whitespace-pre-wrap font-medium leading-snug break-words"
            style={{ fontSize: `${fontSize}px` }}
          >
            {element.content || 'Clique 2x para escrever'}
          </p>
        )}
      </div>

      {/* Footer: Tags, Author, Reactions, Votes */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-1 text-[11px] pt-1.5 border-t border-black/5">
        {/* Author / Tag */}
        <div className="flex items-center gap-1.5 opacity-80">
          {element.style.author && (
            <span className="font-semibold">{element.style.author}</span>
          )}
          {element.style.tags && element.style.tags.length > 0 && (
            <span className="bg-black/10 px-1.5 py-0.5 rounded text-[10px] font-medium">
              {element.style.tags[0]}
            </span>
          )}
        </div>

        {/* Reactions & Dot Voting */}
        <div className="flex items-center gap-1.5">
          {element.reactions?.map((r, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                onAddReaction(element.id, r.emoji);
              }}
              className="bg-white/60 hover:bg-white px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1 shadow-2xs font-semibold"
            >
              <span>{r.emoji}</span>
              <span>{r.count}</span>
            </button>
          ))}

          {/* Voting session counter button */}
          {(isVotingActive || (element.style.votes && element.style.votes > 0)) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVote(element.id);
              }}
              className="bg-purple-600 text-white hover:bg-purple-700 px-1.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-2xs transition-transform active:scale-95"
              title="Votar nesta nota"
            >
              <span>●</span>
              <span>{element.style.votes || 0}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
