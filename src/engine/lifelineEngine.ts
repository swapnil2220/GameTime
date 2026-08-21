import type { AptitudePuzzle, Option, AudiencePollResult, AIExpertRecommendation } from '../types/game';
import { SeededRandom } from './seed';

export function computeFiftyFifty(options: Option[]): string[] {
  const correctOpt = options.find((o) => o.isCorrect);
  const wrongOpts = options.filter((o) => !o.isCorrect);

  if (!correctOpt || wrongOpts.length < 2) return options.map((o) => o.id);

  const rng = new SeededRandom();
  const shuffledWrong = rng.shuffle(wrongOpts);
  const keptWrong = shuffledWrong[0];

  return [correctOpt.id, keptWrong.id];
}

export function computeAudiencePoll(puzzle: AptitudePuzzle): AudiencePollResult {
  const rng = new SeededRandom();
  const correctOpt = puzzle.options.find((o) => o.isCorrect);
  const wrongOpts = puzzle.options.filter((o) => !o.isCorrect);

  let correctPct = 65;
  if (puzzle.difficulty === 'beginner') correctPct = rng.range(70, 85);
  else if (puzzle.difficulty === 'intermediate') correctPct = rng.range(50, 68);
  else correctPct = rng.range(38, 52); // Expert confusion

  let remaining = 100 - correctPct;
  const percentages: Record<string, number> = {};

  if (correctOpt) {
    percentages[correctOpt.id] = correctPct;
  }

  wrongOpts.forEach((w, idx) => {
    if (idx === wrongOpts.length - 1) {
      percentages[w.id] = Math.max(2, remaining);
    } else {
      const p = rng.range(2, Math.max(3, Math.floor(remaining / 2)));
      percentages[w.id] = p;
      remaining -= p;
    }
  });

  return { percentages };
}

export async function fetchAIExpertRecommendation(puzzle: AptitudePuzzle): Promise<AIExpertRecommendation> {
  const activeKey = import.meta.env.VITE_GEMINI_API_KEY;
  const correctOpt = puzzle.options.find((o) => o.isCorrect);

  if (activeKey && activeKey !== 'your_gemini_api_key_here' && correctOpt) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${activeKey}`;
      const promptText = `Act as an erudite quizmaster scholar on a high-stakes Millionaire game show.
Question: "${puzzle.renderedData.questionText || puzzle.explanation}"
Correct Answer: "${correctOpt.content}"
Output JSON:
{
  "confidenceScore": 88,
  "explanation": "I am 88% certain it is ${correctOpt.content} because..."
}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: { response_mime_type: 'application/json', temperature: 0.7 },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          return {
            optionId: correctOpt.id,
            optionContent: String(correctOpt.content),
            confidenceScore: parsed.confidenceScore || 85,
            explanation: parsed.explanation || `I'm quite confident the answer is ${correctOpt.content}.`,
          };
        }
      }
    } catch (e) {
      // Fallback below
    }
  }

  // Local preset fallback
  const fallbackOpt = correctOpt || puzzle.options[0];
  const rng = new SeededRandom();
  const conf = puzzle.difficulty === 'beginner' ? rng.range(85, 95) : rng.range(70, 85);

  return {
    optionId: fallbackOpt.id,
    optionContent: String(fallbackOpt.content),
    confidenceScore: conf,
    explanation: `I'm about ${conf}% certain the answer is "${fallbackOpt.content}" based on logical principles.`,
  };
}
