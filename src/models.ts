export type Mark = "X" | "O";
export type GameMode = "ai" | "two-player";
export type Difficulty = "Easy" | "Balanced" | "Smart";
export type Outcome = Mark | "draw";

export interface Move {
  mark: Mark;
  cell: number;
}

export interface Game {
  id: string;
  number: number;
  mode: GameMode;
  difficulty: Difficulty;
  playerMark: Mark;
  moves: Move[];
  startedAt: string;
}

export interface MatchRecord extends Game {
  opponent: string;
  outcome: Outcome;
  playedAt: string;
}

export interface Settings {
  mode: GameMode;
  difficulty: Difficulty;
  playerMark: Mark;
  sound: boolean;
  motion: boolean;
}

export interface LocalData {
  version: 1;
  settings: Settings;
  activeGame: Game;
  matches: MatchRecord[];
  nextMatchNumber: number;
  currentStreak: number;
}

export const DEFAULT_SETTINGS: Settings = {
  mode: "ai",
  difficulty: "Smart",
  playerMark: "X",
  sound: true,
  motion: true,
};
