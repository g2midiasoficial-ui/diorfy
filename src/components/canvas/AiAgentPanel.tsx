import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  X,
  Send,
  Wand2,
  Lightbulb,
  Layers,
  Network,
  Film,
  Check,
  ArrowRight,
  UserCheck,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { CanvasElement, CanvasFrame } from '../../types/miro';
import { generateBoardWithAI } from '../../utils/aiService';
import confetti from 'canvas-confetti';

interface AiAgentPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyElements: (newElements: CanvasElement[], newFrames?: CanvasFrame[]) => void;
  onOpenSlideMotionStudio: () => void;
  currentElementsCount: number;
}

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  actionProposal?: {
    type: 'slides' | 'mindmap' | 'brainstorm' | 'personas' | 'swot' | 'flowchart';
    title: string;
    description: string;
    topic: string;
  };
  timestamp: string;
}

export const AiAgentPanel: React.FC<AiAgentPanelProps> = ({
  isOpen,
  onClose,
  onApplyElements,
  onOpenSlideMotionStudio,
  currentElementsCount,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: 'Olá! Sou seu **Agente Diorfy AI**. Posso sugerir ideias, criar notas adesivas, mapas mentais, personas ou montar apresentações de slides com motion design instantaneamente. O que você gostaria de criar hoje?',
      timestamp: 'Agora',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  if (!isOpen) return null;

  const quickPills = [
    { label: '🎬 Montar Slides Motion Design', prompt: 'Crie uma apresentação de 4 slides sobre estratégia digital' },
    { label: '🧠 Mapa Mental', prompt: 'Gere um mapa mental para lançamento de um produto' },
    { label: '📝 6 Post-its de Brainstorming', prompt: 'Faça um brainstorming de ideias para engajamento de usuários' },
    { label: '👥 Personas de Usuários', prompt: 'Crie 2 personas completas para aplicativo mobile' },
    { label: '📊 Matriz SWOT', prompt: 'Monte uma análise SWOT para expansão de mercado' },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'Agora',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsThinking(true);

    try {
      // Determine action type from text
      const lower = text.toLowerCase();
      let actionType: 'slides' | 'mindmap' | 'brainstorm' | 'personas' | 'swot' | 'flowchart' = 'brainstorm';
      let title = 'Brainstorming Estratégico';

      if (lower.includes('slide') || lower.includes('apresenta') || lower.includes('motion')) {
        actionType = 'slides';
        title = 'Montagem de Slides com Motion Design';
      } else if (lower.includes('mapa') || lower.includes('mindmap') || lower.includes('fluxo')) {
        actionType = 'mindmap';
        title = 'Mapa Mental Conectado';
      } else if (lower.includes('persona') || lower.includes('cliente') || lower.includes('usuario')) {
        actionType = 'personas';
        title = 'Personas de Público-Alvo';
      } else if (lower.includes('swot') || lower.includes('fofa') || lower.includes('analise')) {
        actionType = 'swot';
        title = 'Matriz SWOT Completa';
      }

      // Try server AI agent or local smart reasoning
      const res = await fetch('/api/ai/agent-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          boardContext: { elementsCount: currentElementsCount },
        }),
      });

      const data = await res.json();
      const replyText = data.reply || `Analisei seu pedido sobre "${text}". Estruturei um plano visual pronto para ser inserido na sua lousa.`;

      const agentMsg: Message = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: replyText,
        actionProposal: {
          type: actionType,
          title,
          description: `Gerar blocos visuais e notas adesivas automáticas para "${text}"`,
          topic: text,
        },
        timestamp: 'Agora',
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: Message = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: `Com certeza! Preparei uma estrutura completa para "${text}". Clique no botão abaixo para adicionar ao seu canvas.`,
        actionProposal: {
          type: 'brainstorm',
          title: 'Ideias Prontas',
          description: `Adicionar elementos no quadro para "${text}"`,
          topic: text,
        },
        timestamp: 'Agora',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleExecuteAction = async (proposal: NonNullable<Message['actionProposal']>) => {
    if (proposal.type === 'slides') {
      onOpenSlideMotionStudio();
      onClose();
      return;
    }

    try {
      const generated = await generateBoardWithAI({
        type: proposal.type === 'personas' ? 'user_persona' : proposal.type === 'swot' ? 'swot' : proposal.type === 'mindmap' ? 'mindmap' : 'brainstorm',
        topic: proposal.topic,
      });

      onApplyElements(generated.elements, generated.frames);
      try {
        confetti({ particleCount: 40, spread: 60 });
      } catch {}
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed right-4 bottom-16 top-16 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in slide-in-from-right select-none"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold">Agente Diorfy AI</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-blue-100">Copilot interativo para lousa e apresentações</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8fafc]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3 rounded-2xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs'
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-xs'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>

              {/* Action Proposal Card */}
              {m.actionProposal && (
                <div className="mt-2.5 p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/80 rounded-xl text-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[11px] text-blue-900 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-blue-600" />
                      {m.actionProposal.title}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 mb-2">{m.actionProposal.description}</p>
                  <button
                    onClick={() => handleExecuteAction(m.actionProposal!)}
                    className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{m.actionProposal.type === 'slides' ? 'Abrir Estúdio de Slides' : 'Adicionar ao Quadro'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <span className="text-[9px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-slate-500 text-xs p-2 bg-white rounded-xl border border-slate-200 w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
            <span>Agente pensando e estruturando...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto flex gap-1.5 no-scrollbar">
        {quickPills.map((pill, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(pill.prompt)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-full text-[10px] font-semibold whitespace-nowrap transition-colors border border-slate-200/60 shrink-0"
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Peça algo ao Agente (ex: criar 5 slides, mapa mental...)"
          className="flex-1 text-xs border border-slate-200 focus:border-blue-500 rounded-xl px-3 py-2.5 outline-none bg-slate-50 focus:bg-white transition-colors"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim()}
          className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
          title="Enviar"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
