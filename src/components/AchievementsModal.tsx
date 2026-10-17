import React, { useEffect } from 'react';
import { X, Trophy, Lock } from 'lucide-react';
import { INITIAL_ACHIEVEMENTS } from '../utils/mathGenerator';
import { soundCtrl } from '../utils/audio';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedIds: string[];
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  unlockedIds,
}) => {
  const handleClose = () => {
    soundCtrl.playClick(350);
    onClose();
  };

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

  const total = INITIAL_ACHIEVEMENTS.length;
  const unlockedCount = unlockedIds.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-pop"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-slate-900 border-2 border-amber-400/40 rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl relative text-white flex flex-col max-h-[90vh]">
        {/* Top Header with title and explicit Close button */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-yellow-300 leading-tight">
                Medalhas do Herói
              </h2>
              <p className="text-xs text-slate-300">
                <strong className="text-amber-400">{unlockedCount}</strong> de {total} medalhas desbloqueadas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-rose-500/30 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 transition active:scale-95"
            title="Fechar Medalhas"
            aria-label="Fechar Medalhas"
          >
            <X className="w-4 h-4 text-amber-300" />
            <span>Fechar</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/10 h-2 rounded-full mb-3 shrink-0 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full transition-all duration-500 rounded-full"
            style={{ width: `${(unlockedCount / total) * 100}%` }}
          />
        </div>

        {/* Scrollable Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1 overflow-y-auto pr-1">
          {INITIAL_ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlockedIds.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                  isUnlocked
                    ? 'bg-amber-400/10 border-amber-400/40 text-amber-200 shadow-sm'
                    : 'bg-white/5 border-white/5 text-slate-500 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                    isUnlocked ? 'bg-amber-400/20 shadow-inner' : 'bg-slate-800'
                  }`}
                >
                  {isUnlocked ? ach.icon : <Lock className="w-5 h-5 text-slate-600" />}
                </div>
                <div className="min-w-0">
                  <h4 className={`text-sm font-bold truncate ${isUnlocked ? 'text-yellow-300' : 'text-slate-400'}`}>
                    {ach.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-tight mt-0.5">
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guaranteed Bottom Close Button */}
        <div className="pt-3.5 border-t border-white/10 mt-3 flex justify-end shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-purple-950 font-black text-sm shadow-lg transition active:scale-95 flex items-center gap-2"
          >
            <X className="w-4 h-4 stroke-[3]" />
            <span>Fechar Medalhas</span>
          </button>
        </div>
      </div>
    </div>
  );
};
