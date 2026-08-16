import type { AptitudePuzzle, AptitudeCategory, DifficultyTier } from '../types/game';
import { SeededRandom } from './seed';
import { generateAnalogyPuzzle } from './categories/analogies';
import { generateCipherPuzzle } from './categories/ciphers';
import { generateVennPuzzle } from './categories/vennLogic';
import { generateSeriesPuzzle } from './categories/series';
import { generateSyllogismPuzzle } from './categories/syllogisms';
import { generateGeographyPuzzle } from './categories/geography';
import { generateSportsPuzzle } from './categories/sportsCulture';

export function generateAptitudePuzzle(
  levelNumber: number,
  category?: AptitudeCategory,
  seed?: number
): AptitudePuzzle {
  const rng = new SeededRandom(seed);

  const difficulty: DifficultyTier =
    levelNumber <= 8
      ? 'beginner'
      : levelNumber <= 16
      ? 'intermediate'
      : levelNumber <= 24
      ? 'expert'
      : 'master';

  const categories: AptitudeCategory[] = [
    'analogy',
    'cipher',
    'venn',
    'series',
    'geography',
    'sports',
    'syllogism',
  ];

  const selectedCategory = category ?? categories[(levelNumber - 1) % categories.length];

  let puzzle: AptitudePuzzle;

  switch (selectedCategory) {
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
    case 'geography':
      puzzle = generateGeographyPuzzle(difficulty, rng);
      break;
    case 'sports':
      puzzle = generateSportsPuzzle(difficulty, rng);
      break;
  }

  puzzle.levelNumber = levelNumber;
  return puzzle;
}
