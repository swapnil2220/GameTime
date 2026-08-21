import type { AptitudePuzzle, Option, DifficultyTier } from '../../types/game';
import { SeededRandom } from '../seed';

export interface HistoryData {
  eventTitle: string;
  questionText: string;
  correctAnswer: string;
  distractors: string[];
  explanation: string;
  triviaFact: string;
}

const HISTORY_QUESTIONS: HistoryData[] = [
  {
    eventTitle: 'Ancient Rome',
    questionText: 'Who was the first official Emperor of the Roman Empire, ruling from 27 BC until his death in AD 14?',
    correctAnswer: 'Augustus (Octavian)',
    distractors: ['Julius Caesar', 'Nero', 'Marcus Aurelius'],
    explanation: 'Augustus Caesar was the founder of the Roman Principate and its first Emperor.',
    triviaFact: 'The month of August was renamed in honor of Augustus Caesar!',
  },
  {
    eventTitle: 'Industrial Revolution',
    questionText: 'Which Scottish inventor substantially improved the Newcomen steam engine in 1776, sparking the Industrial Revolution?',
    correctAnswer: 'James Watt',
    distractors: ['Thomas Edison', 'Nikola Tesla', 'Alexander Graham Bell'],
    explanation: 'James Watt invented the separate condenser, dramatically improving steam engine efficiency.',
    triviaFact: 'The electrical unit "Watt" was named in honor of James Watt in 1882!',
  },
  {
    eventTitle: 'World History',
    questionText: 'In which year did the Berlin Wall fall, symbolizing the end of the Cold War era in Europe?',
    correctAnswer: '1989',
    distractors: ['1991', '1985', '1979'],
    explanation: 'The Berlin Wall fell on November 9, 1989.',
    triviaFact: 'Portions of the Berlin Wall were crushed and used to build roads across Germany!',
  },
];

export function generateHistoryPuzzle(
  difficulty: DifficultyTier,
  rng: SeededRandom,
  seenIds: string[] = []
): AptitudePuzzle {
  const available = HISTORY_QUESTIONS.filter((h) => !seenIds.includes(`hist_${h.eventTitle.toLowerCase().replace(/\s+/g, '_')}`));
  const item = available.length > 0 ? rng.pick(available) : rng.pick(HISTORY_QUESTIONS);

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
    id: `hist_${item.eventTitle.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
    category: 'history',
    categoryTitle: 'World History & Era Chronicles',
    difficulty,
    levelNumber: 1,
    renderedData: {
      sportName: item.eventTitle,
      icon: '🏛️',
      questionText: item.questionText,
    },
    options,
    explanation: `${item.explanation} 💡 DID YOU KNOW? ${item.triviaFact}`,
    visualHint: `Think about major world history milestones of ${item.eventTitle}.`,
  };
}
