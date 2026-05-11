# 🛡️ SafeGuard — Full Project File-by-File Explanation

> **Project:** IoT Child Safety & Anti-Kidnapping System  
> **Stack:** Next.js 16.2.4 · React 19 · Tailwind CSS v4 · ESP32 IoT Hardware  
> **Type:** BPI Final Year Project · Bangladesh

---

## 📁 Complete Project Structure

```
project-work-client/
│
├── public/                          ← Static assets served at root URL
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── src/
│   └── app/                         ← Next.js App Router root
│       │
│       ├── page.jsx                 ← / Landing page (home)
│       ├── layout.js                ← Root layout (wraps every page)
│       ├── globals.css              ← Global styles + Tailwind import
│       ├── Navbar.jsx               ← Shared top navigation bar
│       ├── Footer.jsx               ← Shared footer
│       │
│       ├── auth/
│       │   ├── login/page.jsx       ← /auth/login  Login form
│       │   └── register/page.jsx   ← /auth/register  3-step registration
│       │
│       ├── dashboard/
│       │   ├── page.jsx             ← /dashboard  Main sidebar dashboard
│       │   └── overview/page.jsx   ← /dashboard/overview  Standalone overview
│       │
│       ├── AboutPage/page.jsx       ← /AboutPage  Team + mission + timeline
│       ├── ContactPage/page.jsx     ← /ContactPage  Contact form
│       └── Features/page.jsx       ← /Features  Full features showcase
│
├── jsconfig.json                    ← Path alias: @/* → ./src/*
├── next.config.mjs                  ← Next.js configuration
├── postcss.config.mjs               ← PostCSS for Tailwind v4
├── package.json                     ← Dependencies and scripts
├── eslint.config.mjs                ← Linting rules
└── .gitignore                       ← Git ignored files
```

---

---

# 📄 FILE 1 — `src/app/layout.js`

## What it does

This is the **root layout** — the outermost wrapper that Next.js App Router renders around every single page in the entire application. Every route (`/`, `/dashboard`, `/auth/login`, etc.) is wrapped by this file automatically.

## Code breakdown

```js
import "./globals.css"; // Loads Tailwind CSS and global body styles for the whole app
import Footer from "./Footer"; // Imports the shared Footer component
import Navbar from "./Navbar"; // Imports the shared Navbar component

export const metadata = {
  title: "SafeGuard — Child Safety System",
  description: "IoT-based child safety & anti-kidnapping system...",
};
// ↑ This sets the <title> and <meta name="description"> for SEO on every page.
//   Next.js reads this export automatically and injects it into the <head>.

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar /> {/* Top navigation bar — appears on every page */}
        {children}{" "}
        {/* The actual page content (e.g. landing page, dashboard) */}
        <Footer /> {/* Footer — appears on every page */}
      </body>
    </html>
  );
}
```

## Why it matters

- Without this file the app cannot render
- Any component placed here (Navbar, Footer) automatically appears on every route
- The `metadata` export is what makes Google/search engines see the correct page title
- `children` is the current route's `page.jsx` content, injected dynamically by Next.js

---

---

# 📄 FILE 2 — `src/app/globals.css`

## What it does

Global stylesheet that is imported once in `layout.js` and applies to the entire application. It sets CSS variables for light/dark theme colors and imports Tailwind CSS.

## Code breakdown

```css
@import "tailwindcss";
/* ↑ Loads all Tailwind v4 utility classes (flex, grid, bg-*, text-*, etc.)
     This single line replaces the old @tailwind base/components/utilities directives */

:root {
  --background: #ffffff; /* Light mode background */
  --foreground: #171717; /* Light mode text color */
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans); /* Geist font (if loaded) */
  --font-mono: var(--font-geist-mono); /* Geist Mono (if loaded) */
}
/* ↑ @theme inline is a Tailwind v4 feature — it maps CSS vars to Tailwind tokens
     so you can write bg-background and text-foreground in JSX className strings */

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a; /* Dark mode background */
    --foreground: #ededed; /* Dark mode text */
  }
}
/* ↑ Automatically switches theme based on the user's OS dark/light preference */

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}
```

## Why it matters

- Every inline style in the project that uses `background: "#0a0a12"` or similar dark colors is consistent with this dark-first design
- Tailwind utilities work throughout the project because of the `@import "tailwindcss"` line here

