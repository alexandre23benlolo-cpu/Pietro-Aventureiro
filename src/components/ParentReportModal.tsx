import React, { useEffect } from 'react';
import { X, RotateCcw, CheckCircle2 } from 'lucide-react';
import { PlayerStats } from '../types/math';
import { soundCtrl } from '../utils/audio';

interface ParentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  onResetStats: () => void;
}

export const ParentReportModal: React.FC<ParentReportModalProps> = ({
  isOpen,
  onClose,
  stats,
  onResetStats,
}) => {
  const [isConfirmingReset, setIsConfirmingReset] = React.useState<boolean>(false);

  const handleClose = () => {
    soundCtrl.playClick(350);
    setIsConfirmingReset(false);
    onClose();
  };

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const totalAnswered = stats.totalQuestionsAnswered;
  const totalCorrect = stats.totalCorrect;
  const overallAccuracy =
    totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const ops = [
    { key: '+', label: 'Adição (Soma)', color: 'text-emerald-400', bar: 'bg-emerald-500' },
    { key: '-', label: 'Subtração (Menos)', color: 'text-amber-400', bar: 'bg-amber-500' },
    { key: '×', label: 'Multiplicação (Tabuada)', color: 'text-cyan-400', bar: 'bg-cyan-500' },
    { key: '÷', label: 'Divisão', color: 'text-rose-400', bar: 'bg-rose-500' },
  ] as const;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-pop"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-slate-900 border-2 border-cyan-400/40 rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl relative text-white flex flex-col max-h-[90vh]">
        {/* Top Header with prominent Close button */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">📊</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-cyan-300 leading-tight">
                Painel dos Pais
              </h2>
              <p className="text-xs text-slate-300">
                Acompanhe o desenvolvimento matemático
              </p>
            </div>
          </div>

          {/* Primary Top Close Button - Big & Unmissable */}
          <button
            type="button"
            onClick={handleClose}
            className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-rose-500/30 hover:border-rose-400/50 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 transition active:scale-95 shadow-sm"
            title="Fechar Painel dos Pais"
            aria-label="Fechar Painel dos Pais"
          >
            <X className="w-4 h-4 text-cyan-300" />
            <span>Fechar</span>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Overview KPI Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
              <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider block">
                Respondidas
              </span>
              <span className="text-xl sm:text-2xl font-black text-white tabular-nums">
                {totalAnswered}
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
              <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider block">
                Precisão Geral
              </span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 tabular-nums">
                {overallAccuracy}%
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
              <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider block">
                Recorde Combo
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 tabular-nums">
                {stats.highestStreak}x
              </span>
            </div>
          </div>

          {/* Per-operation breakdown */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Desempenho por Operação
            </h3>
            {ops.map((item) => {
              const data = stats.operationsBreakdown[item.key] || { correct: 0, total: 0 };
              const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
              return (
                <div key={item.key} className="bg-white/5 rounded-2xl p-3 border border-white/5">
                  <div className="flex justify-between items-center text-xs mb-1.5 font-semibold">
                    <span className={item.color}>{item.label}</span>
                    <span className="text-slate-300 tabular-nums">
                      {data.correct}/{data.total} acertos ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className={`${item.bar} h-full transition-all duration-500 rounded-full`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Guidance tip */}
          <div className="bg-indigo-950/60 border border-indigo-500/30 rounded-2xl p-3.5 text-xs text-indigo-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <p>
              <strong>Dica Pedagógica:</strong> Nos níveis iniciais, incentive a criança a usar o botão &ldquo;Ver com Desenhos&rdquo; para relacionar a quantidade visual ao símbolo numérico.
            </p>
          </div>
        </div>

        {/* Fixed Bottom Action Bar with Big Prominent FECHAR Button */}
        <div className="pt-3.5 border-t border-white/10 mt-3 flex items-center justify-between gap-3 shrink-0">
          {!isConfirmingReset ? (
            <button
              type="button"
              onClick={() => setIsConfirmingReset(true)}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition py-2 px-2.5 rounded-xl hover:bg-rose-500/10"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Zerar Histórico</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 p-1.5 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs">
              <span className="text-rose-200 font-semibold">Zerar histórico?</span>
              <button
                type="button"
                onClick={() => {
                  soundCtrl.playWrong();
                  onResetStats();
                  setIsConfirmingReset(false);
                }}
                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition"
              >
                Sim, Zerar
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmingReset(false)}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 text-slate-300 rounded-lg transition"
              >
                Cancelar
              </button>
            </div>
          )}

          {/* Big high-contrast close button, guaranteed visible */}
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-sm shadow-xl transition transform active:scale-95 flex items-center gap-2"
          >
            <X className="w-4 h-4 stroke-[3]" />
            <span>Fechar Painel</span>
          </button>
        </div>
      </div>
    </div>
  );
};
