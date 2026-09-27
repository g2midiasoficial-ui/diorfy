import React, { useState } from 'react';
import { Vote, X, Check, Trophy, Sparkles } from 'lucide-react';
import { CanvasElement } from '../../types/miro';
import confetti from 'canvas-confetti';

interface VotingWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  elements: CanvasElement[];
  isVotingActive: boolean;
  onStartVoting: (votesPerPerson: number) => void;
  onEndVoting: () => void;
}

export const VotingWidget: React.FC<VotingWidgetProps> = ({
  isOpen,
  onClose,
  elements,
  isVotingActive,
  onStartVoting,
  onEndVoting,
}) => {
  const [votesPerPerson, setVotesPerPerson] = useState(3);
  const [showResults, setShowResults] = useState(false);

  if (!isOpen) return null;

  // Filter elements that have votes
  const votedItems = elements
    .filter((el) => (el.style.votes || 0) > 0)
    .sort((a, b) => (b.style.votes || 0) - (a.style.votes || 0));

  const handleEndSession = () => {
    onEndVoting();
    setShowResults(true);
    try {
      confetti({ particleCount: 80, spread: 60 });
    } catch {}
  };

  return (
    <div className="absolute top-16 right-36 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-40 w-80 select-none animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
            <Vote className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-900">Sessão de Votação (Dot Voting)</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {showResults ? (
        /* Results View */
        <div className="py-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-purple-700 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              Resultado da Votação
            </span>
            <button
              onClick={() => setShowResults(false)}
              className="text-[11px] text-blue-600 hover:underline"
            >
              Nova sessão
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {votedItems.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">
                Nenhum voto foi registrado nesta sessão.
              </p>
            ) : (
              votedItems.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    idx === 0
                      ? 'bg-amber-50/50 border-amber-200 ring-1 ring-amber-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        idx === 0
                          ? 'bg-amber-400 text-amber-950'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-800'
                          : 'bg-orange-300 text-orange-950'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-800 truncate font-medium">
                      {item.content || 'Sem texto'}
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-purple-700 shrink-0 ml-2 bg-purple-100 px-2 py-0.5 rounded-full">
                    {item.style.votes} {item.style.votes === 1 ? 'voto' : 'votos'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      ) : isVotingActive ? (
        /* Active Voting Session Status */
        <div className="py-3 space-y-3">
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 leading-relaxed">
            <p className="font-bold mb-1">● Votação em andamento!</p>
            <p>Clique em qualquer nota adesiva no quadro para adicionar seus votos.</p>
          </div>

          <button
            onClick={handleEndSession}
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            Encerrar e Ver Resultados
          </button>
        </div>
      ) : (
        /* Setup New Session */
        <div className="py-3 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Votos por participante
            </label>
            <div className="flex items-center gap-2">
              {[1, 3, 5, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setVotesPerPerson(num)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    votesPerPerson === num
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-tight">
            Cada membro da equipe poderá distribuir seus pontos entre as notas adesivas para priorização ágil.
          </p>

          <button
            onClick={() => onStartVoting(votesPerPerson)}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            Iniciar Votação
          </button>
        </div>
      )}
    </div>
  );
};
