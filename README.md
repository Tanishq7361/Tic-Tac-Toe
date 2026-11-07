# Tic-Tac-Toe

A polished, responsive Tic-Tac-Toe game hub. Play against the local AI or pass
the board between two players, review each move, undo turns, and explore saved
match history and statistics.

## Run locally

```sh
npm install
npm run dev
```

Open the localhost URL printed by Vite. The app is a client-side React, Vite,
and TypeScript SPA; all game data and preferences are stored in this browser's
local storage. No account or backend is required.

## Play

Choose **Local AI** or **Two players** from the Play page. In a two-player
match, X starts and players take turns. Three matching marks in a row,
column, or diagonal wins; a full board without a winning line is a draw.

The AI supports Easy, Balanced, and Smart (minimax) difficulty. Undo removes
the AI's reply and your preceding move in AI games, or the last move in
two-player games. Settings let you choose the AI difficulty and mark, sound,
and motion preferences.

## Routes

- `/` — dashboard, recent matches, statistics, and win-rate chart
- `/play` — local matches, board, undo, and move timeline
- `/history` — searchable, filterable, sortable, paginated match history
- `/settings` — local play preferences

## Verify

```sh
npm test
npm run build
```

For development-only loading, error, empty, and data-state previews, use the
**Preview state** selector in the lower-right corner of the Dashboard or Game
History page.
