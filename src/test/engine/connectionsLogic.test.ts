import { describe, it, expect } from 'vitest';
import { generateAIConnectionsPuzzle } from '../../engine/aiEngine';
import type { ConnectionsPuzzle } from '../../types/game';

describe('Connections 16-Tile Solver & Decoy Matrix', () => {
  it('generates a valid board with exactly 4 groups of 4 items (16 total)', () => {
    const puzzle: ConnectionsPuzzle = generateAIConnectionsPuzzle('tech', 42);

    expect(puzzle.groups).toHaveLength(4);
    puzzle.groups.forEach((group) => {
      expect(group.items).toHaveLength(4);
      expect(group.categoryTitle).toBeTruthy();
      expect(group.explanation).toBeTruthy();
      expect(['yellow', 'green', 'blue', 'purple']).toContain(group.colorTier);
    });

    expect(puzzle.shuffledTiles).toHaveLength(16);
  });

  it('validates all 16 tiles are non-empty unique strings', () => {
    const puzzle = generateAIConnectionsPuzzle('movies', 99);

    // Ensure non-empty and no whitespace issues
    puzzle.shuffledTiles.forEach((tile) => {
      expect(typeof tile).toBe('string');
      expect(tile.trim().length).toBeGreaterThan(0);
      expect(tile).toBe(tile.trim());
    });

    // Ensure all 16 tiles are unique
    const uniqueTiles = new Set(puzzle.shuffledTiles);
    expect(uniqueTiles.size).toBe(16);
  });

  it('correctly evaluates matching groups and detects "One Away!" (3 match, 1 distractor)', () => {
    const puzzle = generateAIConnectionsPuzzle(undefined, 777);

    const group0 = puzzle.groups[0];
    const group1 = puzzle.groups[1];

    // Perfect 4-match selection
    const perfectGuess = [...group0.items];
    const isPerfectMatch = puzzle.groups.some((g) => {
      const gSet = new Set(g.items);
      return perfectGuess.every((t) => gSet.has(t));
    });
    expect(isPerfectMatch).toBe(true);

    // 3-match + 1 distractor ("One Away!")
    const oneAwayGuess = [group0.items[0], group0.items[1], group0.items[2], group1.items[0]];

    let isOneAwayDetected = false;
    puzzle.groups.forEach((g) => {
      const gSet = new Set(g.items);
      const matchCount = oneAwayGuess.filter((t) => gSet.has(t)).length;
      if (matchCount === 3) {
        isOneAwayDetected = true;
      }
    });

    expect(isOneAwayDetected).toBe(true);

    // 2-match + 2 distractors (Not One Away)
    const twoMatchGuess = [group0.items[0], group0.items[1], group1.items[0], group1.items[1]];

    let twoMatchOneAway = false;
    puzzle.groups.forEach((g) => {
      const gSet = new Set(g.items);
      const matchCount = twoMatchGuess.filter((t) => gSet.has(t)).length;
      if (matchCount === 3) {
        twoMatchOneAway = true;
      }
    });

    expect(twoMatchOneAway).toBe(false);
  });

  it('selects preset based on topic prompt keywords', () => {
    const pMovie = generateAIConnectionsPuzzle('Hollywood Cinema');
    expect(pMovie.title).toBe('AI STUDIO: HOLLYWOOD CINEMA');
    expect(pMovie.groups.some((g) => g.categoryTitle.includes('DISNEY') || g.categoryTitle.includes('DIRECTOR'))).toBe(true);

    const pTech = generateAIConnectionsPuzzle('Software Code');
    expect(pTech.title).toBe('AI STUDIO: SOFTWARE CODE');
    expect(pTech.groups.some((g) => g.categoryTitle.includes('PROGRAMMING') || g.categoryTitle.includes('BROWSERS'))).toBe(true);

    const pFood = generateAIConnectionsPuzzle('Culinary Arts Food');
    expect(pFood.title).toBe('AI STUDIO: CULINARY ARTS FOOD');
    expect(pFood.groups.some((g) => g.categoryTitle.includes('PASTA') || g.categoryTitle.includes('CHEESE'))).toBe(true);
  });
});
