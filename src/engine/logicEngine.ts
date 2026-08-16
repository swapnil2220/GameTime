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
  const rng = new SeededRandom(seed);

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

  switch (selectedCategory) {
    case 'geography':
      return generateGeographyPuzzle(difficulty, rng);
    case 'sports':
      return generateSportsPuzzle(difficulty, rng);
    case 'analogy':
      return generateAnalogyPuzzle(difficulty, rng);
    case 'cipher':
      return generateCipherPuzzle(difficulty, rng);
    case 'venn':
      return generateVennPuzzle(difficulty, rng);
    case 'series':
      return generateSeriesPuzzle(difficulty, rng);
    case 'syllogism':
      return generateSyllogismPuzzle(difficulty, rng);
    default:
      return generateGeographyPuzzle(difficulty, rng);
  }
}
