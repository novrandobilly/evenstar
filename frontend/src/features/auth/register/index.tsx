import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTRegister } from "../../../api/auth/useTRegister";
import logo from "../../../assets/logo.svg";

export const RegisterFeature: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [clubName, setClubName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const registerMutation = useTRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters.");
      return;
    }

    if (password !== passwordConfirm) {
      setValidationError("Passwords do not match.");
      return;
    }

    registerMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      club_name: clubName.trim(),
      password,
      passwordConfirm,
    });
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
            Host Registration
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-4">
            Become a Session Host
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Run automated rotations and save your tournament records
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {validationError && (
            <div className="rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3 text-center">
              {validationError}
            </div>
          )}

          <div className="bg-white p-3.5 rounded-2xl border border-[#ded7c4] shadow-2xs focus-within:border-court-600 focus-within:ring-2 focus-within:ring-court-500/20 transition">
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Your Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Johnson"
              className="w-full text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none bg-transparent"
            />
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-[#ded7c4] shadow-2xs focus-within:border-court-600 focus-within:ring-2 focus-within:ring-court-500/20 transition">
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@club.com"
              className="w-full text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none bg-transparent"
            />
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-[#ded7c4] shadow-2xs focus-within:border-court-600 focus-within:ring-2 focus-within:ring-court-500/20 transition">
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Club or Community Name (Optional)
            </label>
            <input
              type="text"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              placeholder="e.g. Sunday Tennis Club"
              className="w-full text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none bg-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white p-3.5 rounded-2xl border border-[#ded7c4] shadow-2xs focus-within:border-court-600 focus-within:ring-2 focus-within:ring-court-500/20 transition">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 chars"
                className="w-full text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none bg-transparent"
              />
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-[#ded7c4] shadow-2xs focus-within:border-court-600 focus-within:ring-2 focus-within:ring-court-500/20 transition">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                Confirm *
              </label>
              <input
                type="password"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Repeat"
                className="w-full text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none bg-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending || !name.trim() || !email.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-court-850 hover:bg-court-900 text-volt-300 py-4 text-xs font-black shadow-lg shadow-court-900/20 active:scale-[0.98] transition cursor-pointer border border-court-700/50 disabled:opacity-60 disabled:cursor-not-allowed mt-3"
          >
            {registerMutation.isPending ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Create Host Account</span>
                <span>🎾</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center pt-6 pb-2">
        <p className="text-xs text-slate-500 font-medium">
          Already registered?{" "}
          <Link
            to="/login"
            className="font-bold text-court-800 hover:text-court-900 underline underline-offset-2"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterFeature;
