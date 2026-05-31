# BLACKLINE AUTO STUDIO

Premium luxury automotive detailing website — a cinematic, dark-mode brand site built to look like a $10K custom agency project.

## Run & Operate

- `pnpm --filter @workspace/blackline run dev` — run the frontend (PORT + BASE_PATH required, handled by workflow)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + Framer Motion + wouter
- Fonts: Cormorant Garamond (serif/headlines) + Inter (sans/body) via Google Fonts
- API: Express 5
- DB: PostgreSQL + Drizzle ORM (not yet provisioned — no backend routes needed for MVP)
- Build: esbuild (CJS bundle for API)

## Where things live

- `artifacts/blackline/src/pages/Home.tsx` — landing page (hero, services, portfolio, testimonials, CTA)
- `artifacts/blackline/src/pages/Quote.tsx` — 4-step price calculator
- `artifacts/blackline/src/pages/Booking.tsx` — 6-step booking flow
- `artifacts/blackline/src/pages/admin/` — admin stubs (Dashboard, Bookings, Customers, Services, Technicians, Analytics)
- `artifacts/blackline/src/components/layout/Navbar.tsx` — fixed transparent → dark nav
- `artifacts/blackline/src/components/layout/AdminLayout.tsx` — dark sidebar admin shell
- `artifacts/blackline/src/assets/` — AI-generated images (hero, portfolio-1..4, cta)
- `artifacts/blackline/src/index.css` — BLACKLINE color palette + Cormorant + Inter import

## Color Palette

- Background: #070707 → `bg-background`
- Cards: #111111 → `bg-card`
- Borders: #1A1A1A → `border-border`
- Primary text: #F5F5F5 → `text-foreground`
- Secondary text: #8A8A8A → `text-muted-foreground`
- Gold accent: #C9A86A → `text-primary` / `bg-primary`

## Architecture decisions

- Purely frontend — no backend calls needed. Quote calculator and booking are client-side only.
- Images are AI-generated PNGs stored in `src/assets/` (not object storage) — simple and fast.
- Wouter used for routing (not react-router-dom). App mounted at `/`.
- Admin area is route-only stubs with no auth — structure is prepared for future auth integration.
- Google Fonts `@import url()` is the FIRST line in index.css (before all other @imports) — PostCSS requirement.

## Product

- `/` — Cinematic landing page: hero with stats, 6 services with pricing, portfolio gallery, trust section, testimonials, quote CTA
- `/quote` — 4-step quote calculator: vehicle type → service → condition → price estimate
- `/booking` — 6-step booking: service → technician → date (custom calendar) → time slot → contact form → confirmation
- `/admin` — Admin area with dashboard, bookings, customers, services, technicians, analytics stubs

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Google Fonts `@import url()` MUST be the very first line in `index.css` before `@import "tailwindcss"` — PostCSS will fail silently otherwise.
- Do NOT use react-router-dom — this project uses `wouter`.
- Do NOT explicitly import React at top of files — the Vite JSX transformer handles it.
- Admin routes use nested routing via wouter Switch inside AdminLayout — keep that pattern.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
