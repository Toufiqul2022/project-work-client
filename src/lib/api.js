// ─── Nirapod — Central API Layer ─────────────────────────────────────────────
// Backend: https://nirapod-backend.onrender.com
// Auth: JWT (frontend) | X-Device-Token (ESP32 hardware endpoints only)

const BASE_URL = "https://nirapod-backend.onrender.com";

// ════════════════════════════════════════════════════════
// TOKEN HELPERS
// ════════════════════════════════════════════════════════

// Read tokens from localStorage (safe for SSR)
export const getAccessToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
export const getRefreshToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;

// Persist tokens; pass null for refresh to keep existing one
export const saveTokens = (access, refresh) => {
  localStorage.setItem("access_token", access);
  if (refresh) localStorage.setItem("refresh_token", refresh);
};

// Wipe both tokens (call on logout or auth failure)
export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const isLoggedIn = () => !!getAccessToken();

// ════════════════════════════════════════════════════════
// CORE FETCH  (auto-refresh on 401)
// ════════════════════════════════════════════════════════

// Central fetch wrapper — injects JWT header and retries once after refresh
async function apiFetch(path, options = {}, withAuth = true) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (withAuth) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `JWT ${token}`;
  }
  let res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (res.status === 401 && withAuth) {
    const ok = await _refreshToken();
    if (ok) {
      headers["Authorization"] = `JWT ${getAccessToken()}`;
      res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
    }
  }
  return res;
}

