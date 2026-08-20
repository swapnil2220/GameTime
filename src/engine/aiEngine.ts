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
        explanation: 'Last names of Marvel & DC superheroes.',
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
        explanation: 'Things associated with slicing.',
      },
    ],
  },
];

export async function fetchLiveGeminiConnectionsPuzzle(
  topicPrompt: string,
  apiKey?: string
): Promise<ConnectionsPuzzle | null> {
  const activeKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY;
  if (!activeKey || activeKey === 'your_gemini_api_key_here') return null;

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${activeKey}`;

    const promptText = `Generate a 16-tile NYT Connections style puzzle themed around "${topicPrompt}".
Return strictly valid JSON with 4 distinct categories (4 tiles each).
Difficulty tiers must be "yellow" (easiest), "green" (medium), "blue" (hard), "purple" (mind-bending/tricky).
Output JSON schema:
{
  "title": "AI STUDIO: ${topicPrompt.toUpperCase()}",
  "groups": [
    {
      "categoryTitle": "CATEGORY NAME 1",
      "items": ["ITEM1", "ITEM2", "ITEM3", "ITEM4"],
      "colorTier": "yellow",
      "explanation": "Brief 1-sentence reason"
    },
    {
      "categoryTitle": "CATEGORY NAME 2",
      "items": ["ITEM5", "ITEM6", "ITEM7", "ITEM8"],
      "colorTier": "green",
      "explanation": "Brief 1-sentence reason"
    },
    {
      "categoryTitle": "CATEGORY NAME 3",
      "items": ["ITEM9", "ITEM10", "ITEM11", "ITEM12"],
      "colorTier": "blue",
      "explanation": "Brief 1-sentence reason"
    },
    {
      "categoryTitle": "CATEGORY NAME 4",
      "items": ["ITEM13", "ITEM14", "ITEM15", "ITEM16"],
      "colorTier": "purple",
      "explanation": "Brief 1-sentence reason"
    }
  ]
}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    const parsed = JSON.parse(rawText);
    if (!parsed.groups || parsed.groups.length !== 4) return null;

    const allItems: string[] = [];
    parsed.groups.forEach((g: ConnectionsGroup) => allItems.push(...g.items));
    if (allItems.length !== 16) return null;

    const rng = new SeededRandom();
    const shuffledTiles = rng.shuffle(allItems);

    return {
      id: `ai_${Date.now()}`,
      title: parsed.title || `AI STUDIO: ${topicPrompt.toUpperCase()}`,
      topicPrompt,
      groups: parsed.groups,
      shuffledTiles,
    };
  } catch (err) {
    console.error('Gemini API fetch error:', err);
    return null;
  }
}

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
