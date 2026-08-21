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
  | 'math_logic'
  | 'cinema'
  | 'word_origins'
  | 'history'
  | 'inventions'
  | 'lateral';

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

export interface MindMatrixStats {
  patternRecognition: number;
  spatialReasoning: number;
  verbalFluency: number;
  deductiveLogic: number;
  mathematicalAgility: number;
  speedReflexes: number;
}

export interface BlitzResult {
  score: number;
  maxCombo: number;
  accuracy: number;
  avgResponseTimeSec: number;
  totalAnswered: number;
  correctCount: number;
}

export type RelicModifierId = 'chronos_lens' | 'occams_razor' | 'chaos_cipher' | 'quantum_link';

export interface RelicModifier {
  id: RelicModifierId;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  active: boolean;
}

export type AIPersonaType = 'socratic' | 'snarky' | 'zen';

export interface AIPersona {
  id: AIPersonaType;
  name: string;
  avatar: string;
  tagline: string;
}

export interface GhostTelemetryFrame {
  stepIndex: number;
  timestampMs: number;
  selectedOptionId: string;
  isCorrect: boolean;
}

export interface GhostRunData {
  seedStr: string;
  username: string;
  avatar: string;
  totalTimeSec: number;
  score: number;
  telemetry: GhostTelemetryFrame[];
}

export type AudioTheme = 'cyberpunk' | 'zen' | 'typewriter';

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
  mindMatrix: MindMatrixStats;
  blitzHighScore: number;
  activeRelics?: RelicModifierId[];
  preferredPersona?: AIPersonaType;
  audioTheme?: AudioTheme;
  levelProgress: LevelProgress[];
  createdAt: string;
}

export type ViewState =
  | 'level_select'
  | 'playing'
  | 'connections_playing'
  | 'blitz_playing'
  | 'ghost_duel'
  | 'result'
  | 'leaderboard';
