import { Badge, Button, Card, CardHeader, Text } from "@fluentui/react-components";
import { ArrowUndoRegular, HistoryRegular } from "@fluentui/react-icons";
import { CELL_NAMES, boardFromMoves } from "../lib/game-engine";
import type { Game } from "../models";

interface MoveTimelineProps {
  game: Game;
  onUndo: () => void;
  canUndo: boolean;
}

export function MoveTimeline({ game, onUndo, canUndo }: MoveTimelineProps) {
  return (
    <Card className="timeline-card">
      <CardHeader
        header={<Text className="card-title">Move timeline</Text>}
        description={<Text>{game.moves.length} moves</Text>}
      />
      {game.moves.length ? (
        <ol className="move-list" aria-label="Moves played">
          {game.moves.map((move, index) => (
            <li className="move-item" key={`${index}-${move.cell}`}>
              <Badge appearance="tint" color={move.mark === "X" ? "brand" : "informative"}>{String(index + 1).padStart(2, "0")}</Badge>
              <div><strong>{move.mark} at {CELL_NAMES[move.cell]}</strong><Text>{game.mode === "ai" && move.mark !== game.playerMark ? "Local AI responded" : index === 0 ? "You opened the match" : "Move recorded"}</Text></div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="timeline-empty"><HistoryRegular className="empty-icon" /><Text>Your first move starts the timeline.</Text></div>
      )}
      <div className="timeline-board" aria-label="Board after the latest move">
        <span>Current position</span>
        <strong>{boardFromMoves(game.moves).map((mark) => mark ?? "·").join(" ")}</strong>
      </div>
      <Button appearance="secondary" icon={<ArrowUndoRegular />} onClick={onUndo} disabled={!canUndo} className="undo-button">
        Undo move
      </Button>
    </Card>
  );
}
