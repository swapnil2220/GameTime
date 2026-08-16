import type { ConnectionsPuzzle, ConnectionsGroup } from '../types/game';
import { SeededRandom } from './seed';

const AI_PRESET_PUZZLES: Array<{ title: string; groups: [ConnectionsGroup, ConnectionsGroup, ConnectionsGroup, ConnectionsGroup] }> = [
  {
    title: 'THE DAILY NEXUS AI #42',
    groups: [
      {
        categoryTitle: 'CHESS PIECES',
        items: ['KING', 'QUEEN', 'ROOK', 'KNIGHT'],
        colorTier: 'yellow',
        explanation: 'Standard pieces on a chessboard.',
      },
      {
        categoryTitle: 'PLAYING CARD SUITS',
        items: ['SPADE', 'HEART', 'DIAMOND', 'CLUB'],
        colorTier: 'green',
        explanation: 'Four suits in a standard 52-card deck.',
      },
      {
        categoryTitle: 'WORDS ENDING IN "OUT"',
        items: ['LOOK', 'KNOCK', 'STRIKE', 'SHOUT'],
        colorTier: 'blue',
        explanation: 'Words that commonly pair with "out" (Lookout, Knockout, Strikeout, Shoutout).',
      },
      {
        categoryTitle: 'THINGS WITH SPRINGS',
        items: ['CLOCK', 'TRAMPOLINE', 'MATTRESS', 'PEN'],
        colorTier: 'purple',
        explanation: 'Objects that contain internal mechanical springs.',
      },
    ],
  },
  {
    title: 'AI STUDIO: CINEMA & HOLLYWOOD',
    groups: [
      {
        categoryTitle: 'DISNEY PRINCESSES',
        items: ['BELLE', 'ARIEL', 'JASMINE', 'MULAN'],
        colorTier: 'yellow',
        explanation: 'Iconic animated Disney movie princesses.',
      },
      {
        categoryTitle: 'MOVIES WITH "STAR" IN TITLE',
        items: ['WARS', 'TREK', 'GATE', 'BURST'],
        colorTier: 'green',
        explanation: 'Famous sci-fi movie titles starting with Star.',
      },
      {
        categoryTitle: 'THINGS A DIRECTOR SAYS',
        items: ['ACTION', 'CUT', 'QUIET', 'PRINT'],
        colorTier: 'blue',
        explanation: 'Commands called out on a film set.',
      },
      {
        categoryTitle: 'SUPERHERO SECRET ALTER EGOS',
        items: ['PARKER', 'WAYNE', 'STARK', 'BANNER'],
        colorTier: 'purple',
        explanation: 'Last names of Marvel & DC superheroes (Peter, Bruce, Tony, Bruce).',
      },
    ],
  },
  {
    title: 'AI STUDIO: TECH & INNOVATION',
    groups: [
      {
        categoryTitle: 'PROGRAMMING LANGUAGES',
        items: ['PYTHON', 'JAVA', 'RUST', 'SWIFT'],
        colorTier: 'yellow',
        explanation: 'Popular modern software coding languages.',
      },
      {
        categoryTitle: 'WEB BROWSERS',
        items: ['CHROME', 'SAFARI', 'EDGE', 'OPERA'],
        colorTier: 'green',
        explanation: 'Web browsers used to surf the internet.',
      },
      {
        categoryTitle: 'PLANTS THAT ARE ALSO TECH NAMES',
        items: ['APPLE', 'BLACKBERRY', 'MINT', 'LOTUS'],
        colorTier: 'blue',
        explanation: 'Botanical items that double as tech companies or software.',
      },
      {
        categoryTitle: 'THINGS THAT CAN "BUG"',
        items: ['COMPUTER', 'LISTENER', 'INSECT', 'PHONE'],
        colorTier: 'purple',
        explanation: 'Things that can have a bug or be wiretapped.',
      },
    ],
  },
  {
    title: 'AI STUDIO: FOOD & CULINARY ARTS',
    groups: [
      {
        categoryTitle: 'ITALIAN PASTA SHAPES',
        items: ['PENNE', 'FUSILLI', 'RIGATONI', 'FARFALLE'],
        colorTier: 'yellow',
        explanation: 'Classic forms of Italian dried pasta.',
      },
      {
        categoryTitle: 'TYPES OF CHEESE',
        items: ['CHEDDAR', 'BRIE', 'GOUDA', 'SWISS'],
        colorTier: 'green',
        explanation: 'Popular dairy cheese varieties.',
      },
      {
        categoryTitle: 'MEASUREMENTS IN BAKING',
        items: ['CUP', 'PINCH', 'OUNCE', 'DASH'],
        colorTier: 'blue',
        explanation: 'Recipe measurement units.',
      },
      {
        categoryTitle: 'THINGS THAT SLICE',
        items: ['KNIFE', 'PIZZA', 'GOLF', 'BREAD'],
        colorTier: 'purple',
        explanation: 'Things associated with slicing (utensil, dish, shot, food).',
      },
    ],
  },
];

export function generateAIConnectionsPuzzle(topicPrompt?: string, seed?: number): ConnectionsPuzzle {
  const rng = new SeededRandom(seed);

  let chosenPreset = AI_PRESET_PUZZLES[0];

  if (topicPrompt && topicPrompt.trim().length > 0) {
    const promptLower = topicPrompt.toLowerCase();
    if (promptLower.includes('movie') || promptLower.includes('film') || promptLower.includes('cinema')) {
      chosenPreset = AI_PRESET_PUZZLES[1];
    } else if (promptLower.includes('tech') || promptLower.includes('code') || promptLower.includes('software')) {
      chosenPreset = AI_PRESET_PUZZLES[2];
    } else if (promptLower.includes('food') || promptLower.includes('cook') || promptLower.includes('chef')) {
      chosenPreset = AI_PRESET_PUZZLES[3];
    } else {
      chosenPreset = rng.pick(AI_PRESET_PUZZLES);
    }
  } else {
    chosenPreset = rng.pick(AI_PRESET_PUZZLES);
  }

  // Collect all 16 items and shuffle
  const allItems: string[] = [];
  chosenPreset.groups.forEach((g) => {
    allItems.push(...g.items);
  });

  const shuffledTiles = rng.shuffle(allItems);

  return {
    id: `connections_${Date.now()}_${rng.range(100, 999)}`,
    title: topicPrompt ? `AI STUDIO: ${topicPrompt.toUpperCase()}` : chosenPreset.title,
    topicPrompt,
    groups: chosenPreset.groups,
    shuffledTiles,
  };
}
