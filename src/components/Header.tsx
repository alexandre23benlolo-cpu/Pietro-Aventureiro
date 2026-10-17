import React from 'react';
import { Volume2, VolumeX, Trophy, Award, BarChart3, Sparkles, Download } from 'lucide-react';
import { HeroCharacter } from '../types/math';

interface HeaderProps {
  score: number;
  streak: number;
  selectedHero: HeroCharacter;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHeroModal: () => void;
  onOpenAchievements: () => void;
  onOpenRanking: () => void;
  onOpenStats: () => void;
  onOpenDownload: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  streak,
  selectedHero,
  soundEnabled,
  onToggleSound,
  onOpenHeroModal,
  onOpenAchievements,
  onOpenRanking,
  onOpenStats,
  onOpenDownload,
}) => {
  return (
    <header className="w-full bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-3 sm:px-4 py-3 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenHeroModal}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 transition-transform active:scale-95 group text-left"
            title="Trocar herói (Pietro e amigos)"
          >
            <span className="text-2xl animate-float">{selectedHero.emoji}</span>
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-yellow-300 block leading-tight">
                {selectedHero.name}
              </span>
              <span className="text-[10px] text-slate-300 leading-none">Trocar Herói</span>
            </div>
          </button>

          <div>
            <h1 className="text-base sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>Aventura Matemática</span>
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400 hidden sm:inline" />
            </h1>
            <p className="text-[11px] text-indigo-300 hidden sm:block">
              Aprenda brincando com as 4 operações
            </p>
          </div>
        </div>

        {/* Live Score & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Streak indicator if > 0 */}
          {streak > 1 && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 border border-amber-400/40 rounded-xl text-amber-300 text-xs font-bold animate-pulse-gentle">
              <span>🔥</span>
              <span className="tabular-nums">{streak}x</span>
            </div>
          )}

          {/* Current Score Badge */}
          <div className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-yellow-400 text-purple-950 font-bold rounded-2xl shadow-sm text-xs sm:text-sm">
            <span>⭐</span>
            <span className="tabular-nums font-black">{score}</span>
            <span className="text-[10px] sm:text-[11px] font-semibold opacity-90">pts</span>
          </div>

          {/* Utility buttons */}
          <div className="flex items-center gap-1">
            {/* Download / Install button */}
            <button
              type="button"
              onClick={onOpenDownload}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 transition active:scale-95 shadow-sm text-xs font-bold"
              title="Baixar ou Instalar o Aplicativo"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Baixar</span>
            </button>

            {/* Ranking button */}
            <button
              type="button"
              onClick={onOpenRanking}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-yellow-300 border border-yellow-400/40 transition active:scale-95 shadow-sm text-xs font-bold"
              title="Ver Ranking dos Campeões"
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden md:inline">Ranking</span>
            </button>

            <button
              type="button"
              onClick={onOpenAchievements}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 border border-white/10 transition active:scale-95"
              title="Conquistas e Medalhas"
            >
              <Award className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenStats}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-300 border border-white/10 transition active:scale-95"
              title="Painel dos Pais"
            >
              <BarChart3 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onToggleSound}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition active:scale-95"
              title={soundEnabled ? 'Desativar som' : 'Ativar som'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
