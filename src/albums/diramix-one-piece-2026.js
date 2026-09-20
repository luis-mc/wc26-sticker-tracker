/* ==================================================================
   DIRAMIX · ONE PIECE — 185
   A flat numbered album: no sections, no lettered specials, nothing
   but 1–185.

   Verified: the checklist runs 1–185 with no gap and holds no coded
   stickers at all; 185 is also the total Stickers.app publishes. The
   old "185 or 200?" disagreement is settled — 185 is the album.
   Ranges: laststicker.com full checklist (Sept 2026).
   ================================================================== */

import { numberedPages } from "./build.js";

export default {
  id: "diramix-one-piece-2026",
  publisher: "Diramix",
  title: "One Piece",
  shortTitle: "ONE PIECE",
  slug: "onepiece2026",
  kicker: "STICKER ALBUM",
  tagline: "185 stickers, numbered straight through.",
  year: 2026,
  sport: "tv",
  category: "Movies & TV",
  total: 185,
  status: "numbered",
  note: "Diramix publishes no section breakdown, so stickers are grouped into pages of 25 and tracked by number.",
  hasMeta: false,
  vocab: { unit: "Page", unitPlural: "Pages", section: "Section",
           sectionPlural: "Sections", meta: "Section" },
  displayOrder: ["NUM"],
  sections: [
    { id: "NUM", label: "Album", short: "ALBUM", color: "--need", c1: "#C0432F",
      units: numberedPages(1, 185) },
  ],
};
