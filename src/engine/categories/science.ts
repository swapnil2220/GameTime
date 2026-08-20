import type { AptitudePuzzle, Option, DifficultyTier } from '../../types/game';
import { SeededRandom } from '../seed';

export interface ScienceQuestionData {
  id: string;
  topic: string;
  icon: string;
  questionText: string;
  correctAnswer: string;
  distractors: string[];
  explanation: string;
  triviaFact: string;
}

const SCIENCE_QUESTIONS: ScienceQuestionData[] = [
  {
    id: 'sci_01',
    topic: 'Astronomy & Physics',
    icon: '🪐',
    questionText: 'Which planet in our solar system has the most moons (95 confirmed moons)?',
    correctAnswer: 'Jupiter',
    distractors: ['Saturn', 'Neptune', 'Uranus'],
    explanation: 'Jupiter has 95 officially recognized moons, including the 4 large Galilean moons.',
    triviaFact: 'Jupiter is so massive that all other solar system planets combined could fit inside it!',
  },
  {
    id: 'sci_02',
    topic: 'Chemistry',
    icon: '🧪',
    questionText: 'What is the chemical symbol for Gold on the periodic table?',
    correctAnswer: 'Au',
    distractors: ['Ag', 'Fe', 'Gd'],
    explanation: 'Gold’s chemical symbol Au comes from the Latin word "Aurum", meaning shining dawn.',
    triviaFact: 'All the gold ever mined in human history could fit into a cube measuring just 22 meters on each side!',
  },
  {
    id: 'sci_03',
    topic: 'Physics & Optics',
    icon: '⚡',
    questionText: 'What is the approximate speed of light in a vacuum?',
    correctAnswer: '300,000 km/s',
    distractors: ['150,000 km/s', '500,000 km/s', '1,000,000 km/s'],
    explanation: 'Light travels through a vacuum at exactly 299,792 km per second (approx 300,000 km/s).',
    triviaFact: 'Light takes just 8 minutes and 20 seconds to travel 150 million km from the Sun to Earth!',
  },
  {
    id: 'sci_04',
    topic: 'Biology & Genetics',
    icon: '🧬',
    questionText: 'Which organelle is known as the "powerhouse of the cell"?',
    correctAnswer: 'Mitochondria',
    distractors: ['Ribosome', 'Golgi Body', 'Nucleus'],
    explanation: 'Mitochondria generate cellular energy through ATP production via aerobic respiration.',
    triviaFact: 'Mitochondria have their own distinct DNA inherited exclusively from your mother!',
  },
  {
    id: 'sci_05',
    topic: 'Earth Science',
    icon: '🌋',
    questionText: 'What layer of Earth lies directly beneath the outer crust?',
    correctAnswer: 'Mantle',
    distractors: ['Outer Core', 'Inner Core', 'Lithosphere'],
    explanation: 'The mantle is the thickest layer of Earth, making up 84% of Earth’s total volume.',
    triviaFact: 'Earth’s inner core is a solid sphere of nickel-iron as hot as the surface of the Sun (~5,400 °C)!',
  },
  {
    id: 'sci_06',
    topic: 'Chemistry & Elements',
    icon: '💎',
    questionText: 'Diamond and graphite are allotropes of which single chemical element?',
    correctAnswer: 'Carbon',
    distractors: ['Silicon', 'Titanium', 'Boron'],
    explanation: 'Both diamond and graphite consist purely of carbon atoms arranged in different crystal lattices.',
    triviaFact: 'Diamonds are formed deep under Earth’s mantle under extreme pressure over billions of years!',
  },
  {
    id: 'sci_07',
    topic: 'Astronomy & Stars',
    icon: '🌟',
    questionText: 'What is the closest star system to our Sun (approx 4.24 light-years away)?',
    correctAnswer: 'Alpha Centauri / Proxima',
    distractors: ['Sirius', 'Betelgeuse', 'Andromeda'],
    explanation: 'Proxima Centauri in the Alpha Centauri system is the closest known star to Earth.',
    triviaFact: 'Even travelling at 56,000 km/h, Voyager 1 would take over 73,000 years to reach Proxima Centauri!',
  },
  {
    id: 'sci_08',
    topic: 'Physics & Gravity',
    icon: '🍏',
    questionText: 'What is the approximate acceleration due to gravity on Earth’s surface?',
    correctAnswer: '9.8 m/s²',
    distractors: ['5.2 m/s²', '12.4 m/s²', '15.0 m/s²'],
    explanation: 'Standard surface gravity on Earth accelerates falling objects at approx 9.8 meters per second squared.',
    triviaFact: 'Gravity on the Moon is about 1/6th of Earth’s, allowing astronauts to jump 6 times higher!',
  },
];

export function generateSciencePuzzle(difficulty: DifficultyTier, rng: SeededRandom, seenIds: string[] = []): AptitudePuzzle {
  const available = SCIENCE_QUESTIONS.filter((q) => !seenIds.includes(q.id));
  const item = available.length > 0 ? rng.pick(available) : rng.pick(SCIENCE_QUESTIONS);

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

  // Fallback loop ensuring 4 options
  const fallbacks = ['Iron (Fe)', 'Nitrogen', 'Proton', 'Kinetic Energy'];
  let extra = 0;
  while (options.length < 4 && extra < fallbacks.length) {
    if (!seen.has(fallbacks[extra])) {
      seen.add(fallbacks[extra]);
      options.push({ id: `opt_sci_fb_${extra}`, content: fallbacks[extra], isCorrect: false });
    }
    extra++;
  }

  return {
    id: item.id,
    category: 'science',
    categoryTitle: 'Science & Astronomy World',
    difficulty,
    levelNumber: 6,
    renderedData: item,
    options,
    explanation: `${item.explanation} 💡 DID YOU KNOW? ${item.triviaFact}`,
    visualHint: `Topic: ${item.topic}. Think about physical and chemical laws.`,
  };
}
