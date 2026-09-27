import React, { useState } from 'react';
import {
  Sparkles,
  MousePointer,
  Hand,
  LayoutGrid,
  Square,
  StickyNote,
  Type,
  ArrowUpRight,
  PenTool,
  Frame,
  Smile,
  MessageSquare,
  Plus,
  Undo2,
  Redo2,
  Circle,
  Diamond,
  Triangle,
  Star,
  Cylinder,
  Cloud,
  MessageCircle,
  Highlighter,
  Eraser,
  Network,
  Image as ImageIcon,
  Bot,
  Film,
  Zap,
  Hexagon,
  Shield,
  Heart,
  FileText,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Layers,
  Box,
  Tag,
  Settings,
  Award,
  ChevronRight,
  Database,
  PlusCircle,
} from 'lucide-react';
import { ShapeType } from '../../types/miro';

export type CanvasTool =
  | 'select'
  | 'pan'
  | 'sticky'
  | 'shape'
  | 'text'
  | 'connector'
  | 'pen'
  | 'highlighter'
  | 'eraser'
  | 'frame'
  | 'comment'
  | 'mindmap'
  | 'image';

interface CanvasToolbarProps {
  activeTool: CanvasTool;
  onSelectTool: (tool: CanvasTool) => void;
  onOpenAI: () => void;
  onOpenNanoBanana?: () => void;
  onOpenAiAgent?: () => void;
  onOpenSlideMotion?: () => void;
  onOpenMindmapStudio?: () => void;
  onOpenTemplates: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onAddStickyWithColor: (color: string) => void;
  onAddShapeWithType: (type: ShapeType) => void;
  onAddStickerEmoji: (emoji: string) => void;
  onAddImage?: (url: string, title?: string) => void;
  onAddMindmapRootNode?: () => void;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  activeTool,
  onSelectTool,
  onOpenAI,
  onOpenNanoBanana,
  onOpenAiAgent,
  onOpenSlideMotion,
  onOpenMindmapStudio,
  onOpenTemplates,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onAddStickyWithColor,
  onAddShapeWithType,
  onAddStickerEmoji,
  onAddImage,
  onAddMindmapRootNode,
}) => {
  const [showStickyPalette, setShowStickyPalette] = useState(false);
  const [showShapePalette, setShowShapePalette] = useState(false);
  const [showPenPalette, setShowPenPalette] = useState(false);
  const [showStickerPalette, setShowStickerPalette] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showMindmapMenu, setShowMindmapMenu] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [shapeTab, setShapeTab] = useState<'basic' | 'polygon' | 'arrows' | 'symbols'>('basic');

  const stickyColors = [
    { name: 'Amarelo', bg: '#fef08a', border: '#eab308' },
    { name: 'Verde', bg: '#bbf7d0', border: '#22c55e' },
    { name: 'Azul', bg: '#bae6fd', border: '#0284c7' },
    { name: 'Rosa', bg: '#fbcfe8', border: '#db2777' },
    { name: 'Laranja', bg: '#fed7aa', border: '#ea580c' },
    { name: 'Roxo', bg: '#e9d5ff', border: '#9333ea' },
    { name: 'Cinza', bg: '#e2e8f0', border: '#64748b' },
    { name: 'Ciano', bg: '#a5f3fc', border: '#0891b2' },
  ];

  // 30+ Geometric Shapes Organized in 4 Categories
  const basicShapes: { id: ShapeType; label: string; icon: React.ReactNode }[] = [
    { id: 'rectangle', label: 'Retângulo', icon: <Square className="w-4 h-4" /> },
    { id: 'rounded', label: 'Retângulo Arredondado', icon: <Square className="w-4 h-4 rounded-md" /> },
    { id: 'circle', label: 'Círculo', icon: <Circle className="w-4 h-4" /> },
    { id: 'pill', label: 'Pílula / Cápsula', icon: <div className="w-4 h-2.5 rounded-full border border-current" /> },
    { id: 'diamond', label: 'Losango / Decisão', icon: <Diamond className="w-4 h-4" /> },
    { id: 'triangle', label: 'Triângulo', icon: <Triangle className="w-4 h-4" /> },
    { id: 'pentagon', label: 'Pentágono', icon: <div className="w-4 h-4 border border-current [clip-path:polygon(50%_0%,100%_38%,82%_100%,18%_100%,0%_38%)] bg-current/20" /> },
  ];

  const polygonShapes: { id: ShapeType; label: string; icon: React.ReactNode }[] = [
    { id: 'hexagon', label: 'Hexágono', icon: <Hexagon className="w-4 h-4" /> },
    { id: 'octagon', label: 'Octógono', icon: <div className="w-4 h-4 border border-current rotate-45" /> },
    { id: 'cube', label: 'Cubo 3D / Bloco', icon: <Box className="w-4 h-4" /> },
    { id: 'database', label: 'Banco de Dados', icon: <Database className="w-4 h-4" /> },
    { id: 'cylinder', label: 'Cilindro / Armazém', icon: <Cylinder className="w-4 h-4" /> },
    { id: 'document', label: 'Documento', icon: <FileText className="w-4 h-4" /> },
    { id: 'cross', label: 'Cruz / Plus', icon: <PlusCircle className="w-4 h-4" /> },
    { id: 'parallelogram', label: 'Paralelogramo', icon: <div className="w-4 h-3.5 border border-current skew-x-12" /> },
    { id: 'trapezoid', label: 'Trapézio', icon: <div className="w-4 h-3.5 border border-current [clip-path:polygon(20%_0%,80%_0%,100%_100%,0%_100%)] bg-current/20" /> },
  ];

  const arrowShapes: { id: ShapeType; label: string; icon: React.ReactNode }[] = [
    { id: 'arrow-right', label: 'Seta Direita', icon: <ArrowRight className="w-4 h-4" /> },
    { id: 'arrow-left', label: 'Seta Esquerda', icon: <ArrowLeft className="w-4 h-4" /> },
    { id: 'arrow-up', label: 'Seta Cima', icon: <ArrowUp className="w-4 h-4" /> },
    { id: 'arrow-down', label: 'Seta Baixo', icon: <ArrowDown className="w-4 h-4" /> },
    { id: 'step-chevron', label: 'Chevron de Etapa', icon: <ChevronRight className="w-4 h-4" /> },
    { id: 'bracket-left', label: 'Chave Esquerda {', icon: <span className="font-bold font-mono text-sm">{'{'}</span> },
    { id: 'bracket-right', label: 'Chave Direita }', icon: <span className="font-bold font-mono text-sm">{'}'}</span> },
  ];

  const symbolShapes: { id: ShapeType; label: string; icon: React.ReactNode }[] = [
    { id: 'star', label: 'Estrela', icon: <Star className="w-4 h-4" /> },
    { id: 'shield', label: 'Escudo / Segurança', icon: <Shield className="w-4 h-4" /> },
    { id: 'heart', label: 'Coração / Valor', icon: <Heart className="w-4 h-4" /> },
    { id: 'lightning', label: 'Raio / Energia', icon: <Zap className="w-4 h-4" /> },
    { id: 'cloud', label: 'Nuvem / Cloud', icon: <Cloud className="w-4 h-4" /> },
    { id: 'speech', label: 'Balão de Fala', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'gear', label: 'Engrenagem / Processo', icon: <Settings className="w-4 h-4" /> },
    { id: 'tag', label: 'Tag / Etiqueta', icon: <Tag className="w-4 h-4" /> },
    { id: 'badge', label: 'Selo / Medalha', icon: <Award className="w-4 h-4" /> },
  ];

  const emojis = ['👍', '❤️', '🚀', '🔥', '💡', '🎉', '⭐', '👏', '👀', '💯'];

  const handleImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customImageUrl.trim() && onAddImage) {
      onAddImage(customImageUrl.trim(), 'Imagem importada');
      setCustomImageUrl('');
      setShowImageDialog(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAddImage) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          onAddImage(reader.result as string, file.name);
          setShowImageDialog(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="absolute left-4 top-18 bottom-6 z-20 flex flex-col items-center justify-between py-1 pointer-events-auto select-none">
      {/* Main Drawing & Canvas Tools Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 p-1.5 flex flex-col gap-1 shrink-0">
        {/* Select (V) */}
        <button
          onClick={() => onSelectTool('select')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors group relative cursor-pointer ${
            activeTool === 'select'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Selecionar / Mover Elementos (V)"
        >
          <MousePointer className="w-4 h-4" />
        </button>

        {/* Pan / Hand Tool (H / Espaço) */}
        <button
          onClick={() => onSelectTool('pan')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors group relative cursor-pointer ${
            activeTool === 'pan'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Mãozinha de Pan / Mover Tela Livremente (H ou segurar Espaço)"
        >
          <Hand className="w-4 h-4" />
        </button>

        <div className="h-px w-6 bg-slate-200 mx-auto my-0.5" />

        {/* Sticky Note Tool (N) */}
        <div className="relative">
          <button
            onClick={() => {
              onSelectTool('sticky');
              setShowStickyPalette(!showStickyPalette);
            }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors group relative cursor-pointer ${
              activeTool === 'sticky'
                ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-400'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Nota Adesiva / Post-it (N)"
          >
            <StickyNote className="w-4 h-4 text-amber-600" />
          </button>

          {showStickyPalette && (
            <div className="absolute left-full top-0 ml-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-2.5 z-50 grid grid-cols-4 gap-2 w-40 animate-in fade-in">
              <div className="col-span-4 text-[11px] font-bold text-slate-700 pb-1 border-b border-slate-100 mb-1">
                Cor do Post-it
              </div>
              {stickyColors.map((col) => (
                <button
                  key={col.name}
                  onClick={() => {
                    onAddStickyWithColor(col.bg);
                    setShowStickyPalette(false);
                  }}
                  className="w-7 h-7 rounded-lg border shadow-xs hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                  style={{ backgroundColor: col.bg, borderColor: col.border }}
                  title={col.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Shapes Tool (S) - 30+ Shapes with Category Tabs */}
        <div className="relative">
          <button
            onClick={() => {
              onSelectTool('shape');
              setShowShapePalette(!showShapePalette);
            }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors group relative cursor-pointer ${
              activeTool === 'shape'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Formas Geométricas & Diagramas (S)"
          >
            <Square className="w-4 h-4" />
          </button>

          {showShapePalette && (
            <div className="absolute left-full top-0 ml-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-50 w-76 text-xs animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="font-bold text-slate-900">Formas & Símbolos</span>
                <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-mono font-bold">
                  30+ formas
                </span>
              </div>

              {/* Shape Tabs */}
              <div className="flex gap-1 mb-2 bg-slate-100 p-0.5 rounded-xl text-[10px] font-bold">
                <button
                  onClick={() => setShapeTab('basic')}
                  className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer ${
                    shapeTab === 'basic' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Básicas
                </button>
                <button
                  onClick={() => setShapeTab('polygon')}
                  className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer ${
                    shapeTab === 'polygon' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Diagrama
                </button>
                <button
                  onClick={() => setShapeTab('arrows')}
                  className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer ${
                    shapeTab === 'arrows' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Setas
                </button>
                <button
                  onClick={() => setShapeTab('symbols')}
                  className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer ${
                    shapeTab === 'symbols' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Símbolos
                </button>
              </div>

              {/* Shape Items Grid */}
              <div className="grid grid-cols-2 gap-1.5 max-h-60 overflow-y-auto pr-1">
                {(shapeTab === 'basic'
                  ? basicShapes
                  : shapeTab === 'polygon'
                  ? polygonShapes
                  : shapeTab === 'arrows'
                  ? arrowShapes
                  : symbolShapes
                ).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onAddShapeWithType(s.id);
                      setShowShapePalette(false);
                    }}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-blue-50 text-xs text-slate-700 hover:text-blue-700 text-left transition-colors cursor-pointer group"
                  >
                    <span className="text-blue-600 group-hover:scale-110 transition-transform shrink-0">
                      {s.icon}
                    </span>
                    <span className="truncate text-[11px] font-semibold">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mindmap Quick Tool (M) */}
        <button
          onClick={() => {
            if (onAddMindmapRootNode) onAddMindmapRootNode();
            else if (onOpenMindmapStudio) onOpenMindmapStudio();
          }}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors group relative cursor-pointer ${
            activeTool === 'mindmap'
              ? 'bg-cyan-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Criar Nó de Mapa Mental (M)"
        >
          <Network className="w-4 h-4 text-cyan-600" />
        </button>

        {/* Line / Connector Tool (L) */}
        <button
          onClick={() => onSelectTool('connector')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors group relative cursor-pointer ${
            activeTool === 'connector'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Linha / Seta de Conexão (L)"
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>

        {/* Text Box Tool (T) */}
        <button
          onClick={() => onSelectTool('text')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors group relative cursor-pointer ${
            activeTool === 'text'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Caixa de Texto (T)"
        >
          <Type className="w-4 h-4" />
        </button>

        {/* Pen / Highlighter Tool (P) */}
        <div className="relative">
          <button
            onClick={() => {
              onSelectTool('pen');
              setShowPenPalette(!showPenPalette);
            }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors group relative cursor-pointer ${
              activeTool === 'pen' || activeTool === 'highlighter'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Caneta & Marcador Livre (P)"
          >
            <PenTool className="w-4 h-4" />
          </button>

          {showPenPalette && (
            <div className="absolute left-full top-0 ml-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 flex flex-col gap-1 w-36 text-xs animate-in fade-in">
              <button
                onClick={() => {
                  onSelectTool('pen');
                  setShowPenPalette(false);
                }}
                className={`flex items-center gap-2 p-2 rounded-xl text-left font-semibold transition-colors cursor-pointer ${
                  activeTool === 'pen' ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <PenTool className="w-4 h-4 text-blue-600" />
                <span>Caneta</span>
              </button>
              <button
                onClick={() => {
                  onSelectTool('highlighter');
                  setShowPenPalette(false);
                }}
                className={`flex items-center gap-2 p-2 rounded-xl text-left font-semibold transition-colors cursor-pointer ${
                  activeTool === 'highlighter' ? 'bg-yellow-50 text-yellow-700' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <Highlighter className="w-4 h-4 text-yellow-500" />
                <span>Marcador</span>
              </button>
            </div>
          )}
        </div>

        {/* Frame / Quadro Tool (F) */}
        <button
          onClick={() => onSelectTool('frame')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors group relative cursor-pointer ${
            activeTool === 'frame'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Frame / Seção de Slide (F) - Automaticamente se transforma em Slide no Gerador"
        >
          <Frame className="w-4 h-4" />
        </button>

        {/* Image Tool (Upload or Nano Banana / URL) */}
        <div className="relative">
          <button
            onClick={() => setShowImageDialog(!showImageDialog)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors group relative cursor-pointer ${
              showImageDialog
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Inserir Imagem (Upload, URL ou IA)"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          {showImageDialog && (
            <div className="absolute left-full top-0 ml-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 w-72 text-xs animate-in fade-in">
              <h4 className="font-bold text-slate-900 mb-2">Adicionar Imagem</h4>

              {/* Nano Banana AI direct button */}
              {onOpenNanoBanana && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenNanoBanana();
                    setShowImageDialog(false);
                  }}
                  className="w-full py-2 mb-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
                >
                  <span>🍌 Gerar com Nano Banana IA</span>
                </button>
              )}

              {/* Upload Local File */}
              <label className="block w-full text-center py-2 px-3 border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl font-semibold text-slate-600 hover:text-blue-600 cursor-pointer transition-colors mb-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span>Enviar do Computador</span>
              </label>

              {/* Paste URL */}
              <form onSubmit={handleImageSubmit} className="flex flex-col gap-2">
                <input
                  type="url"
                  placeholder="Ou cole a URL da imagem..."
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  className="w-full text-xs border border-slate-200 focus:border-blue-500 rounded-xl p-2 outline-none"
                />
                <button
                  type="submit"
                  disabled={!customImageUrl.trim()}
                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Inserir Imagem
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Sticker / Reaction Tool */}
        <div className="relative">
          <button
            onClick={() => setShowStickerPalette(!showStickerPalette)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors group relative cursor-pointer ${
              showStickerPalette
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Reações & Stickers Rápidos"
          >
            <Smile className="w-4 h-4" />
          </button>

          {showStickerPalette && (
            <div className="absolute left-full top-0 ml-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-2.5 z-50 grid grid-cols-5 gap-1.5 w-48 animate-in fade-in">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onAddStickerEmoji(emoji);
                    setShowStickerPalette(false);
                  }}
                  className="w-8 h-8 flex items-center justify-center text-lg hover:bg-slate-100 rounded-xl transition-transform hover:scale-125 cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Templates Gallery */}
        <button
          onClick={onOpenTemplates}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors group relative cursor-pointer"
          title="Galeria de Templates e Diagramas"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
      </div>

      {/* Undo / Redo Bottom Controls */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 p-1 flex flex-col gap-0.5 shrink-0">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          title="Desfazer (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          title="Refazer (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
