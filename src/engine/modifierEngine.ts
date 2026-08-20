import type { RelicModifier, RelicModifierId } from '../types/game';

export const ALL_RELICS: RelicModifier[] = [
  {
    id: 'chronos_lens',
    name: 'Chronos Lens',
    icon: '⏳',
    description: 'Grants +5s extra time bonus on every puzzle, but options feature subtle visual similarity.',
    unlocked: true,
    active: false,
  },
  {
    id: 'occams_razor',
    name: "Occam's Razor",
    icon: '🗡️',
    description: 'Automatically eliminates 1 incorrect distractor in 4-choice puzzles, but reduces base score by 25%.',
    unlocked: true,
    active: false,
  },
  {
    id: 'chaos_cipher',
    name: 'Chaos Cipher',
    icon: '🌀',
    description: 'Triples (3x) score multiplier rewards, but rotates cipher alphabets dynamically mid-countdown.',
    unlocked: true,
    active: false,
  },
  {
    id: 'quantum_link',
    name: 'Quantum Link',
    icon: '⚛️',
    description: 'In 16-tile Connections, reveals whether 2 selected tiles belong to the same group before submitting.',
    unlocked: true,
    active: false,
  },
];

export function getRelicById(id: RelicModifierId): RelicModifier | undefined {
  return ALL_RELICS.find((r) => r.id === id);
}

export function isRelicActive(activeRelicIds: RelicModifierId[] | undefined, id: RelicModifierId): boolean {
  if (!activeRelicIds) return false;
  return activeRelicIds.includes(id);
}

export function toggleRelicInList(activeRelicIds: RelicModifierId[] = [], id: RelicModifierId): RelicModifierId[] {
  if (activeRelicIds.includes(id)) {
    return activeRelicIds.filter((rId) => rId !== id);
  } else {
    // Max 2 active relics allowed concurrently
    if (activeRelicIds.length >= 2) {
      return [...activeRelicIds.slice(1), id];
    }
    return [...activeRelicIds, id];
  }
}
