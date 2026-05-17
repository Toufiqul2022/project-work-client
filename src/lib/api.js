// ─── Nirapod — Central API Layer ─────────────────────────────────────────────
// Backend: https://nirapod-backend.onrender.com

const BASE_URL = "https://nirapod-backend.onrender.com";

// ════════════════════════════════════════════════════════
// TOKEN HELPERS
// ════════════════════════════════════════════════════════

export const getAccessToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

export const getRefreshToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;

export const saveTokens = (access, refresh) => {
  localStorage.setItem("access_token", access);
  if (refresh) localStorage.setItem("refresh_token", refresh);
};

export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const isLoggedIn = () => !!getAccessToken();

// ════════════════════════════════════════════════════════
// CORE FETCH WRAPPER (auto-refresh on 401)
// ════════════════════════════════════════════════════════

async function apiFetch(path, options = {}, withAuth = true) {
  const headers = { "Content-Type": "application/json", ...options.headers };

  if (withAuth) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `JWT ${token}`;
  }

  let res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // Auto refresh if 401
  if (res.status === 401 && withAuth) {
    const ok = await _refreshToken();
    if (ok) {
      headers["Authorization"] = `JWT ${getAccessToken()}`;
      res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
    }
  }

  return res;
}

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
// 1. AUTH
// ════════════════════════════════════════════════════════

/** Register — POST /api/auth/users/ */
export async function register({ name, email, password }) {
  const res = await apiFetch(
    "/api/auth/users/",
    { method: "POST", body: JSON.stringify({ name, email, password }) },
    false,
  );
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

/** Login — POST /api/auth/jwt/create/ → saves tokens */
export async function login(email, password) {
  const res = await apiFetch(
    "/api/auth/jwt/create/",
    { method: "POST", body: JSON.stringify({ email, password }) },
    false,
  );
  const data = await res.json();
  if (!res.ok) throw data;
  saveTokens(data.access, data.refresh);
  return data;
}

/** Logout — clears tokens locally */
export function logout() {
  clearTokens();
}

/** Get current user — GET /api/auth/users/me/ */
export async function getMe() {
  const res = await apiFetch("/api/auth/users/me/");
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

/** Update user profile — PATCH /api/auth/users/{id}/ */
export async function patchUser(id, payload) {
  const res = await apiFetch(`/api/auth/users/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

/** Request password reset email — POST /api/auth/users/reset_password/ */
export async function requestPasswordReset(email) {
  const res = await apiFetch(
    "/api/auth/users/reset_password/",
    { method: "POST", body: JSON.stringify({ email }) },
    false,
  );
  if (!res.ok) throw await res.json();
  return true;
}

// ════════════════════════════════════════════════════════
// 2. DEVICES
// ════════════════════════════════════════════════════════

/** List devices — GET /api/devices/ */
export async function getDevices() {
  const res = await apiFetch("/api/devices/");
  const data = await res.json();
  if (!res.ok) throw data;
  return Array.isArray(data) ? data : data.results || [];
}

/** Register device — POST /api/devices/ → returns device_token */
export async function registerDevice(name) {
  const res = await apiFetch("/api/devices/", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

/** Update device — PATCH /api/devices/{id}/ */
export async function patchDevice(id, payload) {
  const res = await apiFetch(`/api/devices/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

/** Soft-delete device — DELETE /api/devices/{id}/ (sets is_active=false) */
export async function deleteDevice(id) {
  const res = await apiFetch(`/api/devices/${id}/`, { method: "DELETE" });
  if (!res.ok) throw await res.json();
  return true;
}

// ════════════════════════════════════════════════════════
// 3. ALERTS
// ════════════════════════════════════════════════════════

/** List alerts — GET /api/alerts/ */
export async function getAlerts(page = 1) {
  const res = await apiFetch(`/api/alerts/?page=${page}`);
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

/** Mark alert resolved — PATCH /api/alerts/{id}/ */
export async function resolveAlert(id) {
  const res = await apiFetch(`/api/alerts/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ resolved: true }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// ════════════════════════════════════════════════════════
// 4. LOCATIONS
// ════════════════════════════════════════════════════════

/** Location history — GET /api/locations/ */
export async function getLocations(page = 1) {
  const res = await apiFetch(`/api/locations/?page=${page}`);
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

/** Latest location for a device */
export async function getDeviceLocations(deviceId, page = 1) {
  const res = await apiFetch(`/api/locations/?device=${deviceId}&page=${page}`);
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// ════════════════════════════════════════════════════════
// 5. GEOFENCES
// ════════════════════════════════════════════════════════

/** List geofences — GET /api/geofences/ */
export async function getGeofences(page = 1) {
  const res = await apiFetch(`/api/geofences/?page=${page}`);
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

/** Create geofence — POST /api/geofences/ */
export async function createGeofence({
  device,
  name,
  latitude,
  longitude,
  radius_m,
}) {
  const res = await apiFetch("/api/geofences/", {
    method: "POST",
    body: JSON.stringify({ device, name, latitude, longitude, radius_m }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

/** Update geofence — PATCH /api/geofences/{id}/ */
export async function patchGeofence(id, payload) {
  const res = await apiFetch(`/api/geofences/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

/** Delete geofence — DELETE /api/geofences/{id}/ */
export async function deleteGeofence(id) {
  const res = await apiFetch(`/api/geofences/${id}/`, { method: "DELETE" });
  if (!res.ok) throw await res.json();
  return true;
}

// ════════════════════════════════════════════════════════
// 6. WEBSOCKET — real-time GPS + alerts
// ════════════════════════════════════════════════════════

/**
 * Connect to device websocket
 * wss://nirapod-backend.onrender.com/ws/device/{device_id}/
 *
 * Messages:
 *   { type: "location", lat, lon, ts }
 *   { type: "alert",    alert_type, lat, lon }
 *
 * Returns the WebSocket — call ws.close() on component unmount.
 */
export function connectDeviceSocket(
  deviceId,
  { onLocation, onAlert, onOpen, onClose, onError } = {},
) {
  const ws = new WebSocket(
    `wss://nirapod-backend.onrender.com/ws/device/${deviceId}/`,
  );

  ws.onopen = () => onOpen?.();
  ws.onclose = () => onClose?.();
  ws.onerror = (e) => onError?.(e);

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.type === "location") onLocation?.(msg);
      if (msg.type === "alert") onAlert?.(msg);
    } catch {}
  };

  return ws;
}
