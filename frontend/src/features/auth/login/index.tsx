import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTLogin } from "../../../api/auth/useTLogin";
import logo from "../../../assets/logo.svg";

export const LoginFeature: React.FC = () => {
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useTLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity.trim() || !password) return;
    loginMutation.mutate({ identity: identity.trim(), password });
  };

  return (
    <div className="flex flex-1 flex-col justify-between max-w-md mx-auto w-full px-5 py-8 font-sans select-none">
      <div>
        {/* Brand Header */}
        <div className="text-center pt-6 pb-8">
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
            Sign in to manage your tennis & racquet sessions
          </p>
        </div>

        {/* Login Card Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-[#ded7c4] shadow-2xs focus-within:border-court-600 focus-within:ring-2 focus-within:ring-court-500/20 transition">
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

          <div className="bg-white p-4 rounded-2xl border border-[#ded7c4] shadow-2xs focus-within:border-court-600 focus-within:ring-2 focus-within:ring-court-500/20 transition">
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
                <span>Sign In as Host</span>
                <span>→</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer Navigation */}
      <div className="text-center pt-8 pb-4">
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
