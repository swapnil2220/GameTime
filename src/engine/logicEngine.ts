import type { AptitudePuzzle, AptitudeCategory, DifficultyTier } from '../types/game';
import { SeededRandom } from './seed';
import { generateGeographyPuzzle } from './categories/geography';
import { generateSportsPuzzle } from './categories/sports';
import { generateAnalogyPuzzle } from './categories/analogies';
import { generateCipherPuzzle } from './categories/ciphers';
import { generateVennPuzzle } from './categories/vennLogic';
import { generateSeriesPuzzle } from './categories/series';
import { generateSyllogismPuzzle } from './categories/syllogisms';
import { generateSciencePuzzle } from './categories/science';
import { generateVerbalAnalogyPuzzle } from './categories/verbalAnalogies';
import { generateMathLogicPuzzle } from './categories/mathLogic';
import { generateCinemaPuzzle } from './categories/cinema';
import { generateWordOriginsPuzzle } from './categories/wordOrigins';
import { generateHistoryPuzzle } from './categories/history';
import { generateInventionsPuzzle } from './categories/inventions';
import { generateLateralPuzzle } from './categories/lateral';

export function generateAptitudePuzzle(
  levelNumber: number,
  category?: AptitudeCategory,
  seed?: number,
  seenIds: string[] = []
): AptitudePuzzle {
  const levelSeed = seed ?? (levelNumber * 7919 + 1337 + Date.now() % 100000);
  const rng = new SeededRandom(levelSeed);

  const difficulty: DifficultyTier =
    levelNumber <= 10 ? 'beginner' : levelNumber <= 20 ? 'intermediate' : 'expert';

  const categories: AptitudeCategory[] = [
    'geography',
    'sports',
    'analogy',
    'cipher',
    'venn',
    'series',
    'syllogism',
    'science',
    'verbal_analogy',
    'math_logic',
    'cinema',
    'word_origins',
    'history',
    'inventions',
    'lateral',
  ];

  // Rotate through 15 categories using level number and random seed offset so levels 1, 11, 21 draw different categories
  const categoryOffset = rng.range(0, categories.length - 1);
  const categoryIndex = (levelNumber - 1 + categoryOffset) % categories.length;
  const selectedCategory = category ?? categories[categoryIndex];

  let puzzle: AptitudePuzzle;

  switch (selectedCategory) {
    case 'geography':
      puzzle = generateGeographyPuzzle(difficulty, rng, seenIds);
      break;
    case 'sports':
      puzzle = generateSportsPuzzle(difficulty, rng, seenIds);
      break;
    case 'analogy':
      puzzle = generateAnalogyPuzzle(difficulty, rng, seenIds);
      break;
    case 'cipher':
      puzzle = generateCipherPuzzle(difficulty, rng, seenIds);
      break;
    case 'venn':
      puzzle = generateVennPuzzle(difficulty, rng, seenIds);
      break;
    case 'series':
      puzzle = generateSeriesPuzzle(difficulty, rng, seenIds);
      break;
    case 'syllogism':
      puzzle = generateSyllogismPuzzle(difficulty, rng, seenIds);
      break;
    case 'science':
      puzzle = generateSciencePuzzle(difficulty, rng, seenIds);
      break;
    case 'verbal_analogy':
      puzzle = generateVerbalAnalogyPuzzle(difficulty, rng, seenIds);
      break;
    case 'math_logic':
      puzzle = generateMathLogicPuzzle(difficulty, rng, seenIds);
      break;
    case 'cinema':
      puzzle = generateCinemaPuzzle(difficulty, rng, seenIds);
      break;
    case 'word_origins':
      puzzle = generateWordOriginsPuzzle(difficulty, rng, seenIds);
      break;
    case 'history':
      puzzle = generateHistoryPuzzle(difficulty, rng, seenIds);
      break;
    case 'inventions':
      puzzle = generateInventionsPuzzle(difficulty, rng, seenIds);
      break;
    case 'lateral':
      puzzle = generateLateralPuzzle(difficulty, rng, seenIds);
      break;
    default:
      puzzle = generateGeographyPuzzle(difficulty, rng, seenIds);
      break;
  }

  puzzle.levelNumber = levelNumber;
  return puzzle;
}
