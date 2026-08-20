import type { AptitudePuzzle, AptitudeCategory, DifficultyTier } from '../types/game';
import { SeededRandom } from './seed';
import { generateGeographyPuzzle } from './categories/geography';
import { generateSportsPuzzle } from './categories/sports';
import { generateAnalogyPuzzle } from './categories/analogies';
import { generateCipherPuzzle } from './categories/ciphers';
import { generateVennPuzzle } from './categories/vennLogic';
import { generateSeriesPuzzle } from './categories/series';
import { generateSyllogismPuzzle } from './categories/syllogisms';

export function generateAptitudePuzzle(
  levelNumber: number,
  category?: AptitudeCategory,
  seed?: number
): AptitudePuzzle {
  const levelSeed = seed ?? (levelNumber * 7919 + 1337);
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
  ];
  const selectedCategory = category ?? categories[(levelNumber - 1) % categories.length];

  let puzzle: AptitudePuzzle;

  switch (selectedCategory) {
    case 'geography':
      puzzle = generateGeographyPuzzle(difficulty, rng);
      break;
    case 'sports':
      puzzle = generateSportsPuzzle(difficulty, rng);
      break;
    case 'analogy':
      puzzle = generateAnalogyPuzzle(difficulty, rng);
      break;
    case 'cipher':
      puzzle = generateCipherPuzzle(difficulty, rng);
      break;
    case 'venn':
      puzzle = generateVennPuzzle(difficulty, rng);
      break;
    case 'series':
      puzzle = generateSeriesPuzzle(difficulty, rng);
      break;
    case 'syllogism':
      puzzle = generateSyllogismPuzzle(difficulty, rng);
      break;
    default:
      puzzle = generateGeographyPuzzle(difficulty, rng);
      break;
  }

  puzzle.levelNumber = levelNumber;
  return puzzle;
}
