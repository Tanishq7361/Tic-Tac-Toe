import { Button, Card } from "@fluentui/react-components";
import { motion, useReducedMotion } from "framer-motion";
import { boardFromMoves, CELL_NAMES, getStatus } from "../lib/game-engine";
import type { Game } from "../models";

interface GameBoardProps {
  game: Game;
  onMove: (cell: number) => void;
  motionEnabled: boolean;
}

export function GameBoard({ game, onMove, motionEnabled }: GameBoardProps) {
  const board = boardFromMoves(game.moves);
  const status = getStatus(board);
  const reducedMotion = useReducedMotion();
  const winningLine = status.kind === "won" ? status.line : [];
  const turn = status.kind === "playing" ? status.turn : null;
  const rows = ["Top row", "Middle row", "Bottom row"];

  return (
    <Card className="board-card">
      <div className="board-heading">
        <div><h2>The board</h2><p>Choose an open square to make your move.</p></div>
        <span className={`turn-pill ${turn === "X" ? "mark-x" : "mark-o"}`} aria-live="polite">
          {status.kind === "won" ? `${status.winner} wins` : status.kind === "draw" ? "Draw game" : `${turn} to move`}
        </span>
      </div>
      <div className="game-board" role="grid" aria-label="Tic-Tac-Toe board">
        {rows.map((rowName, row) => (
          <div className="board-row" role="row" aria-label={rowName} key={rowName}>
            {board.slice(row * 3, row * 3 + 3).map((mark, column) => {
              const cell = row * 3 + column;
              const canPlay = status.kind === "playing" && mark === null &&
                (game.mode === "two-player" || turn === game.playerMark);
              const isWinner = winningLine.includes(cell);
              return (
                <div className="board-cell" role="gridcell" key={cell}>
                  <motion.div
                    className="board-square-motion"
                    whileHover={!reducedMotion && motionEnabled && canPlay ? { scale: 1.035, y: -2 } : undefined}
                    whileTap={!reducedMotion && motionEnabled && canPlay ? { scale: 0.97 } : undefined}
                  >
                    <Button
                      className={`board-square ${mark === "X" ? "mark-x" : mark === "O" ? "mark-o" : ""} ${isWinner ? "winner-cell" : ""}`}
                      appearance="subtle"
                      aria-label={`${CELL_NAMES[cell]}, ${mark ?? "open"}`}
                      disabled={!canPlay}
                      onClick={() => onMove(cell)}
                    >
                      {mark ? <span className="board-mark">{mark}</span> : <span className="cell-index">{String(cell + 1).padStart(2, "0")}</span>}
                    </Button>
                  </motion.div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Card>
  );
}
