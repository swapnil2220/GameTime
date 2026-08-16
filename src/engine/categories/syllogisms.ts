import type { AptitudePuzzle, Option, DifficultyTier } from '../../types/game';
import { SeededRandom } from '../seed';

export interface SyllogismData {
  premise1: string;
  premise2: string;
  question: string;
  correctConclusion: string;
  wrongConclusion1: string;
  wrongConclusion2: string;
  wrongConclusion3: string;
}

export function generateSyllogismPuzzle(difficulty: DifficultyTier, rng: SeededRandom): AptitudePuzzle {
  const pool: SyllogismData[] = [
    {
      premise1: 'All Architects are Designers.',
      premise2: 'All Designers are Creators.',
      question: 'Which conclusion MUST be logically true?',
      correctConclusion: 'All Architects are Creators.',
      wrongConclusion1: 'All Creators are Architects.',
      wrongConclusion2: 'No Architects are Creators.',
      wrongConclusion3: 'Some Creators are not Designers.',
    },
    {
      premise1: 'All Robots are Machines.',
      premise2: 'Some Machines are Autonomous.',
      question: 'Which statement is ALWAYS true based ONLY on the premises?',
      correctConclusion: 'Some Machines are Robots.',
      wrongConclusion1: 'All Robots are Autonomous.',
      wrongConclusion2: 'No Machines are Robots.',
      wrongConclusion3: 'All Autonomous items are Robots.',
    },
    {
      premise1: 'No Reptiles have Feathers.',
      premise2: 'All Snakes are Reptiles.',
      question: 'What follows logically?',
      correctConclusion: 'No Snakes have Feathers.',
      wrongConclusion1: 'Some Snakes have Feathers.',
      wrongConclusion2: 'All Reptiles are Snakes.',
      wrongConclusion3: 'Some Feathers are Snakes.',
    },
  ];

  const item = rng.pick(pool);

  const options: Option[] = [
    { id: 'opt_c', content: item.correctConclusion, isCorrect: true },
    { id: 'opt_w1', content: item.wrongConclusion1, isCorrect: false },
    { id: 'opt_w2', content: item.wrongConclusion2, isCorrect: false },
    { id: 'opt_w3', content: item.wrongConclusion3, isCorrect: false },
  ];

  const shuffledOptions = rng.shuffle(options);

  return {
    id: `syll_${Date.now()}_${rng.range(100, 999)}`,
    category: 'syllogism',
    categoryTitle: 'Speed Syllogisms',
    difficulty,
    levelNumber: 5,
    renderedData: item,
    options: shuffledOptions,
    explanation: `Transit Rule: ${item.premise1} + ${item.premise2} implies "${item.correctConclusion}".`,
    visualHint: `Map the sets: Set A ⊂ Set B ⊂ Set C.`,
  };
}
