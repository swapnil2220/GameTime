import type { AptitudePuzzle, Option, DifficultyTier } from '../../types/game';
import { SeededRandom } from '../seed';

export interface CinemaQuestionData {
  id: string;
  genre: string;
  icon: string;
  questionText: string;
  correctAnswer: string;
  distractors: string[];
  explanation: string;
  popFact: string;
}

const CINEMA_QUESTIONS: CinemaQuestionData[] = [
  {
    id: 'cin_01',
    genre: 'Oscar Records & Cinema',
    icon: '🎬',
    questionText: 'Which legendary 1994 film won 6 Academy Awards, including Best Picture, Best Director, and Best Actor for Tom Hanks?',
    correctAnswer: 'Forrest Gump',
    distractors: ['The Shawshank Redemption', 'Pulp Fiction', 'Titanic'],
    explanation: 'Forrest Gump triumphed at the 67th Academy Awards against heavy contenders Shawshank Redemption and Pulp Fiction.',
    popFact: 'Tom Hanks was not paid a set salary for Forrest Gump; instead, he took profit shares that earned him over $40 Million!',
  },
  {
    id: 'cin_02',
    genre: 'Indian Cinema History',
    icon: '🎥',
    questionText: 'Which 1975 Indian action-drama blockbuster ran for 286 continuous weeks at Minerva Theatre in Mumbai?',
    correctAnswer: 'Sholay',
    distractors: ['Deewaar', 'Mughal-e-Azam', 'Mother India'],
    explanation: 'Directed by Ramesh Sippy, Sholay is widely regarded as one of the greatest Hindi films in history.',
    popFact: 'Amjad Khan was almost replaced as Gabbar Singh because scriptwriter Javed Akhtar felt his voice was too soft!',
  },
  {
    id: 'cin_03',
    genre: 'Global Music History',
    icon: '🎵',
    questionText: 'Which 1982 album by Michael Jackson remains the best-selling album of all time with over 70 million copies sold?',
    correctAnswer: 'Thriller',
    distractors: ['Bad', 'Off the Wall', 'Dangerous'],
    explanation: 'Thriller spent 37 non-consecutive weeks at #1 on the Billboard 200 chart and won a record 8 Grammy Awards.',
    popFact: 'Horror icon Vincent Price recited the famous spoken-word rap at the end of the song "Thriller" in just two takes!',
  },
  {
    id: 'cin_04',
    genre: 'Sci-Fi Film History',
    icon: '🕶️',
    questionText: 'In the 1999 sci-fi classic "The Matrix", what color pill does Morpheus offer Neo to learn the truth?',
    correctAnswer: 'Red Pill',
    distractors: ['Blue Pill', 'Green Pill', 'Gold Pill'],
    explanation: 'The Red Pill represents embracing the painful truth of reality, while the Blue Pill represents staying in blissful ignorance.',
    popFact: 'The green code waterfall in The Matrix was created by scanning Japanese sushi cookbook recipes!',
  },
  {
    id: 'cin_05',
    genre: 'Modern Pop Culture',
    icon: '👑',
    questionText: 'Which fantasy TV series holds the record for the most Emmy Awards won by a narrative series (59 Emmys)?',
    correctAnswer: 'Game of Thrones',
    distractors: ['Breaking Bad', 'The Crown', 'Stranger Things'],
    explanation: 'Game of Thrones won 59 Primetime Emmy Awards across its 8 seasons on HBO.',
    popFact: 'Dothraki language created for the show contains over 3,000 words developed by linguist David J. Peterson!',
  },
];

export function generateCinemaPuzzle(difficulty: DifficultyTier, rng: SeededRandom, seenIds: string[] = []): AptitudePuzzle {
  const available = CINEMA_QUESTIONS.filter((q) => !seenIds.includes(q.id));
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

  const fallbacks = ['Inception', 'Abbey Road', 'Star Wars', 'The Godfather'];
  let extra = 0;
  while (options.length < 4 && extra < fallbacks.length) {
    if (!seen.has(fallbacks[extra])) {
      seen.add(fallbacks[extra]);
      options.push({ id: `opt_cin_fb_${extra}`, content: fallbacks[extra], isCorrect: false });
    }
    extra++;
  }

  return {
    id: item.id,
    category: 'cinema_pop',
    categoryTitle: 'Cinema & Global Pop Culture',
    difficulty,
    levelNumber: 12,
    renderedData: item,
    options,
    explanation: `${item.explanation} 🍿 POP LORE: ${item.popFact}`,
    visualHint: `Genre: ${item.genre}. Recall iconic blockbusters, music, and Hollywood/Bollywood milestones.`,
  };
}
