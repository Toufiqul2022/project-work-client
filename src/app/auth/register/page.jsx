"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register, login, isLoggedIn } from "@/lib/api";
import { validatePhone } from "@/lib/validation";

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
  user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
  phone:
    "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z",
  eyeOff:
    "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24 M1 1l22 22",
  arrow: "M5 12h14 M12 5l7 7-7 7",
  check: "M20 6L9 17l-5-5",
  alert:
    "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
  success: "M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3",
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
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

  const passwordStrength = (p) => {
    if (!p) return { score: 0, label: "", color: "" };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const map = [
      { label: "", color: "" },
      { label: "Weak", color: "#EF4444" },
      { label: "Fair", color: "#F59E0B" },
      { label: "Good", color: "#60A5FA" },
      { label: "Strong", color: "#22C55E" },
    ];
    return { score, ...map[score] };
  };

  const strength = passwordStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    const phoneErr = validatePhone(form.phone);
    if (phoneErr) {
      setError(phoneErr);
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      // Auto-login after registration
      await login(form.email, form.password);
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch (err) {
      const first = Object.values(err || {})?.[0];
      const msg = Array.isArray(first)
        ? first[0]
        : err?.detail || "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className="min-h-screen bg-gray-950 flex items-center justify-center px-4"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 60% 10%, rgba(109,40,217,0.12) 0%, transparent 60%)",
        }}
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
            <Icon d={Icons.success} size={28} color="#22C55E" />
          </div>
          <h2 className="text-xl font-black text-slate-100 mb-2">
            Account Created!
          </h2>
          <p className="text-gray-500 text-sm">Redirecting to dashboard…</p>
          <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mt-4" />
        </div>
      </div>
    );
  }

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
          <p className="text-gray-500 text-sm mt-1">Create your account</p>
        </div>

        {/* Card */}
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-6 md:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
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

            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
                  <Icon d={Icons.user} size={15} />
                </div>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Rahim Uddin"
                  autoComplete="name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.08] transition-all"
                />
              </div>
            </div>

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
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.08] transition-all"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
                  <Icon d={Icons.phone} size={15} />
                </div>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="01XXXXXXXXX"
                  autoComplete="tel"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.08] transition-all"
                />
              </div>
              <p className="text-[10px] text-gray-600 mt-1.5">
                Used to send SMS safety alerts.
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                Password
              </label>
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
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-11 py-3 text-sm text-slate-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.08] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                >
                  <Icon d={showPass ? Icons.eyeOff : Icons.eye} size={15} />
                </button>
              </div>
              {/* Strength bar */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor:
                            i <= strength.score ? strength.color : "#1F2937",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="text-[10px] font-semibold"
                    style={{ color: strength.color }}
                  >
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
                  <Icon d={Icons.lock} size={15} />
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  value={form.confirm}
                  onChange={(e) =>
                    setForm({ ...form, confirm: e.target.value })
                  }
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  className={`w-full bg-white/5 border rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-gray-600 focus:outline-none focus:bg-white/[0.08] transition-all ${
                    form.confirm && form.confirm !== form.password
                      ? "border-red-500/40 focus:border-red-500/60"
                      : form.confirm && form.confirm === form.password
                        ? "border-green-500/40 focus:border-green-500/60"
                        : "border-white/10 focus:border-purple-500/50"
                  }`}
                />
                {form.confirm && form.confirm === form.password && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    <Icon d={Icons.check} size={14} color="#22C55E" />
                  </div>
                )}
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
                  Creating account…
                </>
              ) : (
                <>
                  Create Account
                  <Icon d={Icons.arrow} size={15} color="white" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[11px] text-gray-600 font-semibold">
              Already have an account?
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <Link
            href="/auth/login"
            className="block w-full text-center py-3 rounded-xl text-sm font-bold text-gray-400 bg-white/5 border border-white/[0.08] hover:bg-white/10 hover:text-slate-200 transition-all"
          >
            Sign In
          </Link>
        </div>

        <p className="text-center text-[11px] text-gray-700 mt-6">
          Protected by Nirapod · Child Safety System
        </p>
      </div>
    </div>
  );
}
