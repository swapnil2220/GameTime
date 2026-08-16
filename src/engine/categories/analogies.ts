import type { AptitudePuzzle, Option, DifficultyTier } from '../../types/game';
import { SeededRandom } from '../seed';

export interface AnalogyShape {
  outerShape: 'circle' | 'square' | 'triangle' | 'pentagon';
  innerShape: 'star' | 'diamond' | 'cross' | 'dot';
  outerColor: string;
  innerColor: string;
  rotation: number;
}

const COLORS = ['#00f3ff', '#a855f7', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];

export function generateAnalogyPuzzle(difficulty: DifficultyTier, rng: SeededRandom): AptitudePuzzle {
  const outerShapes: AnalogyShape['outerShape'][] = ['circle', 'square', 'triangle', 'pentagon'];
  const innerShapes: AnalogyShape['innerShape'][] = ['star', 'diamond', 'cross', 'dot'];

  // Shape A
  const shapeA: AnalogyShape = {
    outerShape: rng.pick(outerShapes),
    innerShape: rng.pick(innerShapes),
    outerColor: COLORS[0],
    innerColor: COLORS[1],
    rotation: 0,
  };

  // Rule: Swap outer & inner colors OR Swap outer & inner shapes OR rotate +90
  const ruleType = rng.pick(['swap_colors', 'swap_shapes', 'rotate']);

  let shapeB: AnalogyShape;
  let ruleDescription = '';
  let hintText = '';

  if (ruleType === 'swap_colors') {
    shapeB = { ...shapeA, outerColor: shapeA.innerColor, innerColor: shapeA.outerColor };
    ruleDescription = 'The inner and outer colors are swapped.';
    hintText = 'Notice how the inner color becomes the outer border color.';
  } else if (ruleType === 'swap_shapes') {
    const nextOuter = shapeA.innerShape === 'dot' ? 'circle' : 'square';
    shapeB = { ...shapeA, outerShape: nextOuter as any, outerColor: COLORS[2] };
    ruleDescription = 'The outer shape transforms into a new geometry with a fresh color.';
    hintText = 'Compare the outer border shape transition from A to B.';
  } else {
    shapeB = { ...shapeA, rotation: 90 };
    ruleDescription = 'The shape rotates 90 degrees clockwise.';
    hintText = 'Observe the orientation angle change.';
  }

  // Shape C
  const shapeC: AnalogyShape = {
    outerShape: rng.pick(outerShapes.filter(s => s !== shapeA.outerShape)),
    innerShape: rng.pick(innerShapes.filter(s => s !== shapeA.innerShape)),
    outerColor: COLORS[3],
    innerColor: COLORS[4],
    rotation: 0,
  };

  // Apply same rule to Shape C to produce correct Shape D
  let shapeD: AnalogyShape;
  if (ruleType === 'swap_colors') {
    shapeD = { ...shapeC, outerColor: shapeC.innerColor, innerColor: shapeC.outerColor };
  } else if (ruleType === 'swap_shapes') {
    const nextOuter = shapeC.innerShape === 'dot' ? 'circle' : 'square';
    shapeD = { ...shapeC, outerShape: nextOuter as any, outerColor: COLORS[2] };
  } else {
    shapeD = { ...shapeC, rotation: 90 };
  }

  // Distractors
  const options: Option[] = [];
  options.push({ id: 'opt_correct', content: shapeD, isCorrect: true });

  // Wrong distractor 1 (unswapped colors)
  options.push({
    id: 'opt_d1',
    content: { ...shapeC, outerColor: COLORS[5] },
    isCorrect: false,
  });

  // Wrong distractor 2 (wrong rotation)
  options.push({
    id: 'opt_d2',
    content: { ...shapeD, rotation: 180 },
    isCorrect: false,
  });

  // Wrong distractor 3 (wrong inner shape)
  options.push({
    id: 'opt_d3',
    content: { ...shapeD, innerShape: shapeA.innerShape },
    isCorrect: false,
  });

  const shuffledOptions = rng.shuffle(options);

  return {
    id: `analogy_${Date.now()}_${rng.range(100, 999)}`,
    category: 'analogy',
    categoryTitle: 'Visual Shape Analogy',
    difficulty,
    levelNumber: 1,
    renderedData: {
      shapeA,
      shapeB,
      shapeC,
    },
    options: shuffledOptions,
    explanation: `Shape A is to Shape B as Shape C is to Shape D. Rule: ${ruleDescription}`,
    visualHint: hintText,
  };
}
