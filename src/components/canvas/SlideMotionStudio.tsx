import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Layout,
  Presentation,
  Grid,
  FileText,
  StickyNote as StickyIcon,
  Image as ImageIcon,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Cpu,
  MonitorPlay,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CanvasElement, CanvasFrame } from '../../types/miro';
import confetti from 'canvas-confetti';
import { playSound } from '../../utils/soundEffects';

export type SlideTheme = 'dark' | 'sunset' | 'emerald' | 'cyber' | 'minimal' | 'purple' | 'ocean';
export type SlideTransition = 'slide' | 'zoom' | 'flip' | 'spring' | 'fade';
export type SlideLayout = 'cards' | 'hero' | 'split' | 'metric' | 'process' | 'sticky-wall';

export interface SlideDeckItem {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  metric?: { value: string; label: string };
  points: string[];
  cards?: { title: string; desc: string; color?: string; emoji?: string }[];
  imageUrl?: string;
  theme: SlideTheme;
  transition: SlideTransition;
  layout: SlideLayout;
  notes?: string;
  sourceFrameId?: string;
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
  // Function to intelligently parse whatever is on the whiteboard into slides
  const generateSlidesFromBoardData = (
    currentFrames: CanvasFrame[],
    currentElements: CanvasElement[]
  ): SlideDeckItem[] => {
    // If frames exist, turn each frame into a rich slide
    if (currentFrames && currentFrames.length > 0) {
      const generated: SlideDeckItem[] = currentFrames.map((frame, index) => {
        // Find elements inside or near this frame
        const insideElements = currentElements.filter((el) => {
          return (
            el.x >= frame.x - 50 &&
            el.x <= frame.x + frame.width + 50 &&
            el.y >= frame.y - 50 &&
            el.y <= frame.y + frame.height + 50
          );
        });

        // Extract texts and titles
        const textElements = insideElements.filter((el) => el.type === 'text');
        const stickyElements = insideElements.filter((el) => el.type === 'sticky');
        const shapeElements = insideElements.filter((el) => el.type === 'shape');
        const imageElement = insideElements.find((el) => el.type === 'image');

        const titleText =
          textElements.find((t) => t.content && t.content.length < 50)?.content ||
          frame.title ||
          `Slide ${index + 1}`;

        const subtitleText =
          textElements.find((t) => t.content && t.content !== titleText)?.content ||
          (stickyElements.length > 0
            ? `${stickyElements.length} notas e ideias mapeadas no quadro.`
            : 'Estrutura gerada automaticamente a partir do quadro.');

        // Extract points from stickies or shapes
        const points: string[] = [];
        const cards: { title: string; desc: string; color?: string; emoji?: string }[] = [];

        stickyElements.forEach((stk, sIdx) => {
          const content = stk.content?.trim() || `Ideia ${sIdx + 1}`;
          points.push(content);
          cards.push({
            title: `Item ${sIdx + 1}`,
            desc: content,
            color: stk.style?.backgroundColor || '#fef08a',
            emoji: '📌',
          });
        });

        shapeElements.forEach((shp, shIdx) => {
          if (shp.content && shp.content.trim()) {
            points.push(shp.content.trim());
          }
        });

        const themes: SlideTheme[] = ['dark', 'purple', 'sunset', 'emerald', 'cyber', 'ocean'];
        const transitions: SlideTransition[] = ['slide', 'zoom', 'spring', 'flip', 'fade'];

        return {
          id: `slide-frame-${frame.id || index}`,
          title: titleText,
          subtitle: subtitleText,
          badge: `Seção ${index + 1} • ${frame.title || 'Quadro'}`,
          metric: {
            value: `${insideElements.length}`,
            label: 'Elementos integrados',
          },
          points: points.length > 0 ? points.slice(0, 5) : [
            'Espaço de ideação colaborativa em tempo real',
            'Alinhamento estratégico e mapa de ações',
            'Visualização clara de entregas e resultados',
          ],
          cards: cards.length > 0 ? cards.slice(0, 4) : undefined,
          imageUrl: imageElement?.style?.imageUrl,
          theme: themes[index % themes.length],
          transition: transitions[index % transitions.length],
          layout: stickyElements.length >= 3 ? 'cards' : imageElement ? 'split' : 'hero',
          notes: `Apresentação referente ao frame "${frame.title}". Contém ${insideElements.length} elementos.`,
          sourceFrameId: frame.id,
        };
      });

      return generated;
    }

    // If no frames, group elements into slides based on stickies, shapes, and clusters
    if (currentElements && currentElements.length > 0) {
      const stickies = currentElements.filter((e) => e.type === 'sticky');
      const texts = currentElements.filter((e) => e.type === 'text');
      const images = currentElements.filter((e) => e.type === 'image');
      const shapes = currentElements.filter((e) => e.type === 'shape');

      const slidesList: SlideDeckItem[] = [];

      // Slide 1: Overview & Intro
      slidesList.push({
        id: `slide-auto-intro`,
        title: texts[0]?.content || '🚀 Visão Geral do Quadro Diorfy',
        subtitle: texts[1]?.content || 'Ideias, fluxos e estratégias consolidados em apresentação interativa.',
        badge: 'Apresentação ao Vivo',
        metric: { value: `${currentElements.length}`, label: 'Elementos no quadro' },
        points: [
          `${stickies.length} notas adesivas mapeadas`,
          `${shapes.length} componentes e diagramas estruturados`,
          'Transformação instantânea do whiteboard em apresentação profissional',
        ],
        theme: 'dark',
        transition: 'slide',
        layout: 'hero',
        notes: 'Slide de introdução gerado a partir dos elementos do quadro.',
      });

      // Slide 2: Sticky Notes & Brainstorming Wall
      if (stickies.length > 0) {
        slidesList.push({
          id: `slide-auto-stickies`,
          title: '💡 Ideias & Brainstorming do Quadro',
          subtitle: 'Notas adesivas e contribuições organizadas por tópicos essenciais.',
          badge: 'Ideação & Insights',
          metric: { value: `${stickies.length}`, label: 'Post-its registrados' },
          points: stickies.map((s) => s.content || 'Nota sem texto').slice(0, 5),
          cards: stickies.slice(0, 4).map((s, idx) => ({
            title: `Insight #${idx + 1}`,
            desc: s.content || 'Ideia de destaque do quadro',
            color: s.style?.backgroundColor || '#fef08a',
            emoji: '💡',
          })),
          theme: 'purple',
          transition: 'spring',
          layout: 'cards',
          notes: 'Focar na discussão dos principais post-its criados.',
        });
      }

      // Slide 3: Visual & Media if images exist, or Process Diagram
      if (images.length > 0 || shapes.length > 0) {
        slidesList.push({
          id: `slide-auto-visual`,
          title: '⚡ Estrutura Visual & Fluxo de Trabalho',
          subtitle: 'Processos, diagramas e referências visuais integradas.',
          badge: 'Execução & Design',
          metric: { value: `${shapes.length + images.length}`, label: 'Recursos visuais' },
          points: shapes
            .filter((s) => s.content)
            .map((s) => s.content!)
            .concat(['Mapeamento estruturado de etapas', 'Fluxo contínuo de inovação'])
            .slice(0, 4),
          imageUrl: images[0]?.style?.imageUrl,
          theme: 'cyber',
          transition: 'zoom',
          layout: images.length > 0 ? 'split' : 'process',
          notes: 'Apresentar os recursos visuais e etapas do projeto.',
        });
      }

      // Slide 4: Action Plan & Conclusion
      slidesList.push({
        id: `slide-auto-action`,
        title: '📈 Próximos Passos & Entregas',
        subtitle: 'Plano de ação derivado das decisões tomadas no quadro.',
        badge: 'Roadmap & Ação',
        metric: { value: '100%', label: 'Alinhamento da equipe' },
        points: [
          'Priorização das ideias e post-its mais votados',
          'Execução das tarefas definidas nos frames',
          'Acompanhamento e evolução contínua no Diorfy',
        ],
        theme: 'emerald',
        transition: 'flip',
        layout: 'metric',
        notes: 'Encerrar com chamada para ação e alinhamento dos responsáveis.',
      });

      return slidesList;
    }

    // Default template if board is completely empty
    return [
      {
        id: 'slide-def-1',
        title: '🚀 Diorfy: Transforme o Quadro em Slides',
        subtitle: 'Tudo o que você desenha, anota ou cola no quadro se transforma automaticamente em slides modernos.',
        badge: 'Gerador em Tempo Real',
        metric: { value: '1-Click', label: 'Conversão instantânea' },
        points: [
          'Adicione notas adesivas, frames, textos ou imagens no quadro',
          'Clique em "Sincronizar com o Quadro" para ver seus slides atualizarem',
          'Apresente ao vivo em tela cheia com transições de motion design',
        ],
        theme: 'dark',
        transition: 'slide',
        layout: 'hero',
        notes: 'Apresentação inicial demonstrativa.',
      },
      {
        id: 'slide-def-2',
        title: '💡 Experimente Adicionar Elementos!',
        subtitle: 'Crie 4 post-its no quadro e abra novamente o estúdio de slides para ver a mágica.',
        badge: 'Dica Prática',
        metric: { value: '100%', label: 'Sincronizado' },
        points: [
          'Use a ferramenta de Frames (F) para criar seções temáticas',
          'Use notas adesivas coloridas (N) para ideias',
          'Use o Nano Banana para gerar imagens com IA',
        ],
        theme: 'sunset',
        transition: 'spring',
        layout: 'cards',
        notes: 'Estimular a equipe a cocriar no quadro.',
      },
    ];
  };

