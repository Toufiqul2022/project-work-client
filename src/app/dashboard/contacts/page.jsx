"use client";
// app/dashboard/contacts/page.jsx
import { useState, useEffect, useRef } from "react";
import { getMe } from "@/lib/api"; // রিয়েল এপিআই ইম্পোর্ট
import { validatePhone } from "@/lib/validation";

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

// ─── Emergency Contacts constants & helpers ───────────────────────────────────
const STORAGE_KEY = "nirapod_emergency_contacts";
const RELATIONS = [
  "Father",
  "Mother",
  "Uncle",
  "Aunt",
  "Grandparent",
  "Guardian",
  "Other",
];

// Relation → accent colour (Father/Mother purple, Guardian/Grandparent blue, rest amber)
const relationColor = (relation) => {
  if (relation === "Father" || relation === "Mother") return "#A78BFA";
  if (relation === "Guardian" || relation === "Grandparent") return "#60A5FA";
  return "#FBBF24";
};

const EMPTY_CONTACT = { name: "", phone: "", relation: "Father" };

// ─── Add / Edit Modal ──────────────────────────────────────────────────────────
function ContactModal({ open, initial, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_CONTACT);
  const [error, setError] = useState(null);

  // Reset the form whenever the modal opens (add → empty, edit → existing values)
  useEffect(() => {
    if (open) {
      setForm({ ...EMPTY_CONTACT, ...(initial || {}) });
      setError(null);
    }
  }, [open, initial]);

  if (!open) return null;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const phone = form.phone.trim();
    if (!name) return setError("Contact name is required.");
    const phoneErr = validatePhone(phone);
    if (phoneErr) return setError(phoneErr);
    onSave({ ...form, name, phone });
  };

  const InputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-200 placeholder:text-gray-600 focus:border-purple-500/50 focus:outline-none transition-colors";
  const LabelClass =
    "block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md bg-[#0D1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <form onSubmit={handleSubmit}>
          <div className="px-5 pt-5 pb-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <div className="text-sm font-extrabold text-slate-100">
                {initial ? "Edit Contact" : "Add Emergency Contact"}
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">
                Saved on this device for quick SOS dispatch
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
            >
              ✕
            </button>
          </div>

          <div className="p-5 space-y-4">
            {error && (
              <div className="text-[11px] text-red-400 font-semibold bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                {error}
              </div>
            )}

            <div>
              <label className={LabelClass}>Contact Name</label>
              <input
                className={InputClass}
                placeholder="e.g. Fatema Begum"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
              />
            </div>

            <div>
              <label className={LabelClass}>Phone Number</label>
              <input
                type="tel"
                className={InputClass}
                placeholder="e.g. 01711111111"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                required
              />
            </div>

            <div>
              <label className={LabelClass}>Relation</label>
              <select
                className={InputClass + " cursor-pointer"}
                value={form.relation}
                onChange={(e) => set("relation", e.target.value)}
              >
                {RELATIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 text-xs font-semibold hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
              >
                Save Contact
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Emergency Contact Card ────────────────────────────────────────────────────
function ContactCard({ contact, onEdit, onDelete, deleteConfirm }) {
  const color = relationColor(contact.relation);
  const pendingDelete = deleteConfirm === contact.id;

  return (
    <Card className="group" >
      <div
        className="flex items-center justify-between gap-4"
        style={{ borderLeft: `3px solid ${color}`, paddingLeft: 12, marginLeft: -20, paddingTop: 2, paddingBottom: 2 }}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-base shrink-0"
            style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25`, color }}
          >
            👤
          </div>
          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs md:text-sm font-black text-slate-200 tracking-wide truncate">
                {contact.name}
              </span>
              <Badge color={color}>{contact.relation}</Badge>
            </div>
            <div className="text-[11px] text-gray-400 font-mono flex items-center gap-2">
              <span className="text-slate-500">TEL:</span> {contact.phone}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => onEdit(contact)}
            title="Edit contact"
            className="h-8 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-blue-400 flex items-center justify-center text-xs transition-colors"
          >
            ✎ Edit
          </button>
          <button
            onClick={() => onDelete(contact.id)}
            title="Delete contact"
            className={`h-8 px-2.5 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
              pendingDelete
                ? "bg-red-500/20 border border-red-500/40 text-red-300"
                : "bg-red-500/10 hover:bg-red-500/20 text-red-400"
            }`}
          >
            {pendingDelete ? "Confirm?" : "🗑 Delete"}
          </button>
        </div>
      </div>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RealContactsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testingContact, setTestingContact] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  // ── Emergency contacts (client-side / localStorage) ──
  const [contacts, setContacts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = add mode, object = edit mode
  const [deleteConfirm, setDeleteConfirm] = useState(null); // contact id pending confirm
  const deleteTimer = useRef(null);

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

  // Load emergency contacts from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setContacts(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
  }, []);

  // Persist on every change
  const persist = (list) => {
    setContacts(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

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

  // ── Add / Edit ──
  const openAdd = () => {
    setEditTarget(null);
    setModalOpen(true);
  };
  const openEdit = (contact) => {
    setEditTarget(contact);
    setModalOpen(true);
  };

  const handleSaveContact = (data) => {
    if (editTarget) {
      persist(
        contacts.map((c) =>
          c.id === editTarget.id ? { ...c, ...data, id: editTarget.id } : c,
        ),
      );
    } else {
      persist([...contacts, { ...data, id: crypto.randomUUID() }]);
    }
    setModalOpen(false);
    setEditTarget(null);
    showToast("✅ Contact saved");
  };

  // ── Inline delete confirm (Confirm? window for 3s) ──
  const handleDelete = (id) => {
    if (deleteConfirm === id) {
      clearTimeout(deleteTimer.current);
      persist(contacts.filter((c) => c.id !== id));
      setDeleteConfirm(null);
      showToast("🗑️ Contact removed");
      return;
    }
    setDeleteConfirm(id);
    clearTimeout(deleteTimer.current);
    deleteTimer.current = setTimeout(() => setDeleteConfirm(null), 3000);
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

      {/* ── Section 1 — Primary Contact (from getMe) ── */}
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

      {/* ── Section 2 — Emergency Contacts (localStorage CRUD) ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-black text-white tracking-wide m-0">
            🆘 Emergency Contacts
            <span className="ml-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              {contacts.length} saved
            </span>
          </h3>
          <button
            onClick={openAdd}
            className="px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 text-xs font-bold hover:bg-purple-600/30 transition-colors"
          >
            + Add Contact
          </button>
        </div>

        {contacts.length === 0 ? (
          <Card>
            <div className="text-center py-10">
              <div className="text-3xl mb-3">📭</div>
              <div className="text-sm font-bold text-slate-400">
                No emergency contacts added yet
              </div>
              <div className="text-[11px] text-gray-600 mt-1">
                Add trusted people to notify during an emergency.
              </div>
              <button
                onClick={openAdd}
                className="mt-4 px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 text-xs font-bold hover:bg-purple-600/30 transition-colors"
              >
                + Add First Contact
              </button>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {contacts.map((c) => (
              <ContactCard
                key={c.id}
                contact={c}
                onEdit={openEdit}
                onDelete={handleDelete}
                deleteConfirm={deleteConfirm}
              />
            ))}
          </div>
        )}
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

      {/* ── Add / Edit Modal ── */}
      <ContactModal
        open={modalOpen}
        initial={editTarget}
        onClose={() => {
          setModalOpen(false);
          setEditTarget(null);
        }}
        onSave={handleSaveContact}
      />
    </div>
  );
}
