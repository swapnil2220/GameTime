import type { AptitudePuzzle, Option, DifficultyTier } from '../../types/game';
import { SeededRandom } from '../seed';

export interface InventionQuestionData {
  id: string;
  field: string;
  icon: string;
  questionText: string;
  correctAnswer: string;
  distractors: string[];
  explanation: string;
  eurekaFact: string;
}

const INVENTION_QUESTIONS: InventionQuestionData[] = [
  {
    id: 'inv_01',
    field: 'Medical Breakthroughs',
    icon: '🧫',
    questionText: 'In 1928, Alexander Fleming accidentally discovered Penicillin after returning from vacation to find mold growing on what petri dish bacteria?',
    correctAnswer: 'Staphylococcus',
    distractors: ['E. coli', 'Streptococcus', 'Salmonella'],
    explanation: 'Fleming noticed that Penicillium notatum mold had contaminated a petri dish and created a halo where Staphylococcus bacteria could not grow.',
    eurekaFact: 'Fleming famously remarked: "One sometimes finds what one is not looking for!"',
  },
  {
    id: 'inv_02',
    field: 'Consumer Tech Accidental Discovery',
    icon: '🍿',
    questionText: 'Percy Spencer accidentally invented the Microwave oven in 1945 when a radar cavity magnetron melted what item in his pocket?',
    correctAnswer: 'A Peanut Candy Bar',
    distractors: ['A Bar of Chocolate', 'An Ice Cube', 'A Wax Candle'],
    explanation: 'While working on radar magnetrons at Raytheon, Spencer noticed the candy bar in his pocket had melted into gooey liquid.',
    eurekaFact: 'The very first food item intentionally cooked in a microwave was popcorn!',
  },
  {
    id: 'inv_03',
    field: 'Material Science',
    icon: '📝',
    questionText: 'In 1968, Spencer Silver at 3M developed Post-it Note adhesive while trying to create a super-strong glue. What was unique about his adhesive?',
    correctAnswer: 'It was weak and re-stickable',
    distractors: ['It dried instantly under water', 'It was heat resistant to 1000°C', 'It conducted electricity'],
    explanation: 'Silver created microspheres that held together lightly and could be peeled off surfaces without leaving residue.',
    eurekaFact: 'Post-it notes were colored canary yellow simply because the lab next door only had yellow scrap paper!',
  },
  {
    id: 'inv_04',
    field: 'Physics & Classical Mechanics',
    icon: '🍎',
    questionText: 'According to famous science history, Isaac Newton formulated the Law of Universal Gravitation after watching what fall from a tree in 1666?',
    correctAnswer: 'An Apple',
    distractors: ['An Acorn', 'A Pinecone', 'A Pear'],
    explanation: 'Newton observed an apple fall straight down at Woolsthorpe Manor and pondered why objects accelerate toward Earth’s center.',
    eurekaFact: 'Newton’s original apple tree is still alive and producing fruit at Woolsthorpe Manor over 350 years later!',
  },
  {
    id: 'inv_05',
    field: 'Chemistry & Synthetic Polymers',
    icon: '🍳',
    questionText: 'In 1938, Roy Plunkett accidentally discovered Teflon (PTFE) non-stick coating while attempting to synthesize what substance for refrigerators?',
    correctAnswer: 'A Refrigerant Gas (CFC)',
    distractors: ['A Synthetic Engine Oil', 'A Plastic Polymer', 'A Fire Retardant'],
    explanation: 'Plunkett opened a cylinder of tetrafluoroethylene gas and found it had polymerized into a white, slippery solid.',
    eurekaFact: 'Teflon is so slippery that geckos are incapable of sticking to its surface!',
  },
];

export function generateInventionPuzzle(difficulty: DifficultyTier, rng: SeededRandom, seenIds: string[] = []): AptitudePuzzle {
  const available = INVENTION_QUESTIONS.filter((q) => !seenIds.includes(q.id));
  const item = available.length > 0 ? rng.pick(available) : rng.pick(INVENTION_QUESTIONS);

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

  const fallbacks = ['Steam Engine', 'Electricity', 'Radio Waves', 'Telescope'];
  let extra = 0;
  while (options.length < 4 && extra < fallbacks.length) {
    if (!seen.has(fallbacks[extra])) {
      seen.add(fallbacks[extra]);
      options.push({ id: `opt_inv_fb_${extra}`, content: fallbacks[extra], isCorrect: false });
    }
    extra++;
  }

  return {
    id: item.id,
    category: 'inventions_discovery',
    categoryTitle: 'Accidental Inventions & Eureka Moments',
    difficulty,
    levelNumber: 14,
    renderedData: item,
    options,
    explanation: `${item.explanation} 💡 EUREKA MOMENT: ${item.eurekaFact}`,
    visualHint: `Field: ${item.field}. Reflect on how accidental lab discoveries revolutionized daily life.`,
  };
}
