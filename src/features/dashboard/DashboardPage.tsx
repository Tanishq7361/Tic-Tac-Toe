import {
  Badge,
  Button,
  Card,
  CardHeader,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Skeleton,
  SkeletonItem,
  Text,
  Title1,
  Title2,
  Tooltip,
} from "@fluentui/react-components";
import {
  ArrowRightRegular,
  CalendarRegular,
  ChartMultipleRegular,
  CheckmarkCircleRegular,
  GridRegular,
  HistoryRegular,
  SearchRegular,
  TrophyRegular,
} from "@fluentui/react-icons";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip as ChartTooltip, XAxis, YAxis } from "recharts";
import { useNavigate } from "react-router-dom";
import { PreviewStatePicker, usePreviewState } from "../../components/StatePreview";
import { useGameData, getPlayerOutcome, formatMode } from "../../hooks/GameDataContext";

const weeklyRates = [
  { day: "Sun", rate: 42 }, { day: "Mon", rate: 50 }, { day: "Tue", rate: 38 },
  { day: "Wed", rate: 58 }, { day: "Thu", rate: 54 }, { day: "Fri", rate: 71 }, { day: "Sat", rate: 76 },
];

const statistics = [
  { key: "games", title: "Games played", icon: <GridRegular />, note: "Since you started playing" },
  { key: "wins", title: "Player wins", icon: <TrophyRegular />, note: "A strong run of victories" },
  { key: "draws", title: "Draws", icon: <CheckmarkCircleRegular />, note: "Evenly matched games" },
  { key: "streak", title: "Win streak", icon: <ChartMultipleRegular />, note: "Keep the momentum going" },
];

function DashboardLoading() {
  return (
    <div className="stats-grid" aria-label="Loading dashboard" aria-busy="true">
      {statistics.map((stat) => (
        <Card key={stat.key} className="stat-card">
          <Skeleton aria-hidden="true"><SkeletonItem size={16} /><SkeletonItem size={32} /><SkeletonItem size={12} /></Skeleton>
        </Card>
      ))}
    </div>
  );
}

