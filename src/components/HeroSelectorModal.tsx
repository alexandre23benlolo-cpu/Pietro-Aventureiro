import React, { useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { HEROES } from '../utils/mathGenerator';
import { HeroCharacter } from '../types/math';
import { soundCtrl } from '../utils/audio';

interface HeroSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedHeroId: string;
  onSelectHero: (hero: HeroCharacter) => void;
}

export const HeroSelectorModal: React.FC<HeroSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedHeroId,
  onSelectHero,
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-pop"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-slate-900 border-2 border-indigo-400/40 rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl relative text-white flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl animate-float">🦸‍♂️</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-yellow-300 leading-tight">
                Escolha seu Herói
              </h2>
              <p className="text-xs text-indigo-200">
                Quem vai acompanhar você nesta jornada?
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-rose-500/30 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 transition active:scale-95"
            title="Fechar Heróis"
            aria-label="Fechar Heróis"
          >
            <X className="w-4 h-4 text-yellow-300" />
            <span>Fechar</span>
          </button>
        </div>

        {/* Scrollable list */}
        <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
          {HEROES.map((hero) => {
            const isSelected = hero.id === selectedHeroId;
            return (
              <button
                key={hero.id}
                type="button"
                onClick={() => {
                  soundCtrl.playClick(500);
                  onSelectHero(hero);
                  onClose();
                }}
                className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-yellow-400 shadow-md scale-[1.02]'
                    : 'bg-white/5 hover:bg-white/10 border-white/10'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-3xl shadow-inner shrink-0">
                  {hero.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-white truncate">
                      {hero.name}
                    </h3>
                    {isSelected && (
                      <span className="p-0.5 rounded-full bg-yellow-400 text-purple-950">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-amber-300 font-medium">{hero.title}</p>
                  <p className="text-xs text-slate-400 italic line-clamp-1 mt-0.5">
                    &ldquo;{hero.greeting}&rdquo;
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Guaranteed Bottom Close Button */}
        <div className="pt-3.5 border-t border-white/10 mt-3 flex justify-end shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm transition active:scale-95 flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>Fechar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
