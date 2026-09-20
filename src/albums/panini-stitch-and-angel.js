/* ==================================================================
   PANINI · STITCH & ANGEL — 192
   165 numbered stickers plus an unusually large X run of 27. No
   section breakdown is published; the checklist marks rainbow and
   shiny finishes without saying which numbers carry them.

   Verified: the checklist runs 1–165 with no gap, plus X1–X27 = 192 —
   the total published by both laststicker.com and Stickers.app. Note
   that Toy Story 5 also totals 192 on a different split (180 + 12),
   so the totals alone never told these two apart.
   Ranges: laststicker.com full checklist (Sept 2026).
   ================================================================== */

import { numberedPages } from "./build.js";

export default {
  id: "panini-stitch-and-angel",
  publisher: "Panini",
  title: "Stitch & Angel",
  shortTitle: "STITCH & ANGEL",
  slug: "stitchangel2026",
  kicker: "STICKER ALBUM",
  tagline: "165 stickers plus twenty-seven X specials.",
  year: 2026,
  sport: "tv",
  category: "Movies & TV",
  total: 192,
  status: "numbered",
  note: "Panini publishes no section breakdown, so stickers are grouped into pages of 25 and tracked by number.",
  hasMeta: false,
  vocab: { unit: "Page", unitPlural: "Pages", section: "Section",
           sectionPlural: "Sections", meta: "Section" },
  displayOrder: ["NUM", "X"],
  sections: [
    { id: "NUM", label: "Album", short: "ALBUM", color: "--p2", c1: "#3F7FD0",
      units: numberedPages(1, 165) },
    { id: "X", label: "X specials", short: "★ X SPECIALS", color: "--gold",
      special: true, c1: "#C9982F",
      units: [{ code: "XSP", name: "X specials",
        stickers: Array.from({ length: 27 }, (_, i) => ["X" + (i + 1), "Special X" + (i + 1)]) }] },
  ],
};
