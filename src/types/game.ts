export type AptitudeCategory =
  | 'analogy'
  | 'cipher'
  | 'venn'
  | 'series'
  | 'geography'
  | 'sports'
  | 'syllogism';

export type DifficultyTier = 'beginner' | 'intermediate' | 'expert' | 'master';

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
  stars: number; // 0, 1, 2, 3
  bestTimeSec: number | null;
  bestScore: number;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  isGuest: boolean;
  totalScore: number;
  totalStars: number;
  levels: LevelProgress[];
}

export type ViewState = 'level_select' | 'playing' | 'result' | 'leaderboard';
