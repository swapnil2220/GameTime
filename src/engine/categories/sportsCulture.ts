import type { AptitudePuzzle, Option, DifficultyTier } from '../../types/game';
import { SeededRandom } from '../seed';

export interface SportsQuestion {
  question: string;
  correctAnswer: string;
  wrongAnswers: string[];
  iconEmoji: string;
  explanation: string;
}

const SPORTS_DATABASE: SportsQuestion[] = [
  {
    question: 'How many players are on the field for one team in a standard Soccer (Football) match?',
    correctAnswer: '11 Players',
    wrongAnswers: ['9 Players', '10 Players', '12 Players'],
    iconEmoji: '⚽',
    explanation: 'A standard soccer team fields 11 players including 1 goalkeeper.',
  },
  {
    question: 'Which country has won the most FIFA Men’s World Cup titles (5 titles)?',
    correctAnswer: 'Brazil',
    wrongAnswers: ['Germany', 'Argentina', 'Italy'],
    iconEmoji: '🏆',
    explanation: 'Brazil holds the record with 5 FIFA World Cup victories (1958, 1962, 1970, 1994, 2002).',
  },
  {
    question: 'In Tennis, what is the term for a score of 40-40?',
    correctAnswer: 'Deuce',
    wrongAnswers: ['Love', 'Fault', 'Advantage'],
    iconEmoji: '🎾',
    explanation: 'When both players reach 40 points in a game, the score is termed "Deuce".',
  },
  {
    question: 'How many rings make up the official Olympic symbol?',
    correctAnswer: '5 Rings',
    wrongAnswers: ['4 Rings', '6 Rings', '7 Rings'],
    iconEmoji: '🥇',
    explanation: 'The 5 interlocking rings represent the five inhabited continents of the world.',
  },
  {
    question: 'What is a maximum break score in a single frame of Snooker?',
    correctAnswer: '147',
    wrongAnswers: ['150', '140', '180'],
    iconEmoji: '🎱',
    explanation: 'Potting 15 reds with 15 blacks followed by all colors yields a maximum score of 147.',
  },
  {
    question: 'In Basketball, how far is the 3-point line from the basket in the NBA?',
    correctAnswer: '23 feet 9 inches (7.24 m)',
    wrongAnswers: ['20 feet', '25 feet', '18 feet'],
    iconEmoji: '🏀',
    explanation: 'The NBA 3-point arc is 23 ft 9 in at the top of the key and 22 ft in the corners.',
  },
];

export function generateSportsPuzzle(difficulty: DifficultyTier, rng: SeededRandom): AptitudePuzzle {
  const item = rng.pick(SPORTS_DATABASE);

  const options: Option[] = [
    { id: 'opt_c', content: item.correctAnswer, isCorrect: true },
    ...item.wrongAnswers.map((w, i) => ({ id: `opt_w_${i}`, content: w, isCorrect: false })),
  ];

  return {
    id: `sports_${Date.now()}_${rng.range(100, 999)}`,
    category: 'sports',
    categoryTitle: 'Sports & Global Culture Trivia',
    difficulty,
    levelNumber: 19,
    renderedData: {
      question: item.question,
      iconEmoji: item.iconEmoji,
    },
    options: rng.shuffle(options),
    explanation: item.explanation,
    visualHint: `Recall standard official rules for ${item.iconEmoji}.`,
  };
}
