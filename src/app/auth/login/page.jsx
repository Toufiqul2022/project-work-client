"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api"; // ← Real API

// --- Icons ---
const LockIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validateForm = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) newErrors.email = "Email is required";
    else if (!emailRegex.test(email))
      newErrors.email = "Please enter a valid email address";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Real API Login ──────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      // Backend error messages
      const msg =
        err?.detail ||
        err?.non_field_errors?.[0] ||
        "Login failed. Please check your credentials.";
      setErrors({ api: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a12] flex items-center justify-center p-4 md:p-6 relative overflow-hidden font-sans">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_20%_20%,#633cff_0%,transparent_50%),radial-gradient(circle_at_80%_80%,#00c896_0%,transparent_50%)]"></div>
      <div className="fixed -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 opacity-10 animate-pulse blur-3xl"></div>
      <div className="fixed -bottom-20 -left-20 w-64 h-64 rounded-full bg-gradient-to-br from-pink-600 to-purple-600 opacity-10 animate-bounce blur-3xl"></div>

      <div className="relative z-10 w-full max-w-[820px] min-h-[540px] flex flex-col md:flex-row rounded-[24px] border border-white/10 bg-[#0a0a12]/60 backdrop-blur-[24px] shadow-2xl overflow-hidden animate-[lp-card-rise_0.7s_ease-out]">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
          <div className="relative mb-8">
            <div className="absolute -top-10 right-0 flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/40 bg-purple-500/10 text-[11px] font-medium text-purple-300">
              <LockIcon /> Secure login
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">
              Account Access
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
              Welcome <br /> <span className="text-purple-500">back.</span>
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 md:space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/40 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                className={`w-full h-12 px-4 rounded-xl bg-white/5 border ${errors.email ? "border-red-500/50" : "border-white/10"} text-white outline-none focus:border-purple-500/70 focus:bg-purple-500/5 transition-all placeholder:text-white/20`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-[10px] text-red-400 mt-1 ml-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/40 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  className={`w-full h-12 px-4 rounded-xl bg-white/5 border ${errors.password ? "border-red-500/50" : "border-white/10"} text-white outline-none focus:border-purple-500/70 focus:bg-purple-500/5 transition-all placeholder:text-white/20`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-xs font-bold"
                >
                  {showPass ? "HIDE" : "SHOW"}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] text-red-400 mt-1 ml-1">
                  {errors.password}
                </p>
              )}
              <div className="mt-2 flex justify-end">
                <Link
                  href="#"
                  className="text-xs text-purple-400/80 hover:text-purple-300 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white font-bold tracking-wider hover:opacity-90 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  AUTHENTICATING...
                </span>
              ) : (
                "CONTINUE →"
              )}
            </button>

            {/* API Error */}
            {errors.api && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <span className="text-red-400 text-lg">⚠️</span>
                <p className="text-[11px] text-red-400">{errors.api}</p>
              </div>
            )}
          </form>

          {/* Social Logins */}
          <div className="mt-6 md:mt-8">
            <div className="flex items-center gap-3 mb-4 md:mb-6 text-[10px] uppercase font-bold text-white/20">
              <div className="h-px flex-1 bg-white/10"></div>
              <span>OR CONTINUE WITH</span>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="h-11 flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 hover:text-white transition-all">
                <GoogleIcon /> <span className="hidden sm:inline">Google</span>
              </button>
              <button className="h-11 flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 hover:text-white transition-all">
                GitHub
              </button>
            </div>
          </div>

          <p className="md:hidden mt-8 text-center text-sm text-white/40">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-purple-400 font-bold">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Right Panel */}
        <div className="hidden md:flex w-1/2 relative bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800 p-12 flex-col items-center justify-center text-center overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border border-white/10"></div>
          <div className="absolute bottom-20 left-10 w-20 h-20 rounded-full bg-white/5"></div>
          <div className="relative z-10 space-y-4 animate-[lp-card-rise_1s_ease-out]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
              New here?
            </p>
            <h2 className="text-3xl font-extrabold text-white">
              Join the <br /> network.
            </h2>
            <p className="text-sm text-white/60 leading-relaxed max-w-[220px] mx-auto">
              Create an account and set up your SOS contacts for instant
              emergency alerts.
            </p>
            <Link
              href="/auth/register"
              className="mt-8 inline-block px-10 py-3 rounded-full border-2 border-white/70 text-white text-xs font-bold tracking-widest hover:bg-white hover:text-purple-900 transition-all uppercase"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes lp-card-rise {
          from {
            opacity: 0;
            transform: translateY(28px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </main>
  );
}
