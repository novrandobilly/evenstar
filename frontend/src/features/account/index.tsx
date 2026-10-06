import React from "react";
import { useNavigate } from "react-router-dom";
import { useTProfile } from "../../api/auth/useTProfile";
import { useTGetSessions } from "../../api/sessions/useTGetSessions";
import { useSession } from "../../context/SessionContext";
import { useModal } from "../../context/modal";
import BottomNavigation from "../../components/BottomNavigation";

import ProfileCard from "./features/ProfileCard";
import Roster from "./features/Roster";
import ActiveSessionCard from "./features/ActiveSessionCard";
import SessionHistoryList from "./features/SessionHistoryList";
import LogoutButton from "./features/LogoutButton";

export const AccountFeature: React.FC = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading: isLoadingProfile } = useTProfile();
  const { data: sessions, isLoading: isLoadingSessions } = useTGetSessions();
  const { session, resetSession } = useSession();
  const { showModal } = useModal();

  if (isLoadingProfile) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-xs font-bold text-slate-400 animate-pulse">
          Loading host dashboard...
        </div>
      </div>
    );
  }

  const savedSessions = sessions || [];

  const handleStartNewSession = () => {
    if (session.matches.length > 0) {
      showModal({
        title: "Active Session in Progress",
        description: `You currently have a running session ("${
          session.title || "Tennis Session"
        }") with ${session.matches.length} matches. Starting a new session will discard your current match progress.`,
        confirmText: "Discard & Start Fresh",
        cancelText: "Keep Playing",
        type: "danger",
        onConfirm: () => {
          resetSession();
          navigate("/create-session");
        },
      });
    } else {
      navigate("/create-session");
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-between max-w-md mx-auto w-full font-sans select-none relative">
      <div className="px-5 pt-6 pb-2 space-y-5">
        {/* Simple Text Header */}
        <div className="flex items-center justify-between pt-1">
          <div className="w-8" />
          <h1 className="text-sm font-black uppercase tracking-widest text-slate-800">
            Host Dashboard
          </h1>
          <div className="w-8" />
        </div>

        {/* 1. Host Profile Card */}
        <ProfileCard profile={profile} sessionsCount={savedSessions.length} />

        {/* 2. Active Session in progress (if any) */}
        <ActiveSessionCard />

        {/* 3. Primary CTA: Start a New Session */}
        <button
          type="button"
          onClick={handleStartNewSession}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-volt-500 hover:bg-volt-400 py-4 text-xs font-black text-slate-950 shadow-lg shadow-court-900/10 active:scale-[0.98] transition cursor-pointer"
        >
          <span>Start a New Session</span>
          <span className="text-sm">🎾</span>
        </button>

        {/* 4. Saved Player Roster Pool */}
        <Roster />

        {/* 5. Host Session History */}
        <SessionHistoryList
          sessions={savedSessions}
          isLoading={isLoadingSessions}
        />

        {/* 6. Log Out Button */}
        <LogoutButton />
      </div>

      {/* 🎾 App Bottom Navigation Bar */}
      <BottomNavigation />
    </div>
  );
};

export default AccountFeature;
