"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MultiStepRegister() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // New state for validation
  const router = useRouter();

  // Unified State to collate all information
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    childName: "",
    contacts: ["", "", "", "", ""],
  });

  // Validation Logic
  const validateStep1 = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) tempErrors.name = "Full name is required";
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = "Invalid email format";
    }
    if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validateStep2 = () => {
    let tempErrors = {};
    if (!formData.childName.trim())
      tempErrors.childName = "Child's name is required";

    // Check if at least the first contact is provided and is a valid format (simple length check)
    if (!formData.contacts[0] || formData.contacts[0].length < 7) {
      tempErrors.contacts = "At least one valid primary contact is required";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleContactChange = (index, value) => {
    const newContacts = [...formData.contacts];
    newContacts[index] = value;
    setFormData({ ...formData, contacts: newContacts });
    if (errors.contacts) setErrors({ ...errors, contacts: "" });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep2()) {
      setLoading(true);
      // Simulating final registration completion
      setTimeout(() => {
        setLoading(false);
        router.push("/dashboard");
      }, 2000);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a12] flex items-center justify-center p-4 md:p-6 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_20%_20%,#633cff_0%,transparent_50%),radial-gradient(circle_at_80%_80%,#00c896_0%,transparent_50%)]"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[900px] min-h-[600px] flex flex-col md:flex-row rounded-[24px] md:rounded-[32px] border border-white/10 bg-[#0a0a12]/60 backdrop-blur-[32px] shadow-2xl overflow-hidden animate-[lp-card-rise_0.7s_ease-out]">
        {/* LEFT SIDE: Premium Info Panel (Hidden on mobile) */}
        <div className="hidden md:flex md:w-[40%] relative bg-gradient-to-br from-[#4a1fa8] via-[#7c4dff] to-[#536dfe] p-12 flex-col justify-center items-center text-center overflow-hidden">
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
          <div className="absolute top-[-30px] right-[-30px] w-40 h-40 rounded-full border border-white/10"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 rounded-full bg-white/5"></div>
        </div>

        {/* RIGHT SIDE: Multi-step Form */}
        <div className="w-full md:w-[60%] p-6 md:p-10 flex flex-col justify-center bg-black/10">
          {/* Progress Indicator */}
          <div className="flex gap-3 mb-8 md:mb-10">
            <div
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${step === 1 ? "bg-purple-500 shadow-[0_0_10px_rgba(124,77,255,0.5)]" : "bg-purple-500/20"}`}
            ></div>
            <div
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${step === 2 ? "bg-purple-500 shadow-[0_0_10px_rgba(124,77,255,0.5)]" : "bg-purple-500/20"}`}
            ></div>
          </div>

          {step === 1 ? (
            /* STEP 1: Guardian Credentials */
            <form
              onSubmit={handleNextStep}
              className="space-y-5 md:space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
            >
              <header>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-purple-400 mb-2 font-mono italic">
                  Account access
                </h3>
                <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
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
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                    className={`w-full h-12 px-4 rounded-2xl bg-white/5 border ${errors.name ? "border-red-500/50" : "border-white/10"} text-white outline-none focus:border-purple-500 transition-all`}
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <p className="text-[10px] text-red-400 mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="group">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Guardian Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    className={`w-full h-12 px-4 rounded-2xl bg-white/5 border ${errors.email ? "border-red-500/50" : "border-white/10"} text-white outline-none focus:border-purple-500 transition-all`}
                    placeholder="example@mail.com"
                  />
                  {errors.email && (
                    <p className="text-[10px] text-red-400 mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="group">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (errors.password)
                        setErrors({ ...errors, password: "" });
                    }}
                    className={`w-full h-12 px-4 rounded-2xl bg-white/5 border ${errors.password ? "border-red-500/50" : "border-white/10"} text-white outline-none focus:border-purple-500 transition-all`}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="text-[10px] text-red-400 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-14 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/20 transition-all mt-4 uppercase text-xs tracking-widest"
              >
                Continue to Safety Setup →
              </button>

              <p className="md:hidden mt-8 text-center text-sm text-white/40">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-purple-400 font-bold">
                  Sign In
                </Link>
              </p>
            </form>
          ) : (
            /* STEP 2: Safety Config */
            <form
              onSubmit={handleSubmit}
              className="space-y-5 md:space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
            >
              <header>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-2 font-mono italic">
                  Protocol config
                </h3>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
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
                    value={formData.childName}
                    onChange={(e) => {
                      setFormData({ ...formData, childName: e.target.value });
                      if (errors.childName)
                        setErrors({ ...errors, childName: "" });
                    }}
                    className={`w-full h-12 px-4 rounded-2xl bg-white/5 border ${errors.childName ? "border-red-500/50" : "border-white/10"} text-white outline-none focus:border-emerald-500 transition-all`}
                    placeholder="Enter Child's Name"
                  />
                  {errors.childName && (
                    <p className="text-[10px] text-red-400 mt-1">
                      {errors.childName}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                    Emergency Contacts (Up to 5)
                  </label>
                  <div className="max-h-[160px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                    {formData.contacts.map((contact, i) => (
                      <input
                        key={i}
                        type="tel"
                        value={contact}
                        onChange={(e) => handleContactChange(i, e.target.value)}
                        className={`w-full h-10 px-4 rounded-xl bg-white/5 border ${errors.contacts && i === 0 ? "border-red-500/50" : "border-white/10"} text-white text-xs outline-none focus:border-purple-500/40 transition-all`}
                        placeholder={`Priority Number ${i + 1} ${i === 0 ? "(Required)" : ""}`}
                      />
                    ))}
                  </div>
                  {errors.contacts && (
                    <p className="text-[10px] text-red-400">
                      {errors.contacts}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full sm:flex-1 h-14 bg-white/5 border border-white/10 text-gray-400 font-bold rounded-2xl hover:bg-white/10 transition-all text-xs tracking-widest"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:flex-[2] h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-purple-500/20 transition-all active:scale-95 text-xs tracking-widest uppercase"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      INITIALIZING...
                    </div>
                  ) : (
                    "Complete Register"
                  )}
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
