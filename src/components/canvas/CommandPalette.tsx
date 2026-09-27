import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Sparkles,
  Film,
  StickyNote,
  Square,
  Type,
  PenTool,
  ArrowUpRight,
  Frame,
  Lock,
  Unlock,
  Copy,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Volume2,
  VolumeX,
  Grid,
  Bot,
  Layers,
  HelpCircle,
  X,
  ArrowRight,
} from 'lucide-react';
import { playSound } from '../../utils/soundEffects';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (tool: any) => void;
  onOpenNanoBanana: () => void;
  onOpenAiAgent: () => void;
  onOpenSlideMotion: () => void;
  onOpenTemplates: () => void;
  onOpenExport: () => void;
  onOpenShortcuts: () => void;
  onFitContent: () => void;
  onResetZoom: () => void;
  onToggleGridSnap: () => void;
  onToggleSound: () => void;
  isSoundOn: boolean;
  isGridSnapOn: boolean;
  selectedCount: number;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleLock: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTool,
  onOpenNanoBanana,
  onOpenAiAgent,
  onOpenSlideMotion,
  onOpenTemplates,
  onOpenExport,
  onOpenShortcuts,
  onFitContent,
  onResetZoom,
  onToggleGridSnap,
  onToggleSound,
  isSoundOn,
  isGridSnapOn,
  selectedCount,
  onDuplicate,
  onDelete,
  onToggleLock,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'nano_banana',
      title: '🍌 Nano Banana: Gerar Imagem com IA',
      category: 'Inteligência Artificial',
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      run: () => onOpenNanoBanana(),
    },
    {
      id: 'ai_copilot',
      title: '🤖 Agente Diorfy AI Copilot',
      category: 'Inteligência Artificial',
      icon: <Bot className="w-4 h-4 text-indigo-500" />,
      run: () => onOpenAiAgent(),
    },
    {
      id: 'motion_slides',
      title: '🎬 Estúdio de Slides & Motion Design',
      category: 'Apresentação',
      icon: <Film className="w-4 h-4 text-purple-500" />,
      run: () => onOpenSlideMotion(),
    },
    {
      id: 'tool_sticky',
      title: '📝 Inserir Nota Adesiva (Post-it)',
      category: 'Ferramentas',
      icon: <StickyNote className="w-4 h-4 text-amber-500" />,
      run: () => onSelectTool('sticky'),
    },
    {
      id: 'tool_shape',
      title: '⬜ Inserir Forma Geométrica',
      category: 'Ferramentas',
      icon: <Square className="w-4 h-4 text-blue-500" />,
      run: () => onSelectTool('shape'),
    },
    {
      id: 'tool_text',
      title: '🔤 Inserir Caixa de Texto',
      category: 'Ferramentas',
      icon: <Type className="w-4 h-4 text-slate-700" />,
      run: () => onSelectTool('text'),
    },
    {
      id: 'tool_connector',
      title: '↗️ Inserir Linha / Seta Conectora',
      category: 'Ferramentas',
      icon: <ArrowUpRight className="w-4 h-4 text-blue-600" />,
      run: () => onSelectTool('connector'),
    },
    {
      id: 'tool_frame',
      title: '🖼️ Inserir Frame / Quadro de Slide',
      category: 'Ferramentas',
      icon: <Frame className="w-4 h-4 text-slate-600" />,
      run: () => onSelectTool('frame'),
    },
    {
      id: 'tool_pen',
      title: '✏️ Caneta de Desenho Livre',
      category: 'Ferramentas',
      icon: <PenTool className="w-4 h-4 text-emerald-600" />,
      run: () => onSelectTool('pen'),
    },
    {
      id: 'templates',
      title: '📚 Abrir Biblioteca de Templates',
      category: 'Ferramentas',
      icon: <Layers className="w-4 h-4 text-indigo-600" />,
      run: () => onOpenTemplates(),
    },
    {
      id: 'fit_screen',
      title: '🔍 Ajustar Todo Conteúdo à Tela (Fit)',
      category: 'Visualização & Zoom',
      icon: <Maximize2 className="w-4 h-4 text-blue-500" />,
      run: () => onFitContent(),
    },
    {
      id: 'reset_zoom',
      title: '🎯 Resetar Zoom para 100%',
      category: 'Visualização & Zoom',
      icon: <ZoomIn className="w-4 h-4 text-blue-500" />,
      run: () => onResetZoom(),
    },
    {
      id: 'toggle_grid',
      title: `🧲 Grid Magnético: ${isGridSnapOn ? 'Ativado' : 'Desativado'}`,
      category: 'Preferências',
      icon: <Grid className="w-4 h-4 text-slate-600" />,
      run: () => onToggleGridSnap(),
    },
    {
      id: 'toggle_sound',
      title: `🔊 Efeitos Sonoros: ${isSoundOn ? 'Ligados' : 'Desligados'}`,
      category: 'Preferências',
      icon: isSoundOn ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />,
      run: () => onToggleSound(),
    },
    {
      id: 'custom_shortcuts',
      title: '⌨️ Personalizar Teclas de Atalho',
      category: 'Configurações',
      icon: <HelpCircle className="w-4 h-4 text-indigo-600" />,
      run: () => onOpenShortcuts(),
    },
    {
      id: 'export_board',
      title: '📥 Exportar Quadro (JSON, Imagem)',
      category: 'Exportação',
      icon: <Download className="w-4 h-4 text-emerald-600" />,
      run: () => onOpenExport(),
    },
  ];

  if (selectedCount > 0) {
    actions.unshift(
      {
        id: 'dup_selection',
        title: `📑 Duplicar ${selectedCount} elemento(s) selecionado(s)`,
        category: 'Seleção Ativa',
        icon: <Copy className="w-4 h-4 text-blue-600" />,
        run: () => onDuplicate(),
      },
      {
        id: 'lock_selection',
        title: `🔒 Bloquear / Desbloquear Seleção`,
        category: 'Seleção Ativa',
        icon: <Lock className="w-4 h-4 text-amber-600" />,
        run: () => onToggleLock(),
      },
      {
        id: 'del_selection',
        title: `🗑️ Excluir ${selectedCount} elemento(s) selecionado(s)`,
        category: 'Seleção Ativa',
        icon: <Trash2 className="w-4 h-4 text-rose-600" />,
        run: () => onDelete(),
      }
    );
  }

  const filtered = actions.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filtered[selectedIndex];
      if (selected) {
        playSound.click();
        selected.run();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4 z-50 animate-in fade-in select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col animate-in zoom-in-95"
      >
        {/* Search Input */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Digite uma ação, ferramenta ou comando (ex: post-it, slides, zoom, nano banana...)"
            className="flex-1 text-sm bg-transparent outline-none text-slate-900 placeholder-slate-400 font-medium"
          />
          <kbd className="px-2 py-0.5 bg-slate-200/70 text-slate-600 text-[10px] font-mono font-bold rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              Nenhuma ação encontrada para "{query}"
            </div>
          ) : (
            filtered.map((action, idx) => (
              <button
                key={action.id}
                onClick={() => {
                  playSound.click();
                  action.run();
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-colors cursor-pointer ${
                  selectedIndex === idx
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-xl ${
                      selectedIndex === idx ? 'bg-white/20 text-white' : 'bg-slate-100'
                    }`}
                  >
                    {action.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold">{action.title}</div>
                    <div
                      className={`text-[10px] ${
                        selectedIndex === idx ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {action.category}
                    </div>
                  </div>
                </div>

                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
          <span>Navegue com <b>↑ ↓</b> e selecione com <b>Enter</b></span>
          <span>Diorfy Spotlight</span>
        </div>
      </div>
    </div>
  );
};
