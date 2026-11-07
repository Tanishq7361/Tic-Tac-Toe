import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../components/AppShell";

const DashboardPage = lazy(() => import("../features/dashboard/DashboardPage").then((module) => ({ default: module.DashboardPage })));
const PlayPage = lazy(() => import("../features/game/PlayPage").then((module) => ({ default: module.PlayPage })));
const GameHistoryPage = lazy(() => import("../features/history/GameHistoryPage").then((module) => ({ default: module.GameHistoryPage })));
const SettingsPage = lazy(() => import("../features/settings/SettingsPage").then((module) => ({ default: module.SettingsPage })));

export function AppRoutes() {
  return (
    <Suspense fallback={<div className="route-loading" role="status">Loading page…</div>}>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="play" element={<PlayPage />} />
          <Route path="history" element={<GameHistoryPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
