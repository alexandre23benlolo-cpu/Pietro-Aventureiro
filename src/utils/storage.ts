import { PlayerStats, RankingEntry } from '../types/math';
import { soundCtrl } from './audio';

const STORAGE_KEY = 'aventura_matematica_heroi_v2';

const INITIAL_RANKINGS: RankingEntry[] = [
  {
    id: 'rank-1',
    playerName: 'Pietro',
    heroEmoji: '🚀',
    score: 135,
    accuracy: 100,
    streak: 10,
    operation: '+',
    difficulty: 'easy',
    date: 'Hoje',
  },
  {
    id: 'rank-2',
    playerName: 'Pietro',
    heroEmoji: '🚀',
    score: 110,
    accuracy: 90,
    streak: 7,
    operation: '×',
    difficulty: 'easy',
    date: 'Hoje',
  },
  {
    id: 'rank-3',
    playerName: 'Sofia',
    heroEmoji: '🧙‍♀️',
    score: 95,
    accuracy: 90,
    streak: 5,
    operation: '-',
    difficulty: 'easy',
    date: 'Ontem',
  },
];

const DEFAULT_STATS: PlayerStats = {
  totalQuestionsAnswered: 0,
  totalCorrect: 0,
  highestStreak: 0,
  highestScore: 0,
  missionsCompleted: 0,
  operationsBreakdown: {
    '+': { correct: 0, total: 0 },
    '-': { correct: 0, total: 0 },
    '×': { correct: 0, total: 0 },
    '÷': { correct: 0, total: 0 },
  },
  unlockedAchievements: [],
  selectedHeroId: 'pietro',
  lastPlayerName: 'Pietro',
  rankings: INITIAL_RANKINGS,
  soundEnabled: true,
};

export function loadPlayerStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Check legacy key v1 and migrate
      const legacyRaw = localStorage.getItem('aventura_matematica_heroi_v1');
      if (legacyRaw) {
        const legacyParsed = JSON.parse(legacyRaw);
        return {
          ...DEFAULT_STATS,
          ...legacyParsed,
          selectedHeroId: legacyParsed.selectedHeroId === 'leo' ? 'pietro' : (legacyParsed.selectedHeroId || 'pietro'),
          lastPlayerName: legacyParsed.lastPlayerName || 'Pietro',
          rankings: Array.isArray(legacyParsed.rankings) ? legacyParsed.rankings : INITIAL_RANKINGS,
        };
      }
      return DEFAULT_STATS;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATS,
      ...parsed,
      selectedHeroId: parsed.selectedHeroId === 'leo' ? 'pietro' : (parsed.selectedHeroId || 'pietro'),
      lastPlayerName: parsed.lastPlayerName || 'Pietro',
      operationsBreakdown: {
        ...DEFAULT_STATS.operationsBreakdown,
        ...(parsed.operationsBreakdown || {}),
      },
      unlockedAchievements: Array.isArray(parsed.unlockedAchievements)
        ? parsed.unlockedAchievements
        : [],
      rankings: Array.isArray(parsed.rankings) ? parsed.rankings : INITIAL_RANKINGS,
    };
  } catch {
    return DEFAULT_STATS;
  }
}

export function savePlayerStats(stats: PlayerStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Ignore quota or disabled storage
  }
}

export function resetPlayerStats(): PlayerStats {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('aventura_matematica_heroi_v1');
  } catch {
    // Ignore
  }
  return DEFAULT_STATS;
}

export function updateSoundPreference(enabled: boolean): void {
  soundCtrl.setEnabled(enabled);
}
