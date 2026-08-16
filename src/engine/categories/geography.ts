import type { AptitudePuzzle, Option, DifficultyTier } from '../../types/game';
import { SeededRandom } from '../seed';

export interface GeoQuestion {
  country: string;
  capital: string;
  continent: string;
  flagEmoji: string;
  svgPathD: string; // SVG path outline for map
}

const GEO_DATABASE: GeoQuestion[] = [
  {
    country: 'Japan',
    capital: 'Tokyo',
    continent: 'Asia',
    flagEmoji: '🇯🇵',
    svgPathD: 'M 30,20 Q 40,10 60,25 Q 70,40 50,60 Q 30,70 20,50 Z',
  },
  {
    country: 'Italy',
    capital: 'Rome',
    continent: 'Europe',
    flagEmoji: '🇮🇹',
    svgPathD: 'M 20,10 L 40,20 L 50,50 L 60,70 L 40,65 L 30,45 Z', // boot silhouette
  },
  {
    country: 'France',
    capital: 'Paris',
    continent: 'Europe',
    flagEmoji: '🇫🇷',
    svgPathD: 'M 30,10 L 60,10 L 70,40 L 50,70 L 20,50 Z', // hexagon shape
  },
  {
    country: 'Brazil',
    capital: 'Brasília',
    continent: 'South America',
    flagEmoji: '🇧🇷',
    svgPathD: 'M 20,20 L 70,15 L 60,65 L 30,70 L 15,40 Z',
  },
  {
    country: 'Egypt',
    capital: 'Cairo',
    continent: 'Africa',
    flagEmoji: '🇪🇬',
    svgPathD: 'M 15,15 L 75,15 L 75,65 L 15,65 Z', // quad
  },
  {
    country: 'Australia',
    capital: 'Canberra',
    continent: 'Oceania',
    flagEmoji: '🇦🇺',
    svgPathD: 'M 15,30 Q 30,10 70,20 Q 80,50 60,70 Q 20,70 15,30 Z',
  },
  {
    country: 'Canada',
    capital: 'Ottawa',
    continent: 'North America',
    flagEmoji: '🇨🇦',
    svgPathD: 'M 10,20 L 80,15 L 75,60 L 15,60 Z',
  },
  {
    country: 'India',
    capital: 'New Delhi',
    continent: 'Asia',
    flagEmoji: '🇮🇳',
    svgPathD: 'M 20,10 L 70,10 L 45,75 Z', // triangular peninsula outline
  },
];

export function generateGeographyPuzzle(difficulty: DifficultyTier, rng: SeededRandom): AptitudePuzzle {
  const target = rng.pick(GEO_DATABASE);

  // Question Type: Capital OR Country Map Identification
  const qType = rng.pick(['capital', 'map']);

  if (qType === 'capital') {
    const distractors = rng
      .shuffle(GEO_DATABASE.filter((g) => g.country !== target.country))
      .slice(0, 3)
      .map((g) => g.capital);

    const options: Option[] = [
      { id: 'opt_c', content: target.capital, isCorrect: true },
      ...distractors.map((d, i) => ({ id: `opt_d_${i}`, content: d, isCorrect: false })),
    ];

    return {
      id: `geo_${Date.now()}_${rng.range(100, 999)}`,
      category: 'geography',
      categoryTitle: 'World Geography & Capitals',
      difficulty,
      levelNumber: 17,
      renderedData: {
        type: 'capital',
        country: target.country,
        flagEmoji: target.flagEmoji,
        continent: target.continent,
      },
      options: rng.shuffle(options),
      explanation: `The capital of ${target.country} ${target.flagEmoji} is ${target.capital}.`,
      visualHint: `Think of key landmarks in ${target.country} (${target.continent}).`,
    };
  } else {
    // Map silhouette identification
    const distractors = rng
      .shuffle(GEO_DATABASE.filter((g) => g.country !== target.country))
      .slice(0, 3)
      .map((g) => g.country);

    const options: Option[] = [
      { id: 'opt_c', content: target.country, isCorrect: true },
      ...distractors.map((d, i) => ({ id: `opt_d_${i}`, content: d, isCorrect: false })),
    ];

    return {
      id: `geo_map_${Date.now()}_${rng.range(100, 999)}`,
      category: 'geography',
      categoryTitle: 'Country Map Identification',
      difficulty,
      levelNumber: 18,
      renderedData: {
        type: 'map',
        svgPathD: target.svgPathD,
        flagEmoji: target.flagEmoji,
        continent: target.continent,
      },
      options: rng.shuffle(options),
      explanation: `This map silhouette outline represents ${target.country} ${target.flagEmoji}.`,
      visualHint: `Notice the coastline / border geometry located in ${target.continent}.`,
    };
  }
}
