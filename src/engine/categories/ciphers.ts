import type { AptitudePuzzle, Option, DifficultyTier } from '../../types/game';
import { SeededRandom } from '../seed';

const WORDS_POOL = [
  'CODE', 'LINK', 'MIND', 'STAR', 'WAVE', 'PEAK', 'NEXUS', 'GRID', 'FLOW', 'CYPHER'
];

export function generateCipherPuzzle(difficulty: DifficultyTier, rng: SeededRandom): AptitudePuzzle {
  const word1 = rng.pick(WORDS_POOL);
  let word2 = rng.pick(WORDS_POOL.filter(w => w !== word1));
  if (word2.length !== word1.length) {
    word2 = WORDS_POOL.find(w => w.length === word1.length && w !== word1) || 'TEAM';
  }

  const shift = difficulty === 'beginner' ? 1 : difficulty === 'intermediate' ? 2 : 3;

  const encodeWord = (str: string, shiftVal: number) => {
    return str
      .split('')
      .map((ch) => {
        const code = ch.charCodeAt(0) - 65;
        const newCode = (code + shiftVal + 26) % 26;
        return String.fromCharCode(newCode + 65);
      })
      .join('');
  };

  const codedWord1 = encodeWord(word1, shift);
  const correctCodedWord2 = encodeWord(word2, shift);

  const rawOptions: Option[] = [
    { id: 'opt_correct', content: correctCodedWord2, isCorrect: true },
    { id: 'opt_d1', content: encodeWord(word2, shift + 1), isCorrect: false },
    { id: 'opt_d2', content: encodeWord(word2, shift - 1), isCorrect: false },
    { id: 'opt_d3', content: encodeWord(word2, shift + 2), isCorrect: false },
  ];

  // Deduplicate options strictly
  const options: Option[] = [];
  const seen = new Set<string>();

  for (const opt of rng.shuffle(rawOptions)) {
    if (!seen.has(opt.content)) {
      seen.add(opt.content);
      options.push(opt);
    }
  }

  // Fallback loop ensuring 4 options
  let extraShift = 3;
  while (options.length < 4) {
    const candidate = encodeWord(word2, shift + extraShift);
    if (!seen.has(candidate)) {
      seen.add(candidate);
      options.push({ id: `opt_ciph_fb_${extraShift}`, content: candidate, isCorrect: false });
    }
    extraShift++;
  }

  return {
    id: `cipher_${Date.now()}_${rng.range(100, 999)}`,
    category: 'cipher',
    categoryTitle: 'Code & Cipher Decoding',
    difficulty,
    levelNumber: 2,
    renderedData: {
      exampleWord: word1,
      exampleCode: codedWord1,
      targetWord: word2,
      shiftAmount: shift,
    },
    options,
    explanation: `Each letter is shifted forward by ${shift} position(s) in the alphabet (${word1} → ${codedWord1}). Therefore, ${word2} becomes ${correctCodedWord2}.`,
    visualHint: `Compare letter by letter: '${word1[0]}' shifted by +${shift} becomes '${codedWord1[0]}'.`,
  };
}
