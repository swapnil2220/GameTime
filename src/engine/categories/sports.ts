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
  {
    sportName: 'Volleyball',
    questionText: 'How many maximum hits is a team allowed to return the ball over the net?',
    icon: '🏐',
    correctAnswer: '3 Hits',
    distractors: ['2 Hits', '4 Hits', '1 Hit'],
    explanation: 'A team is allowed a maximum of 3 touches before sending the ball over.',
    triviaFact: 'Volleyball was originally called "Mintonette" when created in 1895!',
  },
  {
    sportName: 'Baseball',
    questionText: 'How many strikes constitute an out for a batter at plate?',
    icon: '⚾',
    correctAnswer: '3 Strikes',
    distractors: ['4 Strikes', '2 Strikes', '5 Strikes'],
    explanation: 'Accumulating 3 strikes results in a strikeout.',
    triviaFact: 'The oldest active baseball stadium is Fenway Park, built in 1912!',
  },
  {
    sportName: 'Rugby Union',
    questionText: 'How many points is awarded for a successful try scored?',
    icon: '🏉',
    correctAnswer: '5 Points',
    distractors: ['3 Points', '6 Points', '4 Points'],
    explanation: 'A try in Rugby Union is worth 5 points, followed by a conversion kick worth 2 points.',
    triviaFact: 'Rugby was invented at Rugby School in England when William Webb Ellis picked up the ball!',
  },
  {
    sportName: 'Swimming',
    questionText: 'Which stroke is performed while lying on the back in water?',
    icon: '🏊',
    correctAnswer: 'Backstroke',
    distractors: ['Freestyle', 'Butterfly', 'Breaststroke'],
    explanation: 'Backstroke is the only official competitive stroke swum on the back.',
    triviaFact: 'Freestyle is the fastest competitive swimming stroke!',
  },
  {
    sportName: 'Formula 1',
    questionText: 'What color flag signals to drivers that the session or race has finished?',
    icon: '🏎️',
    correctAnswer: 'Chequered Flag',
    distractors: ['Red Flag', 'Yellow Flag', 'Green Flag'],
    explanation: 'The black-and-white chequered flag signifies the end of a race.',
    triviaFact: 'F1 cars can generate enough aerodynamic downforce to drive upside down in a tunnel at 120 mph!',
  },
  {
    sportName: 'Ice Hockey',
    questionText: 'What is the disk-shaped object used instead of a ball in ice hockey?',
    icon: '🏒',
    correctAnswer: 'Puck',
    distractors: ['Disk', 'Orb', 'Pellet'],
    explanation: 'Ice hockey is played with a vulcanized rubber puck.',
    triviaFact: 'Original ice hockey pucks used in the 1800s were made from frozen cow dung!',
  },
  {
    sportName: 'Badminton',
    questionText: 'What is the conical feathered projectile hit back and forth in badminton?',
    icon: '🏸',
    correctAnswer: 'Shuttlecock',
    distractors: ['Featherball', 'Birdie', 'Flyer'],
    explanation: 'The projectile in badminton is called a shuttlecock (or birdie).',
    triviaFact: 'The fastest recorded badminton smash reached a staggering speed of 565 km/h (351 mph)!',
  },
  {
    sportName: 'Table Tennis',
    questionText: 'How many points are required to win a standard game of table tennis (lead by 2)?',
    icon: '🏓',
    correctAnswer: '11 Points',
    distractors: ['21 Points', '15 Points', '10 Points'],
    explanation: 'Modern table tennis games are played to 11 points (changed from 21 points in 2001).',
    triviaFact: 'Table tennis was invented in Victorian England as an indoor parlor game called "Ping-Pong"!',
  },
  {
    sportName: 'Boxing',
    questionText: 'What is the maximum duration of a standard championship round in professional boxing?',
    icon: '🥊',
    correctAnswer: '3 Minutes',
    distractors: ['2 Minutes', '5 Minutes', '4 Minutes'],
    explanation: 'Professional men’s boxing rounds last 3 minutes with 1 minute of rest between rounds.',
    triviaFact: 'Boxing gloves were introduced to protect the boxer’s hands, not the opponent’s face!',
  },
  {
    sportName: 'Archery',
    questionText: 'What color is the highest-scoring center ring (10 points) on a standard target?',
    icon: '🏹',
    correctAnswer: 'Gold / Yellow',
    distractors: ['Red', 'Blue', 'Black'],
    explanation: 'The center bullseye rings (9 and 10 points) are colored gold/yellow.',
    triviaFact: 'Archery is the national sport of the Kingdom of Bhutan!',
  },
];

export function generateSportsPuzzle(
  difficulty: DifficultyTier,
  rng: SeededRandom,
  seenIds: string[] = []
): AptitudePuzzle {
  const available = SPORTS_QUESTIONS.filter((s) => !seenIds.includes(`sports_${s.sportName.toLowerCase()}`));
  const item = available.length > 0 ? rng.pick(available) : rng.pick(SPORTS_QUESTIONS);

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

  const fallbackValues = ['1 Point', '5 Points', '10 Points', 'Red Card', 'Whistle'];
  let extra = 0;
  while (options.length < 4 && extra < fallbackValues.length) {
    if (!seen.has(fallbackValues[extra])) {
      seen.add(fallbackValues[extra]);
      options.push({ id: `opt_fb_${extra}`, content: fallbackValues[extra], isCorrect: false });
    }
    extra++;
  }

  return {
    id: `sports_${item.sportName.toLowerCase()}_${Date.now()}`,
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
