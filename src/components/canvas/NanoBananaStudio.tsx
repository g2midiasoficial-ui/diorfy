import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Image as ImageIcon,
  Wand2,
  Download,
  Plus,
  RefreshCw,
  Layers,
  Palette,
  Ratio,
  Check,
  Zap,
  Copy,
  History,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface NanoBananaStudioProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertImageToCanvas: (imageUrl: string, promptText: string) => void;
}

export const NanoBananaStudio: React.FC<NanoBananaStudioProps> = ({
  isOpen,
  onClose,
  onInsertImageToCanvas,
}) => {
  const [prompt, setPrompt] = useState('Robô mascote futurista 3D amigável em escritório de tecnologia, renderização de estúdio');
  const [selectedStyle, setSelectedStyle] = useState('3D Isometric');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3' | '3:4'>('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'generate' | 'presets' | 'history'>('generate');
  const [historyList, setHistoryList] = useState<Array<{ id: string; url: string; prompt: string; style: string }>>([]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const styles = [
    { id: '3D Isometric', label: '3D Isométrico', desc: 'Render 3D moderno estilo Blender / Clay' },
    { id: 'Photorealistic', label: 'Fotorealista 8K', desc: 'Iluminação de estúdio profissional' },
    { id: 'Motion Graphic', label: 'Motion Design', desc: 'Cores vibrantes e formas dinâmicas' },
    { id: 'Cyberpunk Neon', label: 'Cyberpunk Neon', desc: 'Luzes neon e tons escuros futuristas' },
    { id: 'Flat Vector', label: 'Ilustração Vetorial', desc: 'Vetores limpos para SaaS e startups' },
    { id: 'Glassmorphism', label: 'Glassmorphism', desc: 'Vidro fosco translúcido e reflexos' },
  ];

  const aspectRatios: { id: '1:1' | '16:9' | '9:16' | '4:3' | '3:4'; label: string; ratio: string }[] = [
    { id: '1:1', label: 'Quadrado (1:1)', ratio: 'Post / Ícone' },
    { id: '16:9', label: 'Widescreen (16:9)', ratio: 'Slide / Banner' },
    { id: '4:3', label: 'Apresentação (4:3)', ratio: 'Clássico' },
    { id: '9:16', label: 'Story / Vertical (9:16)', ratio: 'Mobile' },
    { id: '3:4', label: 'Retrato (3:4)', ratio: 'Card' },
  ];

  const quickPresets = [
    {
      title: 'Mascote Robô 3D',
      prompt: 'Cute 3D robot mascot waving friendly with glowing blue eyes, clay render, studio light',
      style: '3D Isometric',
      category: '3D & Tech',
    },
    {
      title: 'Dashboard Futurista',
      prompt: 'Futuristic holographic analytics UI dashboard with glowing neon charts and graphs',
      style: 'Cyberpunk Neon',
      category: 'Dashboards & UI',
    },
    {
      title: 'Brainstorming da Equipe',
      prompt: 'Modern vector illustration of diverse agile team collaborating around interactive whiteboard',
      style: 'Flat Vector',
      category: '3D & Tech',
    },
    {
      title: 'Foguete Lançamento 3D',
      prompt: '3D isometric rocket launch with smoke and glowing particles, vibrant startup launch',
      style: '3D Isometric',
      category: '3D & Tech',
    },
    {
      title: 'Ondas Abstratas de Seda',
      prompt: 'Abstract colorful smooth gradient silk wave ribbons flowing in dark space, motion graphic',
      style: 'Motion Graphic',
      category: 'Motion & Abstrato',
    },
    {
      title: 'Esfera de IA em Vidro',
      prompt: 'Glassmorphism glowing AI brain sphere icon with sparkles, translucent frosted glass',
      style: 'Glassmorphism',
      category: 'Motion & Abstrato',
    },
    {
      title: 'Avatar Especialista Tech',
      prompt: 'Friendly software engineer 3D portrait character with glasses and headset, smiling',
      style: '3D Isometric',
      category: 'Personas & Avatares',
    },
    {
      title: 'Espaço de Coworking Moderno',
      prompt: 'Ultra realistic modern Scandinavian coworking office with plants, natural light 8k photography',
      style: 'Photorealistic',
      category: 'Dashboards & UI',
    },
  ];

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/ai/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async (customPrompt?: string) => {
    const textToUse = customPrompt || prompt;
    if (!textToUse.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/nano-banana/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToUse.trim(),
          style: selectedStyle,
          aspectRatio,
        }),
      });

      const data = await res.json();
      const finalImage = data.imageUrl || data.fallbackUrl;

      if (finalImage) {
        setGeneratedImage(finalImage);
        setHistoryList((prev) => [
          { id: `img-${Date.now()}`, url: finalImage, prompt: textToUse, style: selectedStyle },
          ...prev.slice(0, 9),
        ]);
        try {
          confetti({ particleCount: 35, spread: 50 });
        } catch {}
      }
    } catch (err) {
      console.error('Error generating image:', err);
      // Fallback SVG data-uri that always works
      const svg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><rect width="100%" height="100%" fill="%234f46e5" rx="30"/><text x="400" y="400" fill="white" font-family="sans-serif" font-size="28" font-weight="bold" text-anchor="middle">🍌 ${encodeURIComponent(
        textToUse.substring(0, 30)
      )}</text></svg>`;
      setGeneratedImage(svg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInsert = (imgUrl?: string) => {
    const target = imgUrl || generatedImage;
    if (!target) return;
    onInsertImageToCanvas(target, prompt || 'Imagem Nano Banana');
    onClose();
  };

  const handleCopyLink = () => {
    if (!generatedImage) return;
    navigator.clipboard.writeText(generatedImage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in select-none">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center shadow-md shadow-amber-200 text-lg">
              🍌
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Nano Banana Image Studio</h3>
                <span className="text-[10px] font-extrabold bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Gemini Flash Image AI
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Gere imagens conceituais, ilustrações 3D e assets visuais diretamente para sua lousa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white/80 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-slate-100 flex gap-4 bg-slate-50/50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('generate')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'generate'
                ? 'border-amber-500 text-amber-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            Criador de Imagem
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'presets'
                ? 'border-amber-500 text-amber-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Galeria & Prompts Prontos
          </button>
          {historyList.length > 0 && (
            <button
              onClick={() => setActiveTab('history')}
              className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'history'
                  ? 'border-amber-500 text-amber-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Histórico ({historyList.length})
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'generate' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: Form Controls */}
              <div className="md:col-span-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Descreva o que deseja criar (Prompt)
                    </label>
                    <button
                      type="button"
                      onClick={handleEnhancePrompt}
                      disabled={isEnhancing || !prompt.trim()}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{isEnhancing ? 'Aprimorando...' : 'Melhorar com IA'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ex: Robô futurista segurando um tablet brilhante em escritório tech, render 3D clean..."
                    className="w-full text-xs border border-slate-200 focus:border-amber-500 rounded-xl p-3 outline-none resize-none bg-slate-50/60 focus:bg-white transition-all shadow-2xs"
                  />
                </div>

                {/* Style Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-600" />
                    Estilo Visual
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {styles.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSelectedStyle(st.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedStyle === st.id
                            ? 'border-amber-500 bg-amber-50/50 shadow-xs ring-1 ring-amber-500'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-800">{st.label}</div>
                        <div className="text-[10px] text-slate-500 truncate">{st.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aspect Ratio */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Ratio className="w-3.5 h-3.5 text-amber-600" />
                    Proporção da Imagem
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {aspectRatios.map((ar) => (
                      <button
                        key={ar.id}
                        type="button"
                        onClick={() => setAspectRatio(ar.id)}
                        className={`px-2 py-1.5 rounded-lg border text-center transition-all text-xs cursor-pointer ${
                          aspectRatio === ar.id
                            ? 'border-amber-500 bg-amber-500 text-white font-bold shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="font-semibold text-[11px]">{ar.id}</div>
                        <div className="text-[9px] opacity-80">{ar.ratio}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  type="button"
                  disabled={isGenerating || !prompt.trim()}
                  onClick={() => handleGenerate()}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Gerando com Nano Banana...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-white" />
                      <span>Gerar Imagem com IA</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Column: Preview Area */}
              <div className="md:col-span-6 flex flex-col items-center justify-center bg-slate-50/80 rounded-2xl border border-slate-200/80 p-4 min-h-[320px] relative overflow-hidden">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center space-y-3 text-center p-6">
                    <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center animate-bounce text-2xl shadow-inner">
                      🍌
                    </div>
                    <span className="text-xs font-bold text-slate-800">Processando criação visual...</span>
                    <span className="text-[11px] text-slate-500 max-w-xs">
                      Renderizando formas, iluminação de estúdio e texturas de alta definição.
                    </span>
                  </div>
                ) : generatedImage ? (
                  <div className="w-full h-full flex flex-col items-center justify-between space-y-3">
                    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white">
                      <img
                        src={generatedImage}
                        alt="Gerado por Nano Banana"
                        className="w-full h-auto max-h-[280px] object-contain mx-auto"
                      />
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
                        {aspectRatio}
                      </div>
                    </div>

                    <div className="w-full flex items-center gap-2">
                      <button
                        onClick={() => handleInsert()}
                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Inserir na Lousa Diorfy
                      </button>

                      <button
                        onClick={handleCopyLink}
                        className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                        title={copied ? 'Copiado!' : 'Copiar URL da Imagem'}
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleGenerate()}
                        className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                        title="Gerar outra variação"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-2 text-slate-400">
                    <ImageIcon className="w-12 h-12 mx-auto opacity-30" />
                    <p className="text-xs font-medium text-slate-600">Sua imagem aparecerá aqui</p>
                    <p className="text-[11px] text-slate-400 max-w-xs">
                      Escreva um prompt e clique em <b>Gerar Imagem com IA</b> ou escolha um exemplo pronto da galeria.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'presets' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Clique em qualquer template para carregar o prompt ou gerar imediatamente:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {quickPresets.map((qp, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setPrompt(qp.prompt);
                      setSelectedStyle(qp.style);
                      setActiveTab('generate');
                      handleGenerate(qp.prompt);
                    }}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50/30 transition-all cursor-pointer group shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-amber-700">
                          {qp.title}
                        </span>
                        <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {qp.style}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{qp.prompt}</p>
                    </div>
                    <div className="mt-3 text-[10px] font-bold text-amber-600 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Gerar agora
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">Imagens geradas nesta sessão:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {historyList.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 border border-slate-200 rounded-2xl bg-slate-50 hover:bg-white transition-all group flex flex-col justify-between"
                  >
                    <img
                      src={item.url}
                      alt={item.prompt}
                      className="w-full h-28 object-cover rounded-xl mb-2"
                    />
                    <p className="text-[10px] text-slate-600 line-clamp-1 mb-2">{item.prompt}</p>
                    <button
                      onClick={() => handleInsert(item.url)}
                      className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      Inserir no Quadro
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
