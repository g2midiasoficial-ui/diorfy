import React, { useState } from 'react';
import {
  X,
  Check,
  CreditCard,
  QrCode,
  FileText,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserPlan } from '../../types/auth';
import { updateUserPlan, getCurrentUser } from '../../utils/auth';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (plan: UserPlan) => void;
  planId: UserPlan;
  billingCycle: 'monthly' | 'annual';
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  planId,
  billingCycle,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'boleto'>('pix');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [buyerName, setBuyerName] = useState('G2 Mídias');
  const [buyerEmail, setBuyerEmail] = useState('g2midiasoficial@gmail.com');
  const [buyerCpf, setBuyerCpf] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);

  if (!isOpen) return null;

  const planName = planId === 'team' ? 'Plano Enterprise Team' : 'Plano Pro Creator';
  const price =
    planId === 'team'
      ? billingCycle === 'annual'
        ? 'R$ 854,00 / ano'
        : 'R$ 89,00 / mês'
      : billingCycle === 'annual'
      ? 'R$ 374,00 / ano'
      : 'R$ 39,00 / mês';

  const mockPixKey = '00020126580014br.gov.bcb.pix0136diorfy-workspace-pix-access-key5204000053039865802BR5915DIORFY WORKSPACE6009SAO PAULO62070503***6304ABCD';

  const handleCopyPix = () => {
    navigator.clipboard.writeText(mockPixKey);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2500);
  };

  const handleCompletePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      updateUserPlan(planId, billingCycle);

      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      onSuccess(planId);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              D
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 leading-tight">
                Finalizar Assinatura {planName}
              </h3>
              <p className="text-xs text-neutral-500">
                Acesso imediato e garantia incondicional de 7 dias
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Summary Box */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl border border-blue-100 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  {planName}
                </span>
                <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  {billingCycle === 'annual' ? 'Anual (20% OFF)' : 'Mensal'}
                </span>
              </div>
              <p className="text-xs text-neutral-600 mt-0.5">
                Liberação instantânea com IA Copilot, Mapas Mentais e Quadros Ilimitados.
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-neutral-900 block">{price}</span>
              <span className="text-[10px] text-neutral-500">Sem taxa de adesão</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-2">
              Forma de Pagamento
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  paymentMethod === 'pix'
                    ? 'border-blue-600 bg-blue-50/60 text-blue-700 shadow-sm'
                    : 'border-neutral-200 hover:border-neutral-300 text-neutral-600 bg-white'
                }`}
              >
                <QrCode className="w-5 h-5 text-emerald-600" />
                <span>PIX Instantâneo</span>
                <span className="text-[9px] text-emerald-600 font-bold">Aprovação imediata</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  paymentMethod === 'credit_card'
                    ? 'border-blue-600 bg-blue-50/60 text-blue-700 shadow-sm'
                    : 'border-neutral-200 hover:border-neutral-300 text-neutral-600 bg-white'
                }`}
              >
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span>Cartão de Crédito</span>
                <span className="text-[9px] text-neutral-500">Até 12x</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('boleto')}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  paymentMethod === 'boleto'
                    ? 'border-blue-600 bg-blue-50/60 text-blue-700 shadow-sm'
                    : 'border-neutral-200 hover:border-neutral-300 text-neutral-600 bg-white'
                }`}
              >
                <FileText className="w-5 h-5 text-amber-600" />
                <span>Boleto Bancário</span>
                <span className="text-[9px] text-neutral-500">1 a 2 dias</span>
              </button>
            </div>
          </div>

          {/* Form depending on method */}
          <form onSubmit={handleCompletePurchase} className="space-y-4">
            {paymentMethod === 'pix' && (
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-center space-y-3">
                <div className="w-36 h-36 mx-auto bg-white p-2 rounded-lg border border-neutral-300 shadow-sm flex items-center justify-center">
                  <div className="w-full h-full bg-neutral-900 p-1 flex items-center justify-center rounded">
                    <QrCode className="w-28 h-28 text-white" />
                  </div>
                </div>
                <p className="text-xs text-neutral-600">
                  Escaneie o QR Code no seu aplicativo do banco ou copie a chave Pix Copia e Cola:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={mockPixKey}
                    className="w-full text-[11px] bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 text-neutral-500 truncate"
                  />
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-medium hover:bg-neutral-800 transition-colors shrink-0"
                  >
                    {pixCopied ? 'Copiado!' : 'Copiar Pix'}
                  </button>
                </div>
              </div>
            )}

            {paymentMethod === 'credit_card' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Número do Cartão
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    required
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Nome Impresso no Cartão
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="NOME COMPLETO"
                    required
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Validade
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/AA"
                      required
                      className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      CVV / CVC
                    </label>
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      maxLength={4}
                      required
                      className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'boleto' && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
                <p className="font-semibold">Informação sobre o Boleto:</p>
                <p>
                  O boleto será gerado no seu e-mail ({buyerEmail}) com vencimento para 3 dias úteis.
                </p>
              </div>
            )}

            {/* Buyer Info */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Nome do Titular
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  E-mail para Recebimento
                </label>
                <input
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl"
                />
              </div>
            </div>

            {/* Trust & Guarantee */}
            <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-100">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Pagamento 100% Seguro SSL 256-bit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-blue-600" />
                <span>Garantia 7 Dias</span>
              </div>
            </div>

            {/* Action button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {paymentMethod === 'pix'
                      ? 'Confirmar Pagamento PIX e Acessar'
                      : 'Confirmar Assinatura Agora'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
