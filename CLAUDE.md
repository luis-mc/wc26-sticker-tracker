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

This is a React 18 + Vite SPA. **`src/App.jsx`** holds every component and the Firestore helpers; **`src/albums/`** holds the sticker data for each album the app can track. `src/firebase.js` initialises Firebase and exports Auth/Firestore primitives.

### Albums

The app tracks several albums from different publishers. Each one is a *spec* file in `src/albums/`, registered in `src/albums/index.js`:

- `build.js` — `buildAlbum(spec)` turns a spec into the runtime shape every screen reads: `stickers`, `byId`, `units`, `sections`, `sectionMeta`, `unitOrder*`, `vocab`, `total`. Also exports `numberedPages()` for albums whose section breakdown isn't published.
- `index.js` — `getAlbum(id)` (lazy + cached), `knownAlbum(id)`, `CATALOG` (metadata for the shelf screen), `DEFAULT_ALBUM_ID`.
- One file per album — currently thirty-eight, across Panini, Topps, Diramix and PLUS (a Dutch supermarket collection).

Every spec declares a `category` (`Football`, `American football`, `Ice hockey`, `Basketball`, `Motorsport`, `Cycling`, `Rugby`, `Olympics`, `Movies & TV`, …). `CATEGORY_ORDER` in `index.js` fixes the shelf order — sports first, then `Movies & TV`, `Games`, `Music`, `Other` — and the "Add an album" browser filters and groups by it. A category a spec invents that isn't in the list still works; it just sorts last under its own heading.

**Never add an album from a sticker count alone.** Published totals disagree between sources (Panini LaLiga Este 2026/27 is quoted as both 494 and "700+"; three different Panini albums total exactly 192 on three different splits), and an album whose ranges don't close leaves collectors with stickers they can't record. An album may only be added when the source gives every section's number range, those ranges cover 1..total with no gap or overlap, and the total reconciles against a second source where one exists.

When two sources disagree, assume a **counting difference before a contradiction** — in practice that is almost always what it is. One side is usually excluding the card set (Libertadores 443 vs 523, Brasileirão 512 vs 610), the chase stickers (Austria 399 vs 447) or the lettered specials, or is counting sticker *numbers* where the other counts *stickers* (Liga F 380 vs 432, because 38 numbers are printed as A/B split pairs). Reconciling the composition is worth more than matching a bare total, and a source that confirms "1 logo + 15 players per club" is stronger evidence than one that just repeats a number. `npm run verify:albums` enforces this — it also runs as `prebuild`, so an album that doesn't check out cannot ship. Record the checklist source in the spec's header comment. `src/albums/CANDIDATES.md` lists the albums that failed this bar and exactly what each one still needs, so the research isn't repeated.

Spec vocabulary is publisher-neutral: a **section** is a band of the album (a World Cup group, "Clubs", "Specials"), a **unit** is one page inside it (a nation, a club, a subset), and a **slot** is the sticker's position in its unit. A unit's stickers are authored one of three ways — `roster` + the album's `slotTemplate` (named team pages), `from`/`to` (numbered checklists), or an explicit `stickers: [[id, label]]` list. `special: true` on a section keeps its units out of "teams completed" counts.

Sticker objects carry `id`, `n` (global number), `slot`, `kind`, `label`, `foil`, colour fields and the pre-computed display strings `fullCode` / `dispCode` / `slotLabel`, so no screen needs to know how a sticker was authored.

Panini WC26 specifics: 9 intro foils + 11 FIFA Museum foils + 48 nations × 20. Per nation: #1 Team Logo (foil), #2–12 players, #13 Team Photo, #14–20 players.

### Album context

`AlbumCtx` / `useAlbum()` in `App.jsx` provide the open album to every screen — components read `A.stickers`, `A.units`, `A.sections`, `A.vocab` rather than any album-specific constant. `openAlbum(id)` swaps the working set and drops the `hydrated` gate while the new collection loads.

### Firestore schema

- **Private** `/users/{uid}/data/{key}` — wraps value in `{ v: ... }`. Keys: `"profile"` (includes `albums[]` + `activeAlbum`), `"collection"`, `"share_prefs"`, `"friends"`
- **Public** `/public/user:{handle}` — identity + album index (`albums: { [albumId]: summary }`)
- **Public** `/public/user:{handle}:{albumId}` — that album's shared lists (owned/missing/dupes, counts, prefs)

Keys are album-scoped through `dataKey(k, albumId)` / `cacheKey(k, albumId)`: the default album (`panini-wc26`) keeps the original unsuffixed keys, so collections saved before multi-album support need no migration. `legacyLists()` reads a friend's pre-multi-album public doc as that album's snapshot.

The `load(k, sh)` / `save(k, v, sh)` helpers abstract all Firestore access; `sh=true` routes to the public collection. `publishPublic(docId, snapshot)` takes a full public doc id.

### App phases

Auth state drives a `phase` variable: `"loading"` → `"auth"` (email + password) → `"verify"` (email verification) → `"setup"` (choose handle, first-time only) → `"app"` (main UI).

Collection changes auto-save to Firestore with a 700 ms debounce (also republishing the album snapshot and the identity index).

### Styling

No CSS files or Tailwind. Styles live in two places:
- `<Css>` component: injects a `<style>` tag for global rules, slot/foil CSS, animations, and scrollbar styles
- `S` object at the bottom of `App.jsx`: inline style objects referenced as `style={S.foo}`

CSS custom properties (defined in `:root` inside `<Css>`) drive the dark green WC26 colour palette: `--gold`, `--grass`, `--need`, `--sky`, `--ink`, `--surface`, `--line`, `--text`, `--muted`.
