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

const SYLLOGISM_POOL: SyllogismData[] = [
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
  {
    premise1: 'All Stars are Luminous Bodies.',
    premise2: 'The Sun is a Star.',
    question: 'What MUST be concluded?',
    correctConclusion: 'The Sun is a Luminous Body.',
    wrongConclusion1: 'All Luminous Bodies are Suns.',
    wrongConclusion2: 'The Sun is not Luminous.',
    wrongConclusion3: 'No Stars are Luminous.',
  },
  {
    premise1: 'All Planets revolve around a Star.',
    premise2: 'Earth is a Planet.',
    question: 'Which conclusion MUST hold true?',
    correctConclusion: 'Earth revolves around a Star.',
    wrongConclusion1: 'All Stars revolve around Earth.',
    wrongConclusion2: 'Earth does not revolve.',
    wrongConclusion3: 'Some Planets do not revolve around Stars.',
  },
  {
    premise1: 'No Mammals are Insects.',
    premise2: 'All Whales are Mammals.',
    question: 'Which statement MUST be true?',
    correctConclusion: 'No Whales are Insects.',
    wrongConclusion1: 'Some Whales are Insects.',
    wrongConclusion2: 'All Insects are Mammals.',
    wrongConclusion3: 'Some Mammals are Insects.',
  },
  {
    premise1: 'All Diamonds are Minerals.',
    premise2: 'All Minerals are Natural Solids.',
    question: 'Which deduction is valid?',
    correctConclusion: 'All Diamonds are Natural Solids.',
    wrongConclusion1: 'All Natural Solids are Diamonds.',
    wrongConclusion2: 'No Diamonds are Natural Solids.',
    wrongConclusion3: 'Some Minerals are not Natural Solids.',
  },
  {
    premise1: 'Some Coders are Photographers.',
    premise2: 'All Photographers are Artists.',
    question: 'What follows logically?',
    correctConclusion: 'Some Coders are Artists.',
    wrongConclusion1: 'All Coders are Artists.',
    wrongConclusion2: 'No Coders are Artists.',
    wrongConclusion3: 'All Artists are Photographers.',
  },
  {
    premise1: 'All Squares are Rectangles.',
    premise2: 'All Rectangles are Quadrilaterals.',
    question: 'Which statement MUST be true?',
    correctConclusion: 'All Squares are Quadrilaterals.',
    wrongConclusion1: 'All Quadrilaterals are Squares.',
    wrongConclusion2: 'No Squares are Quadrilaterals.',
    wrongConclusion3: 'Some Quadrilaterals are not Rectangles.',
  },
  {
    premise1: 'No Carnivores eat Leaves.',
    premise2: 'Lions are Carnivores.',
    question: 'What conclusion MUST be true?',
    correctConclusion: 'Lions do not eat Leaves.',
    wrongConclusion1: 'Lions eat Leaves.',
    wrongConclusion2: 'All Leaf eaters are Lions.',
    wrongConclusion3: 'Some Carnivores eat Leaves.',
  },
];

export function generateSyllogismPuzzle(difficulty: DifficultyTier, rng: SeededRandom): AptitudePuzzle {
  const item = rng.pick(SYLLOGISM_POOL);

  const rawOptions: Option[] = [
    { id: 'opt_c', content: item.correctConclusion, isCorrect: true },
    { id: 'opt_w1', content: item.wrongConclusion1, isCorrect: false },
    { id: 'opt_w2', content: item.wrongConclusion2, isCorrect: false },
    { id: 'opt_w3', content: item.wrongConclusion3, isCorrect: false },
  ];

  // Guarantee 4 unique options
  const options: Option[] = [];
  const seen = new Set<string>();

  for (const opt of rng.shuffle(rawOptions)) {
    if (!seen.has(opt.content)) {
      seen.add(opt.content);
      options.push(opt);
    }
  }

  // Fallback guard
  const fallbackConclusions = [
    'Cannot be determined from given premises.',
    'None of the above conclusions follow.',
    'All statement premises are contradictory.',
  ];
  let extra = 0;
  while (options.length < 4 && extra < fallbackConclusions.length) {
    if (!seen.has(fallbackConclusions[extra])) {
      seen.add(fallbackConclusions[extra]);
      options.push({ id: `opt_s_fb_${extra}`, content: fallbackConclusions[extra], isCorrect: false });
    }
    extra++;
  }

  return {
    id: `syll_${Date.now()}_${rng.range(100, 999)}`,
    category: 'syllogism',
    categoryTitle: 'Speed Syllogisms',
    difficulty,
    levelNumber: 5,
    renderedData: item,
    options,
    explanation: `Transit Rule: ${item.premise1} + ${item.premise2} implies "${item.correctConclusion}".`,
    visualHint: `Map the sets: Premise 1 & 2 set containment.`,
  };
}
