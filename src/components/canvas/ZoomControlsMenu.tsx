import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Target,
  Sliders,
  Check,
  MousePointer,
} from 'lucide-react';

interface ZoomControlsMenuProps {
  zoom: number;
  onSetZoom: (newZoom: number) => void;
  onFitToContent: () => void;
  onZoomToSelection: () => void;
  onResetZoom: () => void;
  isOpen: boolean;
  onClose: () => void;
  wheelZoomMode: 'zoom' | 'pan';
  onToggleWheelMode: () => void;
}

export const ZoomControlsMenu: React.FC<ZoomControlsMenuProps> = ({
  zoom,
  onSetZoom,
  onFitToContent,
  onZoomToSelection,
  onResetZoom,
  isOpen,
  onClose,
  wheelZoomMode,
  onToggleWheelMode,
}) => {
  if (!isOpen) return null;

  const presets = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 3.0];

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute bottom-14 right-4 z-50 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 select-none animate-in fade-in slide-in-from-bottom-2 text-slate-800"
    >
      {/* Header with Slider */}
      <div className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            Nível de Zoom
          </span>
          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        <input
          type="range"
          min="0.15"
          max="3.0"
          step="0.05"
          value={zoom}
          onChange={(e) => onSetZoom(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* Quick Presets Grid */}
      <div className="py-2.5 border-b border-slate-100">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
          Predefinições
        </span>
        <div className="grid grid-cols-4 gap-1">
          {presets.map((p) => {
            const isCurrent = Math.abs(zoom - p) < 0.03;
            return (
              <button
                key={p}
                onClick={() => {
                  onSetZoom(p);
                }}
                className={`py-1 text-xs font-medium rounded-lg transition-colors text-center ${
                  isCurrent
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                {Math.round(p * 100)}%
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="py-2 space-y-1">
        <button
          onClick={() => {
            onFitToContent();
            onClose();
          }}
          className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors font-medium text-left"
        >
          <span className="flex items-center gap-2">
            <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
            Ajustar à tela (Fit)
          </span>
          <kbd className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
            1
          </kbd>
        </button>

        <button
          onClick={() => {
            onZoomToSelection();
            onClose();
          }}
          className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors font-medium text-left"
        >
          <span className="flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-slate-500" />
            Zoom na seleção
          </span>
          <kbd className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
            2
          </kbd>
        </button>

        <button
          onClick={() => {
            onResetZoom();
            onClose();
          }}
          className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium text-left"
        >
          <span className="flex items-center gap-2">
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            Resetar para 100%
          </span>
          <kbd className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
            0
          </kbd>
        </button>
      </div>

      {/* Mouse Wheel Behavior Toggle */}
      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={onToggleWheelMode}
          className="w-full flex items-center justify-between px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-50 rounded-md"
        >
          <span className="flex items-center gap-1.5">
            <MousePointer className="w-3 h-3 text-slate-400" />
            Roda do mouse:
          </span>
          <span className="font-semibold text-blue-600">
            {wheelZoomMode === 'zoom' ? 'Zoom Direto' : 'Pan (Ctrl p/ Zoom)'}
          </span>
        </button>
      </div>
    </div>
  );
};
