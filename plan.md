# Nirapod Frontend — API Audit & Fix Plan

Audit of the Next.js client (`project-work-client`) against **Nirapod_API_Documentation.md**
(Django REST Framework + Djoser + SimpleJWT backend at `https://nirapod-backend.onrender.com`).

Goal: find every place the frontend calls the backend API **incorrectly**, plus related bugs.

---

## Summary of Findings

| # | Severity | Area | Issue |
|---|----------|------|-------|
| 1 | 🔴 Critical | Register page | `phone` is required by the API but never collected or sent → **registration always fails (400)** — **✅ FIXED** |
| 2 | 🔴 High | Speed unit | API returns `speed` in **m/s**, UI labels & shows it as **km/h** with no conversion → wrong numbers everywhere — **✅ FIXED** |
| 3 | 🟠 Medium | `changeEmail()` in `api.js` | Missing required field `re_new_email` → `set_email` will 400 — **✅ FIXED** |
| 4 | 🟠 Medium | `confirmEmailReset()` in `api.js` | Missing required `uid` + `token` → `reset_email_confirm` will 400 — **✅ FIXED** |
| 5 | 🟠 Medium | Alerts page | Has its own `apiFetch` with **no 401 auto-refresh** → page breaks when access token expires — **✅ FIXED** |
| 6 | 🟡 Low | Reports page | Uses alert type `ANOMALY` which does not exist (valid: `PANIC`/`GEOFENCE`/`MOTION`) — **✅ FIXED** |
| 7 | 🟡 Low | Dashboard WS | Reads `msg.speed` / `msg.accuracy` from the location WebSocket payload, which the doc does not send — **✅ FIXED** |
| 8 | 🟡 Low | Tracking page | Manual refresh sets global `loading=true`, replacing the whole page with a spinner — **✅ FIXED** |
| 10 | 🔴 High | Settings profile update | Save shows a generic error and hides the real backend reason; `ActionBtn` drops `type` (Logout submits the form); empty `phone` is sent → 400 — **✅ FIXED** |
| 9 | ℹ️ Note | Devices | `registerDevice()` exists in `api.js` but there is **no UI** to register a device; settings is read-only (out of scope) |

---

## Detailed Findings

### 1. 🔴 CRITICAL — Registration is broken: `phone` is never sent

**Doc** — `POST /api/auth/users/` requires: `email`, `name`, `phone`, `password`, `re_password`.
`phone` is marked **required** ("SMS recipient for alerts").

**Code**
- `src/app/auth/register/page.jsx` — form state is `{ name, email, password, confirm }`. There is **no phone input**. `handleSubmit` calls:
  ```js
  await register({ name: form.name, email: form.email, password: form.password });
  ```
- `src/lib/api.js` `register()` already forwards `phone`, but the page never passes it, so it goes out as `undefined`.

**Effect:** The backend rejects the request with `400 { "phone": ["This field is required."] }`. Because the auto-login runs only after `register()` resolves, **the entire sign-up flow fails**.

**Fix**
- Add a **Phone** input to the register form (state `phone`, validation for a BD number).
- Pass it through: `register({ name, email, phone: form.phone, password })`.
- Surface the backend's `phone` field error in the existing error banner.

---

### 2. 🔴 HIGH — Speed unit mismatch (m/s vs km/h)

**Doc** — `LocationReading.speed` and the `POST /api/locations/` `speed` field are both **m/s** (example `1.2`).

**Code** — every consumer prints the raw value with a `km/h` label, no `× 3.6` conversion:
- `src/app/dashboard/page.jsx` → `{loc.speed} km/h`, `` `${loc.speed} km/h` ``
- `src/app/dashboard/tracking/page.jsx` → `` `${parseFloat(loc.speed).toFixed(1)} km/h` ``
- `src/app/dashboard/history/page.jsx` → `avgSpeed` and per-row `` `${parseFloat(loc.speed || 0)} km/h` ``
- `src/app/dashboard/reports/page.jsx` → `` `${parseFloat(loc.speed).toFixed(1)} km/h` ``

