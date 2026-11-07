import { Badge, Button, Card, MessageBar, MessageBarBody, MessageBarTitle, Tab, TabList, Text, Title1 } from "@fluentui/react-components";
import { ArrowClockwiseRegular, ArrowUndoRegular, PersonRegular, SparkleRegular } from "@fluentui/react-icons";
import { useReducedMotion } from "framer-motion";
import { useGameData } from "../../hooks/GameDataContext";
import { boardFromMoves, getStatus } from "../../lib/game-engine";
import { GameBoard } from "../../components/GameBoard";
import { MoveTimeline } from "../../components/MoveTimeline";
import { PreviewStatePicker } from "../../components/StatePreview";

function playMoveSound() {
  try {
    const audio = new AudioContext();
    const oscillator = audio.createOscillator();
    const volume = audio.createGain();
    oscillator.frequency.value = 540;
    volume.gain.setValueAtTime(0.035, audio.currentTime);
    volume.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.09);
    oscillator.connect(volume);
    volume.connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.09);
    oscillator.onended = () => { void audio.close(); };
  } catch {
    // Audio is optional; some browsers block playback until user interaction.
  }
}

export function PlayPage() {
  const { data, makeMove, saveSettings, startNewGame, undo } = useGameData();
  const { activeGame: game, settings } = data;
  const reducedMotion = useReducedMotion();
  const status = getStatus(boardFromMoves(game.moves));
  const finished = status.kind !== "playing";
  const turn = status.kind === "playing" ? status.turn : null;
  const changeMode = (mode: "ai" | "two-player") => {
    if (mode === settings.mode && mode === game.mode) return;
    saveSettings({ ...settings, mode });
    startNewGame();
  };
  const handleMove = (cell: number) => {
    if (settings.sound) playMoveSound();
    makeMove(cell);
  };
  const canUndo = !finished && game.moves.length > 0;
  const result = status.kind === "won" ? `${status.winner} won the match`
    : status.kind === "draw" ? "The match ended in a draw" : "";

  return (
    <main className="page play-page">
      <PreviewStatePicker />
      <section className="page-title-row">
        <div><span className="eyebrow"><span className="eyebrow-dot" />Game room / live match</span><Title1 as="h1">Make your next move</Title1><Text>Think ahead, play your line, and enjoy the rematch.</Text></div>
        <Badge appearance="tint" color="brand">Match #{String(game.number).padStart(3, "0")}</Badge>
      </section>
      <TabList
        selectedValue={game.mode}
        onTabSelect={(_, tab) => changeMode(String(tab.value) as "ai" | "two-player")}
        className="mode-tabs"
        aria-label="Game mode"
      >
        <Tab value="ai" icon={<SparkleRegular />}>Local AI</Tab>
        <Tab value="two-player" icon={<PersonRegular />}>Two players</Tab>
      </TabList>

      <section className="match-overview" aria-label="Match details">
        <Card className="overview-card"><span><PersonRegular /> Opponent</span><strong>{game.mode === "ai" ? "Local AI" : "Two players"}</strong><Text>Playing as {game.playerMark}</Text></Card>
        <Card className="overview-card"><span><SparkleRegular /> Difficulty</span><strong>{game.mode === "ai" ? game.difficulty : "Pass & play"}</strong><Text>{game.mode === "ai" ? "Balanced challenge" : "Share the board"}</Text></Card>
        <Card className="overview-card"><span><ArrowClockwiseRegular /> Turn</span><strong>{turn ? `${turn} to move` : "Match complete"}</strong><Text>{turn === game.playerMark ? "You are up next" : game.mode === "ai" ? "Local AI turn" : "Next player up"}</Text></Card>
      </section>

      {finished && <MessageBar intent={status.kind === "draw" ? "info" : "success"}><MessageBarBody><MessageBarTitle>{result}</MessageBarTitle>{status.kind === "won" && status.winner === game.playerMark ? "That’s a great finish. Want another round?" : "Ready to try another round?"}</MessageBarBody></MessageBar>}

      <div className="play-columns">
        <section>
          <GameBoard game={game} onMove={handleMove} motionEnabled={settings.motion} />
          <div className="play-actions">
            <Button appearance="secondary" icon={<ArrowClockwiseRegular />} onClick={startNewGame}>New game</Button>
            <Button appearance="primary" icon={<ArrowUndoRegular />} onClick={undo} disabled={!canUndo}>Undo move</Button>
          </div>
        </section>
        <aside>
          <MoveTimeline game={game} onUndo={undo} canUndo={canUndo} />
          <Card className="play-tip"><SparkleRegular /><div><strong>{game.mode === "ai" ? `${game.difficulty} opponent` : "Local two-player"}</strong><Text>{game.mode === "ai" ? "The AI responds instantly. Undo takes back your last turn and its response." : "Take turns on the same board. Undo removes the most recent move."}</Text></div></Card>
        </aside>
      </div>
      <footer className="page-footnote"><span><span className="status-dot" />Local match · Progress saved on this device</span><span>Motion {settings.motion && !reducedMotion ? "on" : "reduced"}</span></footer>
    </main>
  );
}
