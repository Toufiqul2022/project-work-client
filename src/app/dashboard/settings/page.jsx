"use client";
// app/dashboard/settings/page.jsx
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getMe, getDevices, patchUser, logout } from "@/lib/api"; // patchMe এপিআই মেথড যুক্ত করা হয়েছে
import { Card, ActionBtn } from "../shared";
import { useDashboard } from "../dashboard-context"; // সাইডবার ইন্সট্যান্ট আপডেটের জন্য শেয়ার্ড কনটেক্সট
import { validatePhone } from "@/lib/validation";

export default function SettingsPage() {
  const router = useRouter();
  const { setUser: setSharedUser } = useDashboard(); // লেআউট সাইডবারের ইউজার স্টেট সিঙ্ক
  const [user, setUser] = useState(null);
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);

  // রিয়েল-টাইম এডিটেবল প্রোফাইল স্টেট
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
  });

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (msg, type = "success") => {
    clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    async function load() {
      // রিয়েল টাইম সার্ভার ক্লাস্টার থেকে ডাটা ফেচিং প্রসেস
      const [userR, devsR] = await Promise.allSettled([getMe(), getDevices()]);
      if (userR.status === "fulfilled") {
        setUser(userR.value);
        setProfileForm({
          name: userR.value?.name || "",
          phone: userR.value?.phone || "",
        });
      }
      if (devsR.status === "fulfilled") {
        const devs = Array.isArray(devsR.value)
          ? devsR.value
          : devsR.value?.results || [];
        setDevice(devs[0] || null);
      }
      setLoading(false);
    }
    load();
  }, []);

  // রিয়েল ডাটাবেস সাবমিশন কন্ট্রোলার (PATCH Request)
  const handleSave = async (e) => {
    e.preventDefault();

    // ব্যাকএন্ড মডেলে phone রিকোয়ার্ড — খালি phone পাঠালে 400 আসে, তাই আগেই গার্ড
    const name = profileForm.name.trim();
    const phone = profileForm.phone.trim();
    if (!name) {
      showToast("❌ Full name is required.", "error");
      return;
    }
    const phoneErr = validatePhone(phone);
    if (phoneErr) {
      showToast(`❌ ${phoneErr}`, "error");
      return;
    }
    if (!user?.id) {
      showToast("❌ Profile not loaded yet. Please retry.", "error");
      return;
    }

    setSaving(true);
    try {
      // /me/ এই ব্যাকএন্ডে রিড-অনলি (PATCH → 405), তাই নিজের UUID দিয়ে আপডেট
      const updatedUser = await patchUser(user.id, { name, phone });
      setUser(updatedUser);
      setSharedUser(updatedUser); // সাইডবার/হেডার তাৎক্ষণিক আপডেট
      // Notify the global Navbar (outside the dashboard context) to refresh instantly
      window.dispatchEvent(
        new CustomEvent("nirapod:profile-updated", { detail: updatedUser }),
      );
      showToast("✅ Profile configurations updated successfully.");
    } catch (err) {
      // ব্যাকএন্ডের আসল এরর সারফেস করা হচ্ছে (login/register পেজের মতো)
      const msg =
        err?.detail ||
        err?.phone?.[0] ||
        err?.name?.[0] ||
        Object.values(err || {})?.[0]?.[0] ||
        "Failed to update profile.";
      showToast(`❌ ${msg}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout(); // টোকেন ক্লিয়ারিং গেটওয়ে
    router.push("/auth/login");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );

  const deviceFields = [
    { label: "Device ID", value: device?.id || "No hardware linked" },
    { label: "Device Name", value: device?.name || "—" },
    {
      label: "Status Mode",
      value: device?.is_active ? "🟢 SENSOR ENGAGED" : "⚪ SUSPENDED",
    },
    {
      label: "Power Core Battery",
      value: device?.battery_pct != null ? `${device.battery_pct}%` : "—",
    },
    {
      label: "Last Server Ping",
      value: device?.last_seen
        ? new Date(device.last_seen).toLocaleString("en-BD")
        : "—",
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712] p-4 md:p-8 text-slate-100 relative overflow-hidden font-sans animate-in fade-in duration-300">
      {/* ── রিয়েল-টাইম সিস্টেম নোটিফিকেশন টোস্ট ── */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[100] px-4 py-2.5 rounded-xl text-xs font-bold shadow-2xl border backdrop-blur-md animate-in slide-in-from-right duration-200
            ${toast.type === "error" ? "bg-red-950/80 border-red-500/30 text-red-300" : "bg-green-950/80 border-green-500/30 text-green-300"}`}
        >
          {toast.msg}
        </div>
      )}

      {/* ── সাইবার ডার্ক মেস গ্রেডিয়েন্ট ব্যাকগ্রাউন্ড লেয়ার ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[130px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        {/* হেডার ব্লক */}
        <div className="border-b border-white/5 pb-4">
          <h2 className="text-xl font-black text-white tracking-tight italic m-0">
            ⚙️ Control Matrix Settings
          </h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
            Hardware Configuration & Parent Profile Node
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── ১. হার্ডওয়্যার ডিভাইস কনফিগারেশন প্যানেল (Read Only) ── */}
          <Card title="Device Configuration">
            <div className="space-y-4">
              {deviceFields.map((f) => (
                <div key={f.label}>
                  <label className="block text-[10px] text-gray-500 mb-1.5 font-bold uppercase tracking-wider">
                    {f.label}
                  </label>
                  <input
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-3 py-2 md:py-2.5 text-slate-300 text-xs md:text-sm focus:outline-none transition-colors font-mono"
                    defaultValue={f.value}
                    readOnly
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* ── ২. রিয়েল প্রোফাইল আপডেট প্যানেল (Editable form) ── */}
          <form onSubmit={handleSave} className="h-full">
            <Card
              title="Profile Node Management"
              className="flex flex-col h-full justify-between"
            >
              <div className="space-y-4 flex-1">
                {/* Full Name */}
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1.5 font-bold uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 md:py-2.5 text-slate-200 text-xs md:text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-colors"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, name: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Email (Read-Only Matrix logic for Auth) */}
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1.5 font-bold uppercase tracking-wider">
                    Email Address (Account ID)
                  </label>
                  <input
                    type="email"
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-3 py-2 md:py-2.5 text-gray-500 text-xs md:text-sm focus:outline-none cursor-not-allowed font-mono"
                    value={user?.email || ""}
                    disabled
                    readOnly
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1.5 font-bold uppercase tracking-wider">
                    Guardian SOS Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 md:py-2.5 text-slate-200 text-xs md:text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-colors"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, phone: e.target.value })
                    }
                    placeholder="01XXXXXXXXX"
                    required
                  />
                </div>
              </div>

              {/* অ্যাকশন বাটন কন্ট্রোল */}
              <div className="mt-6 flex gap-3 pt-4 border-t border-white/[0.03]">
                <ActionBtn
                  type="submit"
                  color="#6D28D9"
                  className="flex-1 font-bold text-xs uppercase tracking-wider h-10 disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? "Commiting Changes…" : "Save Configurations"}
                </ActionBtn>
                <ActionBtn
                  type="button"
                  color="#EF4444"
                  className="font-bold text-xs uppercase tracking-wider h-10"
                  onClick={handleLogout}
                >
                  Logout
                </ActionBtn>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
