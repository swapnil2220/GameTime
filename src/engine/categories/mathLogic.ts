import type { AptitudePuzzle, Option, DifficultyTier } from '../../types/game';
import { SeededRandom } from '../seed';

export interface MathLogicData {
  id: string;
  equationText: string;
  missingSymbol: string;
  correctAnswer: string;
  distractors: string[];
  explanation: string;
}

export function generateMathLogicPuzzle(difficulty: DifficultyTier, rng: SeededRandom, seenIds: string[] = []): AptitudePuzzle {
  let equationText = '';
  let correctAnswer = '';
  let distractors: string[] = [];
  let explanation = '';
  const puzzleId = `math_${difficulty}_${seenIds.length}_${rng.range(1000, 9999)}`;

  if (difficulty === 'beginner') {
    const a = rng.range(4, 15);
    const b = rng.range(3, 12);
    const op = rng.pick(['+', '-', '×']);

    if (op === '+') {
      equationText = `${a} + ? = ${a + b}`;
      correctAnswer = `${b}`;
      distractors = [`${b + 2}`, `${b - 1}`, `${b + 5}`];
      explanation = `Subtract ${a} from ${a + b} to get ? = ${b}.`;
    } else if (op === '-') {
      equationText = `${a + b} - ? = ${a}`;
      correctAnswer = `${b}`;
      distractors = [`${b + 3}`, `${b - 2}`, `${b + 1}`];
      explanation = `Subtract ${a} from ${a + b} to get ? = ${b}.`;
    } else {
      equationText = `${a} × ? = ${a * b}`;
      correctAnswer = `${b}`;
      distractors = [`${b + 1}`, `${b + 3}`, `${Math.max(1, b - 2)}`];
      explanation = `Divide ${a * b} by ${a} to get ? = ${b}.`;
    }
  } else if (difficulty === 'intermediate') {
    const a = rng.range(3, 8);
    const b = rng.range(2, 6);
    const c = rng.range(5, 20);
    const target = a * b + c;

    equationText = `(${a} × ?) + ${c} = ${target}`;
    correctAnswer = `${b}`;
    distractors = [`${b + 1}`, `${b + 2}`, `${Math.max(1, b - 1)}`];
    explanation = `Subtract ${c} from ${target} (= ${a * b}), then divide by ${a} to get ? = ${b}.`;
  } else {
    const n = rng.range(4, 9);
    const sq = n * n;
    const offset = rng.range(3, 15);

    equationText = `(?²) - ${offset} = ${sq - offset}`;
    correctAnswer = `${n}`;
    distractors = [`${n + 1}`, `${n + 2}`, `${n - 1}`];
    explanation = `Add ${offset} to ${sq - offset} (= ${sq}), then taking square root √${sq} gives ? = ${n}.`;
  }

  const rawOptions: Option[] = [
    { id: 'opt_c', content: correctAnswer, isCorrect: true },
  ];
  distractors.forEach((d, i) => {
    rawOptions.push({ id: `opt_d_${i}`, content: d, isCorrect: false });
  });

  const options: Option[] = [];
  const seen = new Set<string>();

  for (const opt of rng.shuffle(rawOptions)) {
    if (!seen.has(opt.content)) {
      seen.add(opt.content);
      options.push(opt);
    }
  }

  let fallbackVal = 10;
  while (options.length < 4) {
    const str = `${fallbackVal}`;
    if (!seen.has(str)) {
      seen.add(str);
      options.push({ id: `opt_math_fb_${fallbackVal}`, content: str, isCorrect: false });
    }
    fallbackVal++;
  }

  return {
    id: puzzleId,
    category: 'math_logic',
    categoryTitle: 'Quick Math Logic',
    difficulty,
    levelNumber: 8,
    renderedData: {
      equationText,
      correctAnswer,
    },
    options,
    explanation: `Difficulty: ${difficulty.toUpperCase()}. ${explanation}`,
    visualHint: `Solve step by step by isolating the unknown '?' on one side of the equation.`,
  };
}
