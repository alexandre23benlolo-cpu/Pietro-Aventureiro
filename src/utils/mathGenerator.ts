import { DifficultyLevel, MathProblem, Operation } from '../types/math';

const ITEM_TYPES: Array<'stars' | 'apples' | 'gems' | 'cookies' | 'balloons'> = [
  'stars',
  'apples',
  'gems',
  'cookies',
  'balloons',
];

export function generateMathProblem(
  operationChoice: Operation,
  difficulty: DifficultyLevel
): MathProblem {
  let op: '+' | '-' | '×' | '÷';
  if (operationChoice === 'mix') {
    const ops: Array<'+' | '-' | '×' | '÷'> = ['+', '-', '×', '÷'];
    op = ops[Math.floor(Math.random() * ops.length)];
  } else {
    op = operationChoice;
  }

  let num1 = 0;
  let num2 = 0;
  let correctAnswer = 0;

  switch (op) {
    case '+': {
      if (difficulty === 'easy') {
        num1 = Math.floor(Math.random() * 9) + 1; // 1 to 9
        num2 = Math.floor(Math.random() * 8) + 1; // 1 to 8
      } else if (difficulty === 'medium') {
        num1 = Math.floor(Math.random() * 15) + 5; // 5 to 19
        num2 = Math.floor(Math.random() * 15) + 3; // 3 to 17
      } else {
        num1 = Math.floor(Math.random() * 35) + 10;
        num2 = Math.floor(Math.random() * 35) + 10;
      }
      correctAnswer = num1 + num2;
      break;
    }

    case '-': {
      if (difficulty === 'easy') {
        num1 = Math.floor(Math.random() * 10) + 1; // 1 to 10
        num2 = Math.floor(Math.random() * num1); // 0 to num1 (non-negative)
      } else if (difficulty === 'medium') {
        num1 = Math.floor(Math.random() * 16) + 10; // 10 to 25
        num2 = Math.floor(Math.random() * (num1 - 2)) + 1;
      } else {
        num1 = Math.floor(Math.random() * 40) + 20; // 20 to 60
        num2 = Math.floor(Math.random() * (num1 - 5)) + 5;
      }
      correctAnswer = num1 - num2;
      break;
    }

    case '×': {
      if (difficulty === 'easy') {
        // Tabuadas mais simples para iniciantes: 1, 2, 3, 4, 5 e 10
        const easyFactors = [1, 2, 3, 4, 5, 10];
        num1 = easyFactors[Math.floor(Math.random() * easyFactors.length)];
        num2 = Math.floor(Math.random() * 6); // 0 to 5
      } else if (difficulty === 'medium') {
        num1 = Math.floor(Math.random() * 8) + 2; // 2 to 9
        num2 = Math.floor(Math.random() * 8) + 2; // 2 to 9
      } else {
        num1 = Math.floor(Math.random() * 10) + 3;
        num2 = Math.floor(Math.random() * 10) + 3;
      }
      correctAnswer = num1 * num2;
      break;
    }

    case '÷': {
      // Divisão sempre exata
      if (difficulty === 'easy') {
        // Divisor 1 a 5, quociente 1 a 5
        num2 = Math.floor(Math.random() * 4) + 1; // 1 to 4
        correctAnswer = Math.floor(Math.random() * 5) + 1; // 1 to 5
        num1 = num2 * correctAnswer;
      } else if (difficulty === 'medium') {
        num2 = Math.floor(Math.random() * 7) + 2; // 2 to 8
        correctAnswer = Math.floor(Math.random() * 8) + 2; // 2 to 9
        num1 = num2 * correctAnswer;
      } else {
        num2 = Math.floor(Math.random() * 9) + 2; // 2 to 10
        correctAnswer = Math.floor(Math.random() * 10) + 3; // 3 to 12
        num1 = num2 * correctAnswer;
      }
      break;
    }
  }

  // Generate 3 plausible distractors
  const optionsSet = new Set<number>();
  optionsSet.add(correctAnswer);

  const candidateDeltas = [-2, -1, 1, 2, 3, -3, 5, -5, 10, -10];
  let tries = 0;

  while (optionsSet.size < 4 && tries < 50) {
    tries++;
    const delta = candidateDeltas[Math.floor(Math.random() * candidateDeltas.length)];
    const candidate = correctAnswer + delta;

    if (candidate >= 0 && candidate !== correctAnswer) {
      optionsSet.add(candidate);
    }
  }

  // Fallback if not enough
  let fallbackVal = 1;
  while (optionsSet.size < 4) {
    if (!optionsSet.has(correctAnswer + fallbackVal) && correctAnswer + fallbackVal >= 0) {
      optionsSet.add(correctAnswer + fallbackVal);
    } else if (!optionsSet.has(Math.max(0, correctAnswer - fallbackVal))) {
      optionsSet.add(Math.max(0, correctAnswer - fallbackVal));
    }
    fallbackVal++;
  }

  const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

  const randomItem = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    num1,
    num2,
    operation: op,
    correctAnswer,
    options,
    itemType: randomItem,
  };
}