---

---

# 📄 FILE 3 — `src/app/Navbar.jsx`

## What it does

The shared **top navigation bar** that appears on every page (via `layout.js`). It is fully responsive, scroll-aware, supports mobile hamburger menu, a user dropdown menu, and shows different link sets depending on whether the user is on an auth page or a regular page.

## Key features

- **Scroll detection** — background and blur change after scrolling 10px
- **Active route highlighting** — current page link gets a purple accent
- **Auth-page awareness** — hides the "Dashboard" link when on `/auth/*` routes
- **Mobile hamburger menu** — full-screen overlay nav for small screens
- **User dropdown** — avatar button reveals profile/logout menu
- **Live status chips** — shows SAFE status, battery %, and GPS signal in the top bar
- **PulseDot component** — animated green dot indicating live system status

## Navigation links

```
Public nav:     Home / Features / About / Contact / Dashboard
Auth page nav:  Home / Features / About / Contact  (no Dashboard)
```

## State variables

| State          | Purpose                                                                |
| -------------- | ---------------------------------------------------------------------- |
| `scrolled`     | `true` when page is scrolled > 10px — triggers blur + border on navbar |
| `mobileOpen`   | Controls the mobile hamburger menu open/close                          |
| `userMenuOpen` | Controls the user avatar dropdown visibility                           |

## Hooks used

- `usePathname()` — detects the current URL to highlight active links and hide Dashboard on auth pages
- `useState` — manages scroll, mobile menu, and user menu states
- `useEffect` — attaches scroll listener; closes menus when route changes

---

---

# 📄 FILE 4 — `src/app/Footer.jsx`

## What it does

The shared **footer** displayed at the bottom of every page. A 4-column layout with the brand description, navigation links grouped by category, and a bottom bar with copyright and social icons.

## Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  🛡️ SafeGuard         Navigation    System       Hardware       │
│  IoT safety system    Overview       Contacts     ESP32          │
│  description text     Tracking       Reports      NEO-6M GPS     │
│                       Health         Settings     SIM800L        │
│  🟢 System online     Alerts         Device Cfg   Diagnostics    │
│  📡 Strong signal     History        API Docs     Firmware       │
│  🔋 78%               Zones                                      │
├─────────────────────────────────────────────────────────────────│
│  © 2026 SafeGuard — BPI Final Year    v2.1.0    [gh][📖][🎧][🐛] │
└─────────────────────────────────────────────────────────────────┘
```

## Components inside Footer

| Component    | Purpose                                                 |
| ------------ | ------------------------------------------------------- |
| `StatusChip` | Colored pill badge showing system/signal/battery status |
| `Icon`       | Inline SVG renderer used for all nav link icons         |

## Link columns

| Column     | Links                                                               |
| ---------- | ------------------------------------------------------------------- |
| Navigation | Overview, Live Tracking, Health, Alerts, History, Zones             |
| System     | Contacts, Reports, Settings, Device Config, API Docs                |
| Hardware   | ESP32 Module, NEO-6M GPS, SIM800L GSM, Diagnostics, Firmware Update |

## Bottom bar

- Copyright year (dynamically set with `new Date().getFullYear()`)
- Version badge: `v2.1.0`
- Stack badge: `Next.js · Django · ESP32`
- 4 social icon buttons: GitHub, Docs, Support, Bug Report

---

---

# 📄 FILE 5 — `src/app/page.jsx`

## What it does

The **public landing page** at the root URL `/`. This is the first thing visitors see — a full marketing page for SafeGuard with animated sections, live widget demos, feature cards, stats, testimonials, and CTAs.

## Page sections (top to bottom)

### 1. Hero Section

- Animated badge: "IoT Child Safety — Bangladesh"
- Animated gradient headline: "Keep Your Child **Safe. Always.**"
- Subtitle explaining the ESP32 + GPS + health + AI combination
- Two CTA buttons: **Get Started Free** (→ `/auth/register`) and **Live Demo** (→ `/dashboard`)
- 4 real-time status pills: SAFE · 🔋78% · 📡4/4 · ♥72 BPM
- **Full dashboard mockup** — a fake browser window showing the sidebar, stat cards, a live GPS map widget, and a live heart-rate sparkline

### 2. Stats Strip

4 animated counter cards that count up when they scroll into view:

- `10s` — GPS Update Rate
- `99%` — System Uptime
- `5+` — Emergency Contacts
- `72h` — Battery Life

### 3. Live Alerts + Device Section

- Left: SOS / Geofence / Anomaly alert cards with type, location, time, and status
- Right: Animated floating wearable device circle + hardware spec table (MCU, GPS, GSM, Sensor, Battery)

### 4. Features Grid

6 feature cards in a 3-column grid:

1. Real-Time GPS Tracking (IoT Hardware)
2. Biometric Health Monitor (Biometric)
3. One-Press SOS Alerts (Critical)
4. Smart Geofencing (Smart)
5. AI Anomaly Detection (AI/ML)
6. Multi-Network Failover (Network)

### 5. Tech Stack Band

6 technology cards: Frontend / Backend / Hardware / Algorithm / AI+ML / Hosting

### 6. How It Works

3-step vertical timeline:

- Step 01: Wear the Device
- Step 02: Monitor in Real Time
- Step 03: Respond Instantly

### 7. Testimonials

3 parent review cards with 5-star ratings:

- Fatema Begum (Mother, Dhaka)
- Karim Hossain (Father, Mirpur)
- Nadia Islam (Guardian, Chittagong)

### 8. Final CTA

- Large gradient headline: "Start protecting your child today"
- Two buttons: **Get Started Free** + **Talk to us**
- Trust badges: No credit card required · Free setup · 24/7 support

## Custom components inside page.jsx

| Component     | Purpose                                                                       |
| ------------- | ----------------------------------------------------------------------------- |
| `PulseDot`    | Animated green/red dot using CSS @keyframes ping                              |
| `Counter`     | Counts from 0 to target number when scrolled into view (IntersectionObserver) |
| `useReveal()` | Custom hook — returns `[ref, visible]` for scroll-reveal animations           |
| `LiveMap`     | Animated fake SVG map showing GPS pin, zones, roads, and a live ping          |
| `HeartRate`   | Real-time heart rate display with animated sparkline SVG                      |
| `HeroItem`    | Fade-in + slide-up wrapper with a configurable delay                          |
| `Reveal`      | Scroll-triggered fade-in wrapper used for all sections below the hero         |

---

---

# 📄 FILE 6 — `src/app/auth/login/page.jsx`

## What it does

The **login page** at `/auth/login`. Provides a styled email + password form with a Google OAuth button, password visibility toggle, and simulated authentication that redirects to the dashboard.

## Layout

Split-screen design:

- **Left panel** (hidden on mobile): gradient purple brand panel with tagline and "New here? Register" link
- **Right panel**: login form

## Form fields

| Field    | Type                | Features                       |
| -------- | ------------------- | ------------------------------ |
| Email    | `email`             | Controlled input               |
| Password | `password` / `text` | Toggle show/hide with eye icon |

## State variables

| State      | Purpose                                         |
| ---------- | ----------------------------------------------- |
| `email`    | Controlled email input value                    |
| `password` | Controlled password input value                 |
| `loading`  | Shows spinner and disables button during submit |
| `showPass` | Toggles password visibility                     |

## Form submission flow

```
User clicks "Sign In"
→ e.preventDefault()
→ setLoading(true)
→ setTimeout 2000ms (simulates API call)
→ setLoading(false)
→ router.push("/dashboard")
```

## Notable icons

`LockIcon`, `EyeIcon`, `EyeOffIcon`, `GoogleIcon` — all defined as inline SVG components at the top of the file (no external icon library needed).

---

---

# 📄 FILE 7 — `src/app/auth/register/page.jsx`

## What it does

The **multi-step registration page** at `/auth/register`. A 3-step wizard that collects personal info, child info, and emergency contacts before creating an account.

## Layout

Same split-screen as login:

- **Left panel**: gradient purple info panel with "Already have an account? Login" link
- **Right panel**: step wizard

## The 3 Steps

### Step 1 — Personal Information

- Full name
- Email address
- Password
- Confirm password

### Step 2 — Child Information

- Child's full name
- (Device pairing information)

### Step 3 — Emergency Contacts

- Up to 5 phone number fields
- Each contact stored in `formData.contacts[0..4]`

## State variables

| State      | Purpose                                       |
| ---------- | --------------------------------------------- |
| `step`     | Current step: 1, 2, or 3                      |
| `loading`  | Shows spinner during final submit             |
| `formData` | Single unified object holding all form values |

## `formData` shape

```js
{
  name: "",
  email: "",
  password: "",
  childName: "",
  contacts: ["", "", "", "", ""]   // Up to 5 emergency phone numbers
}
```

## Form submission flow

```
Step 1 → "Next" → validates fields → setStep(2)
Step 2 → "Next" → validates child name → setStep(3)
Step 3 → "Create Account"
  → handleSubmit()
  → setLoading(true)
  → setTimeout 2000ms
  → router.push("/dashboard")
