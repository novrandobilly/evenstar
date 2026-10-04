import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useModal } from "../../context/modal";
import { useTGoogleLogin } from "../../api/auth/useTGoogleLogin";
import { useTLogin } from "../../api/auth/useTLogin";
import PWAGuide from "../../components/PWAGuide";
import logo from "../../assets/logo.svg";

export const HomeFeature: React.FC = () => {
  const { showModal, hideModal } = useModal();
  const googleLoginMutation = useTGoogleLogin();
  const loginMutation = useTLogin();

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");

  const handleOpenPwaGuide = () => {
    showModal({
      title: "Install Kickserve App",
      contentBody: <PWAGuide onClose={hideModal} />,
      hideActions: true,
    });
  };

  const handleGoogleSignIn = () => {
    googleLoginMutation.mutate();
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity.trim() || !password) return;
    loginMutation.mutate({ identity: identity.trim(), password });
  };

  return (
    <div className="flex flex-1 flex-col w-full font-sans select-none">
      {/* 🎾 HERO SECTION / LOGIN PAGE */}
      <div className="relative w-full min-h-dvh flex flex-col justify-between p-6 sm:p-8 overflow-hidden bg-slate-900">
        {/* Background Image Asset - Fixed to .webp */}
        <div
          className="absolute inset-0 bg-cover bg-position-[center_right_-20px] sm:bg-center"
          style={{ backgroundImage: "url('/home-background.webp')" }}
        />

        {/* High-Contrast Gradient Overlays */}
        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-black/80 pointer-events-none" />

        {/* Top Brand Bar */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-end gap-2">
            <img
              src={logo}
              alt="Kickserve"
              className="h-5 w-auto object-contain drop-shadow-sm brightness-110"
            />
            <div className="flex items-end gap-1.5 pl-1.5 border-l border-white/20">
              <span className="text-[10px] font-normal tracking-wider text-slate-300 uppercase leading-none">
                BY
              </span>
              <span className="text-[10px] font-normal tracking-widest text-white uppercase leading-none">
                <span className="font-black">ENVIEN</span>
                STUDIO
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenPwaGuide}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 transition cursor-pointer active:scale-95 shadow-sm"
          >
            <svg
              className="w-3.5 h-3.5 text-slate-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <rect x="5" y="2" width="14" height="20" rx="3" ry="3" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
            <span>Install App</span>
          </button>
        </div>

        {/* Hero Middle Content: Headline, Subtitle, and Sign-In Actions */}
        <div className="relative z-10 my-auto pt-6 pb-6 max-w-sm">
          <h1 className="text-[50px] sm:text-[56px] font-black italic tracking-tighter leading-[0.92] text-left">
            <span className="block text-white drop-shadow-md -rotate-5">
              Plan
            </span>
            <span className="block text-white drop-shadow-md -rotate-5 pl-1.5">
              Less,
            </span>
            <span className="block text-volt-500 drop-shadow-md -rotate-5 pl-3">
              Play
            </span>
            <span className="block text-volt-500 drop-shadow-md -rotate-5 pl-4.5">
              More.
            </span>
          </h1>

          <div className="flex flex-col gap-1 leading-none mt-8 space-y-0.5 text-xs sm:text-sm font-medium drop-shadow-sm text-left">
            <span className="text-white/90">Kickserve handles</span>
            <span className="text-white/90">the matchups, scores,</span>
            <span className="text-white/90">and standings.</span>
            <span className="text-volt-400 font-extrabold mt-2 text-sm sm:text-base">
              You just bring your game.
            </span>
          </div>

          {/* 🎾 SIGN IN ACTIONS PLACED RIGHT UNDER "YOU JUST BRING YOUR GAME" */}
          <div className="mt-6 space-y-3">
            {!showEmailForm ? (
              <>
                {/* 1. Google Sign-In */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoginMutation.isPending}
                  className="w-full h-11 flex items-center justify-center gap-3 rounded-full bg-white hover:bg-slate-100 px-4 text-slate-900 font-extrabold text-xs shadow-xl active:scale-[0.98] transition cursor-pointer disabled:opacity-60"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>
                    {googleLoginMutation.isPending
                      ? "Connecting..."
                      : "Continue with Google"}
                  </span>
                </button>

                {/* 2. Sign In with Email Toggle */}
                <button
                  type="button"
                  onClick={() => setShowEmailForm(true)}
                  className="w-full h-11 flex items-center justify-center gap-3 rounded-full bg-volt-500 hover:bg-volt-400 px-4 text-slate-950 font-black text-xs shadow-xl active:scale-[0.98] transition cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 text-slate-950 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span>Sign In with Email</span>
                </button>
              </>
            ) : (
              /* Inline Email Form */
              <form
                onSubmit={handleEmailSubmit}
                className="space-y-2.5 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-2xl"
              >
                <div className="flex items-center justify-between pb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">
                    Host Sign In
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowEmailForm(false)}
                    className="text-[11px] font-bold text-slate-400 hover:text-white cursor-pointer"
                  >
                    ← Options
                  </button>
                </div>

                <input
                  type="text"
                  required
                  autoFocus
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  placeholder="Email or Username"
                  className="w-full rounded-xl bg-slate-900/90 border border-white/20 px-3.5 py-2.5 text-xs font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-volt-400 transition"
                />

                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-xl bg-slate-900/90 border border-white/20 px-3.5 py-2.5 text-xs font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-volt-400 transition"
                />

                <button
                  type="submit"
                  disabled={
                    loginMutation.isPending || !identity.trim() || !password
                  }
                  className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-volt-500 hover:bg-volt-400 px-4 text-slate-950 font-black text-xs shadow-lg active:scale-[0.98] transition cursor-pointer disabled:opacity-60"
                >
                  {loginMutation.isPending ? (
                    <span>Signing In...</span>
                  ) : (
                    <>
                      <span>Sign In with Password</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Account registration link */}
            <div className="flex items-center justify-between pt-1 px-1">
              <Link
                to="/register"
                className="text-[11px] font-bold text-slate-300 hover:text-white underline underline-offset-2"
              >
                Don't have an account? Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeFeature;
