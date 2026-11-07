import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Field,
  MessageBar,
  MessageBarBody,
  Select,
  Switch,
  Text,
  Title1,
} from "@fluentui/react-components";
import { CheckmarkCircleRegular, GridRegular, SaveRegular, SettingsRegular } from "@fluentui/react-icons";
import { DEFAULT_SETTINGS, type Settings } from "../../models";
import { useGameData, formatMode } from "../../hooks/GameDataContext";
import { PreviewStatePicker } from "../../components/StatePreview";

export function SettingsPage() {
  const { data, saveSettings } = useGameData();
  const [draft, setDraft] = useState<Settings>(data.settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => setDraft(data.settings), [data.settings]);
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveSettings(draft);
    setSaved(true);
  };
  const reset = () => {
    setDraft({ ...DEFAULT_SETTINGS });
    setSaved(false);
  };

  return (
    <main className="page settings-page">
      <PreviewStatePicker />
      <section className="page-title-row">
        <div><span className="eyebrow"><span className="eyebrow-dot" />Personalize your game</span><Title1 as="h1"><SettingsRegular /> Settings</Title1><Text>Make every match feel like yours.</Text></div>
        <Badge appearance="tint" color="success"><CheckmarkCircleRegular /> Local play</Badge>
      </section>

      <div className="settings-layout">
        <Card className="settings-form-card">
          <form className="settings-form" aria-label="Game settings" onSubmit={onSubmit}>
            <Field label="Game mode" hint="Play against the built-in opponent or share the board locally.">
              <Select value={draft.mode} onChange={(event) => set("mode", event.target.value as Settings["mode"])}>
                <option value="ai">Local AI</option><option value="two-player">Two players</option>
              </Select>
            </Field>
            <Field
              label="AI difficulty"
              validationState={draft.mode === "ai" ? "none" : "warning"}
              validationMessage={draft.mode === "ai" ? undefined : "Difficulty applies when you choose Local AI."}
              hint="Smart adapts to the board and looks for the strongest move."
            >
              <Select value={draft.difficulty} disabled={draft.mode !== "ai"} onChange={(event) => set("difficulty", event.target.value as Settings["difficulty"])}>
                <option value="Easy">Easy</option><option value="Balanced">Balanced</option><option value="Smart">Smart</option>
              </Select>
            </Field>
            <Field label="Player mark" validationState="warning" validationMessage="This preference applies to new Local AI games." hint="Choose the mark you will play as in Local AI games.">
              <Select value={draft.playerMark} onChange={(event) => set("playerMark", event.target.value as Settings["playerMark"])}>
                <option value="X">X</option><option value="O">O</option>
              </Select>
            </Field>

            <div className="settings-toggles">
              <div className="toggle-row">
                <div><Switch label="Sound effects" checked={draft.sound} onChange={(_, value) => set("sound", value.checked)} /><Text>Play a subtle sound for moves and match results.</Text></div>
              </div>
              <div className="toggle-row">
                <div><Switch label="Motion effects" checked={draft.motion} onChange={(_, value) => set("motion", value.checked)} /><Text>Use gentle transitions across the board and game hub.</Text></div>
              </div>
            </div>

            <div className="settings-actions">
              <Button appearance="secondary" type="button" icon={<SettingsRegular />} onClick={reset}>Reset to defaults</Button>
              <Button appearance="primary" type="submit" icon={<SaveRegular />}>Save settings</Button>
            </div>
            {saved && <MessageBar intent="success"><MessageBarBody><strong>Settings saved.</strong> Your preferences are stored on this device.</MessageBarBody></MessageBar>}
          </form>
        </Card>

        <aside className="settings-aside">
          <Card className="settings-summary">
            <div className="summary-board" aria-hidden="true"><GridRegular /><span>X</span><span>O</span><span>X</span></div>
            <Badge appearance="tint" color="brand">Selected mode</Badge>
            <h2>{draft.mode === "ai" ? "Local AI" : "Two players"}</h2>
            <Text>{draft.mode === "ai" ? "A focused match against your local AI opponent. Your current setup is ready for a smart, classic game." : "Share your device and challenge a friend to a classic local match."}</Text>
            <div className="summary-badges">
              <Badge appearance="tint" color="success">{draft.mode === "ai" ? draft.difficulty : "Pass & play"}</Badge>
              <Badge appearance="tint" color="informative">You play {draft.playerMark}</Badge>
            </div>
          </Card>
          <Card className="privacy-card"><CheckmarkCircleRegular /><div><strong>Private by design</strong><Text>Settings, matches, and statistics stay in this browser. No account or network connection needed.</Text></div></Card>
        </aside>
      </div>
      <footer className="page-footnote"><span><span className="status-dot" />Current game: {formatMode(data.activeGame.mode, data.activeGame.playerMark, data.activeGame.difficulty)}</span><span>Changes apply to your next match.</span></footer>
    </main>
  );
}
