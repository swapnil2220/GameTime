import { describe, it, expect } from 'vitest';
import { ALL_RELICS, getRelicById, isRelicActive, toggleRelicInList } from '../../engine/modifierEngine';

describe('modifierEngine (Relics System)', () => {
  it('retrieves relic by ID', () => {
    const relic = getRelicById('occams_razor');
    expect(relic).toBeDefined();
    expect(relic?.name).toBe("Occam's Razor");

    const nonExistent = getRelicById('invalid_id' as any);
    expect(nonExistent).toBeUndefined();
  });

  it('checks if relic is active', () => {
    expect(isRelicActive(undefined, 'chronos_lens')).toBe(false);
    expect(isRelicActive(['chronos_lens', 'quantum_link'], 'chronos_lens')).toBe(true);
    expect(isRelicActive(['chronos_lens'], 'occams_razor')).toBe(false);
  });

  it('toggles relics in list enforcing max limit of 2', () => {
    let active = toggleRelicInList([], 'chronos_lens');
    expect(active).toEqual(['chronos_lens']);

    active = toggleRelicInList(active, 'occams_razor');
    expect(active).toEqual(['chronos_lens', 'occams_razor']);

    // Toggling 3rd drops oldest (chronos_lens)
    active = toggleRelicInList(active, 'quantum_link');
    expect(active).toEqual(['occams_razor', 'quantum_link']);

    // Untoggles existing
    active = toggleRelicInList(active, 'occams_razor');
    expect(active).toEqual(['quantum_link']);
  });
});
