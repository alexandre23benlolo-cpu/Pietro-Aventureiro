import React, { useState, useEffect } from 'react';
import { X, Trophy, Trash2, Search, RotateCcw, AlertTriangle } from 'lucide-react';
import { Operation, RankingEntry } from '../types/math';
import { soundCtrl } from '../utils/audio';

interface RankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rankings: RankingEntry[];
  onClearRanking: () => void;
  onDeleteRankingEntry?: (id: string) => void;
}

export const RankingModal: React.FC<RankingModalProps> = ({
  isOpen,
  onClose,
  rankings,
  onClearRanking,
  onDeleteRankingEntry,
}) => {
  const [filterOp, setFilterOp] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isConfirmingClear, setIsConfirmingClear] = useState<boolean>(false);

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

  const handleClose = () => {
    soundCtrl.playClick(350);
    setIsConfirmingClear(false);
    onClose();
  };

  const handleResetFilters = () => {
    soundCtrl.playClick(400);
    setFilterOp('all');
    setSearchQuery('');
  };

  const isFilterActive = filterOp !== 'all' || searchQuery.trim().length > 0;

  // Filter rankings by operation and competitor name
  const filtered = rankings
    .filter((r) => {
      const matchesOp = filterOp === 'all' || r.operation === filterOp;
      const matchesQuery =
        searchQuery.trim() === '' ||
        r.playerName.toLowerCase().includes(searchQuery.trim().toLowerCase());
      return matchesOp && matchesQuery;
    })
    .sort((a, b) => b.score - a.score);

  const getOpBadge = (op: Operation) => {
    switch (op) {
      case '+':
        return { label: 'Adição (+)', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' };
      case '-':
        return { label: 'Subtração (-)', bg: 'bg-amber-500/20 text-amber-300 border-amber-400/30' };
      case '×':
        return { label: 'Multiplicação (×)', bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30' };
      case '÷':
        return { label: 'Divisão (÷)', bg: 'bg-rose-500/20 text-rose-300 border-rose-400/30' };
      case 'mix':
        return { label: 'Misto (⭐)', bg: 'bg-purple-500/20 text-purple-300 border-purple-400/30' };
      default:
        return { label: op, bg: 'bg-white/10 text-white border-white/20' };
    }
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return { icon: '🥇', label: '1º Lugar', color: 'bg-yellow-400/20 text-yellow-300 border-yellow-400' };
    if (index === 1) return { icon: '🥈', label: '2º Lugar', color: 'bg-slate-300/20 text-slate-200 border-slate-300' };
    if (index === 2) return { icon: '🥉', label: '3º Lugar', color: 'bg-amber-700/20 text-amber-300 border-amber-600' };
    return { icon: `#${index + 1}`, label: `${index + 1}º`, color: 'bg-white/5 text-slate-400 border-white/10' };
  };

  const handleConfirmClear = () => {
    soundCtrl.playWrong();
    onClearRanking();
    setIsConfirmingClear(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-pop"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-slate-900 border-2 border-yellow-400/50 rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl relative text-white flex flex-col max-h-[90vh]">
        {/* Top bar with Title and explicit Close 'X' Button */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-300 text-xl shadow-inner">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-yellow-300 leading-tight">
                Ranking dos Campeões
              </h2>
              <p className="text-xs text-indigo-200">
                Placar das crianças na Aventura Matemática
              </p>
            </div>
          </div>

          {/* Primary Top Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-rose-500/30 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 transition active:scale-95"
            title="Fechar Ranking"
            aria-label="Fechar Ranking"
          >
            <X className="w-4 h-4 text-yellow-300" />
            <span>Fechar</span>
          </button>
        </div>

        {/* Competitor Search & Clear Filter Bar */}
        <div className="space-y-2 mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar competidor pelo nome (ex: Pietro, Sofia)..."
                className="w-full bg-slate-800/90 border border-white/15 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-yellow-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                  title="Limpar busca"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Clear Filter Button if active */}
            {isFilterActive && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                title="Limpar todos os filtros e mostrar todos os competidores"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpar Filtro</span>
              </button>
            )}
          </div>

          {/* Operation Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'Todos' },
              { id: '+', label: '➕ Adição' },
              { id: '-', label: '➖ Subtração' },
              { id: '×', label: '✖️ Tabuada' },
              { id: '÷', label: '➗ Divisão' },
              { id: 'mix', label: '🌟 Misto' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  soundCtrl.playClick(440);
                  setFilterOp(tab.id);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                  filterOp === tab.id
                    ? 'bg-yellow-400 text-purple-950 shadow-sm scale-102'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ranking List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[200px]">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400 bg-white/5 rounded-2xl border border-white/5 p-4">
              <span className="text-4xl block mb-2 opacity-60">🏆</span>
              <p className="font-semibold text-sm">Nenhum competidor encontrado nesta categoria!</p>
              <p className="text-xs text-slate-400 mt-1">
                {isFilterActive
                  ? 'Tente limpar o filtro de competidores para ver todos os placares.'
                  : 'Complete uma missão matemática para registrar seu nome no ranking!'}
              </p>
              {isFilterActive && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-3 px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-purple-950 font-bold text-xs transition"
                >
                  Limpar Filtro e Mostrar Todos
                </button>
              )}
            </div>
          ) : (
            filtered.map((entry, idx) => {
              const rank = getRankBadge(idx);
              const op = getOpBadge(entry.operation);
              const isPietro = entry.playerName.toLowerCase() === 'pietro';

              return (
                <div
                  key={entry.id || idx}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    idx === 0
                      ? 'bg-gradient-to-r from-yellow-500/15 via-amber-500/10 to-yellow-500/5 border-yellow-400/50 shadow-md'
                      : idx === 1
                      ? 'bg-white/10 border-slate-300/40'
                      : idx === 2
                      ? 'bg-white/5 border-amber-600/40'
                      : 'bg-white/5 border-white/5'
                  }`}
                >
                  {/* Left: Position & Player Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center font-black text-sm shrink-0 ${rank.color}`}
                    >
                      {rank.icon}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg">{entry.heroEmoji}</span>
                        <h4 className="font-black text-base text-white truncate">
                          {entry.playerName}
                        </h4>
                        {isPietro && (
                          <span className="bg-yellow-400/30 text-yellow-300 text-[10px] px-1.5 py-0.5 rounded-md font-bold">
                            Herói
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${op.bg}`}>
                          {op.label}
                        </span>
                        {entry.streak > 1 && (
                          <span className="text-[10px] text-amber-300 font-bold">
                            🔥 {entry.streak}x
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Score & optional individual delete */}
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-black text-yellow-300 tabular-nums">
                        {entry.score}
                        <span className="text-xs font-semibold text-yellow-200/80 ml-0.5">pts</span>
                      </div>
                      <div className="text-[11px] text-emerald-400 font-semibold">
                        {entry.accuracy}% acertos
                      </div>
                    </div>

                    {onDeleteRankingEntry && (
                      <button
                        type="button"
                        onClick={() => onDeleteRankingEntry(entry.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Remover esta pontuação"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Actions */}
        <div className="pt-3.5 border-t border-white/10 mt-3 flex flex-wrap items-center justify-between gap-2 shrink-0">
          {/* Reliable In-App Confirmation (no window.confirm which is blocked in iframes) */}
          {rankings.length > 0 && !isConfirmingClear && (
            <button
              type="button"
              onClick={() => setIsConfirmingClear(true)}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition py-2 px-3 rounded-xl hover:bg-rose-500/10"
              title="Limpar todos os competidores do ranking"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar Placar</span>
            </button>
          )}

          {isConfirmingClear && (
            <div className="flex items-center gap-2 p-1.5 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs animate-pop">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-rose-200 font-semibold">Zerar todos?</span>
              <button
                type="button"
                onClick={handleConfirmClear}
                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition"
              >
                Sim, Limpar
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmingClear(false)}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 text-slate-300 rounded-lg transition"
              >
                Cancelar
              </button>
            </div>
          )}

          {/* Guaranteed big close button */}
          <button
            type="button"
            onClick={handleClose}
            className="ml-auto px-6 py-2.5 rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-purple-950 font-black text-sm shadow-lg transition transform active:scale-95 flex items-center gap-2"
          >
            <X className="w-4 h-4 stroke-[3]" />
            <span>Fechar Ranking</span>
          </button>
        </div>
      </div>
    </div>
  );
};
