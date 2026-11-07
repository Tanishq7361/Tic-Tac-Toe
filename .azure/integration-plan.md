# Integration hand-off

- **Backend:** None (approved frontend-only SPA); no run/build command, port, or health endpoint.
- **Frontend:** repository root (`.`); `npm install`; `npm run dev` (Vite); `npm run build`.
- **API wiring seam:** Not applicable. The app has no HTTP API, remote services, or mock API client.
- **Client routes:** `GET (client) /`, `/play`, `/history`, `/settings` (React Router; no HTTP endpoints).
- **Persistence:** Browser `localStorage` only. No database, migrations, or connection environment variables; **create NO database seed data**. The approved sample matches/statistics are local starter content, not database seeds.
- **Shared types:** `src/models.ts`; no shared package or import alias.
- **Services:** None (no Essential or Enhancement Azure services).
- **Integration validation:** `npm test -- --reporter=dot`, `npm run build`, then run the production preview and verify all four client routes load the SPA shell. No backend smoke test or migration applies.
