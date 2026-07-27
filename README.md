# RouteBook

A premium, cinematic personal travel journal — an interactive world map, animated
timeline, masonry galleries, and a single glass search bar that finds every
journey, place, photo, and story you've logged.

## Stack

React 19 · Vite · TypeScript · Tailwind CSS v4 · React Router v7 · Framer Motion
· GSAP · Lenis · Lucide · MapLibre GL JS · TanStack Query · Supabase · Cloudinary
· Fuse.js

## Getting started

```bash
npm install
cp .env.example .env   # fill in your Supabase + Cloudinary credentials
npm run dev
```

The app runs fully on local mock data (see `src/data/mockData.ts`) if you leave
`.env` untouched — every page, the map, search, timeline, and galleries are
explorable immediately. Once you add real Supabase/Cloudinary credentials, the
data layer (`src/lib/journeysRepo.ts`) automatically switches to live queries.

## Connecting Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run `supabase/schema.sql` — it creates the
   `journeys`, `photos`, `videos`, `albums`, `tags` tables, a `locations` view
   for the map, a `get_travel_stats()` RPC for the stats section, and Row
   Level Security policies (public read, authenticated write).
3. Copy your Project URL and anon key into `.env` as `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY`.
4. Create yourself a user under Authentication → Users so you can sign into
   `/admin`.
5. Seed a few rows in `journeys` (or use the admin panel once signed in) —
   `photos`/`videos` reference `journeys.id` as a foreign key.

## Connecting Cloudinary

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. Settings → Upload → Add an **unsigned** upload preset (name it e.g.
   `routebook-unsigned`) so the browser can upload directly without a server.
3. Add `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` to
   `.env`.
4. The admin panel's drag-and-drop uploader (`src/components/admin/MediaUploader.tsx`)
   will now upload real files with live progress bars. After upload, insert
   the returned `secure_url` into the relevant `photos`/`videos` row (either
   via the admin form or directly in Supabase) to attach it to a journey.

## Project structure

```
src/
  components/
    admin/       admin layout, auth guard, media uploader
    gallery/      masonry gallery + fullscreen lightbox
    home/         hero, glass search, homepage sections
    journey/      journey-page-only pieces (share button, etc.)
    layout/       nav, footer
    map/          world map + per-journey route map (MapLibre)
    shared/       cross-cutting primitives (glass card, section heading, reveal)
    timeline/      vertical animated timeline
    video/         video player + section
  context/         Supabase auth context
  data/            mock dataset used until Supabase is connected
  hooks/           React Query hooks, Fuse.js search, Lenis smooth scroll
  lib/             Supabase/Cloudinary clients, data repository, utils
  pages/           route-level screens, including /admin/*
  types/           shared domain types (mirrors the SQL schema)
supabase/
  schema.sql       full schema + RLS policies + stats RPC
```

## Design tokens

All colors, radii, and fonts live in `src/index.css` under the Tailwind v4
`@theme` block — change them once, everywhere updates:

| Token | Value |
|---|---|
| Background | `#050505` |
| Glass | `rgba(255,255,255,0.08)` |
| Border | `rgba(255,255,255,0.12)` |
| Accent | `#6EA8FF` |
| Radius | `18px` |

Headings use **General Sans** (loaded via Fontshare in `index.html` — swap for
your own kit if you have a license), body copy uses **Inter**, and all numbers
(stats, dates, counters) use **JetBrains Mono** for a data-forward feel.

## Notes on scope

- The hero background is a placeholder gradient — drop your photo into
  `Hero.tsx`'s `HERO_IMAGE` constant once you have it.
- Weather on the journey page was marked optional in the brief and isn't
  wired up; it would slot into `Journey.tsx` next to the stats grid via any
  weather API of your choice.
- The map's dark basemap defaults to Stadia's free `alidade_smooth_dark`
  style; set `VITE_MAP_STYLE_URL` to your own MapTiler/Stadia style for
  production traffic levels.
