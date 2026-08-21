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
import { generateMythosPuzzle } from './categories/mythosHistory';
import { generateCinemaPuzzle } from './categories/cinemaPopCulture';
import { generateLateralPuzzle } from './categories/lateralThinking';
import { generateInventionPuzzle } from './categories/inventionsDiscovery';
import { generateWordOriginPuzzle } from './categories/wordOrigins';

export function generateAptitudePuzzle(
  levelNumber: number,
  category?: AptitudeCategory,
  seed?: number,
  seenIds: string[] = []
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
    'science',
    'verbal_analogy',
    'math_logic',
    'mythos_history',
    'cinema_pop',
    'lateral_thinking',
    'inventions_discovery',
    'word_origins',
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
    case 'science':
      puzzle = generateSciencePuzzle(difficulty, rng, seenIds);
      break;
    case 'verbal_analogy':
      puzzle = generateVerbalAnalogyPuzzle(difficulty, rng, seenIds);
      break;
    case 'math_logic':
      puzzle = generateMathLogicPuzzle(difficulty, rng, seenIds);
      break;
    case 'mythos_history':
      puzzle = generateMythosPuzzle(difficulty, rng, seenIds);
      break;
    case 'cinema_pop':
      puzzle = generateCinemaPuzzle(difficulty, rng, seenIds);
      break;
    case 'lateral_thinking':
      puzzle = generateLateralPuzzle(difficulty, rng, seenIds);
      break;
    case 'inventions_discovery':
      puzzle = generateInventionPuzzle(difficulty, rng, seenIds);
      break;
    case 'word_origins':
      puzzle = generateWordOriginPuzzle(difficulty, rng, seenIds);
      break;
    default:
      puzzle = generateGeographyPuzzle(difficulty, rng);
      break;
  }

  puzzle.levelNumber = levelNumber;
  return puzzle;
}

export function generateEscalatingQuestion(stageIndex: number, seenIds: string[] = []): AptitudePuzzle {
  const categories: AptitudeCategory[] = [
    'mythos_history',
    'cinema_pop',
    'lateral_thinking',
    'inventions_discovery',
    'word_origins',
    'geography',
    'science',
    'verbal_analogy',
    'math_logic',
    'cipher',
    'series',
    'syllogism',
  ];

  const rng = new SeededRandom(Date.now() + stageIndex * 9999);
  const cat = rng.pick(categories);

  return generateAptitudePuzzle(stageIndex, cat, rng.range(10000, 99999), seenIds);
}
