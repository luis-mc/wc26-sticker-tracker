/* ==================================================================
   ALBUM REGISTRY
   Every album the app can track lives here. Adding one is a single
   spec file plus a line in SPECS — no changes anywhere else.

   Specs are built lazily (and cached) because a full album is a few
   hundred objects; the catalogue screen only needs the metadata that
   sits on the spec itself.
   ================================================================== */

import { buildAlbum } from "./build.js";
import paniniWc26 from "./panini-wc26.js";
import paniniFifa365 from "./panini-fifa365-2026.js";
import paniniCalciatori from "./panini-calciatori-2025-26.js";
import paniniSerieBkt from "./panini-calciatori-serie-bkt-2025-26.js";
import paniniEfl from "./panini-efl-2025-26.js";
import paniniFutebol from "./panini-futebol-2025-26.js";
import paniniHypermotion from "./panini-laliga-hypermotion-2025-26.js";
import paniniGreece from "./panini-superleague-greece-2025-26.js";
import paniniLigue1 from "./panini-foot-ligue1-2025-26.js";
import toppsPl2026 from "./topps-premier-league-2026.js";
import toppsUcl2526 from "./topps-ucl-2025-26.js";
import toppsNhl2526 from "./topps-nhl-2025-26.js";
import paniniNfl2025 from "./panini-nfl-2025.js";
import paniniNba2425 from "./panini-nba-2024-25.js";
import paniniMilanoCortina from "./panini-milano-cortina-2026.js";
import toppsBundesliga from "./topps-bundesliga-2025-26.js";

export const DEFAULT_ALBUM_ID = paniniWc26.id;

const SPECS = Object.fromEntries([
  paniniWc26,
  paniniFifa365,
  paniniCalciatori,
  paniniSerieBkt,
  paniniEfl,
  paniniFutebol,
  paniniHypermotion,
  paniniGreece,
  paniniLigue1,
  toppsPl2026,
  toppsUcl2526,
  toppsNhl2526,
  paniniNfl2025,
  paniniNba2425,
  paniniMilanoCortina,
  toppsBundesliga,
].map(s => [s.id, s]));

const built = {};

export function getAlbum(id) {
  const spec = SPECS[id] || SPECS[DEFAULT_ALBUM_ID];
  return (built[spec.id] ||= buildAlbum(spec));
}

export const knownAlbum = id => !!SPECS[id];

/* Metadata for the "add an album" browser — no build required.
   `status` tells the collector how solid the checklist is:
     official    — every sticker named from the published checklist
     numbered    — correct size and sections, stickers tracked by number
     provisional — announced product, checklist not finalised yet     */
/* Shelf grouping. Sports first, then everything else; anything a spec
   invents that isn't listed here sorts to the end under its own heading. */
export const CATEGORY_ORDER = [
  "Football", "American football", "Ice hockey", "Basketball", "Baseball",
  "Motorsport", "Cycling", "Rugby", "Cricket", "Olympics", "Other sport",
  "Movies & TV", "Games", "Music", "Other",
];
const catRank = c => { const i = CATEGORY_ORDER.indexOf(c); return i === -1 ? CATEGORY_ORDER.length : i; };

export const CATALOG = Object.values(SPECS).map(s => ({
  id: s.id,
  publisher: s.publisher,
  title: s.title,
  shortTitle: s.shortTitle || s.title,
  kicker: s.kicker || "",
  tagline: s.tagline || "",
  year: s.year,
  sport: s.sport || "football",
  category: s.category || "Other",
  total: s.total ?? null,
  status: s.status || "official",
  note: s.note || "",
})).sort((a, b) => catRank(a.category) - catRank(b.category)
               || a.publisher.localeCompare(b.publisher)
               || a.title.localeCompare(b.title));

export const PUBLISHERS = [...new Set(CATALOG.map(a => a.publisher))].sort();
// Categories that actually have albums, in shelf order.
export const CATEGORIES = [...new Set(CATALOG.map(a => a.category))].sort((a, b) => catRank(a) - catRank(b));
