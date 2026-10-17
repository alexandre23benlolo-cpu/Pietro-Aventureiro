/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import {
  DifficultyLevel,
  GameMode,
  HeroCharacter,
  MathProblem,
  Operation,
  PlayerStats,
  QuestionResult,
  RankingEntry,
} from './types/math';
import { generateMathProblem, HEROES } from './utils/mathGenerator';
import {
  loadPlayerStats,
  savePlayerStats,
  resetPlayerStats,
  updateSoundPreference,
} from './utils/storage';
import { Header } from './components/Header';
import { MenuScreen } from './components/MenuScreen';
import { GameScreen } from './components/GameScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { HeroSelectorModal } from './components/HeroSelectorModal';
import { AchievementsModal } from './components/AchievementsModal';
import { ParentReportModal } from './components/ParentReportModal';
import { RankingModal } from './components/RankingModal';
import { DownloadModal } from './components/DownloadModal';

export default function App() {
  const [stats, setStats] = useState<PlayerStats>(() => loadPlayerStats());
  const [currentScreen, setCurrentScreen] = useState<'menu' | 'game' | 'gameover'>('menu');
  const [currentOperation, setCurrentOperation] = useState<Operation>('+');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');
  const [gameMode, setGameMode] = useState<GameMode>('mission');

  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreakInSession, setMaxStreakInSession] = useState<number>(0);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(10);
  const [currentProblem, setCurrentProblem] = useState<MathProblem>(() =>
    generateMathProblem('+', 'easy')
  );
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);

  // Modals
  const [isHeroModalOpen, setIsHeroModalOpen] = useState<boolean>(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState<boolean>(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState<boolean>(false);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState<boolean>(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);

  // Sync sound preference
  useEffect(() => {
    updateSoundPreference(stats.soundEnabled);
  }, [stats.soundEnabled]);

  const selectedHero: HeroCharacter =
    HEROES.find((h) => h.id === stats.selectedHeroId) || HEROES[0];

  const handleToggleSound = () => {
    setStats((prev) => {
      const next = { ...prev, soundEnabled: !prev.soundEnabled };
      savePlayerStats(next);
      return next;
    });
  };

  const handleSelectHero = (hero: HeroCharacter) => {
    setStats((prev) => {
      const next = { ...prev, selectedHeroId: hero.id };
      savePlayerStats(next);
      return next;
    });
  };

  const handleResetStats = () => {
    const fresh = resetPlayerStats();
    setStats(fresh);
    setIsStatsModalOpen(false);
  };

  const handleSaveToRanking = (playerName: string) => {
    const correctCount = results.filter((r) => r.isCorrect).length;
    const accuracy = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 100;

    const newEntry: RankingEntry = {
      id: `rank-${Date.now()}`,
      playerName,
      heroEmoji: selectedHero.emoji,
      score,
      accuracy,
      streak: maxStreakInSession,
      operation: currentOperation,
      difficulty,
      date: 'Hoje',
    };

    setStats((prev) => {
      const updatedRankings = [newEntry, ...prev.rankings]
        .sort((a, b) => b.score - a.score)
        .slice(0, 50); // Keep top 50 records

      const next: PlayerStats = {
        ...prev,
        lastPlayerName: playerName,
        rankings: updatedRankings,
      };
      savePlayerStats(next);
      return next;
    });
  };

  const handleClearRanking = () => {
    setStats((prev) => {
      const next: PlayerStats = {
        ...prev,
        rankings: [],
      };
      savePlayerStats(next);
      return next;
    });
  };

  const handleDeleteRankingEntry = (id: string) => {
    setStats((prev) => {
      const next: PlayerStats = {
        ...prev,
        rankings: prev.rankings.filter((r) => r.id !== id),
      };
      savePlayerStats(next);
      return next;
    });
  };

  const startGame = (op: Operation) => {
    setCurrentOperation(op);
    setScore(0);
    setStreak(0);
    setMaxStreakInSession(0);
    setQuestionIndex(0);
    setResults([]);
    setNewlyUnlocked([]);

    const numQ = gameMode === 'mission' ? 10 : 999;
    setTotalQuestions(numQ);

    const firstProblem = generateMathProblem(op, difficulty);
    setCurrentProblem(firstProblem);
    setCurrentScreen('game');
  };

  const endGame = useCallback((finalResults: QuestionResult[], finalScore: number) => {
    setCurrentScreen('gameover');

    // Calculate newly unlocked achievements
    const unlockedNow: string[] = [];
    const checkAchievement = (id: string, condition: boolean) => {
      if (condition && !stats.unlockedAchievements.includes(id)) {
        unlockedNow.push(id);
      }
    };

    const hasAnyCorrect = finalResults.some((r) => r.isCorrect);
    checkAchievement('first_step', hasAnyCorrect);
    checkAchievement('streak_3', maxStreakInSession >= 3 || streak >= 3);
    checkAchievement('streak_5', maxStreakInSession >= 5 || streak >= 5);
    checkAchievement('streak_10', maxStreakInSession >= 10 || streak >= 10);
    checkAchievement('score_100', finalScore >= 100);

    const correctCount = finalResults.filter((r) => r.isCorrect).length;
    if (finalResults.length === 10 && correctCount === 10) {
      checkAchievement('perfect_mission', true);
    }

    if (currentOperation === '+') checkAchievement('add_champ', true);
    if (currentOperation === '-') checkAchievement('sub_champ', true);
    if (currentOperation === '×') checkAchievement('mul_champ', true);
    if (currentOperation === '÷') checkAchievement('div_champ', true);

    const hasSuperSpeed = finalResults.some((r) => r.isCorrect && r.timeSpentSec <= 2);
    checkAchievement('speed_demon', hasSuperSpeed);

    setNewlyUnlocked(unlockedNow);

    // Update persistent player stats
    setStats((prev) => {
      const breakdown = { ...prev.operationsBreakdown };
      finalResults.forEach((r) => {
        const opKey = r.problem.operation;
        if (breakdown[opKey]) {
          breakdown[opKey].total += 1;
          if (r.isCorrect) breakdown[opKey].correct += 1;
        }
      });

      const nextAchievements = Array.from(
        new Set([...prev.unlockedAchievements, ...unlockedNow])
      );

      const nextStats: PlayerStats = {
        ...prev,
        totalQuestionsAnswered: prev.totalQuestionsAnswered + finalResults.length,
        totalCorrect: prev.totalCorrect + correctCount,
        highestStreak: Math.max(prev.highestStreak, maxStreakInSession, streak),
        highestScore: Math.max(prev.highestScore, finalScore),
        missionsCompleted: prev.missionsCompleted + (gameMode === 'mission' ? 1 : 0),
        operationsBreakdown: breakdown,
        unlockedAchievements: nextAchievements,
      };

      savePlayerStats(nextStats);
      return nextStats;
    });
  }, [currentOperation, gameMode, maxStreakInSession, stats.unlockedAchievements, streak]);

  const handleAnswer = (selectedAnswer: number, timeSpentSec: number) => {
    const isCorrect = selectedAnswer === currentProblem.correctAnswer;
    const newStreak = isCorrect ? streak + 1 : 0;
    setStreak(newStreak);

    if (newStreak > maxStreakInSession) {
      setMaxStreakInSession(newStreak);
    }

    let earnedScore = 0;
    if (isCorrect) {
      earnedScore = 10;
      if (newStreak >= 5) earnedScore += 10;
      else if (newStreak >= 3) earnedScore += 5;

      // Speed bonus
      if (timeSpentSec < 3) earnedScore += 3;
    }

    const nextScore = score + earnedScore;
    setScore(nextScore);

    const newResult: QuestionResult = {
      problem: currentProblem,
      selectedAnswer,
      isCorrect,
      timeSpentSec,
    };
    const nextResults = [...results, newResult];
    setResults(nextResults);

    const nextIndex = questionIndex + 1;

    // Check if end condition met for mission mode
    if (gameMode === 'mission' && nextIndex >= totalQuestions) {
      endGame(nextResults, nextScore);
      return;
    }

    // Otherwise generate next problem
    setQuestionIndex(nextIndex);
    const nextProblem = generateMathProblem(currentOperation, difficulty);
    setCurrentProblem(nextProblem);
  };

  const handleTimeUp = () => {
    endGame(results, score);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white flex flex-col relative selection:bg-amber-400 selection:text-slate-900">
      {/* Decorative ambient background stars & symbols */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-10 left-10 text-6xl animate-float">➕</div>
        <div className="absolute top-1/4 right-12 text-7xl animate-float delay-1000">✖️</div>
        <div className="absolute bottom-1/3 left-16 text-6xl animate-float delay-500">➗</div>
        <div className="absolute bottom-10 right-20 text-6xl animate-float delay-700">➖</div>
        <div className="absolute top-1/2 left-1/3 text-4xl animate-pulse">⭐</div>
        <div className="absolute top-1/3 right-1/4 text-4xl animate-pulse delay-300">✨</div>
      </div>

      {/* Main Header */}
      <Header
        score={score}
        streak={streak}
        selectedHero={selectedHero}
        soundEnabled={stats.soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenHeroModal={() => setIsHeroModalOpen(true)}
        onOpenAchievements={() => setIsAchievementsModalOpen(true)}
        onOpenRanking={() => setIsRankingModalOpen(true)}
        onOpenStats={() => setIsStatsModalOpen(true)}
        onOpenDownload={() => setIsDownloadModalOpen(true)}
      />

      {/* Content Body Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center relative z-10">
        {currentScreen === 'menu' && (
          <MenuScreen
            selectedHero={selectedHero}
            difficulty={difficulty}
            gameMode={gameMode}
            onSelectDifficulty={setDifficulty}
            onSelectGameMode={setGameMode}
            onStartGame={startGame}
            onOpenRanking={() => setIsRankingModalOpen(true)}
            onOpenDownload={() => setIsDownloadModalOpen(true)}
          />
        )}

        {currentScreen === 'game' && (
          <GameScreen
            problem={currentProblem}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            score={score}
            streak={streak}
            difficulty={difficulty}
            gameMode={gameMode}
            selectedHero={selectedHero}
            onAnswer={handleAnswer}
            onExitGame={() => setCurrentScreen('menu')}
            onTimeUp={handleTimeUp}
          />
        )}

        {currentScreen === 'gameover' && (
          <GameOverScreen
            score={score}
            streak={maxStreakInSession}
            results={results}
            selectedHero={selectedHero}
            newlyUnlocked={newlyUnlocked}
            initialPlayerName={stats.lastPlayerName || 'Pietro'}
            onSaveToRanking={handleSaveToRanking}
            onOpenRanking={() => setIsRankingModalOpen(true)}
            onPlayAgain={() => startGame(currentOperation)}
            onReturnToMenu={() => setCurrentScreen('menu')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-xs text-indigo-300/70 border-t border-white/5 relative z-10">
        <p>Aventura Matemática do Pietro e Amigos · Prática educativa, divertida e segura para crianças</p>
      </footer>

      {/* Modals */}
      <HeroSelectorModal
        isOpen={isHeroModalOpen}
        onClose={() => setIsHeroModalOpen(false)}
        selectedHeroId={stats.selectedHeroId}
        onSelectHero={handleSelectHero}
      />

      <RankingModal
        isOpen={isRankingModalOpen}
        onClose={() => setIsRankingModalOpen(false)}
        rankings={stats.rankings}
        onClearRanking={handleClearRanking}
        onDeleteRankingEntry={handleDeleteRankingEntry}
      />

      <AchievementsModal
        isOpen={isAchievementsModalOpen}
        onClose={() => setIsAchievementsModalOpen(false)}
        unlockedIds={stats.unlockedAchievements}
      />

      <ParentReportModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        stats={stats}
        onResetStats={handleResetStats}
      />

      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
}
