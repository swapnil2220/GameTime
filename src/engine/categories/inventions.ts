import type { AptitudePuzzle, Option, DifficultyTier } from '../../types/game';
import { SeededRandom } from '../seed';

export interface InventionData {
  invention: string;
  inventor: string;
  questionText: string;
  correctAnswer: string;
  distractors: string[];
  explanation: string;
  triviaFact: string;
}

const INVENTIONS_QUESTIONS: InventionData[] = [
  {
    invention: 'Penicillin',
    inventor: 'Alexander Fleming',
    questionText: 'Who accidentally discovered Penicillin in 1928 after leaving a petri dish uncovered near an open window?',
    correctAnswer: 'Alexander Fleming',
    distractors: ['Louis Pasteur', 'Robert Koch', 'Edward Jenner'],
    explanation: 'Alexander Fleming discovered penicillin mold repelling staphylococcus bacteria.',
    triviaFact: 'Penicillin saved an estimated 200 million lives since its discovery!',
  },
  {
    invention: 'Telephone',
    inventor: 'Alexander Graham Bell',
    questionText: 'Who received the first US patent for the electric telephone in March 1876?',
    correctAnswer: 'Alexander Graham Bell',
    distractors: ['Elisha Gray', 'Thomas Edison', 'Guglielmo Marconi'],
    explanation: 'Alexander Graham Bell made the first famous call to his assistant Thomas Watson.',
    triviaFact: 'Bell refused to have a telephone in his study because he found it a distraction from his research!',
  },
  {
    invention: 'World Wide Web',
    inventor: 'Tim Berners-Lee',
    questionText: 'Which British computer scientist invented the World Wide Web in 1989 while working at CERN?',
    correctAnswer: 'Tim Berners-Lee',
    distractors: ['Alan Turing', 'Bill Gates', 'Steve Jobs'],
    explanation: 'Tim Berners-Lee invented HTTP, HTML, and URLs to create the World Wide Web.',
    triviaFact: 'The world\'s first website went live on August 6, 1991, hosted on Berners-Lee\'s NeXT computer at CERN!',
  },
];

export function generateInventionsPuzzle(
  difficulty: DifficultyTier,
  rng: SeededRandom,
  seenIds: string[] = []
): AptitudePuzzle {
  const available = INVENTIONS_QUESTIONS.filter((i) => !seenIds.includes(`inv_${i.invention.toLowerCase()}`));
  const item = available.length > 0 ? rng.pick(available) : rng.pick(INVENTIONS_QUESTIONS);

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
    id: `inv_${item.invention.toLowerCase()}_${Date.now()}`,
    category: 'inventions',
    categoryTitle: 'Science & Breakthrough Inventions',
    difficulty,
    levelNumber: 1,
    renderedData: {
      sportName: item.invention,
      icon: '💡',
      questionText: item.questionText,
    },
    options,
    explanation: `${item.explanation} 💡 DID YOU KNOW? ${item.triviaFact}`,
    visualHint: `Think about famous scientific discoveries associated with ${item.invention}.`,
  };
}
