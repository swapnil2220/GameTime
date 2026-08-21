import type { AptitudePuzzle, Option, DifficultyTier } from '../../types/game';
import { SeededRandom } from '../seed';

export interface CountryMapData {
  name: string;
  capital: string;
  landmark: string;
  continent: string;
  triviaFact: string;
  svgShapeKey: 'japan' | 'italy' | 'brazil' | 'india' | 'australia' | 'france' | 'canada' | 'egypt' | 'germany' | 'spain' | 'argentina' | 'mexico' | 'south_korea' | 'uk' | 'greece' | 'kenya' | 'norway' | 'thailand' | 'south_africa' | 'peru';
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
    triviaFact: 'India is home to the world’s highest cricket ground in Chail at 2,444 meters altitude!',
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
  {
    name: 'Canada',
    capital: 'Ottawa',
    landmark: 'CN Tower',
    continent: 'North America',
    triviaFact: 'Canada has the longest coastline of any country in the world stretching over 202,080 km!',
    svgShapeKey: 'canada',
  },
  {
    name: 'Egypt',
    capital: 'Cairo',
    landmark: 'Great Pyramid of Giza',
    continent: 'Africa',
    triviaFact: 'The Great Pyramid of Giza was the tallest man-made structure in the world for over 3,800 years!',
    svgShapeKey: 'egypt',
  },
  {
    name: 'Germany',
    capital: 'Berlin',
    landmark: 'Brandenburg Gate',
    continent: 'Europe',
    triviaFact: 'Germany has over 20,000 castles scattered across its landscape!',
    svgShapeKey: 'germany',
  },
  {
    name: 'Spain',
    capital: 'Madrid',
    landmark: 'Sagrada Família',
    continent: 'Europe',
    triviaFact: 'Spain produces nearly 50% of the entire world’s total olive oil supply!',
    svgShapeKey: 'spain',
  },
  {
    name: 'Argentina',
    capital: 'Buenos Aires',
    landmark: 'Iguazu Falls',
    continent: 'South America',
    triviaFact: 'Argentina created the world’s first animated feature film in 1917!',
    svgShapeKey: 'argentina',
  },
  {
    name: 'Mexico',
    capital: 'Mexico City',
    landmark: 'Chichen Itza',
    continent: 'North America',
    triviaFact: 'Mexico City is sinking by up to 50 cm per year because it was built on a lakebed!',
    svgShapeKey: 'mexico',
  },
  {
    name: 'South Korea',
    capital: 'Seoul',
    landmark: 'N Seoul Tower',
    continent: 'Asia',
    triviaFact: 'South Korea has the world’s fastest average internet connection speed!',
    svgShapeKey: 'south_korea',
  },
  {
    name: 'United Kingdom',
    capital: 'London',
    landmark: 'Big Ben',
    continent: 'Europe',
    triviaFact: 'You are never more than 115 km (70 miles) away from the sea anywhere in the UK!',
    svgShapeKey: 'uk',
  },
  {
    name: 'Greece',
    capital: 'Athens',
    landmark: 'Parthenon',
    continent: 'Europe',
    triviaFact: 'Athens is one of the oldest cities in the world, continuously inhabited for over 3,400 years!',
    svgShapeKey: 'greece',
  },
  {
    name: 'Kenya',
    capital: 'Nairobi',
    landmark: 'Maasai Mara',
    continent: 'Africa',
    triviaFact: 'Kenya hosts the Great Migration, where millions of wildebeest travel across the Savannah!',
    svgShapeKey: 'kenya',
  },
  {
    name: 'Norway',
    capital: 'Oslo',
    landmark: 'Geirangerfjord',
    continent: 'Europe',
    triviaFact: 'Norway introduced salmon sushi to Japan in the 1980s!',
    svgShapeKey: 'norway',
  },
  {
    name: 'Thailand',
    capital: 'Bangkok',
    landmark: 'Grand Palace',
    continent: 'Asia',
    triviaFact: 'Bangkok’s full ceremonial name is 168 letters long, making it the longest place name in the world!',
    svgShapeKey: 'thailand',
  },
  {
    name: 'South Africa',
    capital: 'Pretoria',
    landmark: 'Table Mountain',
    continent: 'Africa',
    triviaFact: 'South Africa is the only country in the world with three official capital cities!',
    svgShapeKey: 'south_africa',
  },
  {
    name: 'Peru',
    capital: 'Lima',
    landmark: 'Machu Picchu',
    continent: 'South America',
    triviaFact: 'Peru is the birthplace of the potato, cultivating over 4,000 varieties!',
    svgShapeKey: 'peru',
  },
];

export function generateGeographyPuzzle(
  difficulty: DifficultyTier,
  rng: SeededRandom,
  seenIds: string[] = []
): AptitudePuzzle {
  const available = COUNTRIES.filter((c) => !seenIds.includes(`geo_${c.name.toLowerCase()}`));
  const country = available.length > 0 ? rng.pick(available) : rng.pick(COUNTRIES);

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
    questionText = `Which country does this landmark/geography belong to?`;
    correctContent = country.name;
    distractorPool = Array.from(new Set(COUNTRIES.map((c) => c.name).filter((n) => n !== country.name)));
    hint = `The capital of this country is ${country.capital}.`;
  } else {
    questionText = `The landmark ${country.landmark} is located in which country?`;
    correctContent = country.name;
    distractorPool = Array.from(new Set(COUNTRIES.map((c) => c.name).filter((n) => n !== country.name)));
    hint = `This landmark is located in ${country.continent}.`;
  }

  const shuffledPool = rng.shuffle(distractorPool);
  const chosenDistractors: string[] = [];

  for (const d of shuffledPool) {
    if (d !== correctContent && !chosenDistractors.includes(d)) {
      chosenDistractors.push(d);
    }
    if (chosenDistractors.length === 3) break;
  }

  const rawOptions: Option[] = [
    { id: 'opt_correct', content: correctContent, isCorrect: true },
  ];
  chosenDistractors.forEach((d, i) => {
    rawOptions.push({ id: `opt_d_${i}`, content: d, isCorrect: false });
  });

  const uniqueOptions: Option[] = [];
  const seenContent = new Set<string>();

  for (const opt of rng.shuffle(rawOptions)) {
    const key = String(opt.content);
    if (!seenContent.has(key)) {
      seenContent.add(key);
      uniqueOptions.push(opt);
    }
  }

  let extraIdx = 0;
  while (uniqueOptions.length < 4 && extraIdx < COUNTRIES.length) {
    const fallbackVal = questionType === 'capital' ? COUNTRIES[extraIdx].capital : COUNTRIES[extraIdx].name;
    if (!seenContent.has(fallbackVal)) {
      seenContent.add(fallbackVal);
      uniqueOptions.push({ id: `opt_fallback_${extraIdx}`, content: fallbackVal, isCorrect: false });
    }
    extraIdx++;
  }

  return {
    id: `geo_${country.name.toLowerCase()}_${Date.now()}`,
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
