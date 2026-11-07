import { describe, expect, it } from "vitest";
import { boardFromMoves, getStatus, otherMark, playMove, chooseAiMove, undoMoves } from "./game-engine";
import type { Move } from "../models";

describe("Tic-Tac-Toe rules", () => {
  it("recognizes all win directions and a full-board draw", () => {
    expect(getStatus(boardFromMoves([
      { mark: "X", cell: 0 }, { mark: "O", cell: 3 }, { mark: "X", cell: 1 },
      { mark: "O", cell: 4 }, { mark: "X", cell: 2 },
    ]))).toEqual({ kind: "won", winner: "X", line: [0, 1, 2] });
    expect(getStatus(boardFromMoves([
      { mark: "X", cell: 0 }, { mark: "O", cell: 1 }, { mark: "X", cell: 2 },
      { mark: "O", cell: 4 }, { mark: "X", cell: 3 }, { mark: "O", cell: 5 },
      { mark: "O", cell: 6 }, { mark: "X", cell: 7 }, { mark: "X", cell: 8 },
    ]))).toEqual({ kind: "draw" });
  });

  it("rejects occupied cells, invalid indices, wrong turns, and moves after a result", () => {
    const opening: Move[] = [{ mark: "X", cell: 0 }];
    expect(playMove(opening, 0)).toBeNull();
    expect(playMove(opening, 9)).toBeNull();
    expect(playMove(opening, 2, "X")).toBeNull();
    const won: Move[] = [{ mark: "X", cell: 0 }, { mark: "O", cell: 3 }, { mark: "X", cell: 1 }, { mark: "O", cell: 4 }, { mark: "X", cell: 2 }];
    expect(playMove(won, 8)).toBeNull();
    expect(otherMark("O")).toBe("X");
  });

  it("wins immediately and blocks an immediate opponent win", () => {
    const winning: Move[] = [
      { mark: "X", cell: 3 }, { mark: "O", cell: 0 }, { mark: "X", cell: 4 },
      { mark: "O", cell: 1 }, { mark: "X", cell: 8 },
    ];
    expect(chooseAiMove(winning, "Balanced", "O")).toBe(2);
    const blocking: Move[] = [{ mark: "X", cell: 0 }, { mark: "O", cell: 4 }, { mark: "X", cell: 1 }];
    expect(chooseAiMove(blocking, "Balanced", "O")).toBe(2);
  });

  it("never loses when playing the Smart minimax strategy", () => {
    const humanCanForceWin = (moves: Move[]): boolean => {
      const board = boardFromMoves(moves);
      const status = getStatus(board);
      if (status.kind === "won") return status.winner === "X";
      if (status.kind === "draw") return false;
      const available = board.map((mark, cell) => mark === null ? cell : -1).filter((cell) => cell >= 0);
      if (status.turn === "X") {
        return available.some((cell) => humanCanForceWin([...moves, { mark: "X", cell }]));
      }
      const cell = chooseAiMove(moves, "Smart", "O");
      return cell !== null && humanCanForceWin([...moves, { mark: "O", cell }]);
    };

    expect(humanCanForceWin([])).toBe(false);
  });

  it("takes back both turns in AI mode and one in two-player mode", () => {
    const moves: Move[] = [{ mark: "X", cell: 0 }, { mark: "O", cell: 4 }, { mark: "X", cell: 1 }, { mark: "O", cell: 8 }];
    expect(undoMoves(moves, "ai")).toHaveLength(2);
    expect(undoMoves(moves, "two-player")).toHaveLength(3);
    expect(undoMoves([], "ai")).toEqual([]);
  });
});
