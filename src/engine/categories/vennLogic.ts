import type { AptitudePuzzle, Option, DifficultyTier } from '../../types/game';
import { SeededRandom } from '../seed';

export interface VennQuestionData {
  itemA: string;
  itemB: string;
  itemC: string;
  relationType: 'concentric' | 'overlapping' | 'disjoint' | 'two_in_one';
}

export function generateVennPuzzle(difficulty: DifficultyTier, rng: SeededRandom): AptitudePuzzle {
  const dataset: VennQuestionData[] = [
    {
      itemA: 'Mammals',
      itemB: 'Dogs',
      itemC: 'Golden Retrievers',
      relationType: 'concentric', // Golden Retrievers inside Dogs inside Mammals
    },
    {
      itemA: 'Teachers',
      itemB: 'Writers',
      itemC: 'Musicians',
      relationType: 'overlapping', // People can be all three
    },
    {
      itemA: 'Cars',
      itemB: 'Bicycles',
      itemC: 'Airplanes',
      relationType: 'disjoint', // Completely separate transport modes
    },
    {
      itemA: 'Furniture',
      itemB: 'Chairs',
      itemC: 'Tables',
      relationType: 'two_in_one', // Chairs and Tables inside Furniture, separate from each other
    },
  ];

  const pickedData = rng.pick(dataset);

  const options: Option[] = [
    { id: 'opt_concentric', content: 'Concentric Circles (Subset inside Subset)', isCorrect: pickedData.relationType === 'concentric' },
    { id: 'opt_overlapping', content: 'Overlapping Circles (Intersection)', isCorrect: pickedData.relationType === 'overlapping' },
    { id: 'opt_disjoint', content: 'Disjoint Circles (Separate Groups)', isCorrect: pickedData.relationType === 'disjoint' },
    { id: 'opt_two_in_one', content: 'Two Disjoint Circles inside One Big Circle', isCorrect: pickedData.relationType === 'two_in_one' },
  ];

  const shuffledOptions = rng.shuffle(options);

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
    options: shuffledOptions,
    explanation: explanations[pickedData.relationType],
    visualHint: `Think: Are all ${pickedData.itemC} a type of ${pickedData.itemB}? Or do they partially overlap?`,
  };
}
