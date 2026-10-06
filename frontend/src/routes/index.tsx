import { Routes, Route, Navigate } from "react-router-dom";
import HomeFeature from "../features/home";
import CreateSessionFeature from "../features/create-session";
import InSessionFeature from "../features/in-session";
import SessionSummaryFeature from "../features/session-summary";
import HistorySessionFeature from "../features/history-session";
import HistoryListFeature from "../features/history";
import RegisterFeature from "../features/auth/register";
import AccountFeature from "../features/account";
import LiveSessionFeature from "../features/live-session";
import ProtectedRoute from "./guards/ProtectedRoute";
import GuestRoute from "./guards/GuestRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public / Guest Entry Landing & Login */}
      <Route element={<GuestRoute />}>
        <Route path="/" element={<HomeFeature />} />
        <Route path="/login" element={<HomeFeature />} />
        <Route path="/register" element={<RegisterFeature />} />
      </Route>

      {/* Public Live Spectator Route (No Auth Required) */}
      <Route path="/live/:sessionId" element={<LiveSessionFeature />} />

      {/* Protected Host Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/account" element={<AccountFeature />} />
        <Route path="/history" element={<HistoryListFeature />} />
        <Route path="/create-session" element={<CreateSessionFeature />} />
        <Route path="/in-session" element={<InSessionFeature />} />
        <Route path="/session-summary" element={<SessionSummaryFeature />} />
        <Route path="/history/:sessionId" element={<HistorySessionFeature />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
