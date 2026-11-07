import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Select,
  Skeleton,
  SkeletonItem,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  Title1,
} from "@fluentui/react-components";
import {
  ChevronLeftRegular,
  ChevronRightRegular,
  DismissRegular,
  FilterRegular,
  HistoryRegular,
  SearchRegular,
} from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";
import { PreviewStatePicker, usePreviewState } from "../../components/StatePreview";
import { useGameData, getPlayerOutcome, formatMode } from "../../hooks/GameDataContext";

const PAGE_SIZE = 4;

function dateLabel(value: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
    .format(new Date(value));
}

function HistoryLoading() {
  return <Card className="loading-card" role="status" aria-label="Loading matches" aria-busy="true"><Skeleton><SkeletonItem size={32} /><SkeletonItem size={32} /><SkeletonItem size={32} /></Skeleton></Card>;
}

export function GameHistoryPage() {
  const { data, storageError, retryStorage } = useGameData();
  const navigate = useNavigate();
  const previewState = usePreviewState();
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("all");
  const [outcome, setOutcome] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sortDescending, setSortDescending] = useState(true);
  const [page, setPage] = useState(1);
  const invalidRange = Boolean(from && to && from > to);

  const filtered = useMemo(() => {
    if (invalidRange || previewState === "empty") return [];
    const query = search.trim().toLowerCase();
    return data.matches.filter((match) => {
      const paddedNumber = String(match.number).padStart(3, "0");
      const bySearch = !query || `match ${match.number} ${paddedNumber} #${paddedNumber} ${match.opponent}`.toLowerCase().includes(query);
      const byMode = mode === "all" || match.mode === mode;
      const byOutcome = outcome === "all" || getPlayerOutcome(match).toLowerCase() === outcome;
      const date = match.playedAt.slice(0, 10);
      const byDate = (!from || date >= from) && (!to || date <= to);
      return bySearch && byMode && byOutcome && byDate;
    }).sort((a, b) => sortDescending
      ? b.playedAt.localeCompare(a.playedAt) || b.number - a.number
      : a.playedAt.localeCompare(b.playedAt) || a.number - b.number);
  }, [data.matches, from, invalidRange, mode, outcome, previewState, search, sortDescending, to]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const shown = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const clearFilters = () => {
    setSearch("");
    setMode("all");
    setOutcome("all");
    setFrom("");
    setTo("");
    setPage(1);
  };
  const update = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  return (
    <main className="page history-page">
      <PreviewStatePicker />
      <section className="page-title-row">
        <div><span className="eyebrow"><span className="eyebrow-dot" />Your games, in one place</span><Title1 as="h1"><HistoryRegular /> Game History</Title1><Text>Review recent matches and results.</Text></div>
        <Badge appearance="tint" color="brand">{data.matches.length} saved matches</Badge>
      </section>

      {storageError && <MessageBar intent="error"><MessageBarBody><MessageBarTitle>Browser storage is unavailable</MessageBarTitle>{storageError}</MessageBarBody><Button onClick={retryStorage}>Retry</Button></MessageBar>}

      <Card className="filters-card">
        <div className="section-heading filter-heading"><div><h2><SearchRegular /> Find a match</h2><Text>Search or narrow results by match details</Text></div><FilterRegular /></div>
        <form className="history-filters" role="search" aria-label="Search and filter game history" onSubmit={(event) => { event.preventDefault(); setPage(1); }}>
          <Field label="Search matches">
            <Input type="search" value={search} onChange={(_, value) => update(setSearch)(value.value)} placeholder="Search by match or opponent" contentBefore={<SearchRegular />} />
          </Field>
          <Field label="Match type">
            <Select value={mode} onChange={(event) => update(setMode)(event.target.value)}>
              <option value="all">All match types</option><option value="ai">Local AI</option><option value="two-player">Two players</option>
            </Select>
          </Field>
          <Field label="Result">
            <Select value={outcome} onChange={(event) => update(setOutcome)(event.target.value)}>
              <option value="all">All results</option><option value="win">Player wins</option><option value="loss">Losses</option><option value="draw">Draws</option>
            </Select>
          </Field>
          <div className="date-filter">
            <Field label="From">
              <Input type="date" value={from} onChange={(_, value) => update(setFrom)(value.value)} />
            </Field>
            <Field label="To">
              <Input type="date" value={to} onChange={(_, value) => update(setTo)(value.value)} />
            </Field>
          </div>
          <Field
            className="date-validation"
            validationState={invalidRange ? "error" : "warning"}
            validationMessage={invalidRange ? "Start date must be on or before the end date." : "Date filters are optional; leave both blank to search all time."}
          >
            <span className="sr-only">Date range validation</span>
          </Field>
          <div className="filter-actions">
            <Button appearance="primary" icon={<SearchRegular />} type="submit">Apply filters</Button>
            <Button appearance="subtle" icon={<DismissRegular />} onClick={clearFilters} type="button">Clear filters</Button>
          </div>
        </form>
      </Card>

      <section aria-labelledby="matches-heading">
        <div className="section-heading"><div><h2 id="matches-heading"><HistoryRegular /> All matches</h2><Text>{previewState === "empty" ? "No saved matches in this view" : "Recent saved results"}</Text></div></div>
        {previewState === "loading" ? <HistoryLoading /> : previewState === "error" ? (
          <MessageBar intent="error"><MessageBarBody><MessageBarTitle>Couldn’t load your matches</MessageBarTitle>Your saved results are safe. Retry to refresh the list.</MessageBarBody><Button onClick={retryStorage}>Retry</Button></MessageBar>
        ) : shown.length === 0 ? (
          <Card className="empty-state"><SearchRegular className="empty-icon" /><h2>{invalidRange ? "Check your date range" : "No matches found"}</h2><Text>{invalidRange ? "The start date must be before the end date." : "Try widening your search or clearing the selected filters."}</Text><div className="empty-actions"><Button appearance="secondary" onClick={clearFilters}>Clear filters</Button><Button appearance="primary" onClick={() => navigate("/play")}>Play a game</Button></div></Card>
        ) : (
          <>
            <Card className="history-table-card">
              <div className="table-scroll">
                <Table aria-label="Recent game history records" className="history-table">
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>Match</TableHeaderCell>
                      <TableHeaderCell>Opponent</TableHeaderCell>
                      <TableHeaderCell>Mode</TableHeaderCell>
                      <TableHeaderCell>Played as</TableHeaderCell>
                      <TableHeaderCell>Result</TableHeaderCell>
                      <TableHeaderCell>
                        <Button appearance="subtle" onClick={() => setSortDescending(!sortDescending)}>Date {sortDescending ? "↓" : "↑"}</Button>
                      </TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shown.map((match) => {
                      const result = getPlayerOutcome(match);
                      return <TableRow key={match.id}>
                        <TableCell><strong>#{String(match.number).padStart(3, "0")}</strong></TableCell>
                        <TableCell>{match.opponent}</TableCell>
                        <TableCell>{match.mode === "ai" ? "Single player" : "Two players"}</TableCell>
                        <TableCell>{formatMode(match.mode, match.playerMark)}</TableCell>
                        <TableCell><Badge appearance="tint" color={result === "Win" ? "success" : result === "Loss" ? "danger" : "informative"}>{match.outcome === "draw" ? "Draw" : `${match.outcome} won`}</Badge></TableCell>
                        <TableCell><time dateTime={match.playedAt}>{dateLabel(match.playedAt)}</time></TableCell>
                      </TableRow>;
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>
            <nav className="pagination" aria-label="Match history pagination">
              <Text>Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} matches</Text>
              <div className="pagination-controls">
                <Button appearance="secondary" icon={<ChevronLeftRegular />} disabled={safePage === 1} onClick={() => setPage(safePage - 1)}>Previous</Button>
                <span aria-current="page">Page {safePage} of {pageCount}</span>
                <Button appearance="secondary" icon={<ChevronRightRegular />} iconPosition="after" disabled={safePage === pageCount} onClick={() => setPage(safePage + 1)}>Next</Button>
              </div>
            </nav>
          </>
        )}
      </section>
    </main>
  );
}
