import type { AptitudePuzzle, Option, DifficultyTier } from '../../types/game';
import { SeededRandom } from '../seed';

export interface LateralQuestionData {
  id: string;
  riddleType: string;
  icon: string;
  questionText: string;
  correctAnswer: string;
  distractors: string[];
  explanation: string;
  mindFact: string;
}

const LATERAL_QUESTIONS: LateralQuestionData[] = [
  {
    id: 'lat_01',
    riddleType: 'Situational Logic Paradox',
    icon: '🧩',
    questionText: 'A man builds a house with all four walls facing SOUTH. A bear walks past the house. What color is the bear?',
    correctAnswer: 'White',
    distractors: ['Black', 'Brown', 'Grizzly'],
    explanation: 'The only place on Earth where all four walls can face South is the geographic NORTH POLE. Therefore, the bear is a Polar Bear (White).',
    mindFact: 'At the exact North Pole, every direction you turn is South!',
  },
  {
    id: 'lat_02',
    riddleType: 'Wordplay Double-Meaning',
    icon: '💡',
    questionText: 'What occurs ONCE in every minute, TWICE in every moment, but NEVER in a thousand years?',
    correctAnswer: 'The letter M',
    distractors: ['A second', 'The Moon', 'A heartbeat'],
    explanation: 'The letter "M" appears once in "Minute", twice in "MoMent", and zero times in "Thousand Years".',
    mindFact: 'Lateral riddles trick the brain into thinking chronologically rather than linguistically!',
  },
  {
    id: 'lat_03',
    riddleType: 'Mathematical Paradox',
    icon: '⚖️',
    questionText: 'If 3 cats can catch 3 mice in 3 minutes, how many cats are needed to catch 100 mice in 100 minutes?',
    correctAnswer: '3 cats',
    distractors: ['100 cats', '33 cats', '300 cats'],
    explanation: 'If 3 cats catch 3 mice in 3 minutes, it means 3 cats catch 1 mouse per minute. In 100 minutes, those same 3 cats will catch 100 mice!',
    mindFact: 'Rate problems test per-unit productivity rather than proportional scaling!',
  },
  {
    id: 'lat_04',
    riddleType: 'Physics Perspective Shift',
    icon: '⏳',
    questionText: 'What gets wetter and wetter the more it dries?',
    correctAnswer: 'A Towel',
    distractors: ['A Sponge', 'A River', 'A Cloud'],
    explanation: 'As a towel dries water off an object, the towel itself absorbs moisture and becomes wetter.',
    mindFact: 'Semantic ambiguity occurs because "dries" can function as both an active verb and a passive state!',
  },
  {
    id: 'lat_05',
    riddleType: 'Sequential Logic',
    icon: '🔑',
    questionText: 'You enter a dark room with a match, an oil lamp, a kerosene heater, and a candle. What do you light FIRST?',
    correctAnswer: 'The Match',
    distractors: ['The Oil Lamp', 'The Candle', 'The Kerosene Heater'],
    explanation: 'Before you can light the lamp, candle, or heater, you must first ignite the match in your hand!',
    mindFact: 'Prerequisites must precede execution regardless of the target objective!',
  },
];

export function generateLateralPuzzle(difficulty: DifficultyTier, rng: SeededRandom, seenIds: string[] = []): AptitudePuzzle {
  const available = LATERAL_QUESTIONS.filter((q) => !seenIds.includes(q.id));
  const item = available.length > 0 ? rng.pick(available) : rng.pick(LATERAL_QUESTIONS);

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

  const fallbacks = ['The Sun', 'Zero', 'Time', 'A Shadow'];
  let extra = 0;
  while (options.length < 4 && extra < fallbacks.length) {
    if (!seen.has(fallbacks[extra])) {
      seen.add(fallbacks[extra]);
      options.push({ id: `opt_lat_fb_${extra}`, content: fallbacks[extra], isCorrect: false });
    }
    extra++;
  }

  return {
    id: item.id,
    category: 'lateral_thinking',
    categoryTitle: 'Riddles & Lateral Paradoxes',
    difficulty,
    levelNumber: 13,
    renderedData: item,
    options,
    explanation: `${item.explanation} 🧠 LATERAL INSIGHT: ${item.mindFact}`,
    visualHint: `Type: ${item.riddleType}. Think outside assumptions and examine double-meanings.`,
  };
}