```

## `handleContactChange(index, value)`

Updates a single contact in the array without mutating the others:

```js
const newContacts = [...formData.contacts];
newContacts[index] = value;
setFormData({ ...formData, contacts: newContacts });
```

---

---

# 📄 FILE 8 — `src/app/dashboard/page.jsx`

## What it does

The **main parent dashboard** at `/dashboard`. A full-screen sidebar layout with 9 navigation modules. This is the core of the SafeGuard application — where parents monitor their child's safety in real time.

## Layout structure

```
┌──────────────────────────────────────────────────────┐
│                      Top Bar                         │
├──────────┬───────────────────────────────────────────┤
│          │                                           │
│ Sidebar  │         Page Content (scrollable)         │
│ (220px)  │                                           │
│          │                                           │
├──────────┴───────────────────────────────────────────┤
│                      Footer bar                      │
└──────────────────────────────────────────────────────┘
```

## Sidebar

- Collapsible: **220px** (expanded with labels) ↔ **64px** (icon-only)
- Toggle button at top-right edge of sidebar
- Alert badge on the Alerts nav item
- User profile card at the bottom (name + device ID)
- Active route highlighted with purple border + background

## Top bar

Shows current module name + 3 live status chips:

- 🟢 SAFE (green pulse dot)
- 🔋 78% (battery)
- 📡 Strong (signal)

## State variables

| State         | Purpose                                                         |
| ------------- | --------------------------------------------------------------- |
| `page`        | Which module is active: `"overview"`, `"tracking"`, etc.        |
| `sosActive`   | Whether the SOS button is currently activated                   |
| `bpm`         | Live heart rate value (updates every 2 seconds via setInterval) |
| `sidebarOpen` | Whether the sidebar is expanded (true) or collapsed (false)     |

## Live BPM simulation

```js
useEffect(() => {
  const t = setInterval(() => {
    setBpm((prev) =>
      Math.max(60, Math.min(90, prev + (Math.random() > 0.5 ? 1 : -1))),
    );
  }, 2000);
  return () => clearInterval(t);
}, []);
```

Heart rate ticks up or down by 1 every 2 seconds within the 60–90 BPM safe range.

## The 9 Dashboard Modules

### 1. 🛡️ Overview (`OverviewPage`)

- 3 status cards: Device Status / Battery / Signal
- Live GPS map + Heart rate sparkline (side by side)
- Quick Actions row: SOS button + 4 stat counters (Alerts / Zones / Contacts / Uptime)
- Technology stack table (6 rows)

### 2. 🗺️ Tracking (`TrackingPage`)

- Full-height fake live GPS map
- 3 stat cards: Latitude / Longitude / Speed
- Location details list: Address / Last Updated / Update Rate / Safe Zone status

### 3. 💓 Health (`HealthPage`)

- 3 ring gauges: BPM (red) / Stress Level (green) / Battery (blue)
- Live heart rate sparkline chart (wider, more data points)
- Health summary table: Resting HR / Stress / Activity / Anomaly count

### 4. 🚨 Alerts (`AlertsPage`)

- Filter buttons: All / SOS / Geofence / Anomaly
- Alert cards with left border accent color, type badge, location, time, status
- Test alert buttons: 🆘 Test SOS / 📍 Test Geofence / ⚠️ Test Anomaly

### 5. 🛣️ History (`HistoryPage`)

- Date header + GPS map showing today's route
- Vertical timeline: 3 route entries with time, path description, distance

### 6. 📍 Zones (`ZonesPage`)

- Safe zone cards: Home (200m, Active) / School (500m, Active) / Grandma's House (150m, Inactive)
- Edit button per zone
- Zone preview map
- "+ Add Zone" button

### 7. 📞 Contacts (`ContactsPage`)

- 4 contact cards with avatar emoji, name, phone, priority badge (#1 → #4)
- "Test" button per contact (sends a test notification)
- "+ Add Contact" button

### 8. 📄 Reports (`ReportsPage`)

- 3 report cards with title, date, file size, type badge
- "View" button per report
- "⬇ Export PDF" button

### 9. ⚙️ Settings (`SettingsPage`)

- 3 grouped setting sections:
  - **Device Configuration**: Device ID, Hardware API URL, Update Interval
  - **Alert Settings**: Motion Sensitivity, Geofence Radius, Notification Mode
  - **Profile**: Full Name, Email
- "Save Changes" button per section

## Shared sub-components in this file

| Component   | Purpose                                                           |
| ----------- | ----------------------------------------------------------------- |
| `Sparkline` | SVG polyline chart with gradient fill — used for heart rate graph |
| `RingGauge` | SVG circular progress gauge — used in Health module               |
| `FakeMap`   | Animated SVG grid map with GPS pin, zones, roads, and live badge  |

## MOCK data object

All data displayed is from a `MOCK` constant at the top of the file:

```js
const MOCK = {
  user: { name: "Rahim Uddin", id: "BD-2024-001" },
  device: { battery: 78, signal: 4, status: "SAFE" },
  location: { lat: 23.8103, lng: 90.4125, address: "Mirpur 10, Dhaka" },
  heartRate: { bpm: 72, stress: "Low", trend: [...] },
  alerts: [ {SOS}, {Geofence}, {Anomaly} ],
  contacts: [ ...4 contacts ],
  safeZones: [ Home, School, Grandma ],
  routes: [ ...3 route entries ],
}
```

---

---

# 📄 FILE 9 — `src/app/dashboard/overview/page.jsx`

## What it does

A **standalone overview page** at `/dashboard/overview`. This is a separate, self-contained version of the overview module — independent from the sidebar dashboard in `dashboard/page.jsx`. It was the first version of the dashboard and is kept as its own route.

## ⚠️ Bug fixed in this file

This file was **missing `"use client"`** at the top. Since it uses `useState`, `useEffect`, and `useRef`, it must be a client component. The fix: add `"use client";` as the very first line.

## What it contains

- Same `MOCK` data as the main dashboard
- Full sidebar layout with all 9 navigation modules
- The same `Sparkline`, `RingGauge`, `FakeMap` sub-components
- Live BPM ticker via `useEffect` + `setInterval`
- Collapsible sidebar

> **Note:** This page duplicates most of the code from `dashboard/page.jsx`. In a production refactor, these shared components would be extracted into a `/components/` folder.

---

---

# 📄 FILE 10 — `src/app/AboutPage/page.jsx`

## What it does

The **About page** at `/AboutPage`. Tells the story of SafeGuard — who built it, why, the team, the values, and the development timeline.

## Page sections

### Hero

- Badge: "About SafeGuard"
- Gradient headline: "Built by engineers who believe every child deserves safety"
- Paragraph about the project origin (university capstone → full product)

### Mission Block

Centered card with the mission statement:

> "To make advanced child-safety technology accessible to every family in Bangladesh and beyond..."

### Core Values (4 cards in a grid)

| Value                  | Color  |
| ---------------------- | ------ |
| Child Safety First     | Green  |
| Radical Transparency   | Blue   |
| Always On              | Purple |
| Family-Centered Design | Yellow |

### Our Journey (Timeline — 5 milestones)

| Year    | Milestone              |
| ------- | ---------------------- |
| 2023    | Research & Ideation    |
| 2024 Q1 | Prototype Development  |
| 2024 Q2 | Health Sensors Added   |
| 2024 Q3 | Dashboard & App Launch |
| 2025    | AI Anomaly Detection   |

### Meet the Team (5 cards)

| Name          | Role                         |
| ------------- | ---------------------------- |
| Rahim Uddin   | Lead Engineer & Project Head |
| Fatema Begum  | IoT Hardware Engineer        |
| Karim Hossain | Backend & API Developer      |
| Nadia Islam   | Frontend & UX Developer      |
| Sabbir Ahmed  | AI & Data Analyst            |

### CTA block

Two buttons: **Get in Touch** (→ `/contact`) and **Explore Features** (→ `/features`)

---

---

# 📄 FILE 11 — `src/app/ContactPage/page.jsx`

## What it does

The **contact page** at `/ContactPage`. A contact form with 4 info cards and a success state after submission.

## Contact info cards (4 items)

| Label         | Value                    | Color  |
| ------------- | ------------------------ | ------ |
| Email         | support@safeguard.com.bd | Purple |
| Phone         | +880 1700-000000         | Green  |
| Location      | Dhaka, Bangladesh        | Blue   |
| Support Hours | 24/7 — Always available  | Yellow |

## Contact form fields

| Field         | Type                |
| ------------- | ------------------- |
| Full Name     | text input          |
| Email Address | email input         |
| Topic         | `<select>` dropdown |
| Message       | `<textarea>`        |

## Topic dropdown options

General Enquiry / Technical Support / Device/Hardware Issue / Partnership / Press & Media / Other

## State variables

| State       | Purpose                                                    |
| ----------- | ---------------------------------------------------------- |
| `form`      | Object holding all 4 field values                          |
| `submitted` | `true` after successful submission — shows success message |
| `loading`   | `true` during the simulated 1.6s API call                  |

## Submission flow

```
Click "Send Message"
→ e.preventDefault()
→ setLoading(true)
→ setTimeout 1600ms
→ setLoading(false)
→ setSubmitted(true)
→ Shows green success card: "Message Sent!"
```

---

---

# 📄 FILE 12 — `src/app/Features/page.jsx`

## What it does

The **features showcase page** at `/Features`. A detailed, visually rich page presenting all 8 SafeGuard features with icons, descriptions, and a CTA to register.

## Features displayed (8 cards)

| #   | Feature                    | Color  | Badge    |
| --- | -------------------------- | ------ | -------- |
| 1   | Real-Time GPS Tracking     | Green  | Core     |
| 2   | Health Monitoring          | Pink   | IoT      |
| 3   | SOS Emergency Alerts       | Red    | Critical |
| 4   | Smart Safe Zones           | Blue   | Smart    |
| 5   | Multi-Network Connectivity | Purple | Network  |
| 6   | Multi-Contact SOS Network  | Yellow | Family   |
| 7   | Activity & Safety Reports  | Teal   | Reports  |
| 8   | AI Anomaly Detection       | Orange | AI/ML    |

## Page layout

- Background: dark `#0a0a12` with gradient glows
- Hero section: badge + headline + subtitle
- 8 feature cards in a responsive grid (`auto-fill, minmax(300px, 1fr)`)
- Each card: icon box (top-left) + badge (top-right) + title + description
- Bottom CTA: "Get Started Free" → `/auth/register` + "See the Dashboard" → `/dashboard`

