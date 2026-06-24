// ─── Nirapod — Shared input validation ───────────────────────────────────────

// Bangladesh mobile number: 11 digits, starts 013–019 (e.g. 01712345678).
// Optionally accepts a +880 / 880 country-code prefix and normalises it.
export const BD_PHONE_REGEX = /^01[3-9]\d{8}$/;

// Strip spaces/dashes and a leading +880 or 880 → local 01XXXXXXXXX form.
export const normalizePhone = (phone) => {
  let v = String(phone || "").replace(/[\s-]/g, "");
  if (v.startsWith("+880")) v = "0" + v.slice(4);
  else if (v.startsWith("880")) v = "0" + v.slice(3);
  return v;
};

export const isValidPhone = (phone) => BD_PHONE_REGEX.test(normalizePhone(phone));

// Returns an error message string, or null when valid.
export const validatePhone = (phone, { required = true } = {}) => {
  const v = normalizePhone(phone);
  if (!v) return required ? "Phone number is required." : null;
  if (!isValidPhone(v))
    return "Enter a valid 11-digit number, e.g. 01712345678.";
  return null;
};
