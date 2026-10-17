import React, { useState } from 'react';
import { MathProblem } from '../types/math';
import { soundCtrl } from '../utils/audio';

interface VisualManipulativeProps {
  problem: MathProblem;
}

export const VisualManipulative: React.FC<VisualManipulativeProps> = ({ problem }) => {
  const [clickedSet, setClickedSet] = useState<Set<number>>(new Set());

  const handleItemClick = (index: number) => {
    soundCtrl.playClick(350 + (index % 12) * 40);
    setClickedSet((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const getEmoji = (type: MathProblem['itemType']) => {
    switch (type) {
      case 'stars':
        return '⭐';
      case 'apples':
        return '🍎';
      case 'gems':
        return '💎';
      case 'cookies':
        return '🍪';
      case 'balloons':
        return '🎈';
      default:
        return '⭐';
    }
  };

  const emoji = getEmoji(problem.itemType);

  // If numbers are too large for visual counters (e.g. > 30), show a polite summary representation
  const maxVisualLimit = 25;
  const isTooLarge =
    (problem.operation === '+' && problem.num1 + problem.num2 > maxVisualLimit) ||
    (problem.operation === '-' && problem.num1 > maxVisualLimit) ||
    (problem.operation === '×' && problem.num1 * problem.num2 > 36) ||
    (problem.operation === '÷' && problem.num1 > 36);

  if (isTooLarge) {
    return (
      <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/20 animate-pop">
        <p className="text-sm text-yellow-200">
          💡 <strong>Dica da Aventura:</strong> Números grandes! Você pode quebrar as dezenas e unidades mentalmente para resolver com calma.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 border border-indigo-400/30 shadow-lg animate-pop">
      <div className="flex items-center justify-between mb-3 text-xs text-indigo-200">
        <span className="font-semibold flex items-center gap-1">
          <span>🖐️</span> Toque nos itens para contar:
        </span>
        <span className="text-amber-300 font-bold tabular-nums">
          Contados: {clickedSet.size}
        </span>
      </div>

      {/* Addition Manipulative */}
      {problem.operation === '+' && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex flex-wrap justify-center gap-1.5 p-2 bg-indigo-900/40 rounded-xl border border-indigo-500/20 max-w-[200px]">
            {Array.from({ length: problem.num1 }).map((_, i) => {
              const isTapped = clickedSet.has(i);
              return (
                <button
                  key={`n1-${i}`}
                  type="button"
                  onClick={() => handleItemClick(i)}
                  className={`text-2xl transition-transform hover:scale-125 active:scale-95 ${
                    isTapped ? 'scale-115 filter drop-shadow-[0_0_8px_gold]' : 'opacity-80'
                  }`}
                  title={`Item ${i + 1}`}
                >
                  {emoji}
                </button>
              );
            })}
          </div>

          <span className="text-2xl font-black text-yellow-300">+</span>

          <div className="flex flex-wrap justify-center gap-1.5 p-2 bg-indigo-900/40 rounded-xl border border-indigo-500/20 max-w-[200px]">
            {Array.from({ length: problem.num2 }).map((_, i) => {
              const idx = problem.num1 + i;
              const isTapped = clickedSet.has(idx);
              return (
                <button
                  key={`n2-${i}`}
                  type="button"
                  onClick={() => handleItemClick(idx)}
                  className={`text-2xl transition-transform hover:scale-125 active:scale-95 ${
                    isTapped ? 'scale-115 filter drop-shadow-[0_0_8px_gold]' : 'opacity-80'
                  }`}
                  title={`Item ${idx + 1}`}
                >
                  {emoji}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtraction Manipulative */}
      {problem.operation === '-' && (
        <div>
          <p className="text-xs text-center text-slate-300 mb-2">
            Temos {problem.num1} e tiramos {problem.num2}:
          </p>
          <div className="flex flex-wrap justify-center gap-2 p-2 bg-indigo-900/40 rounded-xl border border-indigo-500/20">
            {Array.from({ length: problem.num1 }).map((_, i) => {
              const isCrossed = i >= problem.num1 - problem.num2;
              const isTapped = clickedSet.has(i);
              return (
                <button
                  key={`sub-${i}`}
                  type="button"
                  onClick={() => handleItemClick(i)}
                  className={`relative text-2xl transition-transform hover:scale-125 ${
                    isCrossed ? 'opacity-35 grayscale' : isTapped ? 'scale-115 drop-shadow-[0_0_8px_gold]' : ''
                  }`}
                >
                  {emoji}
                  {isCrossed && (
                    <span className="absolute inset-0 flex items-center justify-center text-rose-500 font-bold text-lg pointer-events-none">
                      ✕
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Multiplication Manipulative (Array / Grid) */}
      {problem.operation === '×' && (
        <div className="text-center">
          <p className="text-xs text-slate-300 mb-2">
            {problem.num1} fileiras com {problem.num2} itens cada:
          </p>
          <div className="inline-flex flex-col gap-1.5 p-3 bg-indigo-900/40 rounded-xl border border-indigo-500/20">
            {Array.from({ length: problem.num1 }).map((_, row) => (
              <div key={`row-${row}`} className="flex gap-1.5 justify-center">
                {Array.from({ length: problem.num2 }).map((_, col) => {
                  const idx = row * problem.num2 + col;
                  const isTapped = clickedSet.has(idx);
                  return (
                    <button
                      key={`col-${col}`}
                      type="button"
                      onClick={() => handleItemClick(idx)}
                      className={`text-2xl transition-transform hover:scale-125 ${
                        isTapped ? 'scale-115 drop-shadow-[0_0_8px_gold]' : 'opacity-85'
                      }`}
                    >
                      {emoji}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Division Manipulative (Grouped into baskets) */}
      {problem.operation === '÷' && (
        <div className="text-center">
          <p className="text-xs text-slate-300 mb-2">
            Divida {problem.num1} igualmente em {problem.num2} cestinhas:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {Array.from({ length: problem.num2 }).map((_, groupIdx) => (
              <div
                key={`group-${groupIdx}`}
                className="bg-indigo-950/60 p-2.5 rounded-xl border border-indigo-400/30 flex flex-col items-center min-w-[70px]"
              >
                <span className="text-[10px] text-indigo-300 font-bold mb-1">
                  Cesta {groupIdx + 1}
                </span>
                <div className="flex flex-wrap justify-center gap-1">
                  {Array.from({ length: problem.correctAnswer }).map((_, itemIdx) => {
                    const globalIdx = groupIdx * problem.correctAnswer + itemIdx;
                    const isTapped = clickedSet.has(globalIdx);
                    return (
                      <button
                        key={`div-item-${itemIdx}`}
                        type="button"
                        onClick={() => handleItemClick(globalIdx)}
                        className={`text-xl transition-transform hover:scale-125 ${
                          isTapped ? 'scale-115 drop-shadow-[0_0_8px_gold]' : ''
                        }`}
                      >
                        {emoji}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