  const [slides, setSlides] = useState<SlideDeckItem[]>(() =>
    generateSlidesFromBoardData(frames, elements)
  );

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlaySeconds, setAutoPlaySeconds] = useState(5);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [laserPointer, setLaserPointer] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isEditingCurrentSlide, setIsEditingCurrentSlide] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showLayoutPicker, setShowLayoutPicker] = useState(false);
  const [isGeneratingDeck, setIsGeneratingDeck] = useState(false);
  const [showAiTopicDialog, setShowAiTopicDialog] = useState(false);
  const [aiCustomTopic, setAiCustomTopic] = useState('');
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Auto sync from board whenever board changes or modal opens
  const handleSyncFromBoard = () => {
    playSound.click();
    const newSlides = generateSlidesFromBoardData(frames, elements);
    setSlides(newSlides);
    setCurrentSlideIndex(0);
    setSyncFeedback('Quadro sincronizado!');
    try {
      confetti({ particleCount: 40, spread: 60 });
    } catch {}
    setTimeout(() => setSyncFeedback(null), 2500);
  };

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

  // Keyboard navigation
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

  const currentSlide: SlideDeckItem = slides[currentSlideIndex] || slides[0] || {
    id: 'empty',
    title: 'Quadro Diorfy',
    subtitle: 'Nenhum slide disponível',
    points: [],
    theme: 'dark',
    transition: 'slide',
    layout: 'hero',
  };

  const goToNext = () => {
    playSound.click();
    setProgress(0);
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    } else {
      setCurrentSlideIndex(0);
    }
  };

  const goToPrev = () => {
    playSound.click();
    setProgress(0);
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    } else {
      setCurrentSlideIndex(slides.length - 1);
    }
  };

  // AI Board to Slides Synthesis
  const handleGenerateSlidesWithAI = async (customPrompt?: string) => {
    setIsGeneratingDeck(true);
    try {
      const res = await fetch('/api/ai/board-to-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          elements,
          frames,
          boardTitle: customPrompt || 'Apresentação Estratégica Diorfy',
        }),
      });
      const data = await res.json();
      if (data.slides && data.slides.length > 0) {
        setSlides(data.slides);
        setCurrentSlideIndex(0);
        setShowAiTopicDialog(false);
        playSound.success();
        try {
          confetti({ particleCount: 70, spread: 70 });
        } catch {}
      } else {
        // Fallback to topic generator
        const res2 = await fetch('/api/ai/generate-slides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: customPrompt || 'Planejamento e Resultados' }),
        });
        const data2 = await res2.json();
        if (data2.slides && data2.slides.length > 0) {
          setSlides(data2.slides);
          setCurrentSlideIndex(0);
          setShowAiTopicDialog(false);
          playSound.success();
        }
      }
    } catch (err) {
      console.error('Error generating AI slides:', err);
    } finally {
      setIsGeneratingDeck(false);
    }
  };

  const handleAddNewSlide = () => {
    playSound.click();
    const newSlide: SlideDeckItem = {
      id: `slide-${Date.now()}`,
      title: `Novo Slide ${slides.length + 1}`,
      subtitle: 'Adicione aqui a mensagem principal e tópicos deste slide.',
      badge: 'Tópico Estratégico',
      metric: { value: '100%', label: 'Foco no resultado' },
      points: [
        'Primeiro ponto de destaque',
        'Segundo elemento explicativo',
        'Conclusão e próximos passos',
      ],
      theme: 'purple',
      transition: 'slide',
      layout: 'hero',
      notes: 'Notas do orador para este slide.',
    };
    const updated = [...slides, newSlide];
    setSlides(updated);
    setCurrentSlideIndex(updated.length - 1);
  };

  const handleDeleteSlide = (idx: number) => {
    if (slides.length <= 1) return;
    playSound.click();
    const updated = slides.filter((_, i) => i !== idx);
    setSlides(updated);
    setCurrentSlideIndex(Math.max(0, idx - 1));
  };

  const handleDuplicateSlide = (idx: number) => {
    playSound.click();
    const target = slides[idx];
    const cloned: SlideDeckItem = {
      ...target,
      id: `slide-${Date.now()}`,
      title: `${target.title} (Cópia)`,
    };
    const updated = [...slides.slice(0, idx + 1), cloned, ...slides.slice(idx + 1)];
    setSlides(updated);
    setCurrentSlideIndex(idx + 1);
  };

  // Export slides back as actual whiteboard frames and cards!
  const handleExportToBoard = () => {
    playSound.success();
    const newFrames: CanvasFrame[] = [];
    const newElements: CanvasElement[] = [];

    slides.forEach((sl, i) => {
      const frameX = 150 + i * 1100;
      const frameY = 150;
      const frameId = `frame-slide-${Date.now()}-${i}`;

      const bgMap: Record<SlideTheme, string> = {
        dark: '#0f172a',
        sunset: '#fff7ed',
        emerald: '#ecfdf5',
        cyber: '#090d16',
        minimal: '#ffffff',
        purple: '#2e1065',
        ocean: '#0c4a6e',
      };

      newFrames.push({
        id: frameId,
        title: `Slide ${i + 1}: ${sl.title.substring(0, 26)}...`,
        x: frameX,
        y: frameY,
        width: 1000,
        height: 600,
        backgroundColor: bgMap[sl.theme] || '#0f172a',
        borderColor: '#6366f1',
        zIndex: 0,
      });

      // Title Text
      newElements.push({
        id: `el-title-${Date.now()}-${i}`,
        type: 'text',
        x: frameX + 60,
        y: frameY + 50,
        width: 880,
        height: 60,
        zIndex: 1,
        content: sl.title,
        style: {
          fontSize: 26,
          fontWeight: 'bold',
          color: sl.theme === 'dark' || sl.theme === 'cyber' || sl.theme === 'purple' || sl.theme === 'ocean' ? '#f8fafc' : '#0f172a',
        },
        createdAt: Date.now(),
      });

      // Subtitle Text
      newElements.push({
        id: `el-sub-${Date.now()}-${i}`,
        type: 'text',
        x: frameX + 60,
        y: frameY + 120,
        width: 880,
        height: 50,
        zIndex: 1,
        content: sl.subtitle,
        style: {
          fontSize: 15,
          color: sl.theme === 'dark' || sl.theme === 'cyber' || sl.theme === 'purple' || sl.theme === 'ocean' ? '#94a3b8' : '#475569',
        },
        createdAt: Date.now(),
      });

      // Points / Cards as Sticky Notes on Board
      sl.points.forEach((pt, ptIdx) => {
        newElements.push({
          id: `el-sticky-${Date.now()}-${i}-${ptIdx}`,
          type: 'sticky',
          x: frameX + 60 + (ptIdx % 3) * 280,
          y: frameY + 200 + Math.floor(ptIdx / 3) * 180,
          width: 250,
          height: 150,
          zIndex: 2,
          content: pt,
          style: {
            backgroundColor: ptIdx === 0 ? '#bbf7d0' : ptIdx === 1 ? '#bae6fd' : '#fef08a',
          },
          createdAt: Date.now(),
        });
      });
    });

    onExportSlidesToBoard(newFrames, newElements);
    try {
      confetti({ particleCount: 70, spread: 80 });
    } catch {}
    onClose();
  };

  // Download slide presentation as JSON
  const handleDownloadDeck = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(slides, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `apresentacao-diorfy-${Date.now()}.json`;
    a.click();
  };

  // Theme styling configurations
  const themeStyles: Record<
    SlideTheme,
    {
      bg: string;
      titleColor: string;
      subtitleColor: string;
      cardBg: string;
      cardBorder: string;
      badgeBg: string;
      badgeText: string;
      metricColor: string;
      bulletDot: string;
    }
  > = {
    dark: {
      bg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white',
      titleColor: 'text-white',
      subtitleColor: 'text-slate-300',
      cardBg: 'bg-white/10 backdrop-blur-md',
      cardBorder: 'border-white/15',
      badgeBg: 'bg-indigo-500/20 border-indigo-400/30',
      badgeText: 'text-indigo-300',
      metricColor: 'text-indigo-400',
      bulletDot: 'bg-indigo-400',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950 text-white',
      titleColor: 'text-white',
      subtitleColor: 'text-purple-200',
      cardBg: 'bg-purple-900/40 backdrop-blur-md',
      cardBorder: 'border-purple-400/30',
      badgeBg: 'bg-purple-500/20 border-purple-400/30',
      badgeText: 'text-purple-300',
      metricColor: 'text-pink-400',
      bulletDot: 'bg-purple-400',
    },
    sunset: {
      bg: 'bg-gradient-to-br from-orange-950 via-rose-950 to-slate-950 text-white',
      titleColor: 'text-white',
      subtitleColor: 'text-orange-200',
      cardBg: 'bg-orange-900/30 backdrop-blur-md',
      cardBorder: 'border-orange-400/20',
      badgeBg: 'bg-orange-500/20 border-orange-400/30',
      badgeText: 'text-orange-300',
      metricColor: 'text-amber-400',
      bulletDot: 'bg-orange-400',
    },
    emerald: {
      bg: 'bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white',
      titleColor: 'text-white',
      subtitleColor: 'text-emerald-200',
      cardBg: 'bg-emerald-900/30 backdrop-blur-md',
      cardBorder: 'border-emerald-400/20',
      badgeBg: 'bg-emerald-500/20 border-emerald-400/30',
      badgeText: 'text-emerald-300',
      metricColor: 'text-emerald-400',
      bulletDot: 'bg-emerald-400',
    },
    cyber: {
      bg: 'bg-gradient-to-br from-[#060814] via-[#0b1026] to-[#04060f] text-white',
      titleColor: 'text-cyan-300',
      subtitleColor: 'text-slate-300',
      cardBg: 'bg-cyan-950/30 backdrop-blur-md',
      cardBorder: 'border-cyan-500/30',
      badgeBg: 'bg-cyan-500/20 border-cyan-400/40',
      badgeText: 'text-cyan-300',
      metricColor: 'text-cyan-400',
      bulletDot: 'bg-cyan-400',
    },
    ocean: {
      bg: 'bg-gradient-to-br from-blue-950 via-cyan-950 to-slate-950 text-white',
      titleColor: 'text-white',
      subtitleColor: 'text-cyan-200',
      cardBg: 'bg-blue-900/30 backdrop-blur-md',
      cardBorder: 'border-blue-400/20',
      badgeBg: 'bg-blue-500/20 border-blue-400/30',
      badgeText: 'text-blue-300',
      metricColor: 'text-sky-400',
      bulletDot: 'bg-sky-400',
    },
    minimal: {
      bg: 'bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900',
      titleColor: 'text-slate-900',
      subtitleColor: 'text-slate-600',
      cardBg: 'bg-white shadow-xl',
      cardBorder: 'border-slate-200',
      badgeBg: 'bg-blue-50 border-blue-200',
      badgeText: 'text-blue-700',
      metricColor: 'text-blue-600',
      bulletDot: 'bg-blue-600',
    },
  };

  const st = themeStyles[currentSlide.theme || 'dark'] || themeStyles.dark;

  // Animation variants based on current slide transition
  const getVariants = () => {
    switch (currentSlide.transition) {
      case 'zoom':
        return {
          initial: { opacity: 0, scale: 0.85 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.15 },
        };
      case 'flip':
        return {
          initial: { opacity: 0, rotateY: 90 },
          animate: { opacity: 1, rotateY: 0 },
          exit: { opacity: 0, rotateY: -90 },
        };
      case 'spring':
        return {
          initial: { opacity: 0, y: 60 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -60 },
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
          initial: { opacity: 0, x: 80 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -80 },
        };
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col select-none transition-all duration-300 ${
        isFullscreen ? 'bg-black p-0' : 'bg-slate-950/80 backdrop-blur-md p-2 sm:p-4'
      }`}
      onMouseMove={(e) => {
        if (laserPointer) {
          setMousePos({ x: e.clientX, y: e.clientY });
        }
      }}
    >
      {/* Laser Pointer overlay */}
      {laserPointer && isFullscreen && (
        <div
          className="fixed pointer-events-none z-50 w-5 h-5 rounded-full bg-red-500 shadow-[0_0_20px_#ef4444] animate-ping"
          style={{ left: mousePos.x - 10, top: mousePos.y - 10 }}
        />
      )}

      {/* Main Studio Frame */}
      <div className="flex-1 flex flex-col bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
        {/* Top Control Bar */}
        <div className="h-14 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between gap-3 text-white shrink-0">
          {/* Left: Branding & Auto Sync */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center shadow-md">
                <Film className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                  <span>Gerador de Slides do Quadro</span>
                  <span className="text-[10px] bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/40">
                    Live Motion
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400 hidden sm:block">
                  Converte post-its, frames e diagramas em apresentações de alto impacto
                </p>
              </div>
            </div>

            {/* Sync from Board Button */}
            <button
              onClick={handleSyncFromBoard}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer ml-2"
              title="Ler novamente todos os post-its, frames e elementos atuais do quadro"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Sincronizar com o Quadro</span>
            </button>

            {syncFeedback && (
              <span className="text-[11px] font-bold text-emerald-400 animate-in fade-in flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {syncFeedback}
              </span>
            )}
          </div>

          {/* Center: Slide Navigator Pill */}
          <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-2xl border border-slate-700 text-xs">
            <button
              onClick={goToPrev}
              className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"
              title="Slide Anterior (Seta Esquerda)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono font-bold px-2 text-slate-200 text-xs">
              {currentSlideIndex + 1} / {slides.length}
            </span>
            <button
              onClick={goToNext}
              className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"
              title="Próximo Slide (Seta Direita / Espaço)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right: AI, Present, Export, Close */}
          <div className="flex items-center gap-2">
            {/* AI Synthesize Button */}
            <button
              onClick={() => setShowAiTopicDialog(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Sintetizar elementos do quadro com Inteligência Artificial"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Sintetizar com IA</span>
            </button>

            {/* Export back to Board */}
            <button
              onClick={handleExportToBoard}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              title="Inserir estes slides como novos frames e notas adesivas no quadro"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Exportar p/ Quadro</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isFullscreen
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Apresentação em Tela Cheia (F)"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Close Studio */}
            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
              title="Fechar Estúdio"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Studio Body: Left Slide Deck List, Center Stage, Right Properties */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Left Slide Deck Thumbnails */}
          {!isFullscreen && (
            <div className="w-56 bg-slate-950/60 border-r border-slate-800 p-3 flex flex-col gap-2 overflow-y-auto shrink-0 select-none">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Slides ({slides.length})
                </span>
                <button
                  onClick={handleAddNewSlide}
                  className="p-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors cursor-pointer"
                  title="Adicionar Novo Slide"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {slides.map((sl, idx) => (
                <div
                  key={sl.id || idx}
                  onClick={() => {
                    playSound.click();
                    setCurrentSlideIndex(idx);
                  }}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer group text-left relative ${
                    currentSlideIndex === idx
                      ? 'bg-purple-950/50 border-purple-500/80 shadow-lg shadow-purple-950/40 ring-1 ring-purple-500/40'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-purple-400">
                      #{idx + 1}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateSlide(idx);
                        }}
                        className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
                        title="Duplicar"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {slides.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSlide(idx);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded"
                          title="Excluir"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 line-clamp-1">{sl.title}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{sl.subtitle}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                      {sl.theme}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                      {sl.transition}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Center Stage: The Live Animated Slide */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden relative bg-slate-950">
            {/* Slide Stage Container 16:9 Aspect Ratio */}
            <div className="w-full max-w-5xl aspect-video max-h-[82vh] rounded-3xl overflow-hidden shadow-2xl relative border border-white/10 flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide.id || currentSlideIndex}
                  variants={getVariants()}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                  className={`w-full h-full p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden ${st.bg}`}
                >
                  {/* Background Ambient Glow */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Slide Top Header Bar */}
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border shadow-xs ${st.badgeBg} ${st.badgeText}`}
                      >
                        {currentSlide.badge || 'Diorfy Slide'}
                      </span>
                    </div>

                    {currentSlide.metric && (
                      <div className="flex items-baseline gap-2 bg-black/20 backdrop-blur-xs px-3.5 py-1.5 rounded-2xl border border-white/10">
                        <span className={`text-xl font-extrabold font-mono ${st.metricColor}`}>
                          {currentSlide.metric.value}
                        </span>
                        <span className="text-[11px] text-slate-300 font-medium">
                          {currentSlide.metric.label}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Slide Main Content based on Layout */}
                  <div className="my-auto z-10 py-4">
                    <h2
                      className={`text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-3 ${st.titleColor}`}
                    >
                      {currentSlide.title}
                    </h2>
                    <p
                      className={`text-sm sm:text-lg leading-relaxed max-w-3xl mb-6 ${st.subtitleColor}`}
                    >
                      {currentSlide.subtitle}
                    </p>

                    {/* Cards Grid Layout */}
                    {currentSlide.cards && currentSlide.cards.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        {currentSlide.cards.map((card, cIdx) => (
                          <motion.div
                            key={cIdx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * cIdx }}
                            className={`p-4 rounded-2xl border ${st.cardBg} ${st.cardBorder} flex flex-col justify-between`}
                          >
                            <div className="text-xl mb-2">{card.emoji || '📌'}</div>
                            <h4 className="font-bold text-xs sm:text-sm text-white mb-1">
                              {card.title}
                            </h4>
                            <p className="text-[11px] text-slate-300 leading-snug">{card.desc}</p>
                          </motion.div>
                        ))}
                      </div>
                    ) : currentSlide.imageUrl ? (
                      /* Split Image + Bullet Points Layout */
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                        <div className="space-y-3">
                          {currentSlide.points.map((pt, pIdx) => (
                            <motion.div
                              key={pIdx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * pIdx }}
                              className="flex items-start gap-3"
                            >
                              <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${st.bulletDot}`} />
                              <span className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                                {pt}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                        <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl max-h-56">
                          <img
                            src={currentSlide.imageUrl}
                            alt="Visual"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ) : (
                      /* Standard Bullet Points Cards */
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {currentSlide.points.map((pt, pIdx) => (
                          <motion.div
                            key={pIdx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 * pIdx }}
                            className={`p-4 rounded-2xl border ${st.cardBg} ${st.cardBorder}`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${st.badgeBg} ${st.badgeText}`}
                              >
                                {pIdx + 1}
                              </span>
                              <span className="text-xs font-bold text-slate-200">Destaque</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{pt}</p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Slide Bottom Bar */}
                  <div className="flex items-center justify-between z-10 pt-2 border-t border-white/10 text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-300">Diorfy Workspace</span>
                      <span>•</span>
                      <span>Gerado do Quadro</span>
                    </div>
                    <span>
                      Slide {currentSlideIndex + 1} de {slides.length}
                    </span>
                  </div>

                  {/* Auto-Play Progress Indicator Line */}
                  {isPlaying && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Presenter Toolbar */}
            <div className="mt-4 flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl shadow-xl text-white select-none">
              {/* Play / Pause Autoplay */}
              <button
                onClick={() => {
                  playSound.click();
                  setIsPlaying(!isPlaying);
                }}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  isPlaying ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-slate-800 text-slate-200'
                }`}
                title={isPlaying ? 'Pausar Apresentação Automática' : 'Iniciar Apresentação Automática'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              {/* Prev Slide */}
              <button
                onClick={goToPrev}
                className="p-2 hover:bg-slate-800 rounded-xl text-slate-200 transition-colors cursor-pointer"
                title="Slide Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Next Slide */}
              <button
                onClick={goToNext}
                className="p-2 hover:bg-slate-800 rounded-xl text-slate-200 transition-colors cursor-pointer"
                title="Próximo Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-slate-800 mx-1" />

              {/* Laser Pointer */}
              <button
                onClick={() => setLaserPointer(!laserPointer)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  laserPointer ? 'bg-red-500 text-white shadow-lg shadow-red-500/50' : 'hover:bg-slate-800 text-slate-300'
                }`}
                title="Apontador Laser Virtual"
              >
                <Zap className="w-4 h-4" />
              </button>

              {/* Theme Picker Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowThemePicker(!showThemePicker)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-slate-800 rounded-xl text-xs text-slate-300 transition-colors cursor-pointer"
                  title="Alterar Tema Visual do Slide"
                >
                  <Palette className="w-3.5 h-3.5 text-purple-400" />
                  <span className="capitalize">{currentSlide.theme}</span>
                </button>

                {showThemePicker && (
                  <div className="absolute bottom-full mb-2 left-0 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-2 z-50 w-44 space-y-1 text-xs">
                    {(['dark', 'purple', 'sunset', 'emerald', 'cyber', 'ocean', 'minimal'] as SlideTheme[]).map((thm) => (
                      <button
                        key={thm}
                        onClick={() => {
                          const updated = [...slides];
                          updated[currentSlideIndex].theme = thm;
                          setSlides(updated);
                          setShowThemePicker(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg capitalize flex items-center justify-between cursor-pointer ${
                          currentSlide.theme === thm
                            ? 'bg-purple-600 text-white font-bold'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <span>{thm}</span>
                        {currentSlide.theme === thm && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Transition Picker */}
              <select
                value={currentSlide.transition}
                onChange={(e) => {
                  const updated = [...slides];
                  updated[currentSlideIndex].transition = e.target.value as SlideTransition;
                  setSlides(updated);
                }}
                className="bg-slate-800 text-xs text-slate-300 rounded-xl px-2.5 py-1.5 outline-none border border-slate-700 cursor-pointer"
                title="Transição Motion Design"
              >
                <option value="slide">Transição: Deslizar</option>
                <option value="zoom">Transição: Zoom In</option>
                <option value="flip">Transição: Giro 3D</option>
                <option value="spring">Transição: Salto Suave</option>
                <option value="fade">Transição: Esmaecer</option>
              </select>

              {/* Download JSON Deck */}
              <button
                onClick={handleDownloadDeck}
                className="p-2 hover:bg-slate-800 rounded-xl text-slate-300 transition-colors cursor-pointer"
                title="Baixar Arquivo da Apresentação"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Topic & Board Synthesis Modal */}
      {showAiTopicDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-800 shadow-2xl text-white select-none">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Sintetizar Apresentação com IA
              </h3>
              <button
                onClick={() => setShowAiTopicDialog(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              A inteligência artificial analisará os {elements.length} elementos e {frames.length}{' '}
              frames do seu quadro para gerar uma narrativa estruturada de apresentação.
            </p>

            <div className="space-y-3">
              <input
                type="text"
                value={aiCustomTopic}
                onChange={(e) => setAiCustomTopic(e.target.value)}
                placeholder="Foco principal (ex: Lançamento de Produto, Estratégia Q3...)"
                className="w-full text-xs bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-purple-500"
              />

              <button
                onClick={() => handleGenerateSlidesWithAI(aiCustomTopic.trim())}
                disabled={isGeneratingDeck}
                className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isGeneratingDeck ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Criando Storytelling com IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Gerar Apresentação Executiva</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
