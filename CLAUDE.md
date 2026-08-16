# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Production build → dist/
npm run preview   # Serve the dist/ build locally
firebase deploy   # Deploy to Firebase Hosting (requires firebase-tools)
```

There is no test suite and no linter configured.

## Environment setup

Copy `.env.example` to `.env.local` and fill in Firebase project values (API key, auth domain, project ID, etc.) from Firebase Console → Project Settings → Your Apps → Web app config.

## Architecture

This is a React 18 + Vite SPA with a single source file: **`src/App.jsx`** contains all components, sticker data, and Firestore helpers. `src/firebase.js` initialises Firebase and exports Auth/Firestore primitives.

### Sticker data

All 980 stickers are defined as constants near the top of `App.jsx`:
- `INTRO` (9 foils), `MUSEUM` (11 foils): special stickers
- `TD`: array of 48 team entries `[code, name, group, conf, flag, c1, c2, [18 player names]]`
- `ALL`: flat array of 980 sticker objects built from the above, each with `id`, `n` (global number 1–980), `slot` (1–20 within team), `kind` (`emblem`/`squad`/`player`/`special`), `foil`, and colour fields

Per-team sticker slots: #1 = Team Logo (foil), #2–12 = Players, #13 = Team Photo, #14–20 = Players. Player index mapping: `slot ≤ 12 → players[slot-2]`, `slot ≥ 14 → players[slot-3]`.

### Firestore schema

- **Private** `/users/{uid}/data/{key}` — wraps value in `{ v: ... }`. Keys: `"profile"`, `"collection"`, `"share_prefs"`, `"friends"`
- **Public** `/public/user:{handle}` — stores the serialised shared snapshot (owned/missing/dupes lists, counts, prefs)

The `load(k, sh)` / `save(k, v, sh)` helpers in `App.jsx` abstract all Firestore access. `sh=true` routes to the public collection.

### App phases

Auth state drives a `phase` variable: `"loading"` → `"auth"` (Google sign-in) → `"setup"` (choose handle, first-time only) → `"app"` (main UI).

Collection changes auto-save to Firestore with a 700 ms debounce (also republishes the public snapshot via `pub()`).

### Styling

No CSS files or Tailwind. Styles live in two places:
- `<Css>` component: injects a `<style>` tag for global rules, slot/foil CSS, animations, and scrollbar styles
- `S` object at the bottom of `App.jsx`: inline style objects referenced as `style={S.foo}`

CSS custom properties (defined in `:root` inside `<Css>`) drive the dark green WC26 colour palette: `--gold`, `--grass`, `--need`, `--sky`, `--ink`, `--surface`, `--line`, `--text`, `--muted`.
