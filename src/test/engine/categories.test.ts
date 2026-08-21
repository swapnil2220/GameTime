import { describe, it, expect } from 'vitest';
import { SeededRandom } from '../../engine/seed';
import { generateGeographyPuzzle } from '../../engine/categories/geography';
import { generateSportsPuzzle } from '../../engine/categories/sports';
import { generateAnalogyPuzzle } from '../../engine/categories/analogies';
import { generateCipherPuzzle } from '../../engine/categories/ciphers';
import { generateVennPuzzle } from '../../engine/categories/vennLogic';
import { generateSeriesPuzzle } from '../../engine/categories/series';
import { generateSyllogismPuzzle } from '../../engine/categories/syllogisms';
import { generateSciencePuzzle } from '../../engine/categories/science';
import { generateVerbalAnalogyPuzzle } from '../../engine/categories/verbalAnalogies';
import { generateMathLogicPuzzle } from '../../engine/categories/mathLogic';
import { generateAptitudePuzzle } from '../../engine/logicEngine';
import type { DifficultyTier, AptitudeCategory, AptitudePuzzle } from '../../types/game';

describe('Category Generators Integrity (100 Iterations Invariant Testing)', () => {
  const difficulties: DifficultyTier[] = ['beginner', 'intermediate', 'expert'];

  const categoryGenerators: Array<{
    name: AptitudeCategory;
    generate: (difficulty: DifficultyTier, rng: SeededRandom) => AptitudePuzzle;
  }> = [
    { name: 'geography', generate: generateGeographyPuzzle },
    { name: 'sports', generate: generateSportsPuzzle },
    { name: 'analogy', generate: generateAnalogyPuzzle },
    { name: 'cipher', generate: generateCipherPuzzle },
    { name: 'venn', generate: generateVennPuzzle },
    { name: 'series', generate: generateSeriesPuzzle },
    { name: 'syllogism', generate: generateSyllogismPuzzle },
    { name: 'science', generate: generateSciencePuzzle },
    { name: 'verbal_analogy', generate: generateVerbalAnalogyPuzzle },
    { name: 'math_logic', generate: generateMathLogicPuzzle },
  ];

  categoryGenerators.forEach(({ name, generate }) => {
    describe(`Category Generator: ${name}`, () => {
      it(`passes invariants across 100 random iterations`, () => {
        for (let i = 0; i < 100; i++) {
          const rng = new SeededRandom(i * 1000 + 42);
          const diff = difficulties[i % difficulties.length];
          const puzzle = generate(diff, rng);

          // Invariant 1: options.length === 4
          expect(puzzle.options, `[Iteration ${i}] Options length should be 4`).toHaveLength(4);

          // Invariant 2: Exactly one correct option
          const correctOptions = puzzle.options.filter((opt) => opt.isCorrect);
          expect(
            correctOptions,
            `[Iteration ${i}] Must contain exactly 1 correct option in ${name}`
          ).toHaveLength(1);

          // Invariant 3: All 4 option contents are distinct (no duplicate distractors)
          const contents = puzzle.options.map((opt) =>
            typeof opt.content === 'object' ? JSON.stringify(opt.content) : String(opt.content).trim()
          );
          const uniqueContents = new Set(contents);
          expect(
            uniqueContents.size,
            `[Iteration ${i}] All options must be unique in ${name}. Got: ${JSON.stringify(contents)}`
          ).toBe(4);

          // Invariant 4: Required properties are non-empty
          expect(puzzle.id).toBeTruthy();
          expect(puzzle.category).toBe(name);
          expect(puzzle.explanation).toBeTruthy();
        }
      });
    });
  });

  describe('Difficulty Scaling & Stage Boundaries in logicEngine', () => {
    it('assigns beginner difficulty for levelNumber <= 10', () => {
      const puzzle = generateAptitudePuzzle(5, 'math_logic', 123);
      expect(puzzle.difficulty).toBe('beginner');
    });

    it('assigns intermediate difficulty for levelNumber 11..20', () => {
      const puzzle = generateAptitudePuzzle(15, 'series', 123);
      expect(puzzle.difficulty).toBe('intermediate');
    });

    it('assigns expert difficulty for levelNumber > 20', () => {
      const puzzle = generateAptitudePuzzle(25, 'cipher', 123);
      expect(puzzle.difficulty).toBe('expert');
    });

    it('cycles categories when category parameter is omitted', () => {
      const p1 = generateAptitudePuzzle(1, undefined, 100);
      const p2 = generateAptitudePuzzle(2, undefined, 100);
      expect(p1.category).toBe('geography');
      expect(p2.category).toBe('sports');
    });
  });
});
