

# Brand Launch Control Tower — Radico Khaitan POC

## Overview
A client-side React dashboard to track alcohol brand launches from ideation to market, with role-based views, mock data, localStorage persistence, and a premium liquor-inspired design.

---

## Pages & Navigation

### 1. Login Page (`/login`)
- Role selector dropdown: **CXO**, **Head**, **Team**
- Any name input "logs in" — no password required
- Sets role in AuthContext, redirects to `/dashboard`
- Gold-accented, centered card with Radico branding

### 2. Dashboard (`/dashboard`)
- **KPI Cards Row**: Total brands, on-track count, delayed count, completed count
- **Pie Chart**: Brand status distribution (Recharts)
- **Bar Chart**: Planned vs actual days per stage (Recharts)
- **Delay Alerts**: Color-coded list (yellow <3d, orange 3-7d, red >7d)
- **Brand Overview Cards**: Progress bars, status flags, click to drill down
- **Early Warning Toasts**: Auto-fire for stages delayed >3 days
- Compact grid layout, responsive 2-4 columns

### 3. Brands List (`/brands`)
- Table view of all brands with name, category, overall status, progress %, launch date
- "Add Brand" button (Teams only)
- Click row → navigates to `/brands/:brandId`

### 4. Brand Detail (`/brands/:brandId`)
- Brand header with name, category, overall status, progress bar
- **7 Stages** shown as accordion sections, each displaying:
  - Planned/actual dates (date pickers for Teams)
  - Status dropdown, owner dropdown, delay indicator (red if >0)
  - SLA countdown timer (live, red if overdue, stops when completed)
  - Notes textarea, mock attachments list
- **"Sync from ERP" button**: Populates Manufacturing stage with mock data
- Edit capabilities restricted to Team role only

### 5. Stage Overview (`/stages/:stageName`)
- Lists all brands' status for that specific stage
- Table with brand name, dates, status, delay, owner

### 6. Analytics (`/analytics`)
- Filters: by brand, stage, date range
- Dynamic charts updating on filter change
- Mock CSV export button (console.logs data)

---

## Layout & Navigation Shell
- **Header**: "Radico Launch Tower" gold logo with bottle silhouette SVG, theme toggle (dark/light), logout button
- **Sidebar**: Links to Dashboard, Brands, Analytics, and each of the 7 stage modules
- Wraps all routes except `/login`

---

## Role-Based Access
| Feature | CXO | Head | Team |
|---|---|---|---|
| Dashboard KPIs & Charts | ✅ | ✅ | ✅ |
| Brand Summaries | ❌ | ✅ | ✅ |
| Add/Edit Brands & Stages | ❌ | ❌ | ✅ |
| ERP Sync Button | ❌ | ❌ | ✅ |

---

## Data & State
- **Context API**: BrandContext (brands array + CRUD), AuthContext (role/user), ThemeContext (dark/light)
- **Mock Data**: 4-5 pre-populated brands (e.g., "New Rampur Whisky Variant" — delayed, "Magic Moments Berry" — completed, "Jaisalmer Gin Reserve" — in progress, "Morpheus XO Brandy" — pending)
- **localStorage**: Load on mount, auto-save on every change
- **Auto-calculations**: Overall status derived from stage statuses, delay = max(0, actualEnd - plannedEnd in days)

---

## Design & Theming
- **Dark mode (default)**: Charcoal `#1A1A1A` background, gold `#D4AF37` accents, white text
- **Light mode**: White background, gold accents, beige `#F5F5DC` secondary
- Theme toggle persists to localStorage
- Inter font, subtle fade-in animations (CSS/Tailwind), compact padding
- Liquor-inspired SVG icons: whisky glass (dashboard), flask (R&D), bottle (packaging)
- WCAG-compliant high contrast

---

## Key Interactive Features
- **SLA Countdown Timers**: Live per-stage countdowns, red badge when overdue, stops on completion
- **Progress Bars**: Per-brand, gold-filled, based on completed stage count
- **Toast Alerts**: Fire on render if any stage delayed >3 days
- **Mock ERP Sync**: Merges hardcoded manufacturing data into brand, recalculates status
- **Mock Attachments**: Add/remove from in-memory list per stage
- **Audit Logging**: Console.log all data changes

---

## Technical Details
- Lazy-loaded routes with React.lazy + Suspense
- Error boundaries wrapping route content
- Reusable `StageForm` component for all 7 stages
- Date utilities and status calculation utilities in `/utils`
- No external auth, no backend, no API calls

