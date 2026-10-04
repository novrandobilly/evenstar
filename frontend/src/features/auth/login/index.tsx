import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTLogin } from "../../../api/auth/useTLogin";
import { useTGoogleLogin } from "../../../api/auth/useTGoogleLogin";
import logo from "../../../assets/logo.svg";

export const LoginFeature: React.FC = () => {
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useTLogin();
  const googleLoginMutation = useTGoogleLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity.trim() || !password) return;
    loginMutation.mutate({ identity: identity.trim(), password });
  };

  const handleGoogleSignIn = () => {
    googleLoginMutation.mutate();
  };

  return (
    <div className="flex flex-1 flex-col justify-between max-w-md mx-auto w-full px-5 py-8 font-sans select-none">
      <div>
        {/* Brand Header */}
        <div className="text-center pt-4 pb-6">
          <img
            src={logo}
            alt="Kickserve"
            className="h-9 w-auto mx-auto mb-3 object-contain"
          />
          <span className="text-[10px] font-black uppercase tracking-widest text-court-700 bg-court-100/70 px-3 py-1 rounded-full border border-court-500/20">
            Host Portal
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-4">
            Welcome Back, Host
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Sign in to manage your tournament sessions
          </p>
        </div>

        {/* Google Sign-In Quick Action */}
        <div className="space-y-3 mb-5">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoginMutation.isPending}
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white hover:bg-slate-50 border border-[#ded7c4] px-4 py-3.5 text-slate-900 font-extrabold text-xs shadow-2xs active:scale-[0.98] transition cursor-pointer disabled:opacity-60"
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
                ? "Signing in with Google..."
                : "Sign in with Google"}
            </span>
          </button>

          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-chalk-300" />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Or with Email
            </span>
            <div className="flex-1 h-px bg-chalk-300" />
          </div>
        </div>

        {/* Login Card Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="bg-white p-3.5 rounded-2xl border border-[#ded7c4] shadow-2xs focus-within:border-court-600 focus-within:ring-2 focus-within:ring-court-500/20 transition">
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Email or Username
            </label>
            <input
              type="text"
              required
              autoFocus
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
              placeholder="host@club.com"
              className="w-full text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none bg-transparent"
            />
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-[#ded7c4] shadow-2xs focus-within:border-court-600 focus-within:ring-2 focus-within:ring-court-500/20 transition">
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none bg-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending || !identity.trim() || !password}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-court-850 hover:bg-court-900 text-volt-300 py-4 text-xs font-black shadow-lg shadow-court-900/20 active:scale-[0.98] transition cursor-pointer border border-court-700/50 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
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
      </div>

      {/* Footer Navigation */}
      <div className="text-center pt-6 pb-2">
        <p className="text-xs text-slate-500 font-medium">
          Don't have a host account yet?{" "}
          <Link
            to="/register"
            className="font-bold text-court-800 hover:text-court-900 underline underline-offset-2"
          >
            Create one here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginFeature;
