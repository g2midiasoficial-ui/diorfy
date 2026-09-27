import React, { useState } from 'react';
import {
  Folder,
  ChevronDown,
  Download,
  Share2,
  Play,
  Timer as TimerIcon,
  Vote,
  Video,
  MoreVertical,
  ArrowLeft,
  Sparkles,
  Check,
  Edit2,
  Trash2,
  Copy,
  FileImage,
  FileCode,
  Users,
  Grid3X3,
  Search,
  Volume2,
  VolumeX,
  Keyboard,
  Film,
  Bot,
  Network,
  Wand2,
  Presentation,
} from 'lucide-react';
import { BoardItem } from '../../types/miro';

interface CanvasTopNavProps {
  board: BoardItem;
  onBackToDashboard: () => void;
  onRenameBoard: (newTitle: string) => void;
  onOpenExport: () => void;
  onOpenShare: () => void;
  onOpenUpgrade: () => void;
  onToggleTimer: () => void;
  isTimerActive: boolean;
  onToggleVoting: () => void;
  isVotingActive: boolean;
  onStartPresentation: () => void;
  collaboratorCount: number;
  onToggleCollabCursors: () => void;
  showCollabCursors: boolean;
  onOpenCommandPalette?: () => void;
  onOpenShortcuts?: () => void;
  isSoundOn?: boolean;
  onToggleSound?: () => void;
  onToggleTalkTrack?: () => void;
  isTalkTrackActive?: boolean;
  // Diorfy AI & Studio Triggers in Header
  onOpenAI?: () => void;
  onOpenSlideMotion?: () => void;
  onOpenNanoBanana?: () => void;
  onOpenMindmapStudio?: () => void;
  onOpenAiAgent?: () => void;
}

