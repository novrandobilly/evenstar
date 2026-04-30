// frontend/src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { SessionPage } from "@/pages/SessionPage";
import { SessionDetailPage } from "@/pages/SessionDetailPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { ActiveSessionPage } from "@/pages/ActiveSessionPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <SessionPage />
            </Layout>
          }
        />
        <Route
          path="/sessions/new"
          element={
            <Layout>
              <ActiveSessionPage />
            </Layout>
          }
        />
        <Route
          path="/sessions/:sessionId"
          element={
            <Layout>
              <SessionDetailPage />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <ProfilePage />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
