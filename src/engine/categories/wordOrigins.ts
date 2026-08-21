import type { AptitudePuzzle, Option, DifficultyTier } from '../../types/game';
import { SeededRandom } from '../seed';

export interface EtymologyData {
  word: string;
  rootOrigin: string;
  questionText: string;
  correctAnswer: string;
  distractors: string[];
  explanation: string;
  triviaFact: string;
}

const ETYMOLOGY_QUESTIONS: EtymologyData[] = [
  {
    word: 'Hippopotamus',
    rootOrigin: 'Greek hippos + potamos',
    questionText: 'What does the ancient Greek root name "Hippopotamus" literally translate to?',
    correctAnswer: 'River Horse',
    distractors: ['Water Giant', 'Swamp Elephant', 'Mud Rhino'],
    explanation: 'Hippos comes from Greek hippos (horse) + potamos (river) = River Horse.',
    triviaFact: 'Hippos produce their own natural reddish sunscreen fluid called "blood sweat"!',
  },
  {
    word: 'Astronaut',
    rootOrigin: 'Greek astron + nautes',
    questionText: 'What does the word "Astronaut" translate to from its Greek root origins?',
    correctAnswer: 'Star Sailor',
    distractors: ['Sky Pilot', 'Space Traveler', 'Cosmic Scout'],
    explanation: 'Astronaut is derived from Greek astron (star) + nautes (sailor).',
    triviaFact: 'The Soviet Russian term "Cosmonaut" translates to "Cosmos Sailor"!',
  },
  {
    word: 'Salary',
    rootOrigin: 'Latin salarium',
    questionText: 'The word "Salary" comes from the Latin word "Salarium", which originally referred to payments for what substance?',
    correctAnswer: 'Salt',
    distractors: ['Silver', 'Silk', 'Spices'],
    explanation: 'Roman soldiers were given an allowance to purchase valuable salt (salarium).',
    triviaFact: 'Salt was so valuable in ancient times that it was used as currency across Africa and Rome!',
  },
  {
    word: 'Gymnasium',
    rootOrigin: 'Greek gymnasion',
    questionText: 'The word "Gymnasium" comes from the Greek root "Gymnos", which literally means what?',
    correctAnswer: 'Naked',
    distractors: ['Athletic', 'Strong', 'Exercise'],
    explanation: 'Greek athletes trained in the gymnasia without clothing (gymnos = naked).',
    triviaFact: 'Ancient Greek Olympic games competitors performed entirely unclothed as a tribute to Zeus!',
  },
];

export function generateWordOriginsPuzzle(
  difficulty: DifficultyTier,
  rng: SeededRandom,
  seenIds: string[] = []
): AptitudePuzzle {
  const available = ETYMOLOGY_QUESTIONS.filter((e) => !seenIds.includes(`etym_${e.word.toLowerCase()}`));
  const item = available.length > 0 ? rng.pick(available) : rng.pick(ETYMOLOGY_QUESTIONS);

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
    id: `etym_${item.word.toLowerCase()}_${Date.now()}`,
    category: 'word_origins',
    categoryTitle: 'Etymology & Word Origins',
    difficulty,
    levelNumber: 1,
    renderedData: {
      sportName: item.word,
      icon: '📖',
      questionText: item.questionText,
    },
    options,
    explanation: `${item.explanation} 💡 DID YOU KNOW? ${item.triviaFact}`,
    visualHint: `Root origins: ${item.rootOrigin}`,
  };
}
