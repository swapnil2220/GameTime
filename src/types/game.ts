export type AptitudeCategory =
  | 'connections'
  | 'geography'
  | 'sports'
  | 'analogy'
  | 'cipher'
  | 'venn'
  | 'series'
  | 'syllogism'
  | 'science'
  | 'verbal_analogy'
  | 'math_logic';

export type DifficultyTier = 'beginner' | 'intermediate' | 'expert';

export interface ConnectionsGroup {
  categoryTitle: string;
  items: [string, string, string, string];
  colorTier: 'yellow' | 'green' | 'blue' | 'purple';
  explanation: string;
}

export interface ConnectionsPuzzle {
  id: string;
  title: string;
  topicPrompt?: string;
  groups: [ConnectionsGroup, ConnectionsGroup, ConnectionsGroup, ConnectionsGroup];
  shuffledTiles: string[];
}

export interface Option {
  id: string;
  content: any;
  isCorrect: boolean;
}

export interface AptitudePuzzle {
  id: string;
  category: AptitudeCategory;
  categoryTitle: string;
  difficulty: DifficultyTier;
  levelNumber: number;
  renderedData: any;
  options: Option[];
  explanation: string;
  visualHint: string;
}

export interface LevelProgress {
  levelNumber: number;
  unlocked: boolean;
  completed: boolean;
  stars: number;
  bestTimeSec: number | null;
  bestScore: number;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  isGuest: boolean;
  totalScore: number;
  totalStars: number;
  dailyStreak: number;
  lastPlayedDate: string;
  seenQuestionIds?: string[];
  levelProgress: LevelProgress[];
  createdAt: string;
}

export type ViewState = 'level_select' | 'playing' | 'connections_playing' | 'result' | 'leaderboard';