export const HEROES = [
  {
    id: 'pietro',
    name: 'Pietro Astronauta',
    title: 'Explorador das Estrelas',
    emoji: '🚀',
    color: 'from-amber-400 to-yellow-500',
    bgColor: 'bg-amber-500/10 border-amber-400/40 text-amber-300',
    borderColor: 'border-amber-400',
    greeting: 'Olá, sou o Pietro! Vamos viajar pelo universo da matemática juntos!',
  },
  {
    id: 'luna',
    name: 'Maga Luna',
    title: 'Guardiã dos Números Mágicos',
    emoji: '🧙‍♀️',
    color: 'from-purple-400 to-pink-500',
    bgColor: 'bg-purple-500/10 border-purple-400/40 text-purple-300',
    borderColor: 'border-purple-400',
    greeting: 'Prepare sua varinha mágica para desvendar as contas!',
  },
  {
    id: 'rex',
    name: 'Dino Rex',
    title: 'Campeão Pré-Histórico',
    emoji: '🦖',
    color: 'from-emerald-400 to-teal-500',
    bgColor: 'bg-emerald-500/10 border-emerald-400/40 text-emerald-300',
    borderColor: 'border-emerald-400',
    greeting: 'Roaaar! Nenhum desafio de matemática assusta a gente!',
  },
  {
    id: 'bit',
    name: 'Robô Bit',
    title: 'Cérebro de Silício',
    emoji: '🤖',
    color: 'from-cyan-400 to-blue-500',
    bgColor: 'bg-cyan-500/10 border-cyan-400/40 text-cyan-300',
    borderColor: 'border-cyan-400',
    greeting: 'Bip-bop! Meus circuitos estão prontos para calcular!',
  },
  {
    id: 'theo',
    name: 'Leãozinho Theo',
    title: 'Coragem da Savana',
    emoji: '🦁',
    color: 'from-orange-400 to-amber-500',
    bgColor: 'bg-orange-500/10 border-orange-400/40 text-orange-300',
    borderColor: 'border-orange-400',
    greeting: 'Com coragem e calma a gente acerta todas!',
  },
];

export const INITIAL_ACHIEVEMENTS = [
  {
    id: 'first_step',
    title: 'Primeiro Passo',
    description: 'Acertou sua primeira pergunta na aventura!',
    icon: '🌱',
  },
  {
    id: 'streak_3',
    title: 'Chama Acesa',
    description: 'Alcançou uma sequência de 3 acertos seguidos!',
    icon: '🔥',
  },
  {
    id: 'streak_5',
    title: 'Super Foco',
    description: 'Alcançou uma incrível sequência de 5 acertos!',
    icon: '⚡',
  },
  {
    id: 'streak_10',
    title: 'Mestre Invencível',
    description: '10 acertos consecutivos sem errar nenhum!',
    icon: '👑',
  },
  {
    id: 'add_champ',
    title: 'Estrela da Adição',
    description: 'Completou uma missão inteira de Adição (+)!',
    icon: '➕',
  },
  {
    id: 'sub_champ',
    title: 'Mestre da Subtração',
    description: 'Completou uma missão inteira de Subtração (-)!',
    icon: '➖',
  },
  {
    id: 'mul_champ',
    title: 'Gênio da Multiplicação',
    description: 'Dominou uma missão de Tabuada (×)!',
    icon: '✖️',
  },
  {
    id: 'div_champ',
    title: 'Detetive da Divisão',
    description: 'Desvendou uma missão completa de Divisão (÷)!',
    icon: '➗',
  },
  {
    id: 'perfect_mission',
    title: 'Missão Nota 10',
    description: 'Terminou uma missão com 100% de precisão!',
    icon: '🏆',
  },
  {
    id: 'score_100',
    title: 'Centena de Ouro',
    description: 'Conquistou mais de 100 pontos em uma partida!',
    icon: '💯',
  },
  {
    id: 'speed_demon',
    title: 'Rápido como um Raio',
    description: 'Respondeu corretamente em menos de 2 segundos!',
    icon: '🚀',
  },
];
