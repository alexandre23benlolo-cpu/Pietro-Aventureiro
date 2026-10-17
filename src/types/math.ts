/**
 * Types for Aventura Matemática do Herói
 */

export type Operation = '+' | '-' | '×' | '÷' | 'mix';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type GameMode = 'mission' | 'speed' | 'zen';

export interface HeroCharacter {
  id: string;
  name: string;
  title: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  greeting: string;
}

export interface MathProblem {
  id: string;
  num1: number;
  num2: number;
  operation: '+' | '-' | '×' | '÷';
  correctAnswer: number;
  options: number[];
  itemType: 'stars' | 'apples' | 'gems' | 'cookies' | 'balloons';
}

export interface QuestionResult {
  problem: MathProblem;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpentSec: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface RankingEntry {
  id: string;
  playerName: string;
  heroEmoji: string;
  score: number;
  accuracy: number;
  streak: number;
  operation: Operation;
  difficulty: DifficultyLevel;
  date: string;
}

export interface PlayerStats {
  totalQuestionsAnswered: number;
  totalCorrect: number;
  highestStreak: number;
  highestScore: number;
  missionsCompleted: number;
  operationsBreakdown: {
    '+': { correct: number; total: number };
    '-': { correct: number; total: number };
    '×': { correct: number; total: number };
    '÷': { correct: number; total: number };
  };
  unlockedAchievements: string[];
  selectedHeroId: string;
  lastPlayerName: string;
  rankings: RankingEntry[];
  soundEnabled: boolean;
}
