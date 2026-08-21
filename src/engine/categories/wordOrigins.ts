import type { AptitudePuzzle, Option, DifficultyTier } from '../../types/game';
import { SeededRandom } from '../seed';

export interface WordOriginQuestionData {
  id: string;
  linguisticRoot: string;
  icon: string;
  questionText: string;
  correctAnswer: string;
  distractors: string[];
  explanation: string;
  etymologyFact: string;
}

const WORD_ORIGIN_QUESTIONS: WordOriginQuestionData[] = [
  {
    id: 'wrd_01',
    linguisticRoot: 'Ancient Greek Etymology',
    icon: '📖',
    questionText: 'The word "SARCASTIC" derives from the ancient Greek word "Sarkazein", which literally translates to what action?',
    correctAnswer: 'To tear flesh like a dog',
    distractors: ['To speak with a snake tongue', 'To laugh in the dark', 'To wear a mask'],
    explanation: 'Sarkazein literally meant "to tear flesh", describing biting, cutting speech designed to rip into someone.',
    etymologyFact: 'Ancient Greeks viewed sarcasm as a sharp, aggressive weapon of rhetoric!',
  },
  {
    id: 'wrd_02',
    linguisticRoot: 'Portmanteau Words',
    icon: '🔤',
    questionText: 'The word "CLACKER" or "SPAM" (canned meat) is famous, but what 1930s portmanteau blends "SPICED" and "HAM"?',
    correctAnswer: 'SPAM',
    distractors: ['SCRAM', 'SLACK', 'SPASM'],
    explanation: 'SPAM was coined by Hormel Foods in 1937 as a blend of "Spiced" and "Ham".',
    etymologyFact: 'The term "Spam" for unsolicited email comes from a 1970 Monty Python sketch repeating SPAM endlessly!',
  },
  {
    id: 'wrd_03',
    linguisticRoot: 'Latin Roots',
    icon: '🏛️',
    questionText: 'The English word "CANDIDATE" comes from the Latin "Candidatus", meaning "clothed in white". Why did political candidates wear white in Ancient Rome?',
    correctAnswer: 'To symbolize purity and honesty',
    distractors: ['To stand out in crowds', 'To represent military victory', 'To stay cool in summer'],
    explanation: 'Roman office seekers wore a chalk-whitened toga (toga candida) to demonstrate purity and nobility of intent.',
    etymologyFact: 'The word "Candor" and "Candle" share the exact same Latin root for shining white brightness!',
  },
  {
    id: 'wrd_04',
    linguisticRoot: 'Modern Slang & Tech Idioms',
    icon: '💻',
    questionText: 'The computer term "BUG" was popularized in 1947 when Grace Hopper found a REAL moth trapped in which component of the Mark II computer?',
    correctAnswer: 'Relay #70 in Panel F',
    distractors: ['The CRT Monitor', 'The Power Transformer', 'The Keyboard Spring'],
    explanation: 'Engineers taped the moth into the logbook with the caption: "First actual case of bug being found."',
    etymologyFact: 'While "bug" existed in engineering slang earlier, Grace Hopper’s moth popularized "debugging" in computing!',
  },
  {
    id: 'wrd_05',
    linguisticRoot: 'Sanskrit & Hindi Borrowings',
    icon: '📜',
    questionText: 'The common English word "SHAMPOO" derives from the Hindi word "Champna" (चाम्पना), which meant what action?',
    correctAnswer: 'To press, knead, or massage',
    distractors: ['To clean with soap', 'To wash hair in rivers', 'To scent with flowers'],
    explanation: 'Champna referred to head massage with fragrant herbal oils, introduced to Britain by Sake Dean Mahomed in 1814.',
    etymologyFact: 'Dean Mahomed was appointed "Shampooing Surgeon" to King George IV and King William IV!',
  },
];

export function generateWordOriginPuzzle(difficulty: DifficultyTier, rng: SeededRandom, seenIds: string[] = []): AptitudePuzzle {
  const available = WORD_ORIGIN_QUESTIONS.filter((q) => !seenIds.includes(q.id));
  const item = available.length > 0 ? rng.pick(available) : rng.pick(WORD_ORIGIN_QUESTIONS);

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

  const fallbacks = ['Metaphor', 'Idiom', 'Linguistics', 'Synergy'];
  let extra = 0;
  while (options.length < 4 && extra < fallbacks.length) {
    if (!seen.has(fallbacks[extra])) {
      seen.add(fallbacks[extra]);
      options.push({ id: `opt_wrd_fb_${extra}`, content: fallbacks[extra], isCorrect: false });
    }
    extra++;
  }

  return {
    id: item.id,
    category: 'word_origins',
    categoryTitle: 'Etymology & Word Origins',
    difficulty,
    levelNumber: 15,
    renderedData: item,
    options,
    explanation: `${item.explanation} 📚 ETYMOLOGY LORE: ${item.etymologyFact}`,
    visualHint: `Root: ${item.linguisticRoot}. Explore original historical and linguistic meanings.`,
  };
}