---

---

# 📄 FILE 13 — `jsconfig.json`

## What it does

Configures JavaScript path aliases so you can use `@/` as a shorthand for `./src/` in import statements throughout the project.

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Example

```js
// Without alias (error-prone relative paths):
import Footer from "../../../app/Footer";

// With alias (clean, always correct):
import Footer from "@/app/Footer";
```

---

---

# 📄 FILE 14 — `next.config.mjs`

## What it does

The Next.js configuration file. Currently minimal (default scaffold) with no custom options.

```js
const nextConfig = {
  /* config options here */
};
export default nextConfig;
```

## What you could add here

- `images.domains` — allow external image URLs
- `redirects()` — URL redirects
- `env` — expose server-side environment variables
- `experimental.turbo` — Turbopack options

---

---

# 📄 FILE 15 — `postcss.config.mjs`

## What it does

Configures PostCSS to process CSS through the Tailwind CSS v4 plugin. This is what makes Tailwind class names work in the browser.

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

> **Note:** Tailwind v4 uses `@tailwindcss/postcss` instead of the old `tailwindcss` PostCSS plugin. If you see `postcss-import` errors, ensure you're using the correct plugin name.

---

---

# 📄 FILE 16 — `package.json`

## What it does

Defines the project's name, version, npm scripts, and all dependencies.

