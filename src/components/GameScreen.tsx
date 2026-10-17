import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Eye, EyeOff, ArrowLeft, Zap } from 'lucide-react';
import { DifficultyLevel, GameMode, HeroCharacter, MathProblem } from '../types/math';
import { VisualManipulative } from './VisualManipulative';
import { soundCtrl } from '../utils/audio';

interface GameScreenProps {
  problem: MathProblem;
  questionIndex: number;
  totalQuestions: number;
  score: number;
  streak: number;
  difficulty: DifficultyLevel;
  gameMode: GameMode;
  selectedHero: HeroCharacter;
  onAnswer: (selectedAnswer: number, timeSpentSec: number) => void;
  onExitGame: () => void;
  onTimeUp?: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  problem,
  questionIndex,
  totalQuestions,
  streak,
  difficulty,
  gameMode,
  selectedHero,
  onAnswer,
  onExitGame,
  onTimeUp,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [showVisuals, setShowVisuals] = useState<boolean>(difficulty === 'easy');
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const startTimeRef = useRef<number>(Date.now());

  // Reset local question state when problem changes
  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    setFeedback(null);
    startTimeRef.current = Date.now();
  }, [problem.id]);

  // Speed mode timer
  useEffect(() => {
    if (gameMode !== 'speed') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameMode, onTimeUp]);

  const handleSelect = useCallback((option: number) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOption(option);

    const timeSpent = Math.max(0.1, (Date.now() - startTimeRef.current) / 1000);
    const isCorrect = option === problem.correctAnswer;

    if (isCorrect) {
      if (streak >= 2) {
        soundCtrl.playStreakBonus();
      } else {
        soundCtrl.playCorrect();
      }

      const praises = [
        '🎉 Muito bem! Resposta certa!',
        '🌟 Incrível! Você acertou!',
        '⚡ Sensacional! Mandou super bem!',
        '🚀 Fantástico! Continue assim!',
        '👏 Parabéns! Resposta certinha!',
      ];
      const randomPraise = praises[Math.floor(Math.random() * praises.length)];
      setFeedback({ isCorrect: true, text: randomPraise });
    } else {
      soundCtrl.playWrong();
      setFeedback({
        isCorrect: false,
        text: `💪 Quase lá! A resposta certa era ${problem.correctAnswer}.`,
      });
    }

    // Advance to next after short visual settle
    setTimeout(() => {
      onAnswer(option, timeSpent);
    }, 1300);
  }, [isAnswered, problem.correctAnswer, streak, onAnswer]);

  // Keyboard shortcut support (1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswered) return;
      if (['1', '2', '3', '4'].includes(e.key)) {
        const index = parseInt(e.key, 10) - 1;
        if (problem.options[index] !== undefined) {
          handleSelect(problem.options[index]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, problem.options, handleSelect]);

  const getOperationName = (op: MathProblem['operation']) => {
    switch (op) {
      case '+':
        return 'Adição';
      case '-':
        return 'Subtração';
      case '×':
        return 'Multiplicação';
      case '÷':
        return 'Divisão';
      default:
        return 'Matemática';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-pop">
      {/* Top Status & Progress Bar */}
      <div className="flex items-center justify-between bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-xs text-indigo-100">
        <button
          type="button"
          onClick={() => {
            soundCtrl.playClick(300);
            onExitGame();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Sair</span>
        </button>

        {/* Center mode badge */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-yellow-300">
            {getOperationName(problem.operation)}
          </span>
          {gameMode === 'mission' && (
            <span className="bg-white/15 px-2 py-0.5 rounded-lg tabular-nums">
              {questionIndex + 1} / {totalQuestions}
            </span>
          )}
          {gameMode === 'speed' && (
            <span className="bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded-lg font-bold tabular-nums flex items-center gap-1">
              <Zap className="w-3 h-3" /> {timeLeft}s
            </span>
          )}
          {gameMode === 'zen' && (
            <span className="bg-teal-500/30 text-teal-300 px-2 py-0.5 rounded-lg">
              Treino Livre
            </span>
          )}
        </div>

        {/* Visual toggle button */}
        <button
          type="button"
          onClick={() => {
            soundCtrl.playClick(440);
            setShowVisuals(!showVisuals);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border transition ${
            showVisuals
              ? 'bg-amber-400 text-purple-950 border-amber-300 font-bold'
              : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
          }`}
          title="Ver representação em desenhos"
        >
          {showVisuals ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">
            {showVisuals ? 'Ocultar Desenhos' : 'Ver com Desenhos'}
          </span>
          <span className="sm:hidden">{showVisuals ? 'Ocultar' : 'Dica'}</span>
        </button>
      </div>

      {/* Mission progress stepper if mission mode */}
      {gameMode === 'mission' && (
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 h-full transition-all duration-300 rounded-full"
            style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      )}

      {/* Main Math Card */}
      <div className="bg-gradient-to-b from-white/20 to-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/30 text-center shadow-2xl relative overflow-hidden">
        {/* Decorative corner hero emoji */}
        <div className="absolute top-3 left-4 text-2xl opacity-60">
          {selectedHero.emoji}
        </div>

        {/* Operation Title */}
        <span className="text-xs uppercase tracking-wider text-indigo-200 font-semibold block mb-2">
          Resolva a conta:
        </span>

        {/* Big Problem Display */}
        <div className="text-5xl sm:text-7xl font-black text-yellow-300 drop-shadow-lg tracking-wider my-3 flex items-center justify-center gap-2 sm:gap-4 font-sans select-none">
          <span>{problem.num1}</span>
          <span className="text-amber-400 text-4xl sm:text-6xl font-light">
            {problem.operation}
          </span>
          <span>{problem.num2}</span>
          <span className="text-indigo-200 text-4xl sm:text-6xl font-light">=</span>
          <span className="text-cyan-300 animate-pulse">?</span>
        </div>

        {/* Active Feedback Message */}
        <div className="h-8 flex items-center justify-center">
          {feedback ? (
            <p
              className={`text-base sm:text-lg font-black transition-all animate-pop ${
                feedback.isCorrect ? 'text-emerald-300' : 'text-rose-300'
              }`}
            >
              {feedback.text}
            </p>
          ) : (
            <p className="text-xs text-indigo-200/80">
              Escolha uma das 4 opções abaixo:
            </p>
          )}
        </div>
      </div>

      {/* Visual Manipulatives (Conditional or Toggled) */}
      {showVisuals && <VisualManipulative problem={problem} />}

      {/* 4 Big Tactile Options */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {problem.options.map((opt, idx) => {
          const isChosen = selectedOption === opt;
          const isCorrectAnswer = opt === problem.correctAnswer;

          let btnColor =
            'bg-white/15 hover:bg-white/25 border-white/30 text-white hover:scale-[1.02]';

          if (isAnswered) {
            if (isCorrectAnswer) {
              btnColor =
                'bg-emerald-500 text-white border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-102';
            } else if (isChosen) {
              btnColor =
                'bg-rose-500 text-white border-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.5)]';
            } else {
              btnColor = 'bg-white/5 border-white/10 text-slate-400 opacity-50';
            }
          }

          return (
            <button
              key={`${problem.id}-opt-${idx}`}
              type="button"
              disabled={isAnswered}
              onClick={() => handleSelect(opt)}
              className={`relative py-5 sm:py-6 px-4 rounded-3xl border-2 text-3xl sm:text-4xl font-black shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center ${btnColor}`}
            >
              {/* Keyboard index hint */}
              <span className="absolute top-2 left-3 text-[10px] sm:text-xs font-normal opacity-60">
                [{idx + 1}]
              </span>

              <span className="tabular-nums drop-shadow-sm">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
