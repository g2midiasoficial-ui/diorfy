import React, { useState } from 'react';
import { CanvasElement } from '../../types/miro';
import { Image as ImageIcon, ExternalLink, Trash2, Copy, Check, Download } from 'lucide-react';
import { playSound } from '../../utils/soundEffects';

interface ImageElementProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onUpdateContent?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
}

export const ImageElement: React.FC<ImageElementProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdateContent,
  onDelete,
}) => {
  const [hasError, setHasError] = useState(false);
  const [copied, setCopied] = useState(false);
  const imageUrl = element.style.imageUrl || element.content;
  const caption = element.content !== imageUrl ? element.content : '';

  const handleCopyImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (imageUrl) {
        await navigator.clipboard.writeText(imageUrl);
        setCopied(true);
        playSound.click();
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `imagem-diorfy-${Date.now()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    playSound.click();
  };

  return (
    <div
      onClick={onSelect}
      className={`absolute select-none group cursor-move transition-shadow rounded-2xl overflow-hidden ${
        isSelected ? 'ring-2 ring-blue-600 shadow-xl' : 'shadow-md hover:shadow-lg'
      }`}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        zIndex: element.zIndex,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
        backgroundColor: element.style.backgroundColor || '#ffffff',
      }}
    >
      {hasError || !imageUrl ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-50 text-slate-400 border-2 border-dashed border-slate-200">
          <ImageIcon className="w-8 h-8 mb-2 opacity-50 text-slate-400" />
          <span className="text-xs text-center font-bold text-slate-600">Imagem indisponível</span>
          <span className="text-[10px] text-slate-400 text-center truncate max-w-full px-2">
            {imageUrl || 'Sem URL'}
          </span>
        </div>
      ) : (
        <div className="relative w-full h-full flex flex-col bg-slate-100">
          <img
            src={imageUrl}
            alt={caption || 'Diorfy asset'}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover select-none pointer-events-none"
            draggable={false}
          />
          {caption && (
            <div className="absolute bottom-0 inset-x-0 bg-black/65 backdrop-blur-xs text-white text-xs px-3 py-1.5 text-center font-medium truncate">
              {caption}
            </div>
          )}
        </div>
      )}

      {/* Selected Action overlay */}
      {isSelected && (
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/95 backdrop-blur-xs p-1 rounded-xl shadow-lg border border-slate-200">
          <button
            onClick={handleCopyImage}
            className="p-1.5 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title={copied ? 'URL Copiada!' : 'Copiar URL / Imagem (Ctrl+C)'}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="Baixar imagem"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          {imageUrl && (
            <a
              href={imageUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Abrir em nova aba"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(element.id);
              }}
              className="p-1.5 text-slate-600 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
              title="Excluir imagem (Delete)"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
