import React from 'react';
import { Play, Sparkles, Clock, Target, Compass } from 'lucide-react';
import { DifficultyLevel, GameMode, HeroCharacter, Operation } from '../types/math';
import { soundCtrl } from '../utils/audio';

interface MenuScreenProps {
  selectedHero: HeroCharacter;
  difficulty: DifficultyLevel;
  gameMode: GameMode;
  onSelectDifficulty: (d: DifficultyLevel) => void;
  onSelectGameMode: (m: GameMode) => void;
  onStartGame: (op: Operation) => void;
  onOpenRanking: () => void;
  onOpenDownload: () => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({
  selectedHero,
  difficulty,
  gameMode,
  onSelectDifficulty,
  onSelectGameMode,
  onStartGame,
  onOpenRanking,
  onOpenDownload,
}) => {
  const operations: Array<{
    op: Operation;
    title: string;
    subtitle: string;
    icon: string;
    gradient: string;
    border: string;
  }> = [
    {
      op: '+',
      title: 'Adição (Soma)',
      subtitle: 'Junte estrelas, balões e números!',
      icon: '➕',
      gradient: 'from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600',
      border: 'border-emerald-400/40',
    },
    {
      op: '-',
      title: 'Subtração (Menos)',
      subtitle: 'Tire e descubra o que restou!',
      icon: '➖',
      gradient: 'from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600',
      border: 'border-amber-400/40',
    },
    {
      op: '×',
      title: 'Multiplicação (Tabuada)',
      subtitle: 'Aprenda tabuadas do 0, 1, 2, 3, 5...',
      icon: '✖️',
      gradient: 'from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600',
      border: 'border-cyan-400/40',
    },
    {
      op: '÷',
      title: 'Divisão (Repartir)',
      subtitle: 'Reparta doces em partes iguais!',
      icon: '➗',
      gradient: 'from-rose-600 to-pink-700 hover:from-rose-500 hover:to-pink-600',
      border: 'border-rose-400/40',
    },
    {
      op: 'mix',
      title: 'Desafio Misto (As 4 Operações)',
      subtitle: 'Mistura divertida de todas as missões!',
      icon: '🌟',
      gradient: 'from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600',
      border: 'border-purple-400/40',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900/80 via-purple-900/70 to-pink-900/60 border border-white/20 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl flex items-center gap-4 sm:gap-6">
        <div className="text-5xl sm:text-6xl animate-float shrink-0 bg-white/10 p-3 rounded-2xl shadow-inner">
          {selectedHero.emoji}
        </div>
        <div>
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
            Missão do Dia
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {selectedHero.name} convida você!
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-lg">
            &ldquo;{selectedHero.greeting}&rdquo;
          </p>
        </div>
      </div>

      {/* Difficulty & Mode Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Difficulty Selector */}
        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-4">
          <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-amber-400" />
            Nível de Dificuldade:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                soundCtrl.playClick(400);
                onSelectDifficulty('easy');
              }}
              className={`py-2.5 px-2 rounded-2xl font-bold text-xs transition-all flex flex-col items-center gap-1 border ${
                difficulty === 'easy'
                  ? 'bg-emerald-500 text-white border-emerald-300 shadow-md scale-102'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/15'
              }`}
            >
              <span className="text-base">🌱</span>
              <span>Iniciante</span>
              <span className="text-[10px] opacity-80 font-normal">Fácil (0 a 10)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundCtrl.playClick(440);
                onSelectDifficulty('medium');
              }}
              className={`py-2.5 px-2 rounded-2xl font-bold text-xs transition-all flex flex-col items-center gap-1 border ${
                difficulty === 'medium'
                  ? 'bg-amber-500 text-white border-amber-300 shadow-md scale-102'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/15'
              }`}
            >
              <span className="text-base">⚡</span>
              <span>Aventureiro</span>
              <span className="text-[10px] opacity-80 font-normal">Médio (até 20)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundCtrl.playClick(480);
                onSelectDifficulty('hard');
              }}
              className={`py-2.5 px-2 rounded-2xl font-bold text-xs transition-all flex flex-col items-center gap-1 border ${
                difficulty === 'hard'
                  ? 'bg-rose-500 text-white border-rose-300 shadow-md scale-102'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/15'
              }`}
            >
              <span className="text-base">👑</span>
              <span>Mestre</span>
              <span className="text-[10px] opacity-80 font-normal">Desafio Maior</span>
            </button>
          </div>
        </div>

        {/* Game Mode Selector */}
        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-4">
          <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-cyan-400" />
            Estilo de Jogo:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                soundCtrl.playClick(400);
                onSelectGameMode('mission');
              }}
              className={`py-2.5 px-2 rounded-2xl font-bold text-xs transition-all flex flex-col items-center gap-1 border ${
                gameMode === 'mission'
                  ? 'bg-indigo-600 text-white border-indigo-300 shadow-md scale-102'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/15'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Missão</span>
              <span className="text-[10px] opacity-80 font-normal">10 Perguntas</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundCtrl.playClick(440);
                onSelectGameMode('speed');
              }}
              className={`py-2.5 px-2 rounded-2xl font-bold text-xs transition-all flex flex-col items-center gap-1 border ${
                gameMode === 'speed'
                  ? 'bg-amber-600 text-white border-amber-300 shadow-md scale-102'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/15'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Corrida</span>
              <span className="text-[10px] opacity-80 font-normal">60 Segundos</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundCtrl.playClick(480);
                onSelectGameMode('zen');
              }}
              className={`py-2.5 px-2 rounded-2xl font-bold text-xs transition-all flex flex-col items-center gap-1 border ${
                gameMode === 'zen'
                  ? 'bg-teal-600 text-white border-teal-300 shadow-md scale-102'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/15'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Treino Zen</span>
              <span className="text-[10px] opacity-80 font-normal">Sem Pressa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Operations List */}
      <div>
        <h3 className="text-lg font-bold text-yellow-300 mb-3 flex items-center gap-2">
          <span>🎯</span> Escolha a sua missão de hoje:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {operations.map((item) => (
            <button
              key={item.op}
              type="button"
              onClick={() => {
                soundCtrl.playClick(520);
                onStartGame(item.op);
              }}
              className={`w-full bg-gradient-to-r ${item.gradient} p-4 rounded-3xl font-bold text-left shadow-lg border ${item.border} flex items-center justify-between group transition-all transform hover:-translate-y-1 active:scale-98`}
            >
              <div className="flex items-center gap-3.5">
                <span className="text-3xl p-2 bg-white/15 rounded-2xl shadow-inner group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <div>
                  <h4 className="text-base sm:text-lg text-white font-black leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs text-white/80 font-normal mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
              <div className="bg-white/20 group-hover:bg-white/30 text-white px-3.5 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1 shrink-0 ml-2 shadow-sm">
                <span>Jogar</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Ranking & Download Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-yellow-400/30 rounded-3xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl animate-bounce">🏆</span>
            <div>
              <h4 className="text-sm font-black text-yellow-300">
                Ranking das Crianças
              </h4>
              <p className="text-[11px] text-indigo-100">
                Maiores pontuações do Pietro e amigos
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundCtrl.playClick(440);
              onOpenRanking();
            }}
            className="px-3.5 py-2 rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-purple-950 font-black text-xs shadow-md transition active:scale-95 whitespace-nowrap"
          >
            Placar
          </button>
        </div>

        <div className="bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 border border-emerald-400/30 rounded-3xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl animate-float">📥</span>
            <div>
              <h4 className="text-sm font-black text-emerald-300">
                Baixar & Instalar
              </h4>
              <p className="text-[11px] text-indigo-100">
                Baixar .ZIP ou instalar no celular/tablet
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundCtrl.playClick(440);
              onOpenDownload();
            }}
            className="px-3.5 py-2 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs shadow-md transition active:scale-95 whitespace-nowrap"
          >
            Baixar
          </button>
        </div>
      </div>
    </div>
  );
};
