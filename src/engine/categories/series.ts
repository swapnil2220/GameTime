import type { AptitudePuzzle, Option, DifficultyTier } from '../../types/game';
import { SeededRandom } from '../seed';

export function generateSeriesPuzzle(difficulty: DifficultyTier, rng: SeededRandom): AptitudePuzzle {
  const start = rng.range(2, 10);
  const step = rng.range(2, 5);

  let sequence: number[] = [];
  let ruleText = '';

  if (difficulty === 'beginner') {
    // Arithmetic Series (+step)
    sequence = [start, start + step, start + 2 * step, start + 3 * step];
    ruleText = `Add +${step} at each step.`;
  } else if (difficulty === 'intermediate') {
    // Increasing Step Series (+2, +4, +6...)
    let current = start;
    sequence = [current];
    for (let i = 1; i < 4; i++) {
      current += i * 2;
      sequence.push(current);
    }
    ruleText = `Step increases by +2 each step (+2, +4, +6).`;
  } else {
    // Square progression (n^2 + 1)
    sequence = [2, 5, 10, 17];
    ruleText = `Rule: (n² + 1) where n = 1, 2, 3, 4.`;
  }

  // Target answer is 5th element
  let targetVal = 0;
  if (difficulty === 'beginner') {
    targetVal = sequence[3] + step;
  } else if (difficulty === 'intermediate') {
    targetVal = sequence[3] + 8;
  } else {
    targetVal = 26; // 5^2 + 1
  }

  const options: Option[] = [];
  options.push({ id: 'opt_c', content: targetVal, isCorrect: true });
  options.push({ id: 'opt_d1', content: targetVal + 2, isCorrect: false });
  options.push({ id: 'opt_d2', content: targetVal - 3, isCorrect: false });
  options.push({ id: 'opt_d3', content: targetVal + 5, isCorrect: false });

  const shuffledOptions = rng.shuffle(options);

  return {
    id: `series_${Date.now()}_${rng.range(100, 999)}`,
    category: 'series',
    categoryTitle: 'Number & Pattern Series',
    difficulty,
    levelNumber: 4,
    renderedData: {
      sequence,
    },
    options: shuffledOptions,
    explanation: `Sequence: ${sequence.join(' → ')} → ${targetVal}. ${ruleText}`,
    visualHint: `Calculate difference between consecutive terms: ${sequence[1] - sequence[0]}, ${sequence[2] - sequence[1]}...`,
  };
}
