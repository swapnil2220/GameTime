import type { AptitudePuzzle, Option, DifficultyTier } from '../../types/game';
import { SeededRandom } from '../seed';

export interface RiddleData {
  riddle: string;
  questionText: string;
  correctAnswer: string;
  distractors: string[];
  explanation: string;
  triviaFact: string;
}

const LATERAL_RIDDLES: RiddleData[] = [
  {
    riddle: 'The Silent Traveler',
    questionText: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
    correctAnswer: 'An Echo',
    distractors: ['A Cloud', 'A Shadow', 'A Kite'],
    explanation: 'An Echo responds to sound waves and moves through air without physical form.',
    triviaFact: 'Echoes travel at the speed of sound: approximately 343 meters per second in air!',
  },
  {
    riddle: 'The Heavy Feather',
    questionText: 'What grows sharper the more you use it, but dulls when left untouched?',
    correctAnswer: 'Human Brain / Mind',
    distractors: ['A Pencil', 'A Kitchen Knife', 'A Diamond'],
    explanation: 'Cognitive skills and brain neural pathways sharpen through active mental exercises.',
    triviaFact: 'Neuroplasticity allows the human brain to reorganize synaptic connections throughout your entire lifetime!',
  },
  {
    riddle: 'The Empty Vessel',
    questionText: 'The more of this you take, the more you leave behind. What is it?',
    correctAnswer: 'Footsteps',
    distractors: ['Time', 'Memories', 'Breath'],
    explanation: 'Each step you take leaves behind another footprint.',
    triviaFact: 'Neil Armstrong\'s footprints on the Moon will remain preserved for millions of years due to lack of wind erosion!',
  },
];

export function generateLateralPuzzle(
  difficulty: DifficultyTier,
  rng: SeededRandom,
  seenIds: string[] = []
): AptitudePuzzle {
  const available = LATERAL_RIDDLES.filter((l) => !seenIds.includes(`lat_${l.riddle.toLowerCase().replace(/\s+/g, '_')}`));
  const item = available.length > 0 ? rng.pick(available) : rng.pick(LATERAL_RIDDLES);

  const rawOptions: Option[] = [
    { id: 'opt_c', content: item.correctAnswer, isCorrect: true },
  ];

  item.distractors.forEach((d, i) => {
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

  return {
    id: `lat_${item.riddle.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
    category: 'lateral',
    categoryTitle: 'Lateral Thinking Riddles',
    difficulty,
    levelNumber: 1,
    renderedData: {
      sportName: item.riddle,
      icon: '🧩',
      questionText: item.questionText,
    },
    options,
    explanation: `${item.explanation} 💡 DID YOU KNOW? ${item.triviaFact}`,
    visualHint: 'Think abstractly beyond literal physical objects.',
  };
}
