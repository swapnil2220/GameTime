import type { AptitudePuzzle, Option, DifficultyTier } from '../../types/game';
import { SeededRandom } from '../seed';

export interface SportsQuestionData {
  sportName: string;
  questionText: string;
  icon: string;
  correctAnswer: string;
  distractors: string[];
  explanation: string;
  triviaFact: string;
}

const SPORTS_QUESTIONS: SportsQuestionData[] = [
  {
    sportName: 'Basketball',
    questionText: 'How many points is a shot worth if taken from behind the arc line?',
    icon: '🏀',
    correctAnswer: '3 Points',
    distractors: ['2 Points', '4 Points', '1 Point'],
    explanation: 'Shots taken beyond the three-point arc line count as 3 points in basketball.',
    triviaFact: 'Basketball was invented in 1891 by Dr. James Naismith using two peach baskets as hoops!',
  },
  {
    sportName: 'Soccer / Football',
    questionText: 'How many players per team are on the pitch at the start of a match?',
    icon: '⚽',
    correctAnswer: '11 Players',
    distractors: ['10 Players', '12 Players', '9 Players'],
    explanation: 'Each football team fields 11 players including 1 goalkeeper.',
    triviaFact: 'The FIFA World Cup is watched by over 3.5 billion people worldwide!',
  },
  {
    sportName: 'Tennis',
    questionText: 'What term is used for a score of zero points in a tennis game?',
    icon: '🎾',
    correctAnswer: 'Love',
    distractors: ['Zero', 'Nil', 'Blank'],
    explanation: 'In tennis scoring, zero points is called "Love".',
    triviaFact: 'The term "Love" comes from the French word "l\'œuf" (meaning egg), representing zero shape!',
  },
  {
    sportName: 'Cricket',
    questionText: 'How many legal deliveries (balls) make up one complete over?',
    icon: '🏏',
    correctAnswer: '6 Balls',
    distractors: ['5 Balls', '8 Balls', '10 Balls'],
    explanation: 'An over in cricket consists of 6 legal deliveries bowled from one end.',
    triviaFact: 'Cricket is the second most popular spectator sport in the world after soccer!',
  },
  {
    sportName: 'Golf',
    questionText: 'What is a score of 1 stroke UNDER par on a hole called?',
    icon: '⛳',
    correctAnswer: 'Birdie',
    distractors: ['Eagle', 'Bogey', 'Albatross'],
    explanation: 'Scoring one stroke under par on a hole is called a Birdie.',
    triviaFact: 'Golf is one of only two sports ever played on the surface of the Moon (by Alan Shepard in 1971)!',
  },
];

export function generateSportsPuzzle(difficulty: DifficultyTier, rng: SeededRandom): AptitudePuzzle {
  const item = rng.pick(SPORTS_QUESTIONS);

  const rawOptions: Option[] = [];
  rawOptions.push({ id: 'opt_c', content: item.correctAnswer, isCorrect: true });

  item.distractors.forEach((d, i) => {
    rawOptions.push({ id: `opt_d_${i}`, content: d, isCorrect: false });
  });

  // Unique options check
  const options: Option[] = [];
  const seen = new Set<string>();

  for (const opt of rng.shuffle(rawOptions)) {
    if (!seen.has(opt.content)) {
      seen.add(opt.content);
      options.push(opt);
    }
  }

  return {
    id: `sports_${Date.now()}_${rng.range(100, 999)}`,
    category: 'sports',
    categoryTitle: 'Sports & World Arena',
    difficulty,
    levelNumber: 1,
    renderedData: item,
    options,
    explanation: `${item.explanation} 💡 DID YOU KNOW? ${item.triviaFact}`,
    visualHint: `Think about official ${item.sportName} match regulations.`,
  };
}