```json
{
  "name": "project-work-client",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev", // Start dev server (localhost:3000)
    "build": "next build", // Production build
    "start": "next start", // Run production build
    "lint": "eslint" // Run ESLint
  },
  "dependencies": {
    "next": "16.2.4", // Next.js framework
    "react": "19.2.4", // React library
    "react-dom": "19.2.4" // React DOM renderer
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4", // Tailwind v4 PostCSS plugin
    "eslint": "^9", // JavaScript linter
    "eslint-config-next": "16.2.4", // Next.js ESLint rules
    "tailwindcss": "^4" // Tailwind CSS v4
  }
}
```

## Important versions

| Package  | Version | Note                                     |
| -------- | ------- | ---------------------------------------- |
| Next.js  | 16.2.4  | Uses App Router, Turbopack dev server    |
| React    | 19.2.4  | Latest React with concurrent features    |
| Tailwind | v4      | New PostCSS-based v4 — different from v3 |

---

---

# 📄 FILE 17 — `eslint.config.mjs`

## What it does

Configures ESLint for the project using Next.js recommended rules. Catches common React, Next.js, and accessibility issues during development.

```js
// Uses flat config format (ESLint v9+)
// Applies next/core-web-vitals rules which include:
// - React hooks rules (no calling hooks inside conditions)
// - Next.js-specific rules (no <img>, use next/image, etc.)
// - Import rules
```

