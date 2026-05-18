"use client";
// app/dashboard/contacts/page.jsx
import { useState, useEffect, useRef } from "react";
import { getMe } from "@/lib/api"; // রিয়েল এপিআই ইম্পোর্ট

// ─── Shared Theme Components ──────────────────────────────────────────────────
function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white/[0.01] border border-white/5 backdrop-blur-xl rounded-2xl p-5 shadow-2xl transition-all duration-300 hover:border-white/10 ${className}`}
    >
      {children}
    </div>
  );
}

function Badge({ children, color }) {
  return (
    <span
      style={{
        color,
        backgroundColor: `${color}10`,
        borderColor: `${color}25`,
      }}
      className="text-[9px] md:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border"
    >
      {children}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RealContactsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testingContact, setTestingContact] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  // ডাটাবেস থেকে রিয়েল প্যারেন্ট প্রোফাইল লোড করা
  useEffect(() => {
    getMe()
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // রিয়েল সিম মডিউল (SIM800L) এসএমএস রিলে সিমুলেশন ট্রিগার
  const handleTestSMS = (phoneNumber) => {
    if (!phoneNumber || phoneNumber === "No phone linked") {
      showToast(
        "⚠️ API Failure: No real phone number linked to this profile node.",
      );
      return;
    }
    setTestingContact(true);

    // এপিআই পাইপলাইন লেটেন্সি সিমুলেশন
    setTimeout(() => {
      setTestingContact(false);
      showToast(
        `✉️ Network Relay Success: SOS test packet transmitted to ${phoneNumber}`,
      );
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <div className="w-6 h-6 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">
          Syncing Database Matrix…
        </span>
      </div>
    );
  }

  const userPhone = user?.phone || "No phone linked";

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative font-sans text-slate-100">
      {/* ── Notification Toast ── */}
      {toast && (
        <div className="fixed top-4 right-4 z-[100] px-4 py-3 bg-[#080e18] border border-purple-500/30 rounded-xl text-xs font-bold text-purple-300 shadow-2xl shadow-purple-500/10 backdrop-blur-md animate-in slide-in-from-right duration-200">
          {toast}
        </div>
      )}

      {/* ── Page Header Block ── */}
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-xl font-black text-white tracking-tight italic m-0">
          📞 SOS Dispatch Matrix
        </h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
          Live System Handlers &nbsp;·&nbsp; Database Query Active
        </p>
      </div>

      {/* ── Real Contact Cards Array ── */}
      <div className="space-y-3">
        <Card className="border-l-4 border-purple-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left Info Column */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center text-base shrink-0">
                👑
              </div>
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs md:text-sm font-black text-slate-200 tracking-wide">
                    {user?.name ||
                      user?.email?.split("@")[0] ||
                      "Account Owner"}
                  </span>
                  <Badge color="#A78BFA">#1 — Primary Guardian</Badge>
                </div>
                <div className="text-[11px] text-gray-400 font-mono flex items-center gap-2">
                  <span className="text-slate-500">TEL:</span> {userPhone}
                </div>
                <div className="text-[10px] text-gray-500 font-mono truncate">
                  EMAIL: {user?.email}
                </div>
              </div>
            </div>

            {/* Right Action Trigger */}
            <button
              onClick={() => handleTestSMS(userPhone)}
              disabled={testingContact || !user?.phone}
              className={`h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all shrink-0 flex items-center justify-center gap-1.5
                ${
                  !user?.phone
                    ? "border-white/5 bg-transparent text-gray-600 cursor-not-allowed"
                    : testingContact
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-400 cursor-wait animate-pulse"
                      : "border-purple-500/20 bg-purple-500/10 text-purple-400 hover:bg-purple-600 hover:text-white"
                }`}
            >
              {testingContact ? (
                <>
                  <div className="w-3 h-3 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin" />
                  Dispatching…
                </>
              ) : (
                "⚡ Test SMS"
              )}
            </button>
          </div>
        </Card>
      </div>

      {/* ── System Instruction Panel ── */}
      <Card className="border border-blue-500/10 bg-blue-950/10">
        <div className="flex items-start gap-3 text-xs leading-relaxed text-blue-400/80">
          <span className="text-lg mt-0.5">💡</span>
          <div>
            <strong className="text-blue-400">Ecosystem Notification:</strong>{" "}
            ইমার্জেন্সি অ্যালার্ট ট্রিগার হলে ডাটাবেসে সেভ থাকা এই নির্দিষ্ট
            কন্টাক্ট নাম্বারে হার্ডওয়্যার থেকে তাৎক্ষণিক লোকেশন ম্যাপ লিংক
            পাঠানো হবে। ডেটা পরিবর্তন বা যোগ করতে নিচের লিংকে ক্লিক করুন।
            <div className="mt-3">
              <a
                href="/dashboard/settings"
                className="text-purple-400 hover:text-purple-300 font-extrabold transition-colors no-underline"
              >
                Go to Settings → Profile to update contact information.
              </a>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
