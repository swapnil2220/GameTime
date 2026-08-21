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
    question: 'What can be validly deduced?',
    correctConclusion: 'Some Machines are Robots.',
    wrongConclusion1: 'All Autonomous items are Robots.',
    wrongConclusion2: 'No Robots are Autonomous.',
    wrongConclusion3: 'All Robots are Autonomous.',
  },
  {
    premise1: 'No Reptiles have Feathers.',
    premise2: 'All Snakes are Reptiles.',
    question: 'Which statement logically follows?',
    correctConclusion: 'No Snakes have Feathers.',
    wrongConclusion1: 'All Snakes have Feathers.',
    wrongConclusion2: 'Some Snakes have Feathers.',
    wrongConclusion3: 'All Feathers belong to Snakes.',
  },
  {
    premise1: 'Some Scientists are Musicians.',
    premise2: 'All Musicians are Artists.',
    question: 'Which conclusion is guaranteed true?',
    correctConclusion: 'Some Scientists are Artists.',
    wrongConclusion1: 'All Artists are Scientists.',
    wrongConclusion2: 'No Scientists are Artists.',
    wrongConclusion3: 'All Scientists are Musicians.',
  },
  {
    premise1: 'All Planets orbit a Star.',
    premise2: 'Earth is a Planet.',
    question: 'What MUST be true?',
    correctConclusion: 'Earth orbits a Star.',
    wrongConclusion1: 'Stars orbit Earth.',
    wrongConclusion2: 'Earth is a Star.',
    wrongConclusion3: 'No Planets orbit Stars.',
  },
  {
    premise1: 'All Mammals are Warm-blooded.',
    premise2: 'Dolphins are Mammals.',
    question: 'Which conclusion is valid?',
    correctConclusion: 'Dolphins are Warm-blooded.',
    wrongConclusion1: 'Warm-blooded creatures are Dolphins.',
    wrongConclusion2: 'Dolphins are Cold-blooded.',
    wrongConclusion3: 'No Dolphins are Warm-blooded.',
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

export function generateSyllogismPuzzle(
  difficulty: DifficultyTier,
  rng: SeededRandom,
  seenIds: string[] = []
): AptitudePuzzle {
  const available = SYLLOGISM_POOL.filter((s) => !seenIds.includes(`syl_${s.premise1.toLowerCase().replace(/\s+/g, '_')}`));
  const item = available.length > 0 ? rng.pick(available) : rng.pick(SYLLOGISM_POOL);

  const rawOptions: Option[] = [
    { id: 'opt_c', content: item.correctConclusion, isCorrect: true },
    { id: 'opt_w1', content: item.wrongConclusion1, isCorrect: false },
    { id: 'opt_w2', content: item.wrongConclusion2, isCorrect: false },
    { id: 'opt_w3', content: item.wrongConclusion3, isCorrect: false },
  ];

  const options: Option[] = [];
  const seen = new Set<string>();

  for (const opt of rng.shuffle(rawOptions)) {
    if (!seen.has(opt.content)) {
      seen.add(opt.content);
      options.push(opt);
    }
  }

  return {
    id: `syl_${item.premise1.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
    category: 'syllogism',
    categoryTitle: 'Deductive Syllogisms',
    difficulty,
    levelNumber: 1,
    renderedData: {
      premise1: item.premise1,
      premise2: item.premise2,
      questionText: item.question,
    },
    options,
    explanation: `From "${item.premise1}" and "${item.premise2}", it logically follows that: "${item.correctConclusion}".`,
    visualHint: 'Diagram the sets using Venn circles to verify set containment.',
  };
}