---

---

# 📄 FILE 18 — `.gitignore`

## What it does

Tells Git which files and folders to never commit to version control.

Key entries:

```
node_modules/     ← 200MB+ of packages — never committed
.next/            ← Next.js build cache — regenerated on build
.env.local        ← Secret keys and API URLs — never in Git
*.log             ← Log files
```

---

---

# 📄 FILE 19 — `public/` folder

## What it does

Static files served directly at the root URL. Files in `public/` are accessible as `https://yourdomain.com/filename`.

| File         | Usage                                   |
| ------------ | --------------------------------------- |
| `next.svg`   | Next.js logo — used in default scaffold |
| `vercel.svg` | Vercel logo — used in default scaffold  |
| `globe.svg`  | Globe icon — used in default scaffold   |
| `file.svg`   | File icon — used in default scaffold    |
| `window.svg` | Window icon — used in default scaffold  |

> These are the default Next.js scaffold assets. None of them are used in the SafeGuard custom pages — they can be replaced with your own assets (logo, favicon, device photos, etc.).

---

---

# 🔄 How All Files Connect

```
Browser request → Next.js router
                      │
                      ▼
              layout.js (runs first)
                      │
           ┌──────────┴──────────┐
           │                     │
        Navbar.jsx           Footer.jsx
           │                     │
           └──────────┬──────────┘
                      │
                 {children}
                      │
        ┌─────────────┼──────────────┐
        │             │              │
     page.jsx   dashboard/       auth/
   (landing)    page.jsx      login/page.jsx
                   │          register/page.jsx
              Overview
              Tracking
              Health          AboutPage/page.jsx
              Alerts          ContactPage/page.jsx
              History         Features/page.jsx
              Zones
              Contacts
              Reports
              Settings
```

---

# 🐛 Bugs Found & Fixed

| File                                  | Bug                              | Fix Applied            |
| ------------------------------------- | -------------------------------- | ---------------------- |
| `src/app/Footer.jsx`                  | File was 0 bytes (empty)         | Full component written |
| `src/app/layout.js`                   | Missing `import "./globals.css"` | Import added           |
| `src/app/layout.js`                   | Missing `export const metadata`  | Metadata export added  |
| `src/app/dashboard/overview/page.jsx` | Missing `"use client"` at top    | Directive added        |

---

# 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open in browser
open http://localhost:3000
```

| URL                            | Page                |
| ------------------------------ | ------------------- |
| `localhost:3000`               | Landing page        |
| `localhost:3000/auth/login`    | Login               |
| `localhost:3000/auth/register` | 3-step registration |
| `localhost:3000/dashboard`     | Main dashboard      |
| `localhost:3000/AboutPage`     | About               |
| `localhost:3000/ContactPage`   | Contact             |
| `localhost:3000/Features`      | Features            |

---

<div align="center">

**SafeGuard v2.1.0** · BPI Final Year Project · Bangladesh  
ESP32 · NEO-6M · SIM800L · Next.js 16 · React 19 · Tailwind v4

</div>
