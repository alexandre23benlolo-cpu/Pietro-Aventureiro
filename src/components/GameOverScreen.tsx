import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Home, Award, CheckCircle2, XCircle, Trophy, Sparkles } from 'lucide-react';
import { HeroCharacter, QuestionResult } from '../types/math';
import { soundCtrl } from '../utils/audio';

interface GameOverScreenProps {
  score: number;
  streak: number;
  results: QuestionResult[];
  selectedHero: HeroCharacter;
  newlyUnlocked: string[];
  initialPlayerName: string;
  onSaveToRanking: (playerName: string) => void;
  onOpenRanking: () => void;
  onPlayAgain: () => void;
  onReturnToMenu: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  streak,
  results,
  selectedHero,
  newlyUnlocked,
  initialPlayerName,
  onSaveToRanking,
  onOpenRanking,
  onPlayAgain,
  onReturnToMenu,
}) => {
  const [playerName, setPlayerName] = useState(initialPlayerName || 'Pietro');
  const [isSaved, setIsSaved] = useState(false);

  const total = results.length;
  const correctCount = results.filter((r) => r.isCorrect).length;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  useEffect(() => {
    soundCtrl.playFanfare();

    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FACC15', '#38BDF8', '#4ADE80', '#F43F5E', '#A855F7'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 350);
    } catch {
      // Ignore
    }
  }, []);

  const handleSaveRanking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    soundCtrl.playCorrect();
    onSaveToRanking(playerName.trim());
    setIsSaved(true);
  };

  const getMessage = () => {
    if (accuracy === 100) {
      return {
        title: 'Mestre Lendário!',
        desc: 'Incrível! Você acertou todas as contas sem errar nenhuma!',
        stars: 3,
        emoji: '🏆',
      };
    }
    if (accuracy >= 80) {
      return {
        title: 'Sensacional!',
        desc: 'Você teve um desempenho maravilhoso! Quase perfeito!',
        stars: 3,
        emoji: '🌟',
      };
    }
    if (accuracy >= 60) {
      return {
        title: 'Muito Bem!',
        desc: 'Você está no caminho certo! Continue praticando com o herói!',
        stars: 2,
        emoji: '⭐',
      };
    }
    return {
      title: 'Bom Esforço!',
      desc: 'O segredo dos grandes campeões é treinar sempre! Tente de novo!',
      stars: 1,
      emoji: '💪',
    };
  };

  const message = getMessage();

  return (
    <div className="space-y-6 text-white animate-pop">
      {/* Trophy Card */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-center shadow-2xl">
        <div className="text-6xl mb-2 animate-bounce">{message.emoji}</div>
        <h2 className="text-3xl font-black text-yellow-300 drop-shadow">
          {message.title}
        </h2>
        <p className="text-sm text-indigo-100 mt-1 max-w-md mx-auto">
          {message.desc}
        </p>

        {/* 3 Stars display */}
        <div className="flex justify-center gap-2 my-4 text-3xl">
          <span className={message.stars >= 1 ? 'text-yellow-400 drop-shadow' : 'text-slate-600'}>
            ⭐
          </span>
          <span className={message.stars >= 2 ? 'text-yellow-400 drop-shadow' : 'text-slate-600'}>
            ⭐
          </span>
          <span className={message.stars >= 3 ? 'text-yellow-400 drop-shadow' : 'text-slate-600'}>
            ⭐
          </span>
        </div>

        {/* Score & Stats Grid */}
        <div className="grid grid-cols-3 gap-3 bg-white/5 rounded-2xl p-4 border border-white/10">
          <div>
            <span className="text-[11px] text-slate-300 uppercase tracking-wider block">
              Pontuação
            </span>
            <span className="text-3xl font-black text-yellow-300 tabular-nums">
              {score}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-300 uppercase tracking-wider block">
              Acertos
            </span>
            <span className="text-3xl font-black text-emerald-400 tabular-nums">
              {correctCount}/{total}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-300 uppercase tracking-wider block">
              Sequência Max
            </span>
            <span className="text-3xl font-black text-amber-400 tabular-nums">
              {streak}x
            </span>
          </div>
        </div>

        {/* Newly Unlocked Trophies Banner */}
        {newlyUnlocked.length > 0 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 rounded-2xl flex items-center justify-center gap-2 text-amber-300 text-xs font-bold animate-pulse-gentle">
            <Award className="w-4 h-4" />
            <span>Você desbloqueou {newlyUnlocked.length} nova(s) medalha(s)!</span>
          </div>
        )}

        {/* Hero Cheer */}
        <div className="mt-4 text-xs text-indigo-200 flex items-center justify-center gap-2 italic">
          <span>{selectedHero.emoji}</span>
          <span>&ldquo;{selectedHero.name}: Você lutou como um verdadeiro campeão!&rdquo;</span>
        </div>
      </div>

      {/* Save to Ranking Card (Multi-child feature!) */}
      <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-purple-500/20 border-2 border-yellow-400/50 rounded-3xl p-5 backdrop-blur-md shadow-xl text-center">
        <div className="flex items-center justify-center gap-2 text-yellow-300 font-bold mb-1 text-sm sm:text-base">
          <Trophy className="w-5 h-5" />
          <span>Ranking das Crianças</span>
          <Sparkles className="w-4 h-4" />
        </div>
        <p className="text-xs text-indigo-100 mb-3">
          Grave sua pontuação no placar para comparar com os amigos e a família!
        </p>

        {!isSaved ? (
          <form onSubmit={handleSaveRanking} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Digite o nome da criança..."
              maxLength={20}
              className="flex-1 bg-slate-900/80 border-2 border-yellow-400/60 rounded-2xl px-4 py-2.5 text-white placeholder-slate-400 font-bold text-center sm:text-left focus:outline-none focus:border-yellow-300 text-sm"
              required
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-purple-950 font-black px-5 py-2.5 rounded-2xl shadow-lg transition active:scale-95 flex items-center justify-center gap-1.5 text-sm whitespace-nowrap"
            >
              <Trophy className="w-4 h-4" />
              <span>Salvar no Ranking</span>
            </button>
          </form>
        ) : (
          <div className="space-y-2">
            <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Pontuação do herói {playerName} salva no ranking com sucesso!</span>
            </div>
            <button
              type="button"
              onClick={() => {
                soundCtrl.playClick(440);
                onOpenRanking();
              }}
              className="px-4 py-2 bg-yellow-400/30 hover:bg-yellow-400/40 border border-yellow-400/60 text-yellow-300 font-bold rounded-xl text-xs transition"
            >
              Ver Placar do Ranking 🏆
            </button>
          </div>
        )}
      </div>

      {/* Review of Questions */}
      {results.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/15">
          <h3 className="text-sm font-bold text-yellow-300 uppercase tracking-wider mb-3">
            Revisão das Perguntas
          </h3>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {results.map((res, idx) => (
              <div
                key={res.problem.id || idx}
                className={`flex items-center justify-between p-3 rounded-2xl border text-sm ${
                  res.isCorrect
                    ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-200'
                    : 'bg-rose-500/10 border-rose-400/30 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {res.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                  <span className="font-bold text-base text-white">
                    {res.problem.num1} {res.problem.operation} {res.problem.num2} = {res.problem.correctAnswer}
                  </span>
                </div>
                <div className="text-xs text-right">
                  {res.isCorrect ? (
                    <span className="text-emerald-300 font-semibold">Acertou!</span>
                  ) : (
                    <span className="text-rose-300">
                      Você escolheu: <strong className="font-bold">{res.selectedAnswer}</strong>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            soundCtrl.playClick(500);
            onPlayAgain();
          }}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-purple-950 font-black p-4 rounded-2xl shadow-xl transition transform active:scale-98 flex items-center justify-center gap-2 text-lg"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Jogar Novamente</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundCtrl.playClick(440);
            onReturnToMenu();
          }}
          className="w-full bg-white/10 hover:bg-white/20 text-white font-bold p-4 rounded-2xl border border-white/20 transition transform active:scale-98 flex items-center justify-center gap-2 text-base"
        >
          <Home className="w-5 h-5" />
          <span>Mudar de Operação</span>
        </button>
      </div>
    </div>
  );
};
