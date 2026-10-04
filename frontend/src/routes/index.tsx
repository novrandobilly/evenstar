import { Routes, Route, Navigate } from "react-router-dom";
import HomeFeature from "../features/home";
import CreateSessionFeature from "../features/create-session";
import InSessionFeature from "../features/in-session";
import SessionSummaryFeature from "../features/session-summary";
import HistorySessionFeature from "../features/history-session";
import LoginFeature from "../features/auth/login";
import RegisterFeature from "../features/auth/register";
import AccountFeature from "../features/account";
import ProtectedRoute from "./guards/ProtectedRoute";
import GuestRoute from "./guards/GuestRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public / Guest Routes */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginFeature />} />
        <Route path="/register" element={<RegisterFeature />} />
      </Route>

      {/* Protected Host Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomeFeature />} />
        <Route path="/account" element={<AccountFeature />} />
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
