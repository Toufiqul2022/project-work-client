"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, isLoggedIn } from "@/lib/api";

const Icon = ({ d, size = 18, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const Icons = {
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  lock: "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z M7 11V7a5 5 0 0110 0v4",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z",
  eyeOff:
    "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24 M1 1l22 22",
  arrow: "M5 12h14 M12 5l7 7-7 7",
  check: "M20 6L9 17l-5-5",
  map: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7a3 3 0 100 6 3 3 0 000-6z",
  alert:
    "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  // ── Redirect if already logged in ──────────────────────
  useEffect(() => {
    if (isLoggedIn()) {
      router.replace("/dashboard");
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(form.email, form.password);
      router.push("/dashboard");
    } catch (err) {
      const msg =
        err?.detail ||
        err?.non_field_errors?.[0] ||
        Object.values(err || {})?.[0]?.[0] ||
        "Invalid email or password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 60% 10%, rgba(109,40,217,0.12) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(37,99,235,0.08) 0%, transparent 50%)",
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-700 to-blue-600 flex items-center justify-center mb-4 shadow-[0_0_32px_rgba(109,40,217,0.4)]">
            <Icon d={Icons.shield} size={26} color="white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Nirapod
          </h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-6 md:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
          {/* Features strip */}
          <div className="flex items-center justify-around mb-6 py-3 bg-white/[0.03] rounded-xl border border-white/5">
            {[
              { icon: Icons.map, label: "GPS Tracking" },
              { icon: Icons.shield, label: "Safe Zones" },
              { icon: Icons.check, label: "Smart Alerts" },
            ].map((f) => (
              <div key={f.label} className="flex flex-col items-center gap-1">
                <Icon d={f.icon} size={14} color="#A78BFA" />
                <span className="text-[10px] text-gray-500 font-semibold">
                  {f.label}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <Icon d={Icons.alert} size={15} color="#EF4444" />
                <span className="text-red-400 text-xs font-medium">
                  {error}
                </span>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
                  <Icon d={Icons.mail} size={15} />
                </div>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
                  <Icon d={Icons.lock} size={15} />
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-11 py-3 text-sm text-slate-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                >
                  <Icon d={showPass ? Icons.eyeOff : Icons.eye} size={15} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-700 to-blue-600 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(109,40,217,0.3)] mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <Icon d={Icons.arrow} size={15} color="white" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[11px] text-gray-600 font-semibold">
              Don't have an account?
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <Link
            href="/auth/register"
            className="block w-full text-center py-3 rounded-xl text-sm font-bold text-gray-400 bg-white/5 border border-white/8 hover:bg-white/10 hover:text-slate-200 transition-all"
          >
            Create Account
          </Link>
        </div>

        <p className="text-center text-[11px] text-gray-700 mt-6">
          Protected by Nirapod · Child Safety System
        </p>
      </div>
    </div>
  );
}
