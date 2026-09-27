import React from 'react';
import { Check, Sparkles, X, Shield, Zap, Users, Infinity } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const plans = [
    {
      name: 'Free',
      price: 'R$ 0',
      period: 'para sempre',
      current: true,
      description: 'Ideal para experimentação e quadros pessoais rápidos.',
      features: [
        '3 boards editáveis',
        'Templates predefinidos',
        'Visualizadores ilimitados',
        'Exportação básica',
      ],
      buttonText: 'Seu plano atual',
      buttonVariant: 'secondary',
    },
    {
      name: 'Starter',
      badge: 'Mais Popular',
      price: 'R$ 48',
      period: 'por membro / mês',
      current: false,
      description: 'Perfeito para times em crescimento que precisam de colaboração sem limites.',
      features: [
        'Boards editáveis ILIMITADOS',
        'TalkTrack gravações em vídeo',
        'Histórico de versões de boards',
        'Exportação de alta resolução (PNG / PDF)',
        'Miro AI Playground ilimitado',
        'Temporizador e Sessões de Votação',
      ],
      buttonText: 'Assinar Starter',
      buttonVariant: 'primary',
    },
    {
      name: 'Business',
      price: 'R$ 96',
      period: 'por membro / mês',
      current: false,
      description: 'Controles avançados de segurança, convidados e integrações corporativas.',
      features: [
        'Tudo do Starter',
        'Convidados externos ilimitados',
        'Single Sign-On (SSO / SAML)',
        'Permissões granulares de projeto',
        'Painel de conformidade e auditoria',
        'Suporte prioritário 24/7',
      ],
      buttonText: 'Testar Business 14 dias',
      buttonVariant: 'outline',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Planos & Preços Diorfy
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              Desbloqueie quadros infinitos e colaboração em tempo real
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-xl p-5 flex flex-col justify-between border ${
                p.current
                  ? 'border-slate-200 bg-slate-50/50'
                  : p.badge
                  ? 'border-blue-600 bg-blue-50/20 shadow-md ring-1 ring-blue-600 relative'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              {p.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold py-0.5 px-3 rounded-full shadow-sm">
                  {p.badge}
                </div>
              )}

              <div>
                <h3 className="text-base font-bold text-slate-900">{p.name}</h3>
                <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{p.description}</p>
                <div className="mt-4 mb-4 pb-4 border-b border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">{p.price}</span>
                    <span className="text-[11px] text-slate-400">{p.period}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  alert(`Plano ${p.name} do Diorfy ativado para o seu time!`);
                  onClose();
                }}
                className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all ${
                  p.buttonVariant === 'primary'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                    : p.buttonVariant === 'secondary'
                    ? 'bg-slate-200 text-slate-700 cursor-default'
                    : 'border border-slate-300 text-slate-800 hover:bg-slate-50'
                }`}
              >
                {p.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
