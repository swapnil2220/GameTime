import type { AptitudePuzzle, Option, DifficultyTier } from '../../types/game';
import { SeededRandom } from '../seed';

export interface MythosQuestionData {
  id: string;
  mythology: string;
  icon: string;
  questionText: string;
  correctAnswer: string;
  distractors: string[];
  explanation: string;
  loreFact: string;
}

const MYTHOS_QUESTIONS: MythosQuestionData[] = [
  {
    id: 'myth_01',
    mythology: 'Indian Epic Lore',
    icon: '🏹',
    questionText: 'In the Mahabharata, what was the invincible divine bow wielded by Arjuna?',
    correctAnswer: 'Gandiva',
    distractors: ['Pinaka', 'Kodanda', 'Sharanga'],
    explanation: 'Gandiva was created by Lord Brahma and gifted to Arjuna by Varuna during the burning of the Khandava forest.',
    loreFact: 'Gandiva was said to be unbreakable and produced a thunderous roar when strung!',
  },
  {
    id: 'myth_02',
    mythology: 'Norse Mythology',
    icon: '⚡',
    questionText: 'In Norse mythology, what is the name of Thor’s magical hammer forged by the dwarves Brokkr and Sindri?',
    correctAnswer: 'Mjölnir',
    distractors: ['Gungnir', 'Gram', 'Tyrfing'],
    explanation: 'Mjölnir was capable of leveling mountains and always returned to Thor’s hand like a boomerang.',
    loreFact: 'Mjölnir’s handle was unusually short because Loki turned into a fly and bit the blacksmith’s eye during forging!',
  },
  {
    id: 'myth_03',
    mythology: 'Greek Mythology',
    icon: '🏛️',
    questionText: 'Which mythological monster had snakes for hair and turned anyone who looked into her eyes into stone?',
    correctAnswer: 'Medusa',
    distractors: ['Sphinx', 'Chimera', 'Hydra'],
    explanation: 'Medusa was the only mortal Gorgon sister, slain by the hero Perseus using a mirrored shield.',
    loreFact: 'According to Ovid, Medusa originally had beautiful hair before being cursed by Athena!',
  },
  {
    id: 'myth_04',
    mythology: 'Egyptian Antiquity',
    icon: '📿',
    questionText: 'Which ancient Egyptian god of the underworld weighed a dead person’s heart against the Feather of Truth?',
    correctAnswer: 'Anubis',
    distractors: ['Osiris', 'Horus', 'Ra'],
    explanation: 'Anubis guided souls through the underworld (Duat) and performed the Weighing of the Heart ritual.',
    loreFact: 'If the heart weighed more than the Feather of Ma’at, it was devoured by the crocodile monster Ammit!',
  },
  {
    id: 'myth_05',
    mythology: 'Ancient Architectural Wonders',
    icon: '🔺',
    questionText: 'Which of the Seven Wonders of the Ancient World is the ONLY one still standing today?',
    correctAnswer: 'Great Pyramid of Giza',
    distractors: ['Hanging Gardens of Babylon', 'Colossus of Rhodes', 'Lighthouse of Alexandria'],
    explanation: 'Built around 2560 BC for Pharaoh Khufu, the Great Pyramid of Giza remains largely intact after 4,500 years.',
    loreFact: 'For over 3,800 years, the Great Pyramid was the tallest human-made structure in the world!',
  },
  {
    id: 'myth_06',
    mythology: 'Indian Mythology',
    icon: '🦚',
    questionText: 'Which king of the Gods in Indian mythology wields the lightning bolt weapon known as the Vajra?',
    correctAnswer: 'Indra',
    distractors: ['Varuna', 'Agni', 'Vayu'],
    explanation: 'Indra is the god of thunder, rain, and heavens, whose weapon Vajra was forged from the bones of Sage Dadhichi.',
    loreFact: 'Sage Dadhichi willingly gave up his life so his indestructible spine could be crafted into the Vajra!',
  },
  {
    id: 'myth_07',
    mythology: 'Greek Epics',
    icon: '🐴',
    questionText: 'Which legendary Greek hero was invulnerable everywhere except his heel?',
    correctAnswer: 'Achilles',
    distractors: ['Odysseus', 'Hercules', 'Perseus'],
    explanation: 'Achilles’ mother Thetis dipped him in the River Styx, holding him by his heel, leaving that spot vulnerable.',
    loreFact: 'Achilles was killed during the Trojan War when Paris struck his heel with a poisoned arrow guided by Apollo!',
  },
];

export function generateMythosPuzzle(difficulty: DifficultyTier, rng: SeededRandom, seenIds: string[] = []): AptitudePuzzle {
  const available = MYTHOS_QUESTIONS.filter((q) => !seenIds.includes(q.id));
  const item = available.length > 0 ? rng.pick(available) : rng.pick(MYTHOS_QUESTIONS);

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

  const fallbacks = ['Zeus', 'Excalibur', 'Parthenon', 'Valhalla'];
  let extra = 0;
  while (options.length < 4 && extra < fallbacks.length) {
    if (!seen.has(fallbacks[extra])) {
      seen.add(fallbacks[extra]);
      options.push({ id: `opt_myth_fb_${extra}`, content: fallbacks[extra], isCorrect: false });
    }
    extra++;
  }

  return {
    id: item.id,
    category: 'mythos_history',
    categoryTitle: 'Mythology & Ancient Civilizations',
    difficulty,
    levelNumber: 11,
    renderedData: item,
    options,
    explanation: `${item.explanation} 📜 ANCIENT LORE: ${item.loreFact}`,
    visualHint: `Mythology: ${item.mythology}. Focus on ancient epics and sacred weapons.`,
  };
}