export const CanvasTopNav: React.FC<CanvasTopNavProps> = ({
  board,
  onBackToDashboard,
  onRenameBoard,
  onOpenExport,
  onOpenShare,
  onOpenUpgrade,
  onToggleTimer,
  isTimerActive,
  onToggleVoting,
  isVotingActive,
  onStartPresentation,
  collaboratorCount,
  onToggleCollabCursors,
  showCollabCursors,
  onOpenCommandPalette,
  onOpenShortcuts,
  isSoundOn,
  onToggleSound,
  onToggleTalkTrack,
  isTalkTrackActive,
  onOpenAI,
  onOpenSlideMotion,
  onOpenNanoBanana,
  onOpenMindmapStudio,
  onOpenAiAgent,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(board.title);
  const [showMenu, setShowMenu] = useState(false);
  const [showAiDropdown, setShowAiDropdown] = useState(false);

  const handleSaveTitle = () => {
    if (titleInput.trim()) {
      onRenameBoard(titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="h-13 bg-white border-b border-slate-200 px-3 sm:px-4 flex items-center justify-between z-30 shrink-0 select-none shadow-2xs">
      {/* Left zone: Logo, Back, Board Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Diorfy Logo / Back button */}
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-100 transition-colors group cursor-pointer shrink-0"
          title="Voltar ao Painel Diorfy"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm group-hover:scale-105 transition-transform">
            D
          </div>
        </button>

        {/* Board Title & Rename */}
        <div className="flex items-center gap-1 min-w-0">
          {isEditingTitle ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') setIsEditingTitle(false);
                }}
                autoFocus
                className="font-bold text-xs sm:text-sm text-slate-900 border border-blue-500 rounded px-1.5 py-0.5 outline-none max-w-[140px] sm:max-w-[220px]"
              />
            </div>
          ) : (
            <button
              onClick={() => {
                setTitleInput(board.title);
                setIsEditingTitle(true);
              }}
              className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-slate-800 hover:text-blue-600 hover:bg-slate-100 px-1.5 py-1 rounded-md transition-colors max-w-[120px] sm:max-w-xs truncate cursor-pointer"
              title="Clique para renomear"
            >
              <span className="truncate">{board.title}</span>
              {board.isReadOnly && (
                <span className="hidden sm:inline text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200">
                  Somente leitura
                </span>
              )}
            </button>
          )}

          {/* Three-dot dropdown menu */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute left-0 top-full mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setIsEditingTitle(true);
                  }}
                  className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                  Renomear quadro
                </button>
                {onOpenShortcuts && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onOpenShortcuts();
                    }}
                    className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                  >
                    <Keyboard className="w-3.5 h-3.5 text-indigo-500" />
                    Personalizar Atalhos
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onOpenExport();
                  }}
                  className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  Exportar quadro
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onBackToDashboard();
                  }}
                  className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                  Voltar para Início
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Command Palette Spotlight Button */}
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-600 rounded-xl text-xs font-medium transition-colors border border-slate-200/80 cursor-pointer ml-2"
            title="Buscar ações e ferramentas (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Buscar...</span>
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold text-slate-500 shadow-2xs">
              Ctrl+K
            </kbd>
          </button>
        )}
      </div>

      {/* Center Zone: Prominent Diorfy AI Suite & Slide Generator */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* 🎬 GERADOR DE SLIDES DO QUADRO */}
        {onOpenSlideMotion && (
          <button
            onClick={onOpenSlideMotion}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-bold transition-all shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
            title="Gerador de Slides: Transforma tudo o que você fizer no quadro em apresentação de slides interativa!"
          >
            <Film className="w-4 h-4 group-hover:rotate-6 transition-transform" />
            <span className="flex items-center gap-1">
              <span>Gerador de Slides</span>
              <span className="hidden lg:inline text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-medium">
                Quadro → Slides
              </span>
            </span>
          </button>
        )}

        {/* ✨ DIORFY AI SUITE BUTTON (Dropdown) */}
        <div className="relative">
          <button
            onClick={() => setShowAiDropdown(!showAiDropdown)}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:bg-blue-100/70 border border-blue-200 text-blue-800 text-xs font-bold transition-all cursor-pointer"
            title="Ferramentas Inteligentes Diorfy AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span className="hidden sm:inline">Diorfy AI</span>
            <ChevronDown className="w-3 h-3 text-blue-600" />
          </button>

          {showAiDropdown && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 text-xs animate-in fade-in">
              <div className="px-2 py-1 border-b border-slate-100 mb-1 flex items-center justify-between">
                <span className="font-bold text-slate-900">Suíte Diorfy AI</span>
                <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.2 rounded-full">
                  Inteligência Visual
                </span>
              </div>

              {/* Gerador de Slides */}
              {onOpenSlideMotion && (
                <button
                  onClick={() => {
                    setShowAiDropdown(false);
                    onOpenSlideMotion();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-purple-50 text-purple-900 text-left font-semibold transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <Film className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Gerador de Slides</p>
                    <p className="text-[10px] text-slate-500">Transforma o quadro em apresentação</p>
                  </div>
                </button>
              )}

              {/* Brainstorms & Templates */}
              {onOpenAI && (
                <button
                  onClick={() => {
                    setShowAiDropdown(false);
                    onOpenAI();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-blue-50 text-blue-900 text-left font-semibold transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Brainstorm & Templates IA</p>
                    <p className="text-[10px] text-slate-500">Cria matrizes, notas e roadmaps</p>
                  </div>
                </button>
              )}

              {/* Nano Banana Image Studio */}
              {onOpenNanoBanana && (
                <button
                  onClick={() => {
                    setShowAiDropdown(false);
                    onOpenNanoBanana();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-amber-50 text-amber-900 text-left font-semibold transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 text-sm">
                    🍌
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Nano Banana Imagens</p>
                    <p className="text-[10px] text-slate-500">Gerador de fotos e ilustrações 3D</p>
                  </div>
                </button>
              )}

              {/* Mindmap Studio */}
              {onOpenMindmapStudio && (
                <button
                  onClick={() => {
                    setShowAiDropdown(false);
                    onOpenMindmapStudio();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-cyan-50 text-cyan-900 text-left font-semibold transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
                    <Network className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Mapas Mentais</p>
                    <p className="text-[10px] text-slate-500">Estruturação de ideias e fluxos</p>
                  </div>
                </button>
              )}

              {/* Copilot Agent */}
              {onOpenAiAgent && (
                <button
                  onClick={() => {
                    setShowAiDropdown(false);
                    onOpenAiAgent();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-indigo-50 text-indigo-900 text-left font-semibold transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Agente Copilot</p>
                    <p className="text-[10px] text-slate-500">Assistente interativo de ideação</p>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right zone: Interactive Widgets, Collaboration, Presentation, Share */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Sound toggle button */}
        {onToggleSound && (
          <button
            onClick={onToggleSound}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              isSoundOn ? 'text-blue-600 hover:bg-blue-50' : 'text-slate-400 hover:bg-slate-100'
            }`}
            title={isSoundOn ? 'Efeitos sonoros ativados (Clique para silenciar)' : 'Efeitos sonoros desativados'}
          >
            {isSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        )}

        {/* Custom Shortcuts trigger */}
        {onOpenShortcuts && (
          <button
            onClick={onOpenShortcuts}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Escolher Teclas de Atalhos (Configurar Teclado)"
          >
            <Keyboard className="w-4 h-4 text-indigo-600" />
          </button>
        )}

        {/* Timer Widget Button */}
        <button
          onClick={onToggleTimer}
          className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            isTimerActive
              ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-400'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Temporizador de Reunião"
        >
          <TimerIcon className="w-4 h-4" />
          <span className="hidden md:inline">Timer</span>
        </button>

        {/* Voting Widget Button */}
        <button
          onClick={onToggleVoting}
          className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            isVotingActive
              ? 'bg-purple-100 text-purple-800 ring-1 ring-purple-400 animate-pulse'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Sessão de Votação com Notas"
        >
          <Vote className="w-4 h-4" />
          <span className="hidden md:inline">Votação</span>
        </button>

        <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* Collaborators Avatar Stack */}
        <button
          onClick={onToggleCollabCursors}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            showCollabCursors ? 'bg-emerald-50 text-emerald-800' : 'text-slate-500 hover:bg-slate-100'
          }`}
          title={showCollabCursors ? 'Ocultar cursores ao vivo' : 'Exibir cursores ao vivo'}
        >
          <div className="flex -space-x-1.5 overflow-hidden">
            <span className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
              MS
            </span>
            <span className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
              CM
            </span>
          </div>
          <span className="hidden lg:inline text-[11px] font-bold ml-1">{collaboratorCount} online</span>
        </button>

        {/* Presentation Button (Direct Trigger to Slide Generator Presentation) */}
        <button
          onClick={onStartPresentation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold transition-colors cursor-pointer border border-purple-200"
          title="Apresentar Quadro"
        >
          <Play className="w-3.5 h-3.5 fill-purple-700" />
          <span className="hidden sm:inline">Apresentar</span>
        </button>

        {/* Share Button */}
        <button
          onClick={onOpenShare}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Compartilhar</span>
        </button>
      </div>
    </header>
  );
};
