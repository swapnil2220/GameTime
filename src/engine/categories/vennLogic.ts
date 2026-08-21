import type { AptitudePuzzle, Option, DifficultyTier } from '../../types/game';
import { SeededRandom } from '../seed';

export interface VennQuestionData {
  itemA: string;
  itemB: string;
  itemC: string;
  relationType: 'concentric' | 'overlapping' | 'disjoint' | 'two_in_one';
}

const VENN_DATASET: VennQuestionData[] = [
  {
    itemA: 'Mammals',
    itemB: 'Dogs',
    itemC: 'Golden Retrievers',
    relationType: 'concentric',
  },
  {
    itemA: 'Teachers',
    itemB: 'Writers',
    itemC: 'Musicians',
    relationType: 'overlapping',
  },
  {
    itemA: 'Cars',
    itemB: 'Bicycles',
    itemC: 'Airplanes',
    relationType: 'disjoint',
  },
  {
    itemA: 'Furniture',
    itemB: 'Chairs',
    itemC: 'Tables',
    relationType: 'two_in_one',
  },
  {
    itemA: 'Animals',
    itemB: 'Pets',
    itemC: 'Cats',
    relationType: 'concentric',
  },
  {
    itemA: 'Doctors',
    itemB: 'Athletes',
    itemC: 'Singers',
    relationType: 'overlapping',
  },
  {
    itemA: 'Apples',
    itemB: 'Bananas',
    itemC: 'Oranges',
    relationType: 'disjoint',
  },
  {
    itemA: 'Vehicles',
    itemB: 'Trucks',
    itemC: 'Motorcycles',
    relationType: 'two_in_one',
  },
  {
    itemA: 'Planets',
    itemB: 'Terrestrial Planets',
    itemC: 'Mars',
    relationType: 'concentric',
  },
  {
    itemA: 'Engineers',
    itemB: 'Gamers',
    itemC: 'Chess Players',
    relationType: 'overlapping',
  },
];

export function generateVennPuzzle(difficulty: DifficultyTier, rng: SeededRandom, _seenIds: string[] = []): AptitudePuzzle {
  const pickedData = rng.pick(VENN_DATASET);

  const rawOptions: Option[] = [
    { id: 'opt_concentric', content: 'Concentric Circles (Subset inside Subset)', isCorrect: pickedData.relationType === 'concentric' },
    { id: 'opt_overlapping', content: 'Overlapping Circles (Intersection)', isCorrect: pickedData.relationType === 'overlapping' },
    { id: 'opt_disjoint', content: 'Disjoint Circles (Separate Groups)', isCorrect: pickedData.relationType === 'disjoint' },
    { id: 'opt_two_in_one', content: 'Two Disjoint Circles inside One Big Circle', isCorrect: pickedData.relationType === 'two_in_one' },
  ];

  const options: Option[] = [];
  const seen = new Set<string>();

  for (const opt of rng.shuffle(rawOptions)) {
    if (!seen.has(opt.content)) {
      seen.add(opt.content);
      options.push(opt);
    }
  }

  const explanations: Record<VennQuestionData['relationType'], string> = {
    concentric: `All ${pickedData.itemC} are ${pickedData.itemB}, and all ${pickedData.itemB} are ${pickedData.itemA}. Thus concentric subsets!`,
    overlapping: `Some ${pickedData.itemA} are ${pickedData.itemB}, and some can be ${pickedData.itemC}. They overlap in intersection!`,
    disjoint: `${pickedData.itemA}, ${pickedData.itemB}, and ${pickedData.itemC} are mutually exclusive categories. Completely separate!`,
    two_in_one: `Both ${pickedData.itemB} and ${pickedData.itemC} belong to ${pickedData.itemA}, but they do not overlap with each other!`,
  };

  return {
    id: `venn_${Date.now()}_${rng.range(100, 999)}`,
    category: 'venn',
    categoryTitle: 'Venn Diagram Set Logic',
    difficulty,
    levelNumber: 3,
    renderedData: pickedData,
    options,
    explanation: explanations[pickedData.relationType],
    visualHint: `Think: Are all ${pickedData.itemC} a type of ${pickedData.itemB}? Or do they partially overlap?`,
  };
}
