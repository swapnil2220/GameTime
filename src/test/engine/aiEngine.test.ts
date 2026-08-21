import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { fetchLiveGeminiConnectionsPuzzle, fetchPersonaHint } from '../../engine/aiEngine';
import type { AptitudePuzzle } from '../../types/game';

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const mockValidConnectionsJson = JSON.stringify({
  title: 'AI STUDIO: SPACE EXPLORATION',
  groups: [
    {
      categoryTitle: 'PLANETS',
      items: ['MARS', 'VENUS', 'JUPITER', 'SATURN'],
      colorTier: 'yellow',
      explanation: 'Planets in our solar system.',
    },
    {
      categoryTitle: 'MOONS',
      items: ['TITAN', 'EUROPA', 'IO', 'CALLISTO'],
      colorTier: 'green',
      explanation: 'Moons of Jupiter and Saturn.',
    },
    {
      categoryTitle: 'ROVERS',
      items: ['CURIOSITY', 'PERSEVERANCE', 'SPIRIT', 'OPPORTUNITY'],
      colorTier: 'blue',
      explanation: 'Mars rovers.',
    },
    {
      categoryTitle: 'SPACE MISSIONS',
      items: ['APOLLO', 'ARTEMIS', 'VOYAGER', 'HUBBLE'],
      colorTier: 'purple',
      explanation: 'Famous NASA space missions and instruments.',
    },
  ],
});

let currentHandler = http.post(GEMINI_ENDPOINT, () => {
  return HttpResponse.json({
    candidates: [
      {
        content: {
          parts: [{ text: mockValidConnectionsJson }],
        },
      },
    ],
  });
});

const server = setupServer(currentHandler);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const dummyPuzzle: AptitudePuzzle = {
  id: 'test_puz_1',
  category: 'series',
  categoryTitle: 'Number Series',
  difficulty: 'beginner',
  levelNumber: 1,
  renderedData: {},
  options: [],
  explanation: 'Add 2 each step.',
  visualHint: 'Look at the difference.',
};

describe('Gemini API Client & MSW Fallbacks (aiEngine)', () => {
  describe('Successful API Responses', () => {
    it('parses valid Gemini 2.5 Flash connections JSON correctly', async () => {
      server.use(
        http.post(GEMINI_ENDPOINT, () => {
          return HttpResponse.json({
            candidates: [
              {
                content: {
                  parts: [{ text: mockValidConnectionsJson }],
                },
              },
            ],
          });
        })
      );

      const res = await fetchLiveGeminiConnectionsPuzzle('space', 'test-api-key-123');

      expect(res).not.toBeNull();
      expect(res?.title).toBe('AI STUDIO: SPACE EXPLORATION');
      expect(res?.groups).toHaveLength(4);
      expect(res?.shuffledTiles).toHaveLength(16);
    });

    it('returns persona hint text when Gemini API succeeds', async () => {
      server.use(
        http.post(GEMINI_ENDPOINT, () => {
          return HttpResponse.json({
            candidates: [
              {
                content: {
                  parts: [{ text: 'Think about what sequence of numbers increases steadily.' }],
                },
              },
            ],
          });
        })
      );

      // Force VITE_GEMINI_API_KEY for testing
      const originalEnv = import.meta.env.VITE_GEMINI_API_KEY;
      import.meta.env.VITE_GEMINI_API_KEY = 'test-key';

      const hint = await fetchPersonaHint(dummyPuzzle, 'socratic', 1);
      expect(hint).toBe('Think about what sequence of numbers increases steadily.');

      import.meta.env.VITE_GEMINI_API_KEY = originalEnv;
    });
  });

  describe('Error Handling & Local Fallbacks', () => {
    it('handles HTTP 500 Internal Server Error without throwing', async () => {
      server.use(
        http.post(GEMINI_ENDPOINT, () => {
          return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
        })
      );

      const res = await fetchLiveGeminiConnectionsPuzzle('space', 'test-key');
      expect(res).toBeNull(); // Graceful fallback
    });

    it('handles HTTP 429 Rate Limit without throwing', async () => {
      server.use(
        http.post(GEMINI_ENDPOINT, () => {
          return new HttpResponse(null, { status: 429, statusText: 'Too Many Requests' });
        })
      );

      const res = await fetchLiveGeminiConnectionsPuzzle('space', 'test-key');
      expect(res).toBeNull();
    });

    it('handles malformed JSON response payload without throwing', async () => {
      server.use(
        http.post(GEMINI_ENDPOINT, () => {
          return HttpResponse.json({
            candidates: [
              {
                content: {
                  parts: [{ text: 'NOT_VALID_JSON{broken...' }],
                },
              },
            ],
          });
        })
      );

      const res = await fetchLiveGeminiConnectionsPuzzle('space', 'test-key');
      expect(res).toBeNull();
    });

    it('falls back to local persona hint when API fails or key missing', async () => {
      const originalEnv = import.meta.env.VITE_GEMINI_API_KEY;
      import.meta.env.VITE_GEMINI_API_KEY = '';

      const socraticHint = await fetchPersonaHint(dummyPuzzle, 'socratic', 1);
      expect(socraticHint).toContain('What fundamental relationship links Number Series?');

      const snarkyHint = await fetchPersonaHint(dummyPuzzle, 'snarky', 1);
      expect(snarkyHint).toContain('Overthinking a simple Number Series puzzle already?');

      const zenHint = await fetchPersonaHint(dummyPuzzle, 'zen', 1);
      expect(zenHint).toContain('Observe the flow within Number Series');

      import.meta.env.VITE_GEMINI_API_KEY = originalEnv;
    });
  });
});
