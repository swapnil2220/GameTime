import type { AptitudePuzzle, Option, DifficultyTier } from '../../types/game';
import { SeededRandom } from '../seed';

export interface CountryMapData {
  name: string;
  capital: string;
  landmark: string;
  continent: string;
  triviaFact: string;
  svgShapeKey: 'japan' | 'italy' | 'brazil' | 'india' | 'australia' | 'france';
}

const COUNTRIES: CountryMapData[] = [
  {
    name: 'Japan',
    capital: 'Tokyo',
    landmark: 'Mount Fuji',
    continent: 'Asia',
    triviaFact: 'Tokyo is the most populous metropolitan area in the world with over 37 million residents!',
    svgShapeKey: 'japan',
  },
  {
    name: 'Italy',
    capital: 'Rome',
    landmark: 'Colosseum',
    continent: 'Europe',
    triviaFact: 'Italy has more UNESCO World Heritage sites than any other country in the world!',
    svgShapeKey: 'italy',
  },
  {
    name: 'Brazil',
    capital: 'Brasília',
    landmark: 'Christ the Redeemer',
    continent: 'South America',
    triviaFact: 'The Amazon Rainforest produces over 20% of the world’s oxygen!',
    svgShapeKey: 'brazil',
  },
  {
    name: 'India',
    capital: 'New Delhi',
    landmark: 'Taj Mahal',
    continent: 'Asia',
    triviaFact: 'India is home to the world’s highest cricket ground at 2,444 meters above sea level in Chail!',
    svgShapeKey: 'india',
  },
  {
    name: 'Australia',
    capital: 'Canberra',
    landmark: 'Sydney Opera House',
    continent: 'Oceania',
    triviaFact: 'Australia is the only continent covered by a single country and is wider than the Moon!',
    svgShapeKey: 'australia',
  },
  {
    name: 'France',
    capital: 'Paris',
    landmark: 'Eiffel Tower',
    continent: 'Europe',
    triviaFact: 'France is the most visited country in the world with nearly 90 million tourists annually!',
    svgShapeKey: 'france',
  },
];

export function generateGeographyPuzzle(difficulty: DifficultyTier, rng: SeededRandom): AptitudePuzzle {
  const country = rng.pick(COUNTRIES);
  const questionType = rng.pick(['capital', 'map_identify', 'landmark']);

  let questionText = '';
  let correctContent = '';
  let distractorPool: string[] = [];
  let hint = '';

  if (questionType === 'capital') {
    questionText = `What is the capital city of ${country.name}?`;
    correctContent = country.capital;
    distractorPool = Array.from(new Set(COUNTRIES.map((c) => c.capital).filter((cap) => cap !== country.capital)));
    hint = `This famous capital city is situated in ${country.continent}.`;
  } else if (questionType === 'map_identify') {
    questionText = `Which country does this map outline represent?`;
    correctContent = country.name;
    distractorPool = Array.from(new Set(COUNTRIES.map((c) => c.name).filter((n) => n !== country.name)));
    hint = `The capital of this country is ${country.capital}.`;
  } else {
    questionText = `The landmark ${country.landmark} is located in which country?`;
    correctContent = country.name;
    distractorPool = Array.from(new Set(COUNTRIES.map((c) => c.name).filter((n) => n !== country.name)));
    hint = `This landmark is located in ${country.continent}.`;
  }

  // Pick unique 3 distractors
  const chosenDistractors = rng.shuffle(distractorPool).slice(0, 3);

  const options: Option[] = [];
  options.push({ id: 'opt_correct', content: correctContent, isCorrect: true });
  chosenDistractors.forEach((d, i) => {
    options.push({ id: `opt_d_${i}`, content: d, isCorrect: false });
  });

  // Guarantee distinct options using Set check
  const uniqueOptions: Option[] = [];
  const seenContent = new Set<string>();

  for (const opt of rng.shuffle(options)) {
    const key = String(opt.content);
    if (!seenContent.has(key)) {
      seenContent.add(key);
      uniqueOptions.push(opt);
    }
  }

  return {
    id: `geo_${Date.now()}_${rng.range(100, 999)}`,
    category: 'geography',
    categoryTitle: 'Geography & World Maps',
    difficulty,
    levelNumber: 1,
    renderedData: {
      country,
      questionType,
      questionText,
    },
    options: uniqueOptions,
    explanation: `${country.name}'s capital is ${country.capital}, famous for ${country.landmark}. 💡 DID YOU KNOW? ${country.triviaFact}`,
    visualHint: hint,
  };
}
