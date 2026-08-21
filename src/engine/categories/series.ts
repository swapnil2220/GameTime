import type { AptitudePuzzle, Option, DifficultyTier } from '../../types/game';
import { SeededRandom } from '../seed';

export function generateSeriesPuzzle(difficulty: DifficultyTier, rng: SeededRandom, _seenIds: string[] = []): AptitudePuzzle {
  let sequence: number[] = [];
  let ruleText = '';
  let targetVal = 0;

  if (difficulty === 'beginner') {
    const start = rng.range(2, 10);
    const step = rng.range(2, 5);
    sequence = [start, start + step, start + 2 * step, start + 3 * step];
    targetVal = sequence[3] + step;
    ruleText = `Simple arithmetic progression: Add +${step} at each step.`;
  } else if (difficulty === 'intermediate') {
    const start = rng.range(3, 12);
    let current = start;
    sequence = [current];
    const diffStep = rng.range(2, 4);
    for (let i = 1; i < 4; i++) {
      current += i * diffStep;
      sequence.push(current);
    }
    targetVal = sequence[3] + 4 * diffStep;
    ruleText = `Accelerating difference progression: Increases by +${diffStep} more each step.`;
  } else {
    // Expert
    const patternType = rng.pick(['square', 'cube_minus_one', 'geometric_alt']);
    if (patternType === 'square') {
      const offset = rng.range(1, 5);
      sequence = [1 * 1 + offset, 2 * 2 + offset, 3 * 3 + offset, 4 * 4 + offset];
      targetVal = 5 * 5 + offset;
      ruleText = `Quadratic formula: n² + ${offset} for n = 1, 2, 3, 4, 5.`;
    } else if (patternType === 'cube_minus_one') {
      sequence = [1 - 1, 8 - 1, 27 - 1, 64 - 1]; // 0, 7, 26, 63
      targetVal = 125 - 1; // 124
      ruleText = `Cubic progression: n³ - 1 for n = 1, 2, 3, 4, 5.`;
    } else {
      sequence = [3, 7, 15, 31]; // x * 2 + 1
      targetVal = 63;
      ruleText = `Geometric ratio formula: multiply by 2 then add 1 (2n + 1).`;
    }
  }

  const rawOptions: Option[] = [
    { id: 'opt_c', content: targetVal, isCorrect: true },
    { id: 'opt_d1', content: targetVal + 2, isCorrect: false },
    { id: 'opt_d2', content: targetVal - 3, isCorrect: false },
    { id: 'opt_d3', content: targetVal + 5, isCorrect: false },
  ];

  const options: Option[] = [];
  const seen = new Set<number>();

  for (const opt of rng.shuffle(rawOptions)) {
    if (!seen.has(opt.content)) {
      seen.add(opt.content);
      options.push(opt);
    }
  }

  // Fallback loop ensuring 4 options
  let extraDelta = 7;
  while (options.length < 4) {
    const candidate = targetVal + extraDelta;
    if (!seen.has(candidate)) {
      seen.add(candidate);
      options.push({ id: `opt_ser_fb_${extraDelta}`, content: candidate, isCorrect: false });
    }
    extraDelta++;
  }

  return {
    id: `series_${Date.now()}_${rng.range(100, 999)}`,
    category: 'series',
    categoryTitle: 'Number & Pattern Series',
    difficulty,
    levelNumber: 4,
    renderedData: {
      sequence,
    },
    options,
    explanation: `Difficulty level: ${difficulty.toUpperCase()}. Sequence: ${sequence.join(' → ')} → ${targetVal}. ${ruleText}`,
    visualHint: `Calculate difference between consecutive terms: ${sequence[1] - sequence[0]}, ${sequence[2] - sequence[1]}...`,
  };
}
