import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Volume2, Bell } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TimerWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TimerWidget: React.FC<TimerWidgetProps> = ({ isOpen, onClose }) => {
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 min default
  const [isRunning, setIsRunning] = useState(false);
  const [initialSeconds, setInitialSeconds] = useState(300);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch {}
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  if (!isOpen) return null;

  const setTimerPreset = (secs: number) => {
    setIsRunning(false);
    setInitialSeconds(secs);
    setSecondsLeft(secs);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progress = initialSeconds > 0 ? (secondsLeft / initialSeconds) * 100 : 0;

  return (
    <div className="absolute top-16 right-20 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-40 w-72 select-none animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold text-slate-900">Temporizador de Sessão</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Clock Display */}
      <div className="py-4 flex flex-col items-center justify-center">
        <span
          className={`text-4xl font-extrabold font-mono tracking-tight ${
            secondsLeft <= 30 && secondsLeft > 0
              ? 'text-rose-600 animate-pulse'
              : 'text-slate-900'
          }`}
        >
          {formattedTime}
        </span>
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              secondsLeft <= 30 ? 'bg-rose-500' : 'bg-blue-600'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all ${
            isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isRunning ? 'Pausar' : 'Iniciar'}</span>
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setSecondsLeft(initialSeconds);
          }}
          className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          title="Reiniciar"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Presets */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
        {[
          { label: '1m', secs: 60 },
          { label: '3m', secs: 180 },
          { label: '5m', secs: 300 },
          { label: '10m', secs: 600 },
        ].map((p) => (
          <button
            key={p.label}
            onClick={() => setTimerPreset(p.secs)}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              initialSeconds === p.secs
                ? 'bg-blue-50 text-blue-600 font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
};
