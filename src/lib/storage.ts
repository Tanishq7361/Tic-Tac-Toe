import type { Game, LocalData, MatchRecord } from "../models";
import { DEFAULT_SETTINGS } from "../models";
import type { Move } from "../models";

export const STORAGE_KEY = "tic-tac-toe.game-hub.v1";

function createHistoricalMatch(number: number, outcome: "X" | "O" | "draw", playedAt: string): MatchRecord {
  return {
    id: `match-${String(number).padStart(3, "0")}`,
    number,
    mode: number % 2 === 0 ? "ai" : "two-player",
    difficulty: "Smart",
    playerMark: "X",
    opponent: number % 2 === 0 ? "Local AI" : (number % 3 === 0 ? "Maya Chen" : "Leo Park"),
    outcome,
    playedAt,
    startedAt: playedAt,
    moves: [],
  };
}

export function createSeedData(): LocalData {
  const matches: MatchRecord[] = [];
  const outcomes: ("X" | "O" | "draw")[] = [
    ...Array<"X">(28).fill("X"),
    ...Array<"draw">(7).fill("draw"),
    ...Array<"O">(9).fill("O"),
  ];
  for (let number = 1; number <= 44; number += 1) {
    const day = String(1 + ((number - 1) % 6)).padStart(2, "0");
    matches.push(createHistoricalMatch(number, outcomes[number - 1], `2026-11-${day}T12:00:00.000Z`));
  }
  matches.push(
    { ...createHistoricalMatch(45, "X", "2026-11-06T15:00:00.000Z"), mode: "two-player", opponent: "Leo Park" },
    { ...createHistoricalMatch(46, "O", "2026-11-06T18:00:00.000Z"), mode: "ai", opponent: "Local AI", playerMark: "O" },
    { ...createHistoricalMatch(47, "draw", "2026-11-07T10:00:00.000Z"), mode: "two-player", opponent: "Maya Chen" },
    { ...createHistoricalMatch(48, "X", "2026-11-07T14:00:00.000Z"), mode: "ai", opponent: "Local AI", playerMark: "X" },
  );
  const activeMoves: Move[] = [
    { mark: "X", cell: 0 },
    { mark: "O", cell: 1 },
    { mark: "X", cell: 4 },
    { mark: "O", cell: 5 },
  ];
  return {
    version: 1,
    settings: { ...DEFAULT_SETTINGS },
    activeGame: {
      id: "match-049",
      number: 49,
      mode: "ai",
      difficulty: "Smart",
      playerMark: "X",
      startedAt: "2026-11-07T15:00:00.000Z",
      moves: activeMoves,
    },
    matches: matches.sort((a, b) => b.number - a.number),
    nextMatchNumber: 50,
    currentStreak: 3,
  };
}

function isMark(value: unknown): value is "X" | "O" {
  return value === "X" || value === "O";
}

function isMove(value: unknown): value is Move {
  if (!value || typeof value !== "object") return false;
  const move = value as Partial<Move>;
  return isMark(move.mark) && Number.isInteger(move.cell) && (move.cell ?? -1) >= 0 && (move.cell ?? 9) < 9;
}

function isGame(value: unknown): value is Game {
  if (!value || typeof value !== "object") return false;
  const game = value as Partial<Game>;
  return typeof game.id === "string" && Number.isInteger(game.number) &&
    (game.mode === "ai" || game.mode === "two-player") &&
    (game.difficulty === "Easy" || game.difficulty === "Balanced" || game.difficulty === "Smart") &&
    isMark(game.playerMark) && typeof game.startedAt === "string" &&
    Array.isArray(game.moves) && game.moves.every(isMove);
}

function isMatch(value: unknown): value is MatchRecord {
  if (!isGame(value)) return false;
  const match = value as Partial<MatchRecord>;
  return typeof match.opponent === "string" &&
    (match.outcome === "X" || match.outcome === "O" || match.outcome === "draw") &&
    typeof match.playedAt === "string";
}

function isLocalData(value: unknown): value is LocalData {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<LocalData>;
  const settings = candidate.settings;
  return candidate.version === 1 && Array.isArray(candidate.matches) && candidate.matches.every(isMatch) &&
    isGame(candidate.activeGame) && Number.isInteger(candidate.nextMatchNumber) &&
    Number.isInteger(candidate.currentStreak) && (candidate.currentStreak ?? -1) >= 0 &&
    Boolean(settings) && (settings?.mode === "ai" || settings?.mode === "two-player") &&
    (settings?.difficulty === "Easy" || settings?.difficulty === "Balanced" || settings?.difficulty === "Smart") &&
    isMark(settings?.playerMark) && typeof settings?.sound === "boolean" && typeof settings?.motion === "boolean";
}

function browserStorage(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

export function loadLocalData(storage?: Storage | null): LocalData {
  const source = storage === undefined ? browserStorage() : storage;
  if (!source) return createSeedData();
  try {
    const raw = source.getItem(STORAGE_KEY);
    if (!raw) return createSeedData();
    const parsed: unknown = JSON.parse(raw);
    return isLocalData(parsed) ? parsed : createSeedData();
  } catch {
    return createSeedData();
  }
}

export function saveLocalData(data: LocalData, storage?: Storage | null): void {
  const target = storage === undefined ? browserStorage() : storage;
  if (!target) throw new Error("Browser storage is unavailable.");
  target.setItem(STORAGE_KEY, JSON.stringify(data));
}