export function DashboardPage() {
  const { data, storageError, retryStorage, startNewGame } = useGameData();
  const navigate = useNavigate();
  const previewState = usePreviewState();
  const completed = data.matches;
  const playerWins = completed.filter((match) => getPlayerOutcome(match) === "Win").length;
  const draws = completed.filter((match) => match.outcome === "draw").length;
  const recent = completed.slice(0, 4);

  return (
    <main className="page dashboard-page">
      <PreviewStatePicker />
      {storageError && (
        <MessageBar intent="error" layout="multiline">
          <MessageBarBody><MessageBarTitle>Browser storage is unavailable</MessageBarTitle>{storageError}</MessageBarBody>
          <Button appearance="primary" onClick={retryStorage}>Retry</Button>
        </MessageBar>
      )}
      <Card className="hero-card">
        <svg className="hero-mesh" aria-hidden="true" viewBox="0 0 800 400" preserveAspectRatio="none">
          <defs>
            <radialGradient id="mesh-a" cx="0%" cy="0%" r="80%"><stop offset="0%" stopColor="#35D6C1" stopOpacity=".55" /><stop offset="100%" stopColor="#35D6C1" stopOpacity="0" /></radialGradient>
            <radialGradient id="mesh-b" cx="100%" cy="100%" r="80%"><stop offset="0%" stopColor="#7C5CFC" stopOpacity=".55" /><stop offset="100%" stopColor="#7C5CFC" stopOpacity="0" /></radialGradient>
          </defs>
          <rect width="800" height="400" fill="url(#mesh-a)" /><rect width="800" height="400" fill="url(#mesh-b)" />
        </svg>
        <div className="hero-content">
          <span className="eyebrow"><span className="eyebrow-dot" />Your game, at a glance</span>
          <Title1 as="h1">Welcome back, Jordan.</Title1>
          <Text className="hero-subtitle">You’ve played {completed.length} games so far. Ready to make your next move?</Text>
          <div className="hero-actions">
            <Button appearance="primary" size="large" icon={<GridRegular />} onClick={() => { startNewGame(); navigate("/play"); }}>
              Play a game
            </Button>
            <Button appearance="secondary" size="large" icon={<HistoryRegular />} onClick={() => navigate("/history")}>
              View game history
            </Button>
          </div>
        </div>
        <div className="hero-orbit" aria-hidden="true"><span>X</span><span>O</span><span>X</span></div>
      </Card>

      <section aria-label="Your game statistics">
        <div className="section-heading">
          <div><Title2 as="h2">At a glance</Title2><Text>Your latest game-room numbers</Text></div>
          <Badge appearance="tint" color="brand">Local profile</Badge>
        </div>
        {previewState === "loading" ? <DashboardLoading /> : previewState === "error" ? (
          <MessageBar intent="error"><MessageBarBody><MessageBarTitle>Couldn’t load your stats</MessageBarTitle>Your saved statistics are safe. Retry to refresh them.</MessageBarBody><Button onClick={retryStorage}>Retry</Button></MessageBar>
        ) : previewState === "empty" || completed.length === 0 ? (
          <Card className="empty-state"><ChartMultipleRegular className="empty-icon" /><Title2 as="h2">No games yet</Title2><Text>Play your first match to start building your personal stats.</Text><Button appearance="primary" onClick={() => navigate("/play")}>Start a game</Button></Card>
        ) : (
          <div className="stats-grid">
            {statistics.map((stat) => {
              const value = stat.key === "games" ? completed.length : stat.key === "wins" ? playerWins
                : stat.key === "draws" ? draws : `${data.currentStreak}-win streak`;
              return (
                <Card key={stat.key} className="stat-card">
                  <CardHeader image={<span className="stat-icon">{stat.icon}</span>} header={<Text className="stat-label">{stat.title}</Text>} />
                  <strong className="stat-value">{value}</strong>
                  <Text className="stat-note">{stat.note}</Text>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section aria-labelledby="recent-heading">
        <div className="section-heading">
          <div><Title2 as="h2" id="recent-heading"><HistoryRegular /> Recent matches</Title2><Text>Your latest results, all in one place</Text></div>
          <Button appearance="subtle" icon={<ArrowRightRegular />} onClick={() => navigate("/history")}>See all games</Button>
        </div>
        {previewState === "loading" ? (
          <Card className="loading-card" aria-busy="true"><Skeleton><SkeletonItem size={24} /><SkeletonItem size={24} /></Skeleton></Card>
        ) : previewState === "error" ? null : previewState === "empty" || recent.length === 0 ? (
          <Card className="empty-state compact-empty"><SearchRegular className="empty-icon" /><Title2 as="h2">No recent matches</Title2><Text>Your completed matches will appear here.</Text></Card>
        ) : (
          <div className="recent-grid">
            {recent.map((match) => {
              const outcome = getPlayerOutcome(match);
              return (
                <Card key={match.id} className="match-card">
                  <CardHeader
                    header={<Text className="match-title">Match #{String(match.number).padStart(3, "0")} · {match.opponent}</Text>}
                    description={<Text className="match-meta">{formatMode(match.mode, match.playerMark)}</Text>}
                    action={<Badge appearance="tint" color={outcome === "Win" ? "success" : outcome === "Loss" ? "danger" : "informative"}>{match.outcome === "draw" ? "Draw" : `${match.outcome} won`}</Badge>}
                  />
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section aria-labelledby="win-rate-heading">
        <div className="section-heading">
          <div><Title2 as="h2" id="win-rate-heading"><ChartMultipleRegular /> 7-day win rate</Title2><Text>Wins per day</Text></div>
          <Badge appearance="tint" color="success">56% average</Badge>
        </div>
        <Card className="chart-card">
          <Text>Your win rate has climbed this week, with your strongest finish today.</Text>
          <div className="chart-wrap" role="img" aria-label="Win rate was 42 percent Sunday, 50 Monday, 38 Tuesday, 58 Wednesday, 54 Thursday, 71 Friday, and 76 percent Saturday.">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={200}>
              <AreaChart data={weeklyRates} margin={{ top: 14, right: 12, left: -18, bottom: 0 }}>
                <defs><linearGradient id="win-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#35D6C1" stopOpacity={0.28} /><stop offset="100%" stopColor="#35D6C1" stopOpacity={0.01} /></linearGradient></defs>
                <CartesianGrid stroke="#27314B" strokeDasharray="3 5" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#9AA4BF", fontSize: 12 }} />
                <YAxis domain={[0, 80]} tickFormatter={(value: number) => `${value}%`} axisLine={false} tickLine={false} tick={{ fill: "#9AA4BF", fontSize: 12 }} />
                <ChartTooltip formatter={(value) => [`${value}%`, "Win rate"]} contentStyle={{ background: "#131A2E", border: "1px solid #27314B", borderRadius: 12 }} />
                <Area type="monotone" dataKey="rate" stroke="#35D6C1" strokeWidth={3} fill="url(#win-fill)" activeDot={{ r: 5, fill: "#35D6C1" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-caption"><span><CalendarRegular /> Week at a glance</span><Badge appearance="tint" color="success">56% average</Badge></div>
        </Card>
      </section>

      <section aria-labelledby="activity-heading">
        <div className="section-heading"><div><Title2 as="h2" id="activity-heading"><CalendarRegular /> Weekly activity</Title2><Text>Your week, one move at a time</Text></div></div>
        <Card className="activity-card">
          <div className="activity-days" aria-label="Completed games by weekday">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => {
              const count = completed.filter((match) => new Date(match.playedAt).getUTCDay() === index).length;
              return <div className="activity-day" key={day}><span>{day}</span><div className="activity-bar"><i style={{ height: `${Math.min(100, Math.max(12, count * 7))}%` }} /></div><strong>{count}</strong></div>;
            })}
          </div>
        </Card>
      </section>
      <footer className="page-footnote"><Tooltip content="Your data stays in this browser" relationship="label"><span><CheckmarkCircleRegular /> Saved on this device</span></Tooltip></footer>
    </main>
  );
}
