import React, { useState } from 'react';
import { CanvasElement } from '../../types/miro';
import {
  Trash2,
  Copy,
  Layers,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  ChevronDown,
  Scale,
  Lock,
  Unlock,
  Pipette,
  Check,
} from 'lucide-react';

interface SelectionToolbarProps {
  selectedElements: CanvasElement[];
  onUpdateStyle: (styleUpdates: Partial<CanvasElement['style']>) => void;
  onUpdateSize?: (width: number, height: number) => void;
  onAlign?: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onCopy?: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onToggleLock?: () => void;
}

export const SelectionToolbar: React.FC<SelectionToolbarProps> = ({
  selectedElements,
  onUpdateStyle,
  onUpdateSize,
  onAlign,
  onCopy,
  onDuplicate,
  onDelete,
  onBringForward,
  onSendBackward,
  onToggleLock,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const [showSizePresets, setShowSizePresets] = useState(false);
  const [customHex, setCustomHex] = useState('');
  const [justCopied, setJustCopied] = useState(false);

  if (selectedElements.length === 0) return null;

  const firstEl = selectedElements[0];
  const isLocked = !!firstEl.style.isLocked;

  // Calculate bounding box center to position floating toolbar above element
  const minX = Math.min(...selectedElements.map((el) => el.x));
  const minY = Math.min(...selectedElements.map((el) => el.y));
  const maxX = Math.max(...selectedElements.map((el) => el.x + el.width));

  const centerX = (minX + maxX) / 2;
  const topY = Math.max(10, minY - 48);

  const colors = [
    { bg: '#ffffff', border: '#cbd5e1' },
    { bg: '#fef08a', border: '#eab308' },
    { bg: '#bbf7d0', border: '#22c55e' },
    { bg: '#bae6fd', border: '#0284c7' },
    { bg: '#fbcfe8', border: '#db2777' },
    { bg: '#fed7aa', border: '#ea580c' },
    { bg: '#e9d5ff', border: '#9333ea' },
    { bg: '#1e293b', border: '#0f172a' },
    { bg: '#ffedd5', border: '#f97316' },
    { bg: '#ccfbf1', border: '#14b8a6' },
    { bg: '#f1f5f9', border: '#94a3b8' },
    { bg: '#3b82f6', border: '#1d4ed8' },
  ];

  const fontSizes = [12, 14, 16, 18, 24, 32, 48];

  const sizePresets = [
    { label: 'Pequeno (S)', width: 140, height: 120 },
    { label: 'Médio (M)', width: 200, height: 180 },
    { label: 'Grande (L)', width: 300, height: 260 },
    { label: 'Extra Grande (XL)', width: 440, height: 360 },
  ];

  const handleApplyCustomHex = (e: React.FormEvent) => {
    e.preventDefault();
    if (customHex.trim()) {
      const hex = customHex.startsWith('#') ? customHex : `#${customHex}`;
      onUpdateStyle({ backgroundColor: hex });
      setShowColorPicker(false);
      setCustomHex('');
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute z-50 flex items-center gap-1 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-1 select-none animate-in fade-in"
      style={{
        left: `${centerX}px`,
        top: `${topY}px`,
        transform: 'translateX(-50%)',
      }}
    >
      {/* Background Color Picker */}
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-1.5 rounded-xl hover:bg-slate-100 flex items-center gap-1 text-slate-700 text-xs cursor-pointer"
          title="Cor de Fundo"
        >
          <div
            className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs"
            style={{ backgroundColor: firstEl.style.backgroundColor || '#fef08a' }}
          />
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {showColorPicker && (
          <div className="absolute left-0 bottom-full mb-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2.5 z-50 w-44">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Paleta de Cores
            </span>
            <div className="grid grid-cols-4 gap-1.5 mb-2.5">
              {colors.map((c, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onUpdateStyle({ backgroundColor: c.bg });
                    setShowColorPicker(false);
                  }}
                  className="w-7 h-7 rounded-lg border shadow-2xs hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                  style={{ backgroundColor: c.bg, borderColor: c.border }}
                />
              ))}
            </div>

            {/* Custom HEX input */}
            <form onSubmit={handleApplyCustomHex} className="flex items-center gap-1 pt-1.5 border-t border-slate-100">
              <input
                type="text"
                value={customHex}
                onChange={(e) => setCustomHex(e.target.value)}
                placeholder="#3b82f6"
                className="flex-1 text-[11px] font-mono border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="h-4 w-px bg-slate-200" />

      {/* Font Size Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowFontSizeMenu(!showFontSizeMenu)}
          className="px-2 py-1 rounded-xl hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
          title="Tamanho do Texto"
        >
          <span>{firstEl.style.fontSize || 14}px</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {showFontSizeMenu && (
          <div className="absolute left-0 bottom-full mb-2 bg-white rounded-2xl shadow-xl border border-slate-200 py-1 z-50 min-w-[70px]">
            {fontSizes.map((size) => (
              <button
                key={size}
                onClick={() => {
                  onUpdateStyle({ fontSize: size });
                  setShowFontSizeMenu(false);
                }}
                className={`w-full text-left px-3 py-1 text-xs hover:bg-slate-100 font-medium cursor-pointer ${
                  firstEl.style.fontSize === size ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700'
                }`}
              >
                {size}px
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Size Preset */}
      {onUpdateSize && (
        <div className="relative">
          <button
            onClick={() => setShowSizePresets(!showSizePresets)}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 flex items-center gap-1 cursor-pointer"
            title="Predefinição de Tamanho"
          >
            <Scale className="w-3.5 h-3.5" />
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showSizePresets && (
            <div className="absolute left-0 bottom-full mb-2 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 w-44">
              <span className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider block">
                Tamanho Rápido
              </span>
              {sizePresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onUpdateSize(preset.width, preset.height);
                    setShowSizePresets(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 text-slate-700 font-medium flex items-center justify-between cursor-pointer"
                >
                  <span>{preset.label}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {preset.width}x{preset.height}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Font Weight */}
      <button
        onClick={() => {
          const nextWeight = firstEl.style.fontWeight === 'bold' ? 'normal' : 'bold';
          onUpdateStyle({ fontWeight: nextWeight });
        }}
        className={`p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer ${
          firstEl.style.fontWeight === 'bold' ? 'bg-slate-100 text-blue-600' : 'text-slate-600'
        }`}
        title="Negrito"
      >
        <Bold className="w-3.5 h-3.5" />
      </button>

      {/* Multi-element Align Buttons */}
      {selectedElements.length > 1 && onAlign && (
        <>
          <div className="h-4 w-px bg-slate-200" />
          <button
            onClick={() => onAlign('left')}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer"
            title="Alinhar à Esquerda"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onAlign('center')}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer"
            title="Alinhar ao Centro"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
        </>
      )}

      <div className="h-4 w-px bg-slate-200" />

      {/* Lock / Unlock Toggle */}
      {onToggleLock && (
        <button
          onClick={onToggleLock}
          className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
            isLocked ? 'bg-amber-100 text-amber-800' : 'text-slate-600 hover:bg-slate-100'
          }`}
          title={isLocked ? 'Elemento Bloqueado (Clique para desbloquear)' : 'Bloquear Elemento (Ctrl+L)'}
        >
          {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
        </button>
      )}

      {/* Copy */}
      {onCopy && (
        <button
          onClick={() => {
            onCopy();
            setJustCopied(true);
            setTimeout(() => setJustCopied(false), 2000);
          }}
          className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
            justCopied ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
          title={justCopied ? 'Copiado para Área de Transferência!' : 'Copiar Seleção / Imagem (Ctrl+C)'}
        >
          {justCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      )}

      {/* Duplicate */}
      <button
        onClick={onDuplicate}
        className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        title="Duplicar (Ctrl+D)"
      >
        <span className="text-[11px] font-bold px-0.5">2x</span>
      </button>

      {/* Layer Forward */}
      <button
        onClick={onBringForward}
        className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        title="Trazer para Frente"
      >
        <Layers className="w-3.5 h-3.5" />
      </button>

      <div className="h-4 w-px bg-slate-200" />

      {/* Delete */}
      <button
        onClick={onDelete}
        className="p-1.5 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
        title="Excluir elemento (Delete)"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
