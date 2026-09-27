import React, { useState, useEffect } from 'react';
import {
  Film,
  Play,
  Pause,
  Plus,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Sparkles,
  Layers,
  Palette,
  Sliders,
  Check,
  Download,
  Share2,
  MoveRight,
  Flame,
  Zap,
  RefreshCw,
  Edit3,
  Wand2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CanvasElement, CanvasFrame } from '../../types/miro';
import confetti from 'canvas-confetti';

export interface SlideDeckItem {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  metric?: { value: string; label: string };
  points: string[];
  theme: 'dark' | 'sunset' | 'emerald' | 'cyber' | 'minimal';
  transition: 'slide' | 'zoom' | 'flip' | 'spring' | 'fade';
  notes?: string;
}

interface SlideMotionStudioProps {
  isOpen: boolean;
  onClose: () => void;
  frames: CanvasFrame[];
  elements: CanvasElement[];
  onExportSlidesToBoard: (newFrames: CanvasFrame[], newElements: CanvasElement[]) => void;
}

export const SlideMotionStudio: React.FC<SlideMotionStudioProps> = ({
  isOpen,
  onClose,
  frames,
  elements,
  onExportSlidesToBoard,
}) => {
  const [slides, setSlides] = useState<SlideDeckItem[]>([
    {
      id: 'slide-1',
      title: '🚀 Diorfy Workspace: A Nova Era da Colaboração',
      subtitle: 'Como equipes modernas transformam ideias em resultados com lousa infinita e inteligência artificial.',
      badge: 'Visão Estratégica 2026',
      metric: { value: '10x', label: 'Mais velocidade na ideação de projetos' },
      points: [
        'Lousa infinita com renderização fluida e espacial',
        'Criação de imagens com Nano Banana Gemini Image',
        'Apresentações imersivas com Motion Design interativo nativo',
      ],
      theme: 'dark',
      transition: 'slide',
      notes: 'Apresentar a proposta de valor principal e o diferencial da IA integrada.',
    },
    {
      id: 'slide-2',
      title: '💡 O Desafio das Equipes Híbridas',
      subtitle: 'Silos de informação, reuniões improdutivas e ferramentas fragmentadas reduzem a velocidade da inovação.',
      badge: 'Problema & Oportunidade',
      metric: { value: '68%', label: 'Do tempo perdido em alinhamentos manuais' },
      points: [
        'Falta de visão espacial dos processos e roadmaps',
        'Dificuldade de documentar decisões em tempo real',
        'Apresentações estáticas que não engajam os participantes',
      ],
      theme: 'sunset',
      transition: 'zoom',
      notes: 'Destacar as dores do cliente e por que as soluções antigas falham.',
    },
    {
      id: 'slide-3',
      title: '⚡ Nossa Solução: Agentes & Motion Design',
      subtitle: 'Um ecossistema visual completo que pensa, cria e apresenta dinamicamente com seu time.',
      badge: 'Inovação Tecnológica',
      metric: { value: '+300%', label: 'Mais retenção e engajamento' },
      points: [
        'Agente Diorfy AI copiloto para geração em segundos',
        'Transições cinematográficas e apresentações de alto impacto',
        'Colaboração multiusuário em tempo real com cursores ao vivo',
      ],
      theme: 'cyber',
      transition: 'spring',
      notes: 'Demonstrar os recursos em tempo real e o poder do motion design.',
    },
    {
      id: 'slide-4',
      title: '📈 Roadmap & Próximos Passos',
      subtitle: 'Plano de execução tática com entregáveis claros para o próximo trimestre.',
      badge: 'Execução & Escala',
      metric: { value: 'Q4', label: 'Lançamento global e integrações' },
      points: [
        'Fase 1: Implementação de automações visuais com IA',
        'Fase 2: Biblioteca comunitária de templates Diorfyverse',
        'Fase 3: Exportação em vídeo e apresentações dinâmicas',
      ],
      theme: 'emerald',
      transition: 'flip',
      notes: 'Finalizar com plano de ação e chamada para engajamento da equipe.',
    },
  ]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlaySeconds, setAutoPlaySeconds] = useState(5);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [laserPointer, setLaserPointer] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // AI Slide Generator State
  const [showAiGenDialog, setShowAiGenDialog] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isGeneratingDeck, setIsGeneratingDeck] = useState(false);

  // Autoplay loop
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      const stepMs = 50;
      const totalMs = autoPlaySeconds * 1000;
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentSlideIndex((curr) => (curr + 1) % slides.length);
            return 0;
          }
          return prev + (stepMs / totalMs) * 100;
        });
      }, stepMs);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isPlaying, autoPlaySeconds, slides.length]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'Space') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'Escape') {
        if (isFullscreen) setIsFullscreen(false);
        else onClose();
      } else if (e.key === 'f' || e.key === 'F') {
        setIsFullscreen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlideIndex, slides.length, isFullscreen]);

  if (!isOpen) return null;

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const goToNext = () => {
    setProgress(0);
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    } else {
      setCurrentSlideIndex(0);
    }
  };

  const goToPrev = () => {
    setProgress(0);
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  // Generate complete deck using AI
  const handleGenerateDeckWithAI = async () => {
    if (!aiTopic.trim()) return;
    setIsGeneratingDeck(true);
    try {
      const res = await fetch('/api/ai/generate-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiTopic.trim() }),
      });
      const data = await res.json();
      if (data.slides && data.slides.length > 0) {
        setSlides(data.slides);
        setCurrentSlideIndex(0);
        setShowAiGenDialog(false);
        setAiTopic('');
        try {
          confetti({ particleCount: 50, spread: 60 });
        } catch {}
      }
    } catch (err) {
      console.error('Error generating slides:', err);
    } finally {
      setIsGeneratingDeck(false);
    }
  };

  const handleAddNewSlide = () => {
    const newSlide: SlideDeckItem = {
      id: `slide-${Date.now()}`,
      title: `Novo Slide ${slides.length + 1}`,
      subtitle: 'Adicione aqui a mensagem principal deste slide com motion design.',
      badge: 'Tópico Estratégico',
      metric: { value: '100%', label: 'Impacto garantido' },
      points: ['Primeiro ponto de destaque', 'Segundo elemento explicativo', 'Conclusão e próximos passos'],
      theme: 'dark',
      transition: 'slide',
    };
    const updated = [...slides, newSlide];
    setSlides(updated);
    setCurrentSlideIndex(updated.length - 1);
  };

  const handleDeleteSlide = (idx: number) => {
    if (slides.length <= 1) return;
    const updated = slides.filter((_, i) => i !== idx);
    setSlides(updated);
    setCurrentSlideIndex(Math.max(0, idx - 1));
  };

  const handleExportToBoard = () => {
    const newFrames: CanvasFrame[] = [];
    const newElements: CanvasElement[] = [];

    slides.forEach((sl, i) => {
      const frameX = 100 + i * 1100;
      const frameY = 100;
      const frameId = `frame-slide-${Date.now()}-${i}`;

      newFrames.push({
        id: frameId,
        title: `Slide ${i + 1}: ${sl.title.substring(0, 30)}...`,
        x: frameX,
        y: frameY,
        width: 1000,
        height: 600,
        backgroundColor: sl.theme === 'dark' ? '#0f172a' : sl.theme === 'sunset' ? '#fff7ed' : '#ffffff',
        borderColor: '#94a3b8',
        zIndex: 0,
      });

      newElements.push({
        id: `el-title-${Date.now()}-${i}`,
        type: 'text',
        x: frameX + 60,
        y: frameY + 60,
        width: 880,
        height: 60,
        zIndex: 1,
        content: sl.title,
        style: {
          fontSize: 24,
          fontWeight: 'bold',
          color: sl.theme === 'dark' ? '#f8fafc' : '#0f172a',
        },
        createdAt: Date.now(),
      });

      newElements.push({
        id: `el-sub-${Date.now()}-${i}`,
        type: 'text',
        x: frameX + 60,
        y: frameY + 130,
        width: 880,
        height: 50,
        zIndex: 1,
        content: sl.subtitle,
        style: {
          fontSize: 15,
          color: sl.theme === 'dark' ? '#94a3b8' : '#475569',
        },
        createdAt: Date.now(),
      });

      sl.points.forEach((pt, ptIdx) => {
        newElements.push({
          id: `el-pt-${Date.now()}-${i}-${ptIdx}`,
          type: 'sticky',
          x: frameX + 60 + ptIdx * 290,
          y: frameY + 240,
          width: 260,
          height: 180,
          zIndex: 2,
          content: pt,
          style: {
            backgroundColor: ptIdx === 0 ? '#fef08a' : ptIdx === 1 ? '#bae6fd' : '#bbf7d0',
            fontSize: 14,
            color: '#1e293b',
          },
          createdAt: Date.now(),
        });
      });
    });

    onExportSlidesToBoard(newFrames, newElements);
    try {
      confetti({ particleCount: 60, spread: 70 });
    } catch {}
    onClose();
  };

  const getThemeClass = (theme: SlideDeckItem['theme']) => {
    switch (theme) {
      case 'sunset':
        return 'bg-gradient-to-br from-amber-600 via-rose-600 to-indigo-900 text-white';
      case 'emerald':
        return 'bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-950 text-white';
      case 'cyber':
        return 'bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-white border border-purple-500/30';
      case 'minimal':
        return 'bg-slate-50 text-slate-900 border border-slate-200';
      case 'dark':
      default:
        return 'bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white';
    }
  };

  const getMotionVariants = (transition: SlideDeckItem['transition']) => {
    switch (transition) {
      case 'zoom':
        return {
          initial: { opacity: 0, scale: 0.85, filter: 'blur(10px)' },
          animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
          exit: { opacity: 0, scale: 1.15, filter: 'blur(8px)' },
        };
      case 'flip':
        return {
          initial: { opacity: 0, rotateY: 90, perspective: 1000 },
          animate: { opacity: 1, rotateY: 0, perspective: 1000 },
          exit: { opacity: 0, rotateY: -90, perspective: 1000 },
        };
      case 'spring':
        return {
          initial: { opacity: 0, y: 80, scale: 0.9 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: -80, scale: 0.9 },
        };
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
      case 'slide':
      default:
        return {
          initial: { opacity: 0, x: 120 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -120 },
        };
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col bg-black/85 backdrop-blur-md select-none transition-all ${
        isFullscreen ? 'p-0' : 'p-4 md:p-6'
      }`}
      onMouseMove={(e) => {
        if (laserPointer) {
          setMousePos({ x: e.clientX, y: e.clientY });
        }
      }}
    >
      {laserPointer && (
        <div
          className="pointer-events-none fixed w-4 h-4 rounded-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,1)] z-50 -translate-x-1/2 -translate-y-1/2 animate-pulse"
          style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
        />
      )}

      {/* Top Header Controls */}
      {!isFullscreen && (
        <div className="flex items-center justify-between bg-slate-900/90 text-white px-5 py-3 rounded-2xl border border-slate-800 mb-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold">Estúdio de Motion Design & Slides</h3>
                <span className="text-[10px] font-extrabold bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full uppercase">
                  Motion Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Apresentações cinematográficas com transições animadas e exportação para o canvas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAiGenDialog(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gerar com IA</span>
            </button>

            <button
              onClick={handleExportToBoard}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Salvar Slides no Quadro</span>
            </button>

            <button
              onClick={() => setIsFullscreen(true)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Tela Cheia (F)"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* AI Generate Deck Modal */}
      {showAiGenDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full p-6 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold">Gerar Apresentação Completa com IA</h3>
              </div>
              <button onClick={() => setShowAiGenDialog(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Digite o tema da apresentação e o gerador criará uma estrutura de 4 slides de alto impacto com métricas e motion design.
            </p>

            <input
              type="text"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateDeckWithAI()}
              placeholder="Ex: Pitch Deck para Investidores, Treinamento de Vendas..."
              className="w-full text-xs bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl p-3 outline-none text-white"
            />

            <div className="flex gap-2">
              {['Pitch Deck', 'Lançamento de Produto', 'Planejamento Q4'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAiTopic(t)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] rounded-lg text-slate-300 transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerateDeckWithAI}
              disabled={isGeneratingDeck || !aiTopic.trim()}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isGeneratingDeck ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Montando slides inteligentes...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Criar Apresentação Agora</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Slide Presentation Stage */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden rounded-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            {...getMotionVariants(currentSlide.transition)}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`w-full max-w-5xl aspect-[16/9] rounded-3xl p-8 md:p-14 shadow-2xl flex flex-col justify-between relative overflow-hidden ${getThemeClass(
              currentSlide.theme
            )}`}
          >
            {/* Background Glow Accents */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Slide Header */}
            <div>
              <div className="flex items-center justify-between mb-4">
                {currentSlide.badge && (
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200"
                  >
                    {currentSlide.badge}
                  </motion.span>
                )}
                <span className="text-xs font-mono font-bold text-white/50">
                  {currentSlideIndex + 1} / {slides.length}
                </span>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight mb-3"
              >
                {currentSlide.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-sm md:text-lg text-white/80 max-w-3xl leading-relaxed"
              >
                {currentSlide.subtitle}
              </motion.p>
            </div>

            {/* Slide Body: Metrics + Feature Points */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-auto pt-4">
              {currentSlide.metric && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 }}
                  className="md:col-span-4 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col justify-center"
                >
                  <span className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-orange-400">
                    {currentSlide.metric.value}
                  </span>
                  <span className="text-xs md:text-sm text-white/80 font-medium mt-1">
                    {currentSlide.metric.label}
                  </span>
                </motion.div>
              )}

              <div
                className={`${
                  currentSlide.metric ? 'md:col-span-8' : 'md:col-span-12'
                } grid grid-cols-1 sm:grid-cols-3 gap-3`}
              >
                {currentSlide.points.map((pt, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className="p-4 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10 flex items-start gap-2.5 hover:bg-black/30 transition-colors"
                  >
                    <div className="w-5 h-5 rounded-full bg-blue-500/30 text-blue-300 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="text-xs text-white/90 leading-relaxed font-medium">{pt}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Slide Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10 text-[11px] text-white/50 font-medium">
              <span>Diorfy Motion Presentation Studio</span>
              <span>Transição: {currentSlide.transition.toUpperCase()}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {isFullscreen && (
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-xl backdrop-blur-md transition-colors z-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div className="mt-4 flex flex-col gap-2.5 bg-slate-900/90 text-white px-5 py-3 rounded-2xl border border-slate-800 shadow-2xl">
        {isPlaying && (
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Navigation buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={goToPrev}
              disabled={currentSlideIndex === 0}
              className="p-2 rounded-xl hover:bg-slate-800 disabled:opacity-30 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Slide Anterior (Seta Esquerda)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              <span>{isPlaying ? 'Pausar' : 'Apresentar'}</span>
            </button>

            <button
              onClick={goToNext}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Próximo Slide (Seta Direita / Espaço)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono font-semibold text-slate-400 ml-2">
              Slide {currentSlideIndex + 1} de {slides.length}
            </span>
          </div>

          {/* Slide Thumbnails Reorder Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-md py-1 no-scrollbar">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setProgress(0);
                  setCurrentSlideIndex(idx);
                }}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all shrink-0 cursor-pointer ${
                  currentSlideIndex === idx
                    ? 'bg-blue-600 text-white font-bold shadow-xs scale-105'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                }`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              onClick={handleAddNewSlide}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Adicionar Novo Slide"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Tools: Laser Pointer & Theme & Transition Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLaserPointer(!laserPointer)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                laserPointer ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Apontador Laser Virtual"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Laser</span>
            </button>

            <select
              value={currentSlide.theme}
              onChange={(e) => {
                const th = e.target.value as any;
                setSlides((prev) =>
                  prev.map((s, idx) => (idx === currentSlideIndex ? { ...s, theme: th } : s))
                );
              }}
              className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 outline-none cursor-pointer"
            >
              <option value="dark">Tema: Dark</option>
              <option value="sunset">Tema: Sunset</option>
              <option value="cyber">Tema: Cyber</option>
              <option value="emerald">Tema: Emerald</option>
              <option value="minimal">Tema: Minimal</option>
            </select>

            <select
              value={currentSlide.transition}
              onChange={(e) => {
                const tr = e.target.value as any;
                setSlides((prev) =>
                  prev.map((s, idx) => (idx === currentSlideIndex ? { ...s, transition: tr } : s))
                );
              }}
              className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 outline-none cursor-pointer"
            >
              <option value="slide">Transição: Slide</option>
              <option value="zoom">Transição: Zoom Reveal</option>
              <option value="flip">Transição: 3D Flip</option>
              <option value="spring">Transição: Elastic Spring</option>
              <option value="fade">Transição: Fade Morph</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
