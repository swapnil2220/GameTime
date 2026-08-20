import type { AptitudePuzzle, Option, DifficultyTier } from '../../types/game';
import { SeededRandom } from '../seed';

export interface VerbalAnalogyData {
  id: string;
  wordA: string;
  wordB: string;
  wordC: string;
  correctAnswer: string;
  distractor1: string;
  distractor2: string;
  distractor3: string;
  relationshipType: string;
  explanation: string;
}

const VERBAL_ANALOGIES: VerbalAnalogyData[] = [
  {
    id: 'van_01',
    wordA: 'AUTHOR',
    wordB: 'BOOK',
    wordC: 'SCULPTOR',
    correctAnswer: 'STATUE',
    distractor1: 'CHISEL',
    distractor2: 'MUSEUM',
    distractor3: 'PAINTING',
    relationshipType: 'Creator to Created Product',
    explanation: 'An Author creates a Book; similarly, a Sculptor creates a Statue.',
  },
  {
    id: 'van_02',
    wordA: 'THERMOMETER',
    wordB: 'TEMPERATURE',
    wordC: 'BAROMETER',
    correctAnswer: 'AIR PRESSURE',
    distractor1: 'HUMIDITY',
    distractor2: 'SPEED',
    distractor3: 'ALTITUDE',
    relationshipType: 'Instrument to Measurement',
    explanation: 'A Thermometer measures Temperature; a Barometer measures Air Pressure.',
  },
  {
    id: 'van_03',
    wordA: 'PUPIL',
    wordB: 'EYE',
    wordC: 'COCHLEA',
    correctAnswer: 'EAR',
    distractor1: 'NOSE',
    distractor2: 'THROAT',
    distractor3: 'BRAIN',
    relationshipType: 'Anatomical Part to Sensory Organ',
    explanation: 'The Pupil is an anatomical part of the Eye; the Cochlea is an anatomical part of the Ear.',
  },
  {
    id: 'van_04',
    wordA: 'CANDLE',
    wordB: 'WAX',
    wordC: 'PAPER',
    correctAnswer: 'PULP',
    distractor1: 'TREE',
    distractor2: 'INK',
    distractor3: 'BOOK',
    relationshipType: 'Finished Item to Primary Material',
    explanation: 'A Candle is made from Wax; Paper is made from Wood Pulp.',
  },
  {
    id: 'van_05',
    wordA: 'SPIDER',
    wordB: 'WEB',
    wordC: 'BEAVER',
    correctAnswer: 'DAM',
    distractor1: 'RIVER',
    distractor2: 'LOG',
    distractor3: 'NEST',
    relationshipType: 'Animal to Built Structure',
    explanation: 'A Spider builds a Web; a Beaver builds a Dam.',
  },
  {
    id: 'van_06',
    wordA: 'NECTAR',
    wordB: 'HONEY',
    wordC: 'MILK',
    correctAnswer: 'BUTTER',
    distractor1: 'COW',
    distractor2: 'CHEESE',
    distractor3: 'WATER',
    relationshipType: 'Raw Material to Refined Product',
    explanation: 'Nectar is processed into Honey; Milk is processed into Butter.',
  },
  {
    id: 'van_07',
    wordA: 'EXPAND',
    wordB: 'CONTRACT',
    wordC: 'ASCEND',
    correctAnswer: 'DESCEND',
    distractor1: 'CLIMB',
    distractor2: 'FLY',
    distractor3: 'HEIGHT',
    relationshipType: 'Antonyms / Opposites',
    explanation: 'Expand is the opposite of Contract; Ascend is the opposite of Descend.',
  },
  {
    id: 'van_08',
    wordA: 'TELESCOPE',
    wordB: 'STAR',
    wordC: 'MICROSCOPE',
    correctAnswer: 'CELL',
    distractor1: 'LABORATORY',
    distractor2: 'GLASS',
    distractor3: 'ATOM',
    relationshipType: 'Instrument to Target Object',
    explanation: 'A Telescope magnifies distant Stars; a Microscope magnifies microscopic Cells.',
  },
];

export function generateVerbalAnalogyPuzzle(difficulty: DifficultyTier, rng: SeededRandom, seenIds: string[] = []): AptitudePuzzle {
  const available = VERBAL_ANALOGIES.filter((a) => !seenIds.includes(a.id));
  const item = available.length > 0 ? rng.pick(available) : rng.pick(VERBAL_ANALOGIES);

  const rawOptions: Option[] = [
    { id: 'opt_c', content: item.correctAnswer, isCorrect: true },
    { id: 'opt_d1', content: item.distractor1, isCorrect: false },
    { id: 'opt_d2', content: item.distractor2, isCorrect: false },
    { id: 'opt_d3', content: item.distractor3, isCorrect: false },
  ];

  const options: Option[] = [];
  const seen = new Set<string>();

  for (const opt of rng.shuffle(rawOptions)) {
    if (!seen.has(opt.content)) {
      seen.add(opt.content);
      options.push(opt);
    }
  }

  const fallbacks = ['CANVAS', 'ENGINE', 'SPEED', 'GALAXY'];
  let extra = 0;
  while (options.length < 4 && extra < fallbacks.length) {
    if (!seen.has(fallbacks[extra])) {
      seen.add(fallbacks[extra]);
      options.push({ id: `opt_van_fb_${extra}`, content: fallbacks[extra], isCorrect: false });
    }
    extra++;
  }

  return {
    id: item.id,
    category: 'verbal_analogy',
    categoryTitle: 'Verbal Word Analogies',
    difficulty,
    levelNumber: 7,
    renderedData: item,
    options,
    explanation: `${item.wordA} : ${item.wordB} :: ${item.wordC} : ${item.correctAnswer}. Rule (${item.relationshipType}): ${item.explanation}`,
    visualHint: `Analyze the relationship between ${item.wordA} and ${item.wordB}, then apply it to ${item.wordC}.`,
  };
}
