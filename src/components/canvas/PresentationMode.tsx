import React, { useState, useEffect } from 'react';
import { CanvasFrame } from '../../types/miro';
import { X, ChevronLeft, ChevronRight, Maximize2, Play, Pause } from 'lucide-react';

interface PresentationModeProps {
  frames: CanvasFrame[];
  isOpen: boolean;
  onClose: () => void;
  onFocusFrame: (frame: CanvasFrame) => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  frames,
  isOpen,
  onClose,
  onFocusFrame,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (isOpen && frames.length > 0) {
      onFocusFrame(frames[currentSlideIndex]);
    }
  }, [isOpen, currentSlideIndex, frames]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlideIndex, frames.length]);

  if (!isOpen || frames.length === 0) return null;

  const goToNext = () => {
    if (currentSlideIndex < frames.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  const currentFrame = frames[currentSlideIndex];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md select-none border border-slate-700/60 animate-in fade-in slide-in-from-bottom-3">
      {/* Slide Title */}
      <span className="text-xs font-bold truncate max-w-[200px] text-slate-200">
        {currentFrame.title}
      </span>

      <div className="h-4 w-px bg-slate-700" />

      {/* Navigation Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={goToPrev}
          disabled={currentSlideIndex === 0}
          className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-30 transition-colors"
          title="Slide anterior (←)"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-xs font-mono font-bold px-1 text-slate-300">
          {currentSlideIndex + 1} / {frames.length}
        </span>

        <button
          onClick={goToNext}
          disabled={currentSlideIndex === frames.length - 1}
          className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-30 transition-colors"
          title="Próximo slide (→ ou Espaço)"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="h-4 w-px bg-slate-700" />

      {/* Close Presentation */}
      <button
        onClick={onClose}
        className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
        title="Sair do modo apresentação (Esc)"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
