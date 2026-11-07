import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Difficulty, Game, GameMode, LocalData, Mark, MatchRecord, Settings } from "../models";
import { boardFromMoves, getStatus, otherMark, playMove, undoMoves, chooseAiMove } from "../lib/game-engine";
import { loadLocalData, saveLocalData } from "../lib/storage";

interface GameDataContextValue {
  data: LocalData;
  storageError: string | null;
  saveSettings: (settings: Settings) => void;
  startNewGame: () => void;
  makeMove: (cell: number) => void;
  undo: () => void;
  retryStorage: () => void;
}

const GameDataContext = createContext<GameDataContextValue | null>(null);

function createGame(number: number, settings: Settings): Game {
  return {
    id: `match-${String(number).padStart(3, "0")}`,
    number,
    mode: settings.mode,
    difficulty: settings.difficulty,
    playerMark: settings.playerMark,
    moves: [],
    startedAt: new Date().toISOString(),
  };
}

function completeGame(data: LocalData, game: Game): LocalData {
  const status = getStatus(boardFromMoves(game.moves));
  if (status.kind === "playing") return { ...data, activeGame: game };
  const alreadySaved = data.matches.some((match) => match.id === game.id);
  if (alreadySaved) return { ...data, activeGame: game };
  const outcome = status.kind === "draw" ? "draw" : status.winner;
  const record: MatchRecord = {
    ...game,
    opponent: game.mode === "ai" ? "Local AI" : "Two players",
    outcome,
    playedAt: new Date().toISOString(),
  };
  const playerWon = outcome === game.playerMark;
  return {
    ...data,
    activeGame: game,
    matches: [record, ...data.matches],
    currentStreak: playerWon ? data.currentStreak + 1 : 0,
  };
}

function addAiResponse(game: Game): Game {
  if (game.mode !== "ai" || getStatus(boardFromMoves(game.moves)).kind !== "playing") return game;
  const aiMark = otherMark(game.playerMark);
  const cell = chooseAiMove(game.moves, game.difficulty, aiMark);
  if (cell === null) return game;
  const moves = playMove(game.moves, cell, aiMark);
  return moves ? { ...game, moves } : game;
}

export function GameDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<LocalData>(() => loadLocalData());
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    try {
      saveLocalData(data);
      setStorageError(null);
    } catch {
      setStorageError("Saved game data could not be written. Your current session is still playable.");
    }
  }, [data]);

  const saveSettings = useCallback((settings: Settings) => {
    setData((current) => ({ ...current, settings }));
  }, []);

  const startNewGame = useCallback(() => {
    setData((current) => {
      const game = createGame(current.nextMatchNumber, current.settings);
      const started = addAiResponse(game);
      return {
        ...current,
        activeGame: started,
        nextMatchNumber: current.nextMatchNumber + 1,
      };
    });
  }, []);

  const makeMove = useCallback((cell: number) => {
    setData((current) => {
      const game = current.activeGame;
      const board = boardFromMoves(game.moves);
      const status = getStatus(board);
      if (status.kind !== "playing") return current;
      if (game.mode === "ai" && status.turn !== game.playerMark) return current;
      const moves = playMove(game.moves, cell, status.turn);
      if (!moves) return current;
      const afterPlayer = { ...game, moves };
      if (getStatus(boardFromMoves(moves)).kind !== "playing") return completeGame(current, afterPlayer);
      const next = addAiResponse(afterPlayer);
      return completeGame(current, next);
    });
  }, []);

  const undo = useCallback(() => {
    setData((current) => {
      const game = current.activeGame;
      if (getStatus(boardFromMoves(game.moves)).kind !== "playing") return current;
      return { ...current, activeGame: { ...game, moves: undoMoves(game.moves, game.mode) } };
    });
  }, []);

  const retryStorage = useCallback(() => {
    try {
      saveLocalData(data);
      setStorageError(null);
    } catch {
      setStorageError("Saved game data could not be written. Check your browser storage settings and retry.");
    }
  }, [data]);

  const value = useMemo(() => ({ data, storageError, saveSettings, startNewGame, makeMove, undo, retryStorage }),
    [data, storageError, saveSettings, startNewGame, makeMove, undo, retryStorage]);

  return <GameDataContext.Provider value={value}>{children}</GameDataContext.Provider>;
}

export function useGameData(): GameDataContextValue {
  const value = useContext(GameDataContext);
  if (!value) throw new Error("useGameData must be used within GameDataProvider.");
  return value;
}

export function getPlayerOutcome(match: MatchRecord): "Win" | "Loss" | "Draw" {
  if (match.outcome === "draw") return "Draw";
  return match.outcome === match.playerMark ? "Win" : "Loss";
}

export function formatMode(mode: GameMode, playerMark: Mark, difficulty?: Difficulty): string {
  if (mode === "two-player") return "Two players";
  return `AI · ${playerMark}${difficulty ? ` · ${difficulty}` : ""}`;
}
