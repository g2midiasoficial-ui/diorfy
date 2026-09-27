import React, { useState, useEffect } from 'react';
import {
  X,
  Keyboard,
  RotateCcw,
  Check,
  Sparkles,
  Volume2,
  VolumeX,
  Grid,
  Palette,
  Sliders,
  AlertCircle,
  Eye,
} from 'lucide-react';
import {
  ShortcutAction,
  CustomShortcutMap,
  DEFAULT_SHORTCUTS,
  getShortcutDisplay,
} from '../../types/shortcuts';
import { playSound, isSoundEnabled, setSoundEnabled } from '../../utils/soundEffects';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customShortcuts: CustomShortcutMap;
  onUpdateShortcut: (actionId: string, shortcut: { key: string; ctrlKey?: boolean; shiftKey?: boolean; altKey?: boolean; metaKey?: boolean }) => void;
  onResetAllShortcuts: () => void;
  // Preferences
  isSoundOn: boolean;
  onToggleSound: () => void;
  gridSnapSize: number;
  onChangeGridSnap: (size: number) => void;
  canvasBgStyle: 'grid' | 'dots' | 'blueprint' | 'dark' | 'clean';
  onChangeCanvasBg: (style: 'grid' | 'dots' | 'blueprint' | 'dark' | 'clean') => void;
  showCollabCursors: boolean;
  onToggleCollabCursors: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({
  isOpen,
  onClose,
  customShortcuts,
  onUpdateShortcut,
  onResetAllShortcuts,
  isSoundOn,
  onToggleSound,
  gridSnapSize,
  onChangeGridSnap,
  canvasBgStyle,
  onChangeCanvasBg,
  showCollabCursors,
  onToggleCollabCursors,
}) => {
  const [activeTab, setActiveTab] = useState<'shortcuts' | 'preferences'>('shortcuts');
  const [recordingActionId, setRecordingActionId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Key recording listener
  useEffect(() => {
    if (!recordingActionId) return;

    const handleKeyRecord = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Ignore lone modifier keys
      if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
        return;
      }

      const newShortcut = {
        key: e.key.toLowerCase(),
        ctrlKey: e.ctrlKey || e.metaKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        metaKey: e.metaKey,
      };

      playSound.pop();
      onUpdateShortcut(recordingActionId, newShortcut);
      setRecordingActionId(null);
    };

    window.addEventListener('keydown', handleKeyRecord, true);
    return () => window.removeEventListener('keydown', handleKeyRecord, true);
  }, [recordingActionId, onUpdateShortcut]);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'Todos os Atalhos' },
    { id: 'tools', label: '🎯 Ferramentas' },
    { id: 'zoom', label: '🔍 Zoom & Tela' },
    { id: 'edit', label: '✏️ Edição & Seleção' },
    { id: 'ai_features', label: '⚡ IA & Apresentação' },
    { id: 'view', label: '👁️ Visualização' },
  ];

  const filteredShortcuts = DEFAULT_SHORTCUTS.filter(
    (s) => selectedCategory === 'all' || s.category === selectedCategory
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in select-none">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-200">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Atalhos Personalizados & Preferências</h3>
              <p className="text-xs text-slate-600">
                Escolha suas próprias teclas de atalho e configure seu workspace
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setRecordingActionId(null);
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white/80 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 border-b border-slate-100 flex gap-4 bg-slate-50/50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'shortcuts'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            Editor de Atalhos ({DEFAULT_SHORTCUTS.length})
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'preferences'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Preferências do Canvas
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'shortcuts' ? (
            <div className="space-y-4">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Recording Banner */}
              {recordingActionId && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between text-xs text-amber-900 animate-pulse">
                  <div className="flex items-center gap-2 font-bold">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Pressione agora a nova tecla ou combinação no teclado...</span>
                  </div>
                  <button
                    onClick={() => setRecordingActionId(null)}
                    className="px-2 py-1 bg-white border border-amber-300 rounded-lg font-bold text-[10px] text-amber-800 hover:bg-amber-100 cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              )}

              {/* Shortcuts Table */}
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                {filteredShortcuts.map((action) => {
                  const currentBinding = customShortcuts[action.id] || {
                    key: action.defaultKey,
                    ctrlKey: action.ctrlKey,
                    shiftKey: action.shiftKey,
                    altKey: action.altKey,
                    metaKey: action.metaKey,
                  };
                  const isCustomized = !!customShortcuts[action.id];
                  const isRecordingThis = recordingActionId === action.id;

                  return (
                    <div
                      key={action.id}
                      className={`p-3.5 flex items-center justify-between transition-colors ${
                        isRecordingThis ? 'bg-amber-50/70' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="pr-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">{action.label}</span>
                          {isCustomized && (
                            <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                              Personalizado
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">{action.description}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setRecordingActionId(action.id)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isRecordingThis
                              ? 'border-amber-500 bg-amber-500 text-white animate-bounce shadow-md'
                              : isCustomized
                              ? 'border-blue-400 bg-blue-50 text-blue-800 hover:bg-blue-100'
                              : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800'
                          }`}
                          title="Clique para redefinir este atalho"
                        >
                          {isRecordingThis ? (
                            <span>Pressione a tecla...</span>
                          ) : (
                            <span>{getShortcutDisplay(currentBinding)}</span>
                          )}
                        </button>

                        {isCustomized && (
                          <button
                            type="button"
                            onClick={() => {
                              playSound.click();
                              onUpdateShortcut(action.id, {
                                key: action.defaultKey,
                                ctrlKey: action.ctrlKey,
                                shiftKey: action.shiftKey,
                                altKey: action.altKey,
                                metaKey: action.metaKey,
                              });
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Restaurar padrão"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Reset All */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Os atalhos personalizados são salvos automaticamente no seu navegador.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    playSound.trash();
                    onResetAllShortcuts();
                  }}
                  className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Todos os Padrões</span>
                </button>
              </div>
            </div>
          ) : (
            /* Preferences Tab */
            <div className="space-y-5">
              {/* Sound Feedback */}
              <div className="p-4 border border-slate-200 rounded-2xl bg-white shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isSoundOn ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                    {isSoundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Efeitos Sonoros & Áudio Tátil</h4>
                    <p className="text-[11px] text-slate-500">Sons sutis de clique, criação de notas, zoom e ações</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onToggleSound();
                    playSound.pop();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    isSoundOn ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {isSoundOn ? 'Ativado' : 'Desativado'}
                </button>
              </div>

              {/* Magnetic Grid Snapping */}
              <div className="p-4 border border-slate-200 rounded-2xl bg-white shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                      <Grid className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Alinhamento Magnético (Snap to Grid)</h4>
                      <p className="text-[11px] text-slate-500">Encaixe automático ao arrastar notas e formas</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {gridSnapSize === 0 ? 'Livre (Sem Snap)' : `${gridSnapSize}px`}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[
                    { size: 0, label: 'Desativado (Livre)' },
                    { size: 10, label: '10px (Fino)' },
                    { size: 20, label: '20px (Padrão)' },
                    { size: 40, label: '40px (Amplo)' },
                  ].map((g) => (
                    <button
                      key={g.size}
                      onClick={() => {
                        playSound.click();
                        onChangeGridSnap(g.size);
                      }}
                      className={`py-2 px-1 text-xs rounded-xl border font-semibold transition-all cursor-pointer ${
                        gridSnapSize === g.size
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Canvas Background Theme */}
              <div className="p-4 border border-slate-200 rounded-2xl bg-white shadow-2xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Estilo de Fundo do Canvas</h4>
                    <p className="text-[11px] text-slate-500">Escolha a textura da grade da sua lousa infinita</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  {[
                    { id: 'grid', label: 'Linhas Clássicas', desc: 'Grade quadriculada suave' },
                    { id: 'dots', label: 'Pontilhado (Dots)', desc: 'Padrão minimalista pontilhado' },
                    { id: 'blueprint', label: 'Blueprint Azul', desc: 'Estilo projeto arquitetônico' },
                    { id: 'dark', label: 'Dark Studio', desc: 'Fundo escuro profissional' },
                    { id: 'clean', label: 'Fundo Limpo', desc: 'Sem linhas de grade' },
                  ].map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => {
                        playSound.click();
                        onChangeCanvasBg(bg.id as any);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        canvasBgStyle === bg.id
                          ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-800">{bg.label}</div>
                      <div className="text-[10px] text-slate-500">{bg.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Collab Cursors */}
              <div className="p-4 border border-slate-200 rounded-2xl bg-white shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Cursores de Colaboradores ao Vivo</h4>
                    <p className="text-[11px] text-slate-500">Exibir movimentação em tempo real da equipe</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onToggleCollabCursors();
                    playSound.click();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    showCollabCursors ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {showCollabCursors ? 'Visíveis' : 'Ocultos'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
