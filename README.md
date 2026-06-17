# CampusEats — Multi-Vendor Canteen Management System

A responsive React + Tailwind CSS frontend for a multi-vendor campus canteen, with
role-based dashboards for **students**, **vendors**, and **admins**, real-time order
tracking, and a REST-ready API service layer.

> This is a **frontend-only** project. All data is served from an in-memory mock API
> (`src/services/api.js`) designed to be swapped for a real backend with minimal changes.

---

## ✨ Features

- **Role-based access control** — `/login` issues a mock session for one of three
  roles (student, vendor, admin). `ProtectedRoute` guards each dashboard route and
  redirects unauthenticated or mismatched roles.
- **5+ vendor dashboards** — each of the 6 seeded vendors (Spice Garden, Wok & Roll,
  The Grill House, Fresh Bites, Chai & Snacks, Pizza Plaza) gets its own vendor
  dashboard: revenue stats, order queue, open/closed toggle, and menu management.
- **Real-time order tracking** — `useOrderTracking` polls the API every 5s and
  subscribes to a push-style update channel, so order statuses (pending →
  preparing → ready → delivered) update live across student, vendor, and admin views.
- **Multi-vendor cart & checkout** — students can add items from any open vendor;
  checkout splits the cart into one order per vendor automatically.
- **Admin analytics** — live revenue-by-vendor chart, vendor management table, and
  a system-wide live order feed.
- **Animated "Canteen Floor"** — a live stall-map visualization that pulses when
  orders come in, shared across student and admin views.
- Fully responsive (mobile → desktop), keyboard-focus visible, and respects
  `prefers-reduced-motion`.

---

## 🛠 Tech Stack

- **React 18** (functional components + hooks)
- **React Router 6** for routing and protected routes
- **Tailwind CSS 3** for styling, with a custom canteen color palette
- **Vite** for dev server and build

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

---

## 🔐 Demo Logins

On `/login`, pick a role — no password is required:

| Role    | What you can do                                                          |
|---------|---------------------------------------------------------------------------|
| Student | Enter any name, browse vendors, order food, track live order status      |
| Vendor  | Pick any of the 6 stalls — manage menu, toggle open/closed, advance orders |
| Admin   | Full system overview — revenue chart, vendor table, live order feed       |

---

## 📁 Project Structure

```
src/
├── components/        # Reusable UI: Navbar, CanteenFloor, CartDrawer, OrderRow...
│   └── ui/             # Small primitives: Badge, Pill, Star, Spinner, LiveDot
├── context/            # AuthContext (RBAC), CartContext
├── data/               # Mock seed data: vendors, menus, orders, status config
├── hooks/              # useOrderTracking — polling + live update subscription
├── pages/              # Login, StudentDashboard, VendorDashboard, AdminDashboard
├── services/api.js     # Mock REST API layer (swap for real fetch/axios calls)
├── App.jsx             # Routes + role-based layout
├── main.jsx            # Entry point, providers
└── index.css           # Tailwind directives + global styles
```

---

## 🔌 Connecting a Real Backend

Every function in `src/services/api.js` documents the REST endpoint it represents,
e.g.:

```js
// GET /vendors/:id/orders
export async function getOrdersByVendor(vendorId) { ... }
```

To integrate a real API:

1. Set `VITE_API_BASE_URL` in a `.env` file.
2. Replace each mock function body with a `fetch`/`axios` call to that endpoint.
3. For real-time updates, replace the `subscribeToOrderUpdates` polling stub in
   `api.js` with a WebSocket or Server-Sent Events listener — `useOrderTracking`
   already calls `subscribe` and re-fetches on each event, so no changes are
   needed in the UI layer.

---

## 🎨 Design System

Custom Tailwind palette (see `tailwind.config.js`):

| Token              | Hex       | Use                          |
|--------------------|-----------|------------------------------|
| `canteen-bg`       | `#0F0E17` | App background               |
| `canteen-surface`  | `#1A1933` | Header, drawers               |
| `canteen-card`     | `#221F3B` | Cards, rows                   |
| `canteen-border`   | `#2E2B50` | Borders, dividers              |
| `canteen-saffron`  | `#F5A623` | Primary accent / CTAs          |
| `canteen-teal`     | `#2EC4B6` | Secondary accent               |
| `canteen-coral`    | `#FF6B6B` | Errors, closed states           |
| `canteen-green`    | `#4CAF82` | Success, "ready"/"delivered"    |
| `canteen-purple`   | `#7C4DFF` | Accents (admin)                |
| `canteen-muted`    | `#8B87A8` | Secondary text                 |
| `canteen-cream`    | `#FFF8F0` | Primary text                   |