// Internal: silently refresh access token; returns true on success
async function _refreshToken() {
  const refresh = getRefreshToken();
  if (!refresh) return false;
  try {
    const res = await fetch(`${BASE_URL}/api/auth/jwt/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (res.ok) {
      const data = await res.json();
      saveTokens(data.access, null);
      return true;
    }
    clearTokens();
    return false;
  } catch {
    clearTokens();
    return false;
  }
}

// ════════════════════════════════════════════════════════
// AUTH — 1. Registration & Login
// ════════════════════════════════════════════════════════

// Register a new parent account; re_password is sent automatically
export async function register({ name, email, phone, password }) {
  const res = await apiFetch(
    "/api/auth/users/",
    {
      method: "POST",
      body: JSON.stringify({ name, email, phone, password, re_password: password }),
    },
    false
  );
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// Login with email + password; stores access + refresh tokens
export async function login(email, password) {
  const res = await apiFetch(
    "/api/auth/jwt/create/",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    false
  );
  const data = await res.json();
  if (!res.ok) throw data;
  saveTokens(data.access, data.refresh);
  return data;
}

// Manually refresh access token using stored refresh token
export async function refreshToken() {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error("No refresh token found");
  const res = await fetch(`${BASE_URL}/api/auth/jwt/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  saveTokens(data.access, null);
  return data;
}

// Check if a token string is still valid; returns boolean
export async function verifyToken(token) {
  const res = await fetch(`${BASE_URL}/api/auth/jwt/verify/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return res.ok;
}

// Clear tokens; redirect to /auth/login after calling this
export function logout() {
  clearTokens();
}

// ════════════════════════════════════════════════════════
// AUTH — 2. Profile  (GET/PUT/PATCH/DELETE /api/auth/users/me/)
// ════════════════════════════════════════════════════════

// Get the logged-in user's full profile
export async function getMe() {
  const res = await apiFetch("/api/auth/users/me/");
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// Full profile update — all editable fields required
export async function updateMe(payload) {
  const res = await apiFetch("/api/auth/users/me/", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// Partial profile update — only send fields you want to change
export async function patchMe(payload) {
  const res = await apiFetch("/api/auth/users/me/", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// Delete the current user's account (204); clears tokens on success
export async function deleteMe() {
  const res = await apiFetch("/api/auth/users/me/", { method: "DELETE" });
  if (res.status !== 204 && !res.ok) throw await res.json();
  clearTokens();
  return true;
}

// ════════════════════════════════════════════════════════
// AUTH — 3. Password Management
// ════════════════════════════════════════════════════════

// Change password while logged in; re_new_password sent automatically
export async function changePassword({ current_password, new_password }) {
  const res = await apiFetch("/api/auth/users/set_password/", {
    method: "POST",
    body: JSON.stringify({ current_password, new_password, re_new_password: new_password }),
  });
  if (res.status !== 204 && !res.ok) throw await res.json();
  return true;
}

// Send password-reset email to the given address (no auth required)
export async function requestPasswordReset(email) {
  const res = await apiFetch(
    "/api/auth/users/reset_password/",
    { method: "POST", body: JSON.stringify({ email }) },
    false
  );
  if (res.status !== 204 && !res.ok) throw await res.json();
  return true;
}

// Confirm password reset with uid + token from the reset email
export async function confirmPasswordReset({ uid, token, new_password }) {
  const res = await apiFetch(
    "/api/auth/users/reset_password_confirm/",
    {
      method: "POST",
      body: JSON.stringify({ uid, token, new_password, re_new_password: new_password }),
    },
    false
  );
  if (res.status !== 204 && !res.ok) throw await res.json();
  return true;
}

// ════════════════════════════════════════════════════════
// AUTH — 4. Email Management
// ════════════════════════════════════════════════════════

// Change email address; requires current password + re_new_email confirmation
export async function changeEmail({ current_password, new_email }) {
  const res = await apiFetch("/api/auth/users/set_email/", {
    method: "POST",
    body: JSON.stringify({
      current_password,
      new_email,
      re_new_email: new_email,
    }),
  });
  if (res.status !== 204 && !res.ok) throw await res.json();
  return true;
}

// Request an email-change confirmation link sent to current email
export async function requestEmailReset(email) {
  const res = await apiFetch("/api/auth/users/reset_email/", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  if (res.status !== 204 && !res.ok) throw await res.json();
  return true;
}

// Confirm email change using the uid + token from the reset email
export async function confirmEmailReset({ uid, token, new_email }) {
  const res = await apiFetch(
    "/api/auth/users/reset_email_confirm/",
    {
      method: "POST",
      body: JSON.stringify({ uid, token, new_email }),
    },
    false
  );
  if (res.status !== 204 && !res.ok) throw await res.json();
  return true;
}

// ════════════════════════════════════════════════════════
// AUTH — 5. Account Activation
// ════════════════════════════════════════════════════════

// Activate a new account using uid + token from the activation email
export async function activateAccount({ uid, token }) {
  const res = await apiFetch(
    "/api/auth/users/activation/",
    { method: "POST", body: JSON.stringify({ uid, token }) },
    false
  );
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// Resend account activation email to the given address
export async function resendActivation(email) {
  const res = await apiFetch(
    "/api/auth/users/resend_activation/",
    { method: "POST", body: JSON.stringify({ email }) },
    false
  );
  if (res.status !== 204 && !res.ok) throw await res.json();
  return true;
}

// ════════════════════════════════════════════════════════
// DEVICES
// Fields: id, owner_email, name, device_token, is_active, last_seen, battery_pct
// ════════════════════════════════════════════════════════

// List all devices registered to the logged-in user (paginated)
export async function getDevices(page = 1) {
  const res = await apiFetch(`/api/devices/?page=${page}`);
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// Get a single device by its UUID
export async function getDevice(id) {
  const res = await apiFetch(`/api/devices/${id}/`);
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// Register a new ESP32 device; save the returned device_token immediately
export async function registerDevice(name) {
  const res = await apiFetch("/api/devices/", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// Full device update — both name and is_active are required
export async function updateDevice(id, payload) {
  const res = await apiFetch(`/api/devices/${id}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// Partial device update — only send fields you want to change
export async function patchDevice(id, payload) {
  const res = await apiFetch(`/api/devices/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// Soft-delete a device (sets is_active=false, data kept); reactivate with patchDevice
export async function deleteDevice(id) {
  const res = await apiFetch(`/api/devices/${id}/`, { method: "DELETE" });
  if (!res.ok) throw await res.json();
  const text = await res.text();
  return text ? JSON.parse(text) : { detail: "Device deactivated." };
}

// ════════════════════════════════════════════════════════
// ALERTS
// Types: PANIC | GEOFENCE | MOTION
// Fields: id, device, device_name, alert_type, alert_type_display,
//         latitude, longitude, sms_sent, sms_sent_at, resolved, timestamp
// ════════════════════════════════════════════════════════

// List alerts with optional filters: device, resolved, alert_type, page
export async function getAlerts({ device, resolved, alert_type, page = 1 } = {}) {
  const params = new URLSearchParams({ page });
  if (device !== undefined) params.set("device", device);
  if (resolved !== undefined) params.set("resolved", resolved);
  if (alert_type !== undefined) params.set("alert_type", alert_type);
  const res = await apiFetch(`/api/alerts/?${params}`);
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// Get a single alert by UUID
export async function getAlert(id) {
  const res = await apiFetch(`/api/alerts/${id}/`);
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// Partial alert update (e.g. { resolved: true }); prefer resolveAlert() for standard flow
export async function patchAlert(id, payload) {
  const res = await apiFetch(`/api/alerts/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// Mark an alert as resolved; it stays in DB but won't appear in ?resolved=false
export async function resolveAlert(id) {
  const res = await apiFetch(`/api/alerts/${id}/resolve/`, { method: "PUT" });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// ════════════════════════════════════════════════════════
// LOCATIONS
// Fields: id, device, device_name, latitude, longitude, accuracy, speed, timestamp
// ════════════════════════════════════════════════════════

// Get paginated GPS history (newest first, 20/page); filter by device UUID
export async function getLocations({ device, page = 1 } = {}) {
  const params = new URLSearchParams({ page });
  if (device !== undefined) params.set("device", device);
  const res = await apiFetch(`/api/locations/?${params}`);
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// Convenience wrapper — fetch GPS history for a specific device
export async function getDeviceLocations(deviceId, page = 1) {
  return getLocations({ device: deviceId, page });
}

// Get a single GPS reading by its UUID
export async function getLocation(id) {
  const res = await apiFetch(`/api/locations/${id}/`);
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// Get the most recent GPS position for a device; returns null if none yet
export async function getLatestLocation(deviceId) {
  try {
    const res = await apiFetch(`/api/locations/latest/?device=${deviceId}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ════════════════════════════════════════════════════════
// GEOFENCES
// Fields: id, device, device_name, name, latitude, longitude, radius_m, is_active
// ════════════════════════════════════════════════════════

// List geofences; filter by device UUID and/or is_active status
export async function getGeofences({ device, is_active, page = 1 } = {}) {
  const params = new URLSearchParams({ page });
  if (device !== undefined) params.set("device", device);
  if (is_active !== undefined) params.set("is_active", is_active);
  const res = await apiFetch(`/api/geofences/?${params}`);
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// Get a single geofence by UUID
export async function getGeofence(id) {
  const res = await apiFetch(`/api/geofences/${id}/`);
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// Create a circular safe zone; recommended radius: Home 100–150m, School 200–300m
export async function createGeofence({
  device,
  name,
  latitude,
  longitude,
  radius_m,
  is_active = true,
}) {
  const res = await apiFetch("/api/geofences/", {
    method: "POST",
    body: JSON.stringify({ device, name, latitude, longitude, radius_m, is_active }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// Full geofence update — all fields required
export async function updateGeofence(id, payload) {
  const res = await apiFetch(`/api/geofences/${id}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// Partial geofence update — e.g. { radius_m: 300 } or { is_active: false }
export async function patchGeofence(id, payload) {
  const res = await apiFetch(`/api/geofences/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// Permanently delete a geofence; use patchGeofence(id, { is_active: false }) to disable instead
export async function deleteGeofence(id) {
  const res = await apiFetch(`/api/geofences/${id}/`, { method: "DELETE" });
  if (!res.ok) throw await res.json();
  return true;
}

// ════════════════════════════════════════════════════════
// WEBSOCKET — Real-time GPS + Alerts
// wss://nirapod-backend.onrender.com/ws/device/{device_id}/
// Messages: { type:"location", lat, lon, ts } | { type:"alert", alert_type, lat, lon }
// ════════════════════════════════════════════════════════

// Open a WebSocket for live GPS and alert events; returns ws — call ws.close() on unmount
export function connectDeviceSocket(
  deviceId,
  { onLocation, onAlert, onOpen, onClose, onError } = {}
) {
  const ws = new WebSocket(
    `wss://nirapod-backend.onrender.com/ws/device/${deviceId}/`
  );
  ws.onopen = () => onOpen?.();
  ws.onclose = () => onClose?.();
  ws.onerror = (e) => onError?.(e);
  ws.onmessage = (e) => {
    try {
      const msg = JSON.parse(e.data);
      if (msg.type === "location") onLocation?.(msg);
      if (msg.type === "alert") onAlert?.(msg);
    } catch {
      // Ignore malformed WebSocket messages
    }
  };
  return ws;
}