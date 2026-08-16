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

  // Distractors with distinct properties
  const options: Option[] = [];
  options.push({ id: 'opt_correct', content: shapeD, isCorrect: true });

  options.push({
    id: 'opt_d1',
    content: { ...shapeC, outerColor: COLORS[5], innerColor: COLORS[0] },
    isCorrect: false,
  });

  options.push({
    id: 'opt_d2',
    content: { ...shapeD, rotation: 180, innerColor: COLORS[2] },
    isCorrect: false,
  });

  options.push({
    id: 'opt_d3',
    content: { ...shapeD, innerShape: shapeA.innerShape, outerColor: COLORS[1] },
    isCorrect: false,
  });

  // Unique options filter
  const uniqueOptions: Option[] = [];
  const seenKeys = new Set<string>();

  for (const opt of rng.shuffle(options)) {
    const s = opt.content as AnalogyShape;
    const key = `${s.outerShape}_${s.innerShape}_${s.outerColor}_${s.innerColor}_${s.rotation}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueOptions.push(opt);
    }
  }

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
    options: uniqueOptions,
    explanation: `Shape A is to Shape B as Shape C is to Shape D. Rule: ${ruleDescription}`,
    visualHint: hintText,
  };
}
