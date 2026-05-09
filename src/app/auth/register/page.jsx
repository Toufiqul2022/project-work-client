"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MultiStepRegister() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Unified State to collate all information [cite: 417, 456]
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    childName: "",
    contacts: ["", "", "", "", ""],
  });

  const handleContactChange = (index, value) => {
    const newContacts = [...formData.contacts];
    newContacts[index] = value;
    setFormData({ ...formData, contacts: newContacts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulating final registration completion
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-[#0a0a12] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_20%_20%,#633cff_0%,transparent_50%),radial-gradient(circle_at_80%_80%,#00c896_0%,transparent_50%)]"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[900px] min-h-[600px] flex rounded-[32px] border border-white/10 bg-[#0a0a12]/60 backdrop-blur-[32px] shadow-2xl overflow-hidden animate-[lp-card-rise_0.7s_ease-out]">
        {/* LEFT SIDE: Premium Info Panel (As requested) */}
        <div className="hidden md:flex w-[40%] relative bg-gradient-to-br from-[#4a1fa8] via-[#7c4dff] to-[#536dfe] p-12 flex-col justify-center items-center text-center overflow-hidden">
          <div className="relative z-10 space-y-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">
              New Here?
            </p>
            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Join the <br /> network.
            </h2>
            <p className="text-sm text-white/70 leading-relaxed font-medium">
              Create an account and set up your SOS contacts for instant
              emergency alerts.
            </p>
            <div className="pt-6">
              <Link
                href="/auth/login"
                className="px-10 py-3 rounded-full border-2 border-white/50 text-white text-[11px] font-bold tracking-widest hover:bg-white/10 transition-all uppercase"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-[-30px] right-[-30px] w-40 h-40 rounded-full border border-white/10"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 rounded-full bg-white/5"></div>
        </div>

        {/* RIGHT SIDE: Multi-step Form [cite: 416] */}
        <div className="w-full md:w-[60%] p-10 flex flex-col justify-center bg-black/10">
          {/* Progress Indicator */}
          <div className="flex gap-3 mb-10">
            <div
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${step === 1 ? "bg-purple-500 shadow-[0_0_10px_rgba(124,77,255,0.5)]" : "bg-purple-900/40"}`}
            ></div>
            <div
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${step === 2 ? "bg-purple-500 shadow-[0_0_10px_rgba(124,77,255,0.5)]" : "bg-purple-900/40"}`}
            ></div>
          </div>

          {step === 1 ? (
            /* STEP 1: Guardian Credentials [cite: 417, 419] */
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(2);
              }}
              className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
            >
              <header>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-purple-400 mb-2 font-mono italic">
                  Account access
                </h3>
                <h1 className="text-3xl font-bold text-white leading-tight">
                  Guardian <br /> Setup.
                </h1>
              </header>

              <div className="space-y-4">
                <div className="group">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full h-12 px-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-purple-500 transition-all"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Guardian Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full h-12 px-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-purple-500 transition-all"
                    placeholder="example@mail.com"
                  />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full h-12 px-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-purple-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-14 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/20 transition-all mt-4 uppercase text-xs tracking-widest"
              >
                Continue to Safety Setup →
              </button>
            </form>
          ) : (
            /* STEP 2: Safety Config [cite: 456, 457] */
            <form
              onSubmit={handleSubmit}
              className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
            >
              <header>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-2 font-mono italic">
                  Protocol config
                </h3>
                <h1 className="text-3xl font-bold text-white">
                  Safety Config.
                </h1>
              </header>

              <div className="space-y-4">
                <div className="group">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Child's Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.childName}
                    onChange={(e) =>
                      setFormData({ ...formData, childName: e.target.value })
                    }
                    className="w-full h-12 px-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-emerald-500 transition-all"
                    placeholder="Enter Child's Name"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                    Emergency Contacts (Up to 5){" "}
                  </label>
                  <div className="max-h-[160px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                    {formData.contacts.map((contact, i) => (
                      <input
                        key={i}
                        type="tel"
                        value={contact}
                        onChange={(e) => handleContactChange(i, e.target.value)}
                        className="w-full h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-purple-500/40 transition-all"
                        placeholder={`Priority Number ${i + 1}`}
                        required={i === 0}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 h-14 bg-white/5 border border-white/10 text-gray-400 font-bold rounded-2xl hover:bg-white/10 transition-all text-xs tracking-widest"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-purple-500/20 transition-all active:scale-95 text-xs tracking-widest uppercase"
                >
                  {loading ? "INITIALIZING..." : "Complete Register"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes lp-card-rise {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </main>
  );
}
