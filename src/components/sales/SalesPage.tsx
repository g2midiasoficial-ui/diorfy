import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  Check,
  Zap,
  ShieldCheck,
  Layers,
  Copy,
  ChevronDown,
  Play,
  Maximize2,
  Users,
  Compass,
  FileCode,
  Layout,
  Plus,
  MousePointer,
  Brain,
  Download,
  CheckCircle2,
  Trash2,
  Calculator,
  TrendingUp,
  Clock,
  Coins,
  Share2,
  Lock,
  Sparkle,
  Image as ImageIcon,
  Workflow,
  BarChart3,
  HelpCircle,
  Eye,
  Sliders,
  X,
} from 'lucide-react';
import { UserProfile, UserPlan } from '../../types/auth';
import { AuthModal } from '../auth/AuthModal';
import { CheckoutModal } from './CheckoutModal';

interface SalesPageProps {
  onEnterPlatform: () => void;
  onOpenBoard?: (boardId: string) => void;
}

export const SalesPage: React.FC<SalesPageProps> = ({ onEnterPlatform }) => {
  // Modal states
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<UserPlan>('pro');
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);

  // Billing toggle
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  // Interactive Feature Pillar Active Tab
  const [activeFeatureTab, setActiveFeatureTab] = useState<'mindmap' | 'clipboard' | 'shapes' | 'ai'>('mindmap');

  // Interactive Mindmap Structure Demo Selector
  const [selectedMindmapType, setSelectedMindmapType] = useState<'radial' | 'tree' | 'fishbone' | 'funnel'>('radial');

  // Interactive AI Generation Demo in Showcase
  const [aiPromptInput, setAiPromptInput] = useState('Lançamento de Produto Digital & Tráfego');
  const [isGeneratingAiDemo, setIsGeneratingAiDemo] = useState(false);
  const [aiGeneratedResult, setAiGeneratedResult] = useState<string[]>([
    '🎯 Oferta Irresistível & VSL',
    '📢 Tráfego Pago (Meta Ads & Google)',
    '📧 Sequência de E-mails de Aquecimento',
    '💳 Checkout Otimizado em 1 Clique',
    '📊 Análise de Métricas & ROI',
  ]);

  // Interactive Mini-Sandbox state
  const [sandboxNotes, setSandboxNotes] = useState<
    Array<{ id: number; text: string; color: string; x: number; y: number; type?: 'note' | 'image' | 'node' }>
  >([
    { id: 1, text: '💡 Ideação & Estratégia Q4', color: '#FEF3C7', x: 24, y: 24, type: 'note' },
    { id: 2, text: '🧠 Mapa Mental do Funil de Vendas', color: '#DBEAFE', x: 230, y: 40, type: 'node' },
    { id: 3, text: '🚀 Copiar & Colar Prints com Ctrl+V', color: '#DCFCE7', x: 440, y: 24, type: 'note' },
  ]);
  const [activeNoteText, setActiveNoteText] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FEF3C7');
  const [showConnectors, setShowConnectors] = useState(true);

  // ROI Calculator State
  const [teamSize, setTeamSize] = useState<number>(5);
  const [weeklyMeetingHours, setWeeklyMeetingHours] = useState<number>(8);

  // Interactive FAQ open states
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Computed ROI values
  const calculatedSavings = useMemo(() => {
    // Average 40% reduction in planning & alignment friction with Diorfy
    const hoursSavedPerWeek = (teamSize * weeklyMeetingHours * 0.4);
    const hoursSavedPerMonth = Math.round(hoursSavedPerWeek * 4.3);
    // Assuming average blended hourly cost of R$ 55
    const financialSavingsPerMonth = hoursSavedPerMonth * 55;
    const efficiencyGain = Math.min(320, 140 + teamSize * 15);

    return {
      hoursSavedPerMonth,
      financialSavingsPerMonth,
      efficiencyGain,
    };
  }, [teamSize, weeklyMeetingHours]);

  const handleAddSandboxNote = () => {
    if (!activeNoteText.trim()) return;
    setSandboxNotes((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: activeNoteText,
        color: selectedColor,
        x: 30 + ((prev.length * 45) % 360),
        y: 90 + ((prev.length * 35) % 120),
        type: 'note',
      },
    ]);
    setActiveNoteText('');
  };

  const handleClearSandbox = () => {
    setSandboxNotes([
      { id: Date.now(), text: '✨ Tela limpa! Crie novas notas ou experimente o mapa mental.', color: '#FEF3C7', x: 40, y: 40, type: 'note' },
    ]);
  };

  const handleAddSampleImage = () => {
    setSandboxNotes((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: '📸 Print de Interface Colado (Ctrl+V)',
        color: '#EDE9FE',
        x: 180,
        y: 80,
        type: 'image',
      },
    ]);
  };

  const handleGenerateAiPrompt = (prompt: string) => {
    setAiPromptInput(prompt);
    setIsGeneratingAiDemo(true);
    setTimeout(() => {
      if (prompt.includes('SaaS') || prompt.includes('Produto')) {
        setAiGeneratedResult([
          '🎯 Definição do ICP & Proposta de Valor',
          '🛠️ MVP com Funcionalidades Centrais',
          '📈 Estratégia de Aquisição (PLG & Outbound)',
          '💳 Precificação Tierizada & Free Trial',
          '🔄 Retenção, Churn & Suporte Ativo',
        ]);
      } else if (prompt.includes('Tráfego') || prompt.includes('Campanha')) {
        setAiGeneratedResult([
          '🎨 Criação de 6 Variações de Criativos',
          '🎯 Segmentação de Públicos Semelhantes',
          '📄 Otimização da Landing Page de Conversão',
          '📊 Testes A/B de Headlines e CTAs',
          '💰 Escala de Orçamento em Campanhas Vencedoras',
        ]);
      } else {
        setAiGeneratedResult([
          '🏗️ Microserviços & Arquitetura Event-Driven',
          '🔒 Autenticação JWT & Criptografia Ponta a Ponta',
          '⚡ Cache Redis para Latência Sub-50ms',
          '💾 Banco Relacional Cloud SQL com Auto-Scale',
          '📊 Telemetria e Monitoramento de Saúde em Tempo Real',
        ]);
      }
      setIsGeneratingAiDemo(false);
    }, 600);
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleOpenPlanCheckout = (plan: UserPlan) => {
    if (plan === 'free') {
      handleOpenAuth('register');
      return;
    }
    setSelectedPlanForCheckout(plan);
    setIsCheckoutOpen(true);
  };

  const handleAuthSuccess = (user: UserProfile) => {
    setIsAuthOpen(false);
    onEnterPlatform();
  };

  const handleCheckoutSuccess = (plan: UserPlan) => {
    setIsCheckoutOpen(false);
    onEnterPlatform();
  };

  const faqs = [
    {
      q: 'Como funciona o recurso de Copiar e Colar Imagens no projeto (Ctrl+V)?',
      a: 'Você pode tirar qualquer captura de tela (print com PrintScreen, ferramenta de captura do Windows ou Cmd+Shift+4 no Mac) ou copiar qualquer imagem da internet e simplesmente pressionar Ctrl+V (ou Cmd+V) diretamente no quadro. O Diorfy insere a imagem instantaneamente na posição exata do seu cursor, permitindo redimensionar, recortar, conectar a mapas mentais e fazer download.',
    },
    {
      q: 'O que inclui o Estúdio de Mapas Mentais com 6 Estruturas?',
      a: 'O Diorfy possui gerador de mapas mentais com 6 estruturas consagradas: Radial 360°, Árvore Horizontal, Organograma Vertical (Top-Down), Diagrama Ishikawa (Espinha de Peixe para análise de causa-raiz), Matriz SWOT e Funil de Jornada do Cliente. Você ramifica nós rapidamente usando as teclas Tab e Enter.',
    },
    {
      q: 'Como funciona a forma de pagamento via PIX e Cartão de Crédito?',
      a: 'Aceitamos PIX instantâneo com liberação imediata da conta em segundos, além de Cartão de Crédito em até 12x e Boleto Bancário. Nossos preços são 100% em Reais brasileiros (R$), sem taxas de IOF internacional ou surpresas cambiais.',
    },
    {
      q: 'Posso convidar membros da minha equipe para colaborar em tempo real?',
      a: 'Sim! No plano Gratuito você pode compartilhar links de visualização. Nos planos Pro e Enterprise Team, você tem colaboração em tempo real com múltiplos editores, cursores ao vivo com nome de cada participante e gerenciamento avançado de permissões.',
    },
    {
      q: 'Existe limite de quadros ou elementos no plano Pro Creator?',
      a: 'Não. O plano Pro Creator oferece quadros infinitos, sem limite de nós, notas adesivas, formas geométricas ou imagens coladas, além de exportações em altíssima resolução (PNG 4K, SVG vetorial e PDF).',
    },
    {
      q: 'Como funciona a garantia incondicional de 7 dias?',
      a: 'Se você assinar qualquer plano pago e achar que a plataforma não atendeu suas expectativas, basta solicitar o reembolso em até 7 dias com devolução integral de 100% do valor pago, sem burocracia.',
    },
  ];

  return (
    <div className="h-screen w-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col selection:bg-blue-500 selection:text-white overflow-y-auto select-text">
      {/* 1. TOP BAR CONTRACT (Strict 3-zone layout) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
              D
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Diorfy Studio
            </span>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#recursos" className="hover:text-slate-900 transition-colors">
              Recursos
            </a>
            <a href="#demo" className="hover:text-slate-900 transition-colors">
              Demonstração
            </a>
            <a href="#comparativo" className="hover:text-slate-900 transition-colors">
              Comparativo
            </a>
            <a href="#calculadora" className="hover:text-slate-900 transition-colors">
              Calculadora ROI
            </a>
            <a href="#planos" className="hover:text-slate-900 transition-colors">
              Planos & Preços
            </a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenAuth('login')}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors whitespace-nowrap"
            >
              Entrar
            </button>
            <button
              onClick={() => handleOpenAuth('register')}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap"
            >
              Acessar Plataforma Grátis
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Unboxed inline announcement text */}
          <div className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3.5 py-1 rounded-full mb-5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Novo Estúdio de Mapas Mentais 2.0 com 6 Estruturas & Copiar/Colar Imagens</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500 font-normal">Sem Limites</span>
          </div>

          {/* Primary headline (balanced measure) */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15] text-balance">
            O Workspace Visual & Gerador de Mapas Mentais que Acelera Projetos em 3x
          </h1>

          {/* Value proposition subheadline */}
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Crie mapas mentais dinâmicos, cole capturas de tela instantaneamente com <span className="font-semibold text-slate-900">Ctrl+V</span>, use mais de 30 símbolos de engenharia e estruture ideias com inteligência artificial.
          </p>

          {/* Dual Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => handleOpenAuth('register')}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Começar Gratuitamente (Sem Cartão)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsDemoTourOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
              <span>Ver Tour Interativo em Vídeo</span>
            </button>
          </div>

          {/* Social Proof & Metrics Adjacency */}
          <div className="mt-10 pt-6 border-t border-slate-200/80 max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-900 font-bold text-sm tabular-nums">+180%</span>
              <span>Velocidade de Ideação</span>
            </div>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-900 font-bold text-sm tabular-nums">50.000+</span>
              <span>Quadros Criados</span>
            </div>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-900 font-bold text-sm tabular-nums">0.0s</span>
              <span>Lag no Ctrl+V de Imagens</span>
            </div>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-900 font-bold text-sm tabular-nums">100%</span>
              <span>Em Reais (com PIX)</span>
            </div>
          </div>

          {/* Hero Interface Visual Asset with Hotspots */}
          <div className="mt-12 relative max-w-5xl mx-auto rounded-2xl overflow-hidden border border-slate-300/80 shadow-2xl bg-slate-900 group">
            <img
              src="/src/assets/images/sales_hero_canvas_1790519840611.jpg"
              alt="Interface do Diorfy Studio com canvas infinito, mapas mentais e notas adesivas"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover transform group-hover:scale-[1.01] transition-transform duration-500"
            />
            {/* Overlay interactive trigger badge */}
            <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-medium border border-white/10 flex items-center gap-2 shadow-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Canvas Infinito Ativo · Suporte a Imagens e IA</span>
            </div>

            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold shadow flex items-center gap-1.5 border border-slate-200">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Pressione Tab / Enter para ramificar nós</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE LIVE MINI-SANDBOX DEMO */}
      <section id="demo" className="py-16 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
              <MousePointer className="w-3.5 h-3.5" />
              <span>Playground Interativo</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Experimente a velocidade da lousa interativa agora mesmo
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Crie notas adesivas, simule conexões de mapas mentais e cole elementos antes de criar sua conta.
            </p>
          </div>

          {/* Interactive Sandbox Container */}
          <div className="bg-slate-100 rounded-2xl border border-slate-300 p-4 sm:p-6 shadow-inner">
            {/* Sandbox Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {/* Color Selector */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-300">
                  {['#FEF3C7', '#DBEAFE', '#DCFCE7', '#FCE7F3', '#EDE9FE'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-5 h-5 rounded-md border transition-all ${
                        selectedColor === c ? 'ring-2 ring-blue-500 scale-110 border-slate-400' : 'border-black/10'
                      }`}
                      title="Selecionar cor"
                    />
                  ))}
                </div>

                <input
                  type="text"
                  value={activeNoteText}
                  onChange={(e) => setActiveNoteText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSandboxNote()}
                  placeholder="Digite uma ideia ou nota rápida..."
                  className="px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                />

                <button
                  onClick={handleAddSandboxNote}
                  className="px-3.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Nota</span>
                </button>

                <button
                  onClick={handleAddSampleImage}
                  className="px-3 py-2 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Simular Print (Ctrl+V)</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowConnectors(!showConnectors)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
                    showConnectors
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-white border-slate-300 text-slate-600'
                  }`}
                >
                  <Workflow className="w-3.5 h-3.5" />
                  <span>{showConnectors ? 'Conectores Ativos' : 'Conectores Ocultos'}</span>
                </button>

                <button
                  onClick={handleClearSandbox}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-300 transition-colors"
                  title="Limpar Sandbox"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleOpenAuth('register')}
                  className="px-3.5 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Abrir Canvas Completo</span>
                </button>
              </div>
            </div>

            {/* Sandbox Canvas Surface */}
            <div className="relative h-72 sm:h-88 bg-[#f8fafc] rounded-xl mt-4 border border-slate-200 overflow-hidden p-4 grid-pattern">
              {/* Simulated Connectors SVG */}
              {showConnectors && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-blue-400 stroke-2">
                  <path d="M 120 70 C 180 70, 180 80, 230 80" fill="none" strokeDasharray="4,4" />
                  <path d="M 330 80 C 380 80, 400 70, 440 70" fill="none" strokeDasharray="4,4" />
                </svg>
              )}

              {sandboxNotes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    backgroundColor: note.color,
                    left: `${Math.min(note.x, 600)}px`,
                    top: `${Math.min(note.y, 200)}px`,
                  }}
                  className={`absolute p-3 rounded-lg shadow-md border border-black/10 w-48 text-xs font-medium text-slate-900 cursor-move transition-all hover:scale-105 ${
                    note.type === 'image' ? 'border-2 border-indigo-400 bg-indigo-50' : ''
                  }`}
                >
                  {note.type === 'image' ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-[11px]">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Screenshot Capturado</span>
                      </div>
                      <div className="h-14 bg-white/80 rounded border border-indigo-200 flex items-center justify-center text-[10px] text-slate-500 font-mono">
                        [ Imagem 1920x1080 px ]
                      </div>
                      <div className="text-[10px] text-slate-600 truncate">{note.text}</div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                        <span>{note.type === 'node' ? 'Nó de Mapa' : 'Nota Rápida'}</span>
                        <span className="w-2 h-2 rounded-full bg-slate-400/50" />
                      </div>
                      <div>{note.text}</div>
                    </>
                  )}
                </div>
              ))}

              <div className="absolute bottom-3 left-3 text-[11px] text-slate-500 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Dica: No canvas completo, você tem zoom infinito de 10% a 500% e exportação 4K!</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE PILLARS & FEATURE SHOWCASE */}
      <section id="recursos" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Poderosas Ferramentas Visuais</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Tudo o que você precisa para estruturar ideias sem atrito
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Explore cada pilar interativamente e veja como o Diorfy substitui múltiplas ferramentas isoladas.
            </p>

            {/* Interactive Feature Segmented Tabs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-200/80 rounded-xl max-w-2xl mx-auto">
              {[
                { id: 'mindmap', label: '🧠 Mapas Mentais (6 Estruturas)' },
                { id: 'clipboard', label: '🖼️ Copiar & Colar 2.0 (Ctrl+V)' },
                { id: 'shapes', label: '📐 30+ Formas & Símbolos' },
                { id: 'ai', label: '🤖 Copiloto de IA para Ideação' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFeatureTab(tab.id as any)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeFeatureTab === tab.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* TAB 1: MINDMAPS SHOWCASE */}
          {activeFeatureTab === 'mindmap' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm animate-in fade-in duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    01. Estúdio de Mapas Mentais Avançado
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                    Estruture Pensamentos Complexos em Segundos
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Escolha entre 6 estruturas automáticas para qualquer modelo de raciocínio. Adicione ramos filhos com a tecla <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px] font-mono text-slate-800">Tab</kbd> e irmãos com <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px] font-mono text-slate-800">Enter</kbd>.
                  </p>

                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-700 block">Selecione uma estrutura para pré-visualizar:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'radial', name: 'Radial 360°', desc: 'Brainstorming amplo' },
                        { id: 'tree', name: 'Árvore Horizontal', desc: 'Sprints & processos' },
                        { id: 'fishbone', name: 'Espinha Ishikawa', desc: 'Análise de causa e efeito' },
                        { id: 'funnel', name: 'Funil de Conversão', desc: 'Jornada do usuário' },
                      ].map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setSelectedMindmapType(type.id as any)}
                          className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                            selectedMindmapType === type.id
                              ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-semibold shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
                          }`}
                        >
                          <div className="font-bold">{type.name}</div>
                          <div className="text-[10px] text-slate-500 font-normal">{type.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex items-center gap-3">
                    <button
                      onClick={() => handleOpenAuth('register')}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
                    >
                      <span>Criar Mapa Mental Grátis</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-lg relative min-h-[320px] flex items-center justify-center">
                  <img
                    src="/src/assets/images/sales_mindmap_diagram_1790519861864.jpg"
                    alt="Diagrama de Mapa Mental 3D"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover max-h-[380px]"
                  />
                  <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[11px] font-medium border border-white/10">
                    Estrutura Selecionada: {selectedMindmapType.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLIPBOARD SHOWCASE */}
          {activeFeatureTab === 'clipboard' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm animate-in fade-in duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    02. Copiar & Colar 2.0 Instantâneo
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                    Tire um Print e Cole Direto no Canvas com Ctrl+V
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Chega de salvar arquivos temporários na área de trabalho e fazer upload manual. Basta pressionar <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px] font-mono text-slate-800">Ctrl+V</kbd> em qualquer lugar do quadro.
                  </p>

                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Posicionamento Inteligente:</strong> A imagem pousa exatamente onde o cursor do seu mouse está.</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Suporte Completo a Formatos:</strong> PNG, JPEG, WebP, SVG e imagens da área de transferência.</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Ferramentas Integradas:</strong> Redimensione, recorte e adicione notas adesivas conectadas ao print.</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => handleOpenAuth('register')}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
                    >
                      <span>Testar Ctrl+V no Diorfy</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-slate-100 rounded-xl p-6 border border-slate-200">
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 font-semibold text-slate-800">
                      <div className="flex items-center gap-2">
                        <Copy className="w-4 h-4 text-indigo-600" />
                        <span>Fluxo de Colagem em 3 Passos:</span>
                      </div>
                      <span className="text-emerald-600 font-bold">Velocidade 0.0s</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center mx-auto mb-1">1</div>
                        <span className="font-semibold block text-slate-800">Tire o Print</span>
                        <span className="text-[10px] text-slate-500">PrintScreen ou Snipping Tool</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center mx-auto mb-1">2</div>
                        <span className="font-semibold block text-slate-800">Pressione Ctrl+V</span>
                        <span className="text-[10px] text-slate-500">Direto na tela</span>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center mx-auto mb-1">3</div>
                        <span className="font-semibold block text-emerald-900">Pronto!</span>
                        <span className="text-[10px] text-emerald-700">Conecte notas & edite</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SHAPES SHOWCASE */}
          {activeFeatureTab === 'shapes' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm animate-in fade-in duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    03. Biblioteca de Formas & Engenharia
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                    Mais de 30 Formas para Arquitetura e Fluxogramas
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    De simples retângulos e círculos até cilindros de Banco de Dados, Cubos 3D, Losangos de Decisão e Chaves de Agrupamento.
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => handleOpenAuth('register')}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
                    >
                      <span>Acessar Biblioteca de Formas</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {[
                      { name: 'Cubo 3D', icon: '🧊' },
                      { name: 'Banco de Dados', icon: '💾' },
                      { name: 'Losango Decisão', icon: '🔶' },
                      { name: 'Chaves { }', icon: '🔣' },
                      { name: 'Chevron Etapa', icon: '⏩' },
                      { name: 'Nuvem Cloud', icon: '☁️' },
                      { name: 'Servidor Server', icon: '🖥️' },
                      { name: 'Escudo Segurança', icon: '🛡️' },
                      { name: 'Engrenagem Setup', icon: '⚙️' },
                      { name: 'Funil Conversão', icon: '🔻' },
                      { name: 'Documento Doc', icon: '📄' },
                      { name: 'Tag de Categoria', icon: '🏷️' },
                    ].map((shape, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white border border-slate-200 rounded-xl text-center shadow-2xs hover:shadow-xs transition-shadow flex flex-col items-center justify-center gap-1"
                      >
                        <span className="text-xl">{shape.icon}</span>
                        <span className="text-[11px] font-semibold text-slate-800">{shape.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AI COPILOT SHOWCASE */}
          {activeFeatureTab === 'ai' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm animate-in fade-in duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <div className="text-xs font-bold text-violet-600 uppercase tracking-wider">
                    04. Inteligência Artificial Generativa Integrada
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                    Transforme Prompts em Mapas Estruturados em Segundos
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Digite um tema, ideia de negócio ou desafio técnico e o Copiloto Diorfy gera a árvore de tópicos completa para você expandir.
                  </p>

                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-700">Experimente um prompt de exemplo:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Lançamento de Produto SaaS',
                        'Campanha de Tráfego Pago',
                        'Arquitetura Cloud Escalável',
                      ].map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => handleGenerateAiPrompt(prompt)}
                          className="px-2.5 py-1 text-[11px] bg-violet-50 hover:bg-violet-100 text-violet-800 border border-violet-200 rounded-lg transition-colors"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => handleOpenAuth('register')}
                      className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
                    >
                      <span>Experimentar IA no Plano Pro</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-violet-400" />
                      <span className="font-semibold text-slate-200">Simulador de Síntese de IA</span>
                    </div>
                    {isGeneratingAiDemo ? (
                      <span className="text-violet-400 text-[11px] animate-pulse">Gerando nós...</span>
                    ) : (
                      <span className="text-emerald-400 text-[11px]">Pronto</span>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="p-3 bg-violet-950/60 border border-violet-800/80 rounded-lg text-xs font-bold text-violet-200 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-violet-400" />
                      <span>{aiPromptInput}</span>
                    </div>

                    <div className="pl-4 space-y-1.5 border-l-2 border-violet-600/40 mt-2">
                      {aiGeneratedResult.map((res, idx) => (
                        <div
                          key={idx}
                          className="p-2 bg-slate-800/90 border border-slate-700 rounded-md text-xs text-slate-300 flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                          <span>{res}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. INTERACTIVE ROI & TIME SAVINGS CALCULATOR */}
      <section id="calculadora" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
              <Calculator className="w-3.5 h-3.5" />
              <span>Calculadora de Retorno sobre Investimento</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Quanto tempo e dinheiro o Diorfy economiza na sua operação?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Ajuste o tamanho do seu time e veja o impacto financeiro direto da redução de atrito visual.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50 rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm">
            {/* Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-900 mb-2">
                  <span>Pessoas no seu time / empresa:</span>
                  <span className="text-sm font-extrabold text-blue-600 tabular-nums">{teamSize} pessoas</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="40"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>1 (Individual)</span>
                  <span>20</span>
                  <span>40+ (Equipes)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-900 mb-2">
                  <span>Horas semanais em reuniões, ideação e alinhamento:</span>
                  <span className="text-sm font-extrabold text-blue-600 tabular-nums">{weeklyMeetingHours} horas / semana</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="25"
                  value={weeklyMeetingHours}
                  onChange={(e) => setWeeklyMeetingHours(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>2h</span>
                  <span>12h</span>
                  <span>25h+</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-900 block">Como calculamos?</span>
                <p>
                  Baseado em métricas de produtividade onde diagramas colaborativos e mapas mentais reduzem retrabalho em até 40% em relação a conversas em texto e e-mails dispersos.
                </p>
              </div>
            </div>

            {/* Calculated Impact Card */}
            <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-400">Impacto Mensal Estimado</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
                  ROI Imediato
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/80">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Horas Economizadas</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                    {calculatedSavings.hoursSavedPerMonth} h
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">por mês em alinhamento</div>
                </div>

                <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/80">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Coins className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Economia Financeira</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums">
                    R$ {calculatedSavings.financialSavingsPerMonth.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">em horas de retrabalho</div>
                </div>
              </div>

              <div className="p-3.5 bg-blue-950/40 rounded-xl border border-blue-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <TrendingUp className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-blue-200">Aceleração média nas entregas de sprints:</span>
                </div>
                <span className="text-sm font-extrabold text-blue-300 tabular-nums">
                  +{calculatedSavings.efficiencyGain}%
                </span>
              </div>

              <button
                onClick={() => handleOpenPlanCheckout('pro')}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Garantir Esse Retorno no Plano Pro</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DETAILED COMPARISON MATRIX (DIORFY VS CONCORRENTES) */}
      <section id="comparativo" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Vantagens Competitivas</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Por que Criadores & Equipes Preferem o Diorfy?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Veja o comparativo frente a soluções tradicionais do mercado.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700">
                    <th className="p-4 font-bold">Recurso / Capacidade</th>
                    <th className="p-4 font-bold text-blue-600 bg-blue-50/50">Diorfy Studio</th>
                    <th className="p-4 font-bold text-slate-500">Miro / Whimsical Tradicional</th>
                    <th className="p-4 font-bold text-slate-500">Quadros Brancos Genéricos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">Preço em Reais (com PIX sem IOF)</td>
                    <td className="p-4 text-blue-700 font-bold bg-blue-50/30">
                      <span className="flex items-center gap-1"><Check className="w-4 h-4 text-emerald-600" /> 100% em R$ com PIX</span>
                    </td>
                    <td className="p-4 text-slate-600">Em Dólar (USD) + IOF 4.38%</td>
                    <td className="p-4 text-slate-400">Variável</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">Copiar & Colar Prints com Ctrl+V Instantâneo</td>
                    <td className="p-4 text-blue-700 font-bold bg-blue-50/30">
                      <span className="flex items-center gap-1"><Check className="w-4 h-4 text-emerald-600" /> Sem lag no cursor</span>
                    </td>
                    <td className="p-4 text-slate-600">Requer upload demorado</td>
                    <td className="p-4 text-rose-500 font-medium">Incompatível</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">6 Estruturas de Mapas Mentais com Tab/Enter</td>
                    <td className="p-4 text-blue-700 font-bold bg-blue-50/30">
                      <span className="flex items-center gap-1"><Check className="w-4 h-4 text-emerald-600" /> Ishikawa, Radial, Árvore</span>
                    </td>
                    <td className="p-4 text-slate-600">Apenas 1 modelo básico</td>
                    <td className="p-4 text-rose-500 font-medium">Não possui</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">30+ Símbolos de Engenharia e Cubos 3D</td>
                    <td className="p-4 text-blue-700 font-bold bg-blue-50/30">
                      <span className="flex items-center gap-1"><Check className="w-4 h-4 text-emerald-600" /> Completo nativo</span>
                    </td>
                    <td className="p-4 text-slate-600">Plugins pagos extras</td>
                    <td className="p-4 text-rose-500 font-medium">Formas básicas apenas</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">Exportação em PNG 4K e SVG sem Marca D'água</td>
                    <td className="p-4 text-blue-700 font-bold bg-blue-50/30">
                      <span className="flex items-center gap-1"><Check className="w-4 h-4 text-emerald-600" /> Ilimitado no Pro</span>
                    </td>
                    <td className="p-4 text-slate-600">Bloqueado em planos baixos</td>
                    <td className="p-4 text-rose-500 font-medium">Baixa resolução</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">Garantia Incondicional de 7 Dias</td>
                    <td className="p-4 text-blue-700 font-bold bg-blue-50/30">
                      <span className="flex items-center gap-1"><Check className="w-4 h-4 text-emerald-600" /> Devolução 100%</span>
                    </td>
                    <td className="p-4 text-slate-600">Suporte em inglês complexo</td>
                    <td className="p-4 text-slate-400">Sem garantia</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 7. QUANTITATIVE SOCIAL PROOF & CASE STUDIES */}
      <section id="depoimentos" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Resultados Comprovados por Quem Cria Todos os Dias
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Histórias reais de profissionais e equipes que escalaram sua produtividade visual.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="text-2xl font-extrabold text-slate-900 tabular-nums mb-1">
                  +240%
                </div>
                <div className="text-xs font-semibold text-blue-600 mb-3">
                  Velocidade no Onboarding de Novos Produtos
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  "O recurso de colar imagens de prints direto na tela e estruturar o mapa mental em
                  árvore horizontal cortou pela metade nossas reuniões de alinhamento."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/80 text-xs">
                <span className="font-bold text-slate-900 block">Lucas Mendes</span>
                <span className="text-slate-500 text-[11px]">Head de Produto, NextScale</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="text-2xl font-extrabold text-slate-900 tabular-nums mb-1">
                  4.5 Horas
                </div>
                <div className="text-xs font-semibold text-indigo-600 mb-3">
                  Economizadas por Sprint de Design
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  "Substituímos três ferramentas diferentes pelo Diorfy. A facilidade de exportar em
                  4K e criar frames de apresentação impressionou toda a diretoria."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/80 text-xs">
                <span className="font-bold text-slate-900 block">Mariana Castro</span>
                <span className="text-slate-500 text-[11px]">Lead UX Designer, Studio Aurora</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="text-2xl font-extrabold text-slate-900 tabular-nums mb-1">
                  12 Projetos
                </div>
                <div className="text-xs font-semibold text-emerald-600 mb-3">
                  Entregues com Antecedência no Trimestre
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  "A diagramação com símbolos de banco de dados e fluxogramas inteligentes tornou a
                  comunicação entre arquitetos e desenvolvedores impecável."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/80 text-xs">
                <span className="font-bold text-slate-900 block">Rafael Albuquerque</span>
                <span className="text-slate-500 text-[11px]">CTO, SyncData Tech</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PRICING & TIERS SECTION */}
      <section id="planos" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Planos Transparentes para Cada Etapa do seu Crescimento
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Comece gratuitamente ou desbloqueie poder ilimitado com nossos planos para criadores e empresas.
            </p>

            {/* Monthly / Annual Switcher */}
            <div className="mt-6 inline-flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cobrança Mensal
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Cobrança Anual</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  20% OFF
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Plan 1: Free Starter */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Gratuito / Starter</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Ideal para projetos individuais e ideação inicial.
                </p>
                <div className="mt-6 mb-6">
                  <span className="text-3xl font-extrabold text-slate-900">R$ 0</span>
                  <span className="text-xs text-slate-500 ml-1">/ para sempre</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Até 3 quadros colaborativos ativos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Copiar e colar imagens com Ctrl+V</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Mapas mentais básicos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Exportação em imagem padrão PNG</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleOpenPlanCheckout('free')}
                className="mt-8 w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs rounded-xl transition-colors text-center"
              >
                Começar Grátis Agora
              </button>
            </div>

            {/* Plan 2: Pro Creator (Popular) */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-blue-600 shadow-xl flex flex-col justify-between relative transform lg:-translate-y-2">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                Mais Escolhido
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Pro Creator</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Para criadores e profissionais que precisam de poder visual ilimitado.
                </p>
                <div className="mt-6 mb-6">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {billingCycle === 'annual' ? 'R$ 31' : 'R$ 39'}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">
                    {billingCycle === 'annual' ? '/ mês (faturado R$ 374/ano)' : '/ mês'}
                  </span>
                </div>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-semibold text-slate-900">Quadros ilimitados sem restrições</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Estúdio de Mapas Mentais Completo (6 layouts)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Copiloto de IA para Brainstorming e Síntese</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>30+ Formas geométricas e símbolos de engenharia</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Exportação em Alta Resolução (SVG, PDF e PNG 4K)</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleOpenPlanCheckout('pro')}
                className="mt-8 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all text-center flex items-center justify-center gap-2"
              >
                <span>Assinar Plano Pro com PIX / Cartão</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Plan 3: Enterprise Team */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Enterprise Team</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Para agências, equipes de tecnologia e empresas em escala.
                </p>
                <div className="mt-6 mb-6">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {billingCycle === 'annual' ? 'R$ 71' : 'R$ 89'}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">
                    {billingCycle === 'annual' ? '/ mês (faturado R$ 854/ano)' : '/ mês'}
                  </span>
                </div>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Tudo incluído no plano Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Múltiplos membros de equipe com permissões</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Workspaces compartilhados para clientes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Suporte prioritário via WhatsApp / E-mail</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleOpenPlanCheckout('team')}
                className="mt-8 w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors text-center"
              >
                Contratar para Minha Equipe
              </button>
            </div>
          </div>

          {/* Guarantee Trust Seal */}
          <div className="mt-12 max-w-2xl mx-auto p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center gap-4 text-xs text-emerald-950">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold block text-emerald-900">Garantia Incondicional de 7 Dias</span>
              <p className="text-emerald-800 text-[11px] leading-relaxed">
                Experimente o plano Pro ou Enterprise sem nenhum risco. Se por qualquer motivo não gostar, solicite o cancelamento em até 7 dias e devolvemos 100% do seu valor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. INTERACTIVE FAQ ACCORDION */}
      <section id="faq" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Perguntas Frequentes
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Tire todas as suas dúvidas sobre a plataforma, planos e recursos.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transform transition-transform ${
                      openFaqIndex === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FINAL HIGH-IMPACT CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Pronto para transformar sua ideação em resultados práticos?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
            Crie sua conta em menos de 1 minuto e comece a desenhar seus mapas mentais agora mesmo.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => handleOpenAuth('register')}
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Criar Conta Gratuita e Acessar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleOpenAuth('login')}
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-colors"
            >
              Já Possuo uma Conta
            </button>
          </div>
        </div>
      </section>

      {/* 11. QUIET FOOTER */}
      <footer className="py-12 bg-white text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              D
            </div>
            <span className="font-bold text-slate-800">Diorfy Studio</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Workspace Visual & Colaborativo</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#recursos" className="hover:text-slate-900 transition-colors">
              Recursos
            </a>
            <a href="#comparativo" className="hover:text-slate-900 transition-colors">
              Comparativo
            </a>
            <a href="#planos" className="hover:text-slate-900 transition-colors">
              Planos
            </a>
            <button onClick={() => handleOpenAuth('login')} className="hover:text-slate-900 transition-colors">
              Área de Membros
            </button>
            <span className="text-slate-400">© 2026 Diorfy. Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>

      {/* Interactive Video / Walkthrough Tour Modal */}
      {isDemoTourOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-blue-400 fill-blue-400" />
                <span className="font-bold text-sm">Demonstração Interativa do Diorfy Studio</span>
              </div>
              <button
                onClick={() => setIsDemoTourOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black aspect-video flex items-center justify-center">
                <img
                  src="/src/assets/images/sales_hero_canvas_1790519840611.jpg"
                  alt="Preview da Demonstração"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl mb-3">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                  <h4 className="text-base font-bold text-white">Tour Guiado: Canvas, Mapas & Ctrl+V</h4>
                  <p className="text-xs text-slate-300 max-w-md mt-1">
                    Veja como criar um projeto do zero, ramificar ideias em árvore e exportar em 4K.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <span className="font-bold text-blue-400 block mb-1">1. Ramificação Rápida</span>
                  <p className="text-slate-300 text-[11px]">Use Tab para criar nós filhos e Enter para nós irmãos.</p>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <span className="font-bold text-indigo-400 block mb-1">2. Ctrl+V Instantâneo</span>
                  <p className="text-slate-300 text-[11px]">Cole prints e imagens direto da sua área de transferência.</p>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <span className="font-bold text-emerald-400 block mb-1">3. Exportação 4K</span>
                  <p className="text-slate-300 text-[11px]">Gere PNGs em alta definição e vetores SVG perfeitos.</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsDemoTourOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    setIsDemoTourOpen(false);
                    handleOpenAuth('register');
                  }}
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <span>Acessar Plataforma Agora</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal Component */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authMode}
        selectedPlan={selectedPlanForCheckout}
      />

      {/* Checkout Modal Component */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
        planId={selectedPlanForCheckout}
        billingCycle={billingCycle}
      />
    </div>
  );
};
