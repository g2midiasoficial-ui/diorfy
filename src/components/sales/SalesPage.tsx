import React, { useState } from 'react';
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

  // Billing toggle
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  // Interactive Mini-Sandbox state
  const [sandboxNotes, setSandboxNotes] = useState<
    Array<{ id: number; text: string; color: string; x: number; y: number }>
  >([
    { id: 1, text: '💡 Ideação & Estratégia Q4', color: '#FEF3C7', x: 20, y: 20 },
    { id: 2, text: '🧠 Mapa Mental do Funil de Vendas', color: '#DBEAFE', x: 220, y: 35 },
    { id: 3, text: '🚀 Copiar & Colar Prints com Ctrl+V', color: '#DCFCE7', x: 420, y: 20 },
  ]);
  const [activeNoteText, setActiveNoteText] = useState('');

  // Interactive FAQ open states
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleAddSandboxNote = () => {
    if (!activeNoteText.trim()) return;
    const colors = ['#FEF3C7', '#DBEAFE', '#DCFCE7', '#FCE7F3', '#EDE9FE'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setSandboxNotes((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: activeNoteText,
        color: randomColor,
        x: 40 + (prev.length % 3) * 190,
        y: 110 + Math.floor(prev.length / 3) * 60,
      },
    ]);
    setActiveNoteText('');
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
      q: 'Como funciona o recurso de Copiar e Colar Imagens no projeto?',
      a: 'Você pode tirar qualquer captura de tela (print com PrintScreen, Snip tool ou Mac) ou copiar uma imagem da web e pressionar Ctrl+V diretamente na tela. O Diorfy identifica o tipo de imagem e a insere imediatamente com suporte a redimensionamento, recorte e download.',
    },
    {
      q: 'O que inclui o Estúdio de Mapas Mentais com 6 Estruturas?',
      a: 'O Diorfy possui gerador de mapas mentais inteligente com estruturas Radial 360°, Árvore Horizontal, Organograma Top-Down, Diagrama Ishikawa (Espinha de Peixe), Matriz SWOT e Funil de Jornada do Cliente, com atalhos de teclado para ramificação rápida.',
    },
    {
      q: 'Posso convidar membros da minha equipe para colaborar?',
      a: 'Sim! No plano Gratuito você pode compartilhar links de visualização. Nos planos Pro e Enterprise Team, você tem colaboração em tempo real, múltiplos editores, cursores ao vivo e gerenciamento de permissões.',
    },
    {
      q: 'Existe limite de quadros ou elementos no plano Pro?',
      a: 'Não. O plano Pro Creator oferece quadros infinitos, sem limite de nós, notas adesivas, formas geométricas ou imagens, além de exportações em altíssima resolução (PNG, SVG e PDF).',
    },
    {
      q: 'Como funciona a garantia incondicional de 7 dias?',
      a: 'Se você assinar qualquer plano pago e achar que a plataforma não atendeu suas expectativas, basta solicitar o reembolso em até 7 dias com devolução integral do seu valor.',
    },
  ];

  return (
    <div className="h-screen w-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col selection:bg-blue-500 selection:text-white overflow-y-auto select-text">
      {/* 1. TOP BAR CONTRACT (Strict 3-zone layout) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
              D
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Diorfy Studio
            </span>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#recursos" className="hover:text-slate-900 transition-colors">
              Recursos
            </a>
            <a href="#mapas-mentais" className="hover:text-slate-900 transition-colors">
              Mapas Mentais
            </a>
            <a href="#demo" className="hover:text-slate-900 transition-colors">
              Demonstração
            </a>
            <a href="#planos" className="hover:text-slate-900 transition-colors">
              Planos & Preços
            </a>
            <a href="#depoimentos" className="hover:text-slate-900 transition-colors">
              Depoimentos
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
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-blue-700 mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Novo Estúdio de Mapas Mentais e Copiar/Colar Imagens 2.0</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500 font-normal">Disponível em todos os planos</span>
          </div>

          {/* Primary headline (balanced measure) */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15] text-balance">
            O Workspace Visual Inteligente para Transformar Ideias em Execução
          </h1>

          {/* Value proposition subheadline */}
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Crie mapas mentais dinâmicos, fluxogramas de alta precisão, wireframes e colabore em tempo
            real com inteligência artificial generativa e canvas infinito.
          </p>

          {/* Dual Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => handleOpenAuth('register')}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Acessar Plataforma Agora (Grátis)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#demo"
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
              <span>Ver Demonstração Interativa</span>
            </a>
          </div>

          {/* Social Proof & Metrics Adjacency */}
          <div className="mt-10 pt-6 border-t border-slate-200/80 max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-900 font-bold text-sm tabular-nums">+180%</span>
              <span>Velocidade de Planejamento</span>
            </div>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-900 font-bold text-sm tabular-nums">50.000+</span>
              <span>Quadros Criados</span>
            </div>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-900 font-bold text-sm tabular-nums">99.9%</span>
              <span>Disponibilidade Cloud</span>
            </div>
          </div>

          {/* Hero Interface Visual Asset */}
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
              <span>Canvas Infinito Ativo com Suporte a Imagens e IA</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE LIVE MINI-SANDBOX DEMO */}
      <section id="demo" className="py-16 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Experimente a velocidade da lousa interativa agora
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Adicione notas adesivas e teste a interface fluida antes de criar sua conta.
            </p>
          </div>

          {/* Interactive Sandbox Container */}
          <div className="bg-slate-100 rounded-2xl border border-slate-300 p-4 sm:p-6 shadow-inner">
            {/* Sandbox Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={activeNoteText}
                  onChange={(e) => setActiveNoteText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSandboxNote()}
                  placeholder="Digite uma ideia ou nota rápida..."
                  className="px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-72"
                />
                <button
                  onClick={handleAddSandboxNote}
                  className="px-3.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Nota</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAuth('register')}
                  className="px-3.5 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Abrir no Canvas Completo</span>
                </button>
              </div>
            </div>

            {/* Sandbox Canvas Surface */}
            <div className="relative h-64 sm:h-80 bg-[#f8fafc] rounded-xl mt-4 border border-slate-200 overflow-hidden p-4 grid-pattern">
              {sandboxNotes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    backgroundColor: note.color,
                    left: `${Math.min(note.x, 500)}px`,
                    top: `${Math.min(note.y, 180)}px`,
                  }}
                  className="absolute p-3 rounded-lg shadow-md border border-black/10 w-44 text-xs font-medium text-slate-900 cursor-move transition-all hover:scale-105"
                >
                  {note.text}
                </div>
              ))}
              <div className="absolute bottom-3 left-3 text-[11px] text-slate-400 bg-white/80 px-2.5 py-1 rounded-md border border-slate-200">
                ✨ Dica: Pressione Ctrl+V no canvas completo para colar imagens diretamente!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ASYMMETRIC BENTO GRID: 5 CAPABILITIES */}
      <section id="recursos" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Projetado para Criadores, Designers e Times de Alta Performance
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Tudo o que você precisa para estruturar pensamentos complexos em diagramas claros e acionáveis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1 (Span 2) */}
            <div className="md:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
                  01. Mapas Mentais Estruturados
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1 mb-2">
                  6 Formatos Inteligentes para Qualquer Tipo de Pensamento
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                  Gere mapas mentais radiais, diagramas em espinha de peixe (Ishikawa), organogramas
                  verticais e funis de jornada com criação de nós com tecla Tab e Enter.
                </p>
              </div>
              <div className="mt-6 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src="/src/assets/images/sales_mindmap_diagram_1790519861864.jpg"
                  alt="Diagrama de Mapa Mental 3D"
                  referrerPolicy="no-referrer"
                  className="w-full h-56 object-cover"
                />
              </div>
            </div>

            {/* Bento Card 2 (Span 1) */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">
                  02. Copiar & Colar 2.0
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">
                  Cole Imagens com Ctrl+V Instantâneo
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tire prints de telas ou copie URLs de imagens na web e cole diretamente no local
                  onde o ponteiro do mouse está posicionado.
                </p>
              </div>
              <div className="mt-6 p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900">
                  <Copy className="w-4 h-4 text-indigo-600" />
                  <span>Clipboard Inteligente</span>
                </div>
                <div className="text-[11px] text-indigo-700">
                  Suporta PNG, JPEG, WebP, SVG e dados estruturados entre diferentes navegadores.
                </div>
              </div>
            </div>

            {/* Bento Card 3 (Span 1) */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">
                  03. Formas & Engenharia
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">
                  Mais de 30 Formas & Símbolos
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cubos 3D, bancos de dados em camadas, chevrons de etapas, chaves agrupadoras e
                  símbolos de arquitetura de software.
                </p>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2 pt-2">
                {['Cubo 3D', 'Banco DB', 'Engrenagem', 'Tag', 'Escudo', 'Chevron', 'Chaves {}', 'Decisão'].map(
                  (shape, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-700 text-center truncate"
                    >
                      {shape}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Bento Card 4 (Span 2) */}
            <div className="md:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-violet-600 tracking-wider uppercase">
                  04. Colaboração em Equipe
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1 mb-2">
                  Sincronização em Tempo Real para Times Remotos
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                  Cursores dinâmicos, comentários contextualizados, modo de apresentação com frames e
                  compartilhamento de quadros por link seguro.
                </p>
              </div>
              <div className="mt-6 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src="/src/assets/images/sales_collaboration_1790519852191.jpg"
                  alt="Colaboração de equipe em workspace moderno"
                  referrerPolicy="no-referrer"
                  className="w-full h-56 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CASE STUDIES & QUANTITATIVE SOCIAL PROOF */}
      <section id="depoimentos" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Resultados Comprovados por Times de Produto e Marketing
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Como empresas e criadores aceleram entregas com o Diorfy Studio.
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

      {/* 6. PRICING & TIERS SECTION */}
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
                Começar Grátis
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
                <span>Assinar Plano Pro Agora</span>
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
                Contratar para Minha Empresa
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE FAQ ACCORDION */}
      <section id="faq" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Perguntas Frequentes
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Tire suas dúvidas sobre recursos, planos e segurança.
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

      {/* 8. FINAL HIGH-IMPACT CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Pronto para revolucionar a forma como você planeja e cria?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
            Junte-se a milhares de profissionais e experimente o poder do Diorfy Studio agora mesmo.
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

      {/* 9. QUIET FOOTER */}
      <footer className="py-12 bg-white text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              D
            </div>
            <span className="font-bold text-slate-800">Diorfy Studio</span>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <span>Workspace Visual & Colaborativo</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#recursos" className="hover:text-slate-900 transition-colors">
              Recursos
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
