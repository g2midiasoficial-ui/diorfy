import React, { useState } from 'react';
import { Sparkles, X, Lightbulb, Network, BarChart3, Workflow, ListChecks, ArrowRight, Loader2 } from 'lucide-react';
import { generateBoardWithAI, AIGenerationRequest } from '../../utils/aiService';
import { CanvasElement, CanvasFrame } from '../../types/miro';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyAIGenerated: (elements: CanvasElement[], frames: CanvasFrame[], title?: string) => void;
}

export const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose, onApplyAIGenerated }) => {
  const [topic, setTopic] = useState('');
  const [selectedType, setSelectedType] = useState<AIGenerationRequest['type']>('brainstorm');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const presets = [
    {
      type: 'brainstorm' as const,
      title: 'Brainstorming de Ideias',
      desc: 'Notas adesivas categorizadas com soluções criativas',
      icon: <Lightbulb className="w-4 h-4 text-amber-500" />,
      example: 'Como aumentar a retenção de clientes em 30%',
    },
    {
      type: 'mindmap' as const,
      title: 'Mapa Mental Expandido',
      desc: 'Nó central com ramificações estratégicas conectadas',
      icon: <Network className="w-4 h-4 text-blue-500" />,
      example: 'Lançamento de Produto SaaS B2B',
    },
    {
      type: 'swot' as const,
      title: 'Matriz SWOT / FOFA',
      desc: 'Forças, Fraquezas, Oportunidades e Ameaças',
      icon: <BarChart3 className="w-4 h-4 text-emerald-500" />,
      example: 'Expansão da empresa para o mercado internacional',
    },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    try {
      const result = await generateBoardWithAI({
        type: selectedType,
        topic: topic.trim(),
      });
      onApplyAIGenerated(result.elements, result.frames, result.title);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in select-none">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Diorfy AI Assistant</h3>
              <p className="text-xs text-slate-500">Crie diagramas e ideias instantaneamente</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white/80 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleGenerate} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Escolha o formato de saída
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {presets.map((p) => (
                <div
                  key={p.type}
                  onClick={() => setSelectedType(p.type)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedType === p.type
                      ? 'border-blue-600 bg-blue-50/30 shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="mb-1.5">{p.icon}</div>
                  <p className="text-xs font-bold text-slate-900">{p.title}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Sobre qual tema ou desafio você quer trabalhar?
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Como otimizar nosso funil de conversão no mobile, Ideias para nova funcionalidade de pagamentos..."
              rows={3}
              className="w-full text-xs border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl p-3 outline-none resize-none placeholder:text-slate-400"
            />
          </div>

          {/* Quick prompt suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-600">Sugestões:</span>
            {[
              'Estratégia de Marketing Digital',
              'Otimização de Processos do Time',
              'Lançamento de Produto Q4',
            ].map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => setTopic(sug)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!topic.trim() || isGenerating}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Gerando com Miro AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Inserir no Quadro</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
