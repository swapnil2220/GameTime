import type { AptitudePuzzle, Option, DifficultyTier } from '../../types/game';
import { SeededRandom } from '../seed';

export interface CinemaQuestionData {
  movieTitle: string;
  questionText: string;
  icon: string;
  correctAnswer: string;
  distractors: string[];
  explanation: string;
  triviaFact: string;
}

const CINEMA_QUESTIONS: CinemaQuestionData[] = [
  {
    movieTitle: 'The Matrix',
    questionText: 'Which pill color does Neo choose to take from Morpheus to see how deep the rabbit hole goes?',
    icon: '🕶️',
    correctAnswer: 'Red Pill',
    distractors: ['Blue Pill', 'Green Pill', 'Yellow Pill'],
    explanation: 'Neo takes the Red Pill to unlock the truth of the Matrix.',
    triviaFact: 'The iconic green code rain in The Matrix consists of Japanese sushi recipe characters!',
  },
  {
    movieTitle: 'Titanic',
    questionText: 'Which famous song performed by Celine Dion served as the main theme song for Titanic?',
    icon: '🚢',
    correctAnswer: 'My Heart Will Go On',
    distractors: ['I Will Always Love You', 'Un-Break My Heart', 'A Whole New World'],
    explanation: 'My Heart Will Go On won the Academy Award for Best Original Song in 1997.',
    triviaFact: 'Titanic was nominated for 14 Academy Awards, tying All About Eve for the most nominations ever!',
  },
  {
    movieTitle: 'Avatar',
    questionText: 'What is the name of the lush habitable alien moon where Avatar takes place?',
    icon: '🌌',
    correctAnswer: 'Pandora',
    distractors: ['Endor', 'Tatooine', 'Vulcan'],
    explanation: 'Avatar is set on Pandora, a moon orbiting Polyphemus in the Alpha Centauri system.',
    triviaFact: 'Director James Cameron hired linguist Paul Frommer to construct a functional Na\'vi language with over 1,000 words!',
  },
  {
    movieTitle: 'Inception',
    questionText: 'What small metallic object does Cobb spin as his personal totem to test reality?',
    icon: '🌀',
    correctAnswer: 'Spinning Top',
    distractors: ['Brass Loaded Die', 'Loaded Chess Pawn', 'Silver Coin'],
    explanation: 'Cobb uses a spinning top: if it spins indefinitely, he is in a dream state.',
    triviaFact: 'The main theme score "Time" by Hans Zimmer uses slowed-down fragments of Edith Piaf\'s song "Non, je ne regrette rien"!',
  },
  {
    movieTitle: 'Interstellar',
    questionText: 'What is the name of the supermassive black hole around which the target planets orbit?',
    icon: '🕳️',
    correctAnswer: 'Gargantua',
    distractors: ['Singularity', 'Leviathan', 'Behemoth'],
    explanation: 'Gargantua is the central supermassive black hole featured in Interstellar.',
    triviaFact: 'Physicist Kip Thorne generated mathematical equations that allowed VFX artists to render the world\'s most scientifically accurate CGI black hole!',
  },
  {
    movieTitle: 'Spider-Man',
    questionText: 'Which iconic phrase is stated by Uncle Ben to Peter Parker?',
    icon: '🕷️',
    correctAnswer: 'With great power comes great responsibility',
    distractors: [
      'Fear is the path to the dark side',
      'It is not who I am underneath, but what I do',
      'The harder you fall, the higher you bounce'
    ],
    explanation: 'Uncle Ben advises Peter that with great power comes great responsibility.',
    triviaFact: 'Spider-Man first appeared in Amazing Fantasy #15 comic in August 1962!',
  },
];

export function generateCinemaPuzzle(
  difficulty: DifficultyTier,
  rng: SeededRandom,
  seenIds: string[] = []
): AptitudePuzzle {
  const available = CINEMA_QUESTIONS.filter((c) => !seenIds.includes(`cin_${c.movieTitle.toLowerCase().replace(/\s+/g, '_')}`));
  const item = available.length > 0 ? rng.pick(available) : rng.pick(CINEMA_QUESTIONS);

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
    id: `cin_${item.movieTitle.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
    category: 'cinema',
    categoryTitle: 'Cinema & Film Trivia',
    difficulty,
    levelNumber: 1,
    renderedData: {
      sportName: item.movieTitle,
      icon: item.icon,
      questionText: item.questionText,
    },
    options,
    explanation: `${item.explanation} 💡 DID YOU KNOW? ${item.triviaFact}`,
    visualHint: `Think about iconic scenes in ${item.movieTitle}.`,
  };
}
