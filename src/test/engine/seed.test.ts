import { describe, it, expect } from 'vitest';
import { SeededRandom } from '../../engine/seed';

describe('SeededRandom (Mulberry32 PRNG)', () => {
  it('generates identical sequence when initialized with identical seeds', () => {
    const rng1 = new SeededRandom(12345);
    const rng2 = new SeededRandom(12345);

    const seq1 = Array.from({ length: 10 }).map(() => rng1.next());
    const seq2 = Array.from({ length: 10 }).map(() => rng2.next());

    expect(seq1).toEqual(seq2);
  });

  it('generates different sequences for different seeds', () => {
    const rng1 = new SeededRandom(12345);
    const rng2 = new SeededRandom(54321);

    const val1 = rng1.next();
    const val2 = rng2.next();

    expect(val1).not.toEqual(val2);
  });

  it('returns numbers within requested min/max range', () => {
    const rng = new SeededRandom(999);
    for (let i = 0; i < 100; i++) {
      const val = rng.range(5, 15);
      expect(val).toBeGreaterThanOrEqual(5);
      expect(val).toBeLessThanOrEqual(15);
      expect(Number.isInteger(val)).toBe(true);
    }
  });

  it('picks items deterministically from array', () => {
    const items = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
    const rng1 = new SeededRandom(777);
    const rng2 = new SeededRandom(777);

    const pick1 = rng1.pick(items);
    const pick2 = rng2.pick(items);

    expect(pick1).toBe(pick2);
    expect(items).toContain(pick1);
  });

  it('shuffles arrays deterministically without mutating original', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const rng1 = new SeededRandom(888);
    const rng2 = new SeededRandom(888);

    const shuffled1 = rng1.shuffle(arr);
    const shuffled2 = rng2.shuffle(arr);

    expect(shuffled1).toEqual(shuffled2);
    expect(shuffled1).not.toBe(arr); // New reference
    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // Unmutated original
    expect(shuffled1.sort((a, b) => a - b)).toEqual(arr);
  });
});
