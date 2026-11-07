import type { Difficulty, Mark, Move } from "../models";

export type Board = (Mark | null)[];
export type GameStatus = { kind: "playing"; turn: Mark } | { kind: "won"; winner: Mark; line: number[] } | { kind: "draw" };

export const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export const CELL_NAMES = [
  "Top left", "Top center", "Top right",
  "Middle left", "Center", "Middle right",
  "Bottom left", "Bottom center", "Bottom right",
];

export const otherMark = (mark: Mark): Mark => mark === "X" ? "O" : "X";

export function boardFromMoves(moves: Move[]): Board {
  const board: Board = Array(9).fill(null);
  for (const move of moves) {
    if (Number.isInteger(move.cell) && move.cell >= 0 && move.cell < 9 && board[move.cell] === null) {
      board[move.cell] = move.mark;
    }
  }
  return board;
}

export function getStatus(board: Board): GameStatus {
  for (const line of WINNING_LINES) {
    const [first, second, third] = line;
    if (board[first] && board[first] === board[second] && board[first] === board[third]) {
      return { kind: "won", winner: board[first], line };
    }
  }
  if (board.every(Boolean)) return { kind: "draw" };
  const xCount = board.filter((mark) => mark === "X").length;
  const oCount = board.filter((mark) => mark === "O").length;
  return { kind: "playing", turn: xCount <= oCount ? "X" : "O" };
}

export function playMove(moves: Move[], cell: number, mark?: Mark): Move[] | null {
  const board = boardFromMoves(moves);
  const status = getStatus(board);
  if (status.kind !== "playing" || !Number.isInteger(cell) || cell < 0 || cell > 8 || board[cell] !== null) return null;
  const nextMark = mark ?? status.turn;
  if (nextMark !== status.turn) return null;
  return [...moves, { cell, mark: nextMark }];
}

function minimax(board: Board, turn: Mark, computer: Mark, depth: number): number {
  const status = getStatus(board);
  if (status.kind === "won") return status.winner === computer ? 10 - depth : depth - 10;
  if (status.kind === "draw") return 0;
  let best = turn === computer ? -Infinity : Infinity;
  for (let cell = 0; cell < 9; cell += 1) {
    if (board[cell] !== null) continue;
    board[cell] = turn;
    const score = minimax(board, otherMark(turn), computer, depth + 1);
    board[cell] = null;
    best = turn === computer ? Math.max(best, score) : Math.min(best, score);
  }
  return best;
}

export function chooseAiMove(moves: Move[], difficulty: Difficulty, aiMark: Mark, random: () => number = Math.random): number | null {
  const board = boardFromMoves(moves);
  const status = getStatus(board);
  if (status.kind !== "playing" || status.turn !== aiMark) return null;
  const available = board.map((mark, index) => mark === null ? index : -1).filter((index) => index >= 0);
  if (available.length === 0) return null;
  if (difficulty === "Easy") return available[Math.floor(random() * available.length)];

  const winningMove = (mark: Mark): number | undefined => available.find((cell) => {
    board[cell] = mark;
    const wins = getStatus(board).kind === "won";
    board[cell] = null;
    return wins;
  });
  const winNow = winningMove(aiMark);
  if (winNow !== undefined) return winNow;
  const block = winningMove(otherMark(aiMark));
  if (block !== undefined) return block;
  if (difficulty === "Balanced") {
    if (board[4] === null) return 4;
    const corners = [0, 2, 6, 8].filter((cell) => board[cell] === null);
    if (corners.length) return corners[Math.floor(random() * corners.length)];
    return available[Math.floor(random() * available.length)];
  }

  let bestScore = -Infinity;
  let bestCell = available[0];
  for (const cell of available) {
    board[cell] = aiMark;
    const score = minimax(board, otherMark(aiMark), aiMark, 0);
    board[cell] = null;
    if (score > bestScore) {
      bestScore = score;
      bestCell = cell;
    }
  }
  return bestCell;
}

export function undoMoves(moves: Move[], mode: "ai" | "two-player"): Move[] {
  if (moves.length === 0) return moves;
  const count = mode === "ai" ? Math.min(2, moves.length) : 1;
  return moves.slice(0, -count);
}