**Effect:** Displayed speed is ~3.6× too low for the stated unit (e.g. 1.2 m/s shown as "1.2 km/h" instead of "4.3 km/h").

**Fix (pick one, apply consistently):**
- Add a helper `const toKmh = (mps) => mps == null ? null : parseFloat(mps) * 3.6;` and use it everywhere a `km/h` label is shown, **or**
- Change the labels to `m/s` and drop the conversion.
- Recommend a single shared helper in `src/lib/` to avoid drift.

---

### 3. 🟠 MEDIUM — `changeEmail()` missing `re_new_email`

**Doc** — `POST /api/auth/users/set_email/` requires `new_email`, `re_new_email`, `current_password`.

**Code** — `src/lib/api.js`:
```js
body: JSON.stringify({ current_password, new_email }) // re_new_email missing
```
**Fix:** send `re_new_email: new_email`. (Latent — no UI calls it yet, but it's wrong.)

---

### 4. 🟠 MEDIUM — `confirmEmailReset()` missing `uid` + `token`

**Doc** — `POST /api/auth/users/reset_email_confirm/` requires `uid`, `token`, `new_email`.

**Code** — `src/lib/api.js` `confirmEmailReset(new_email)` sends only `{ new_email }`.

**Fix:** accept and send `{ uid, token, new_email }`. (Latent — no UI calls it yet.)

---

### 5. 🟠 MEDIUM — Alerts page bypasses the central fetch layer (no token refresh)

**Code** — `src/app/dashboard/alerts/page.jsx` defines a **local** `apiFetch` that attaches the JWT but does **not** retry after a `401` (unlike `src/lib/api.js`'s `apiFetch`, which calls `_refreshToken()`).

**Effect:** When the 12-hour access token expires while the user is on the Alerts page, every call (list, detail, resolve) fails with `401` instead of transparently refreshing. Behavior is inconsistent with the rest of the app.

**Fix:** Replace the local helpers with the shared `getAlerts`, `getAlert`, `resolveAlert` from `@/lib/api` (they already exist and handle refresh). Removes ~40 lines of duplicate code.

---

### 6. 🟡 LOW — Reports uses a non-existent alert type `ANOMALY`

**Code** — `src/app/dashboard/reports/page.jsx`:
```js
const alertColor = (type) =>
  ({ PANIC:"#EF4444", GEOFENCE:"#F59E0B", ANOMALY:"#8B5CF6" })[type] || "#60A5FA";
```
`ANOMALY` is not a valid type. The real third type is `MOTION`, so MOTION alerts fall through to the default blue.

**Fix:** rename the key `ANOMALY` → `MOTION` to match the API enum.

---

### 7. 🟡 LOW — Dashboard reads undocumented WS fields

**Doc** — location WS message is exactly `{ type:"location", lat, lon, ts }`.

**Code** — `src/app/dashboard/page.jsx` `onLocation` reads `msg.speed` and `msg.accuracy`, which aren't sent, so they fall back to `0` / `30`. Not a crash, but the live card shows placeholder speed/accuracy on WS updates.

**Fix:** Drop the undocumented reads (or fetch `/api/locations/latest/` after a WS ping to get the full record). Low priority.

---

### 8. 🟡 LOW — Tracking manual refresh hides the whole page

**Code** — `src/app/dashboard/tracking/page.jsx` `handleManualRefresh` sets `loading:true`; the top-level guard `if (state.loading) return <Loader/>` then unmounts the map/stats and shows a full-screen spinner for one request.

**Fix:** use a separate `refreshing` flag (or a button-local spinner) instead of the page-level `loading`.

---

### 9. ℹ️ NOTE — No device-registration UI

`registerDevice(name)` / `updateDevice` / `deleteDevice` exist in `api.js`, but no page calls them. A user with no device sees "No device registered" everywhere and has no way to add one. Out of scope for "wrong API usage", but flagged as a functional gap.

---

### 10. 🔴 HIGH — Settings profile update fails (name / phone) — ✅ FIXED

**Symptom (user-confirmed):** clicking **Save Configurations** on the Settings page shows the red error
toast; the profile is not updated.

**Flow:** `settings/page.jsx` `handleSave` → `patchMe({ name, phone })` (`src/lib/api.js`) →
`PATCH /api/auth/users/me/` with `Authorization: JWT <token>`. The request *is* firing (the error toast
proves the form submits and the backend returns non-2xx), but three problems combine:

1. **Real error swallowed** — `src/app/dashboard/settings/page.jsx` `handleSave` `catch` discarded `err`
   and showed a fixed string, so the actual cause (`{ phone: [...] }`, `{ detail: ... }`, etc.) was
   invisible.
   **Fix:** extract the backend message like `auth/login` / `auth/register` do
   (`err.detail || err.phone?.[0] || err.name?.[0] || firstFieldError`).

2. **`ActionBtn` dropped the `type` prop** — `src/app/dashboard/shared.jsx`. With no `type`, both the
   Save and **Logout** buttons defaulted to `submit` inside the `<form>`, so Logout also submitted the
   profile form and raced with `handleLogout`.
   **Fix:** forward `type` (default `"button"`); Save passes `type="submit"` explicitly.

3. **Empty `phone` sent** — the phone input was not `required`, but the backend model requires `phone`,
   so submitting a blank phone produced `400 ("This field may not be blank.")`.
   **Fix:** mark phone `required`, trim + guard `name`/`phone` before calling `patchMe`, and only send
   non-empty values.

**Files changed:** `src/app/dashboard/settings/page.jsx`, `src/app/dashboard/shared.jsx`.

> Note: per the API doc, `PATCH /api/auth/users/me/` accepts a subset of `name`/`phone`/`email` with no
> `current_password`. With the real error now surfaced, if a different cause appears (e.g.
> `current_password` required, or `401`), apply the matching targeted fix and re-verify.

---

## Things Verified CORRECT (no change needed)

- `login()` → `POST /api/auth/jwt/create/` with `{ email, password }`; stores `access` + `refresh`. ✅
- `_refreshToken()` / `refreshToken()` → `POST /api/auth/jwt/refresh/` with `{ refresh }`, saves new `access`. ✅
- `apiFetch` sends `Authorization: JWT <token>` (correct scheme, not `Bearer`). ✅
- `changePassword()` → `set_password/` with `current_password`, `new_password`, `re_new_password`. ✅
- Devices/Alerts/Locations/Geofences list calls handle both paginated (`results`) and array responses. ✅
- `resolveAlert()` → `PUT /api/alerts/{id}/resolve/`. ✅
- `createGeofence` / `updateGeofence` / `patchGeofence` / `deleteGeofence` payloads match the schema. ✅
- WebSocket uses `wss://…/ws/device/{id}/` and branches on `type === "location" | "alert"`. ✅
- `getLatestLocation` requires `?device=` and returns `null` on 404. ✅

---

## Proposed Fix Order

1. **Register phone field** (#1) — unblocks all sign-ups. *Critical.*
2. **Speed conversion helper** (#2) — apply across dashboard/tracking/history/reports. *High.*
3. **`api.js` email helpers** (#3, #4) — correct payloads. *Medium.*
4. **Alerts page → shared API layer** (#5). *Medium.*
5. **Reports `MOTION` key** (#6) + **WS field cleanup** (#7) + **tracking refresh flag** (#8). *Low / polish.*
6. (Optional) Device-registration UI (#9).

## Verification

- After #1: register a new account end-to-end → expect `201` then auto-login → dashboard.
- After #2: confirm a known m/s value renders ×3.6 (e.g. `1.2` → `4.3 km/h`).
- After #3/#4: exercise `set_email` / `reset_email_confirm` (or at least unit-confirm the payload shape).
- After #5: simulate expired access token on Alerts page → calls should refresh and succeed.
- `npm run build` + `npm run lint` clean.
