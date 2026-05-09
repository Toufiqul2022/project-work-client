"use client";

import { useState } from "react";

const Icon = ({ d, size = 24, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

const contactInfo = [
  {
    icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
    label: "Email",
    value: "support@safeguard.com.bd",
    color: "#A78BFA",
  },
  {
    icon: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.02 1.2 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z",
    label: "Phone",
    value: "+880 1700-000000",
    color: "#22C55E",
  },
  {
    icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7a3 3 0 100 6 3 3 0 000-6z",
    label: "Location",
    value: "Dhaka, Bangladesh",
    color: "#60A5FA",
  },
  {
    icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 8v4l3 3",
    label: "Support Hours",
    value: "24 / 7 — Always available",
    color: "#FBBF24",
  },
];

const topics = [
  "General Enquiry",
  "Technical Support",
  "Device / Hardware Issue",
  "Partnership / Collaboration",
  "Press & Media",
  "Other",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1600);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a12",
        color: "#E2E8F0",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* Background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.12,
          background:
            "radial-gradient(circle at 30% 0%, #7c3aed 0%, transparent 50%), radial-gradient(circle at 80% 100%, #2563EB 0%, transparent 50%)",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ── HERO ── */}
        <section style={{ textAlign: "center", padding: "80px 24px 56px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 20,
              background: "rgba(109,40,217,0.12)",
              border: "1px solid rgba(109,40,217,0.3)",
              fontSize: 11,
              fontWeight: 800,
              color: "#A78BFA",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 28,
            }}
          >
            <Icon
              d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6"
              size={12}
              color="#A78BFA"
            />
            Contact Us
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              margin: "0 0 20px",
              background:
                "linear-gradient(135deg, #ffffff 0%, #A78BFA 50%, #60A5FA 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            We're here for you, always
          </h1>
          <p
            style={{
              fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
              color: "#6B7280",
              maxWidth: 500,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Have a question about the platform, a device issue, or want to
            partner with us? Reach out — our team responds within a few hours.
          </p>
        </section>

        {/* ── MAIN CONTENT ── */}
        <section
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px 100px",
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr",
            gap: 32,
            alignItems: "start",
          }}
          className="contact-grid"
        >
          {/* Left: Info cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {contactInfo.map((c) => (
              <div
                key={c.label}
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 16,
                  padding: "20px 22px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 13,
                    background: c.color + "15",
                    border: `1px solid ${c.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon d={c.icon} size={19} color={c.color} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#6B7280",
                      marginBottom: 3,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {c.label}
                  </div>
                  <div
                    style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0" }}
                  >
                    {c.value}
                  </div>
                </div>
              </div>
            ))}

            {/* Social links */}
            <div
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: "20px 22px",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#6B7280",
                  marginBottom: 14,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Find us online
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {["GitHub", "LinkedIn", "Twitter"].map((s) => (
                  <div
                    key={s}
                    style={{
                      padding: "7px 14px",
                      borderRadius: 10,
                      background: "rgba(109,40,217,0.1)",
                      border: "1px solid rgba(109,40,217,0.25)",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#A78BFA",
                      cursor: "pointer",
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 24,
              padding: "36px",
            }}
          >
            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 52, marginBottom: 20 }}>✅</div>
                <h2
                  style={{
                    fontSize: 22,
                    fontWeight: 900,
                    color: "#E2E8F0",
                    margin: "0 0 12px",
                  }}
                >
                  Message Sent!
                </h2>
                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7 }}>
                  Thanks,{" "}
                  <strong style={{ color: "#A78BFA" }}>{form.name}</strong>.
                  We've received your message and will get back to you at{" "}
                  <strong style={{ color: "#60A5FA" }}>{form.email}</strong>{" "}
                  within a few hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", topic: "", message: "" });
                  }}
                  style={{
                    marginTop: 28,
                    padding: "10px 24px",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#A78BFA",
                    background: "rgba(109,40,217,0.12)",
                    border: "1px solid rgba(109,40,217,0.3)",
                    cursor: "pointer",
                  }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 900,
                    color: "#E2E8F0",
                    margin: "0 0 6px",
                  }}
                >
                  Send us a message
                </h2>
                <p
                  style={{ fontSize: 13, color: "#6B7280", margin: "0 0 28px" }}
                >
                  Fill in the form and we'll be in touch shortly.
                </p>

                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: 18 }}
                >
                  {/* Name + Email row */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 14,
                    }}
                  >
                    {[
                      {
                        name: "name",
                        label: "Full Name",
                        placeholder: "Rahim Uddin",
                        type: "text",
                      },
                      {
                        name: "email",
                        label: "Email Address",
                        placeholder: "rahim@email.com",
                        type: "email",
                      },
                    ].map((field) => (
                      <div key={field.name}>
                        <label
                          style={{
                            display: "block",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#9CA3AF",
                            marginBottom: 7,
                            letterSpacing: "0.04em",
                          }}
                        >
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          name={field.name}
                          value={form[field.name]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          required
                          style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "10px 14px",
                            borderRadius: 10,
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "#E2E8F0",
                            fontSize: 13,
                            fontFamily: "inherit",
                            outline: "none",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "rgba(109,40,217,0.5)";
                            e.target.style.boxShadow =
                              "0 0 0 3px rgba(109,40,217,0.12)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor =
                              "rgba(255,255,255,0.1)";
                            e.target.style.boxShadow = "none";
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Topic */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#9CA3AF",
                        marginBottom: 7,
                        letterSpacing: "0.04em",
                      }}
                    >
                      Topic
                    </label>
                    <select
                      name="topic"
                      value={form.topic}
                      onChange={handleChange}
                      required
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 10,
                        background: "#0a0a12",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: form.topic ? "#E2E8F0" : "#6B7280",
                        fontSize: 13,
                        fontFamily: "inherit",
                        outline: "none",
                        cursor: "pointer",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(109,40,217,0.5)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(255,255,255,0.1)";
                      }}
                    >
                      <option value="" disabled>
                        Select a topic…
                      </option>
                      {topics.map((t) => (
                        <option
                          key={t}
                          value={t}
                          style={{ background: "#0D1117" }}
                        >
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#9CA3AF",
                        marginBottom: 7,
                        letterSpacing: "0.04em",
                      }}
                    >
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help…"
                      required
                      rows={5}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "12px 14px",
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#E2E8F0",
                        fontSize: 13,
                        fontFamily: "inherit",
                        resize: "vertical",
                        outline: "none",
                        lineHeight: 1.6,
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(109,40,217,0.5)";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(109,40,217,0.12)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(255,255,255,0.1)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: "13px 0",
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 800,
                      color: "white",
                      background: loading
                        ? "rgba(109,40,217,0.4)"
                        : "linear-gradient(135deg, #6D28D9, #2563EB)",
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                      transition: "opacity 0.2s",
                      boxShadow: loading
                        ? "none"
                        : "0 0 20px rgba(109,40,217,0.35)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {loading ? "Sending…" : "Send Message →"}
                  </button>
                </form>
              </>
            )}
          </div>
        </section>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
