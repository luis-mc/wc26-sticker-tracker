/* ==================================================================
   PANINI · TOY STORY 5 — 192
   180 numbered stickers plus twelve X specials. No section breakdown
   is published. Finishes vary across the album — the checklist marks
   foil, figured and glow-in-the-dark stickers — but not which numbers
   carry which, so no finish is recorded here.

   Verified: the checklist runs 1–180 with no gap, plus X1–X12 = 192 —
   the total published by both laststicker.com and Stickers.app.
   Ranges: laststicker.com full checklist (Sept 2026).
   ================================================================== */

import { numberedPages } from "./build.js";

export default {
  id: "panini-toy-story-5",
  publisher: "Panini",
  title: "Toy Story 5",
  shortTitle: "TOY STORY 5",
  slug: "toystory5",
  kicker: "STICKER ALBUM",
  tagline: "180 stickers plus twelve X specials.",
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
    { id: "NUM", label: "Album", short: "ALBUM", color: "--grass", c1: "#3E8E4F",
      units: numberedPages(1, 180) },
    { id: "X", label: "X specials", short: "★ X SPECIALS", color: "--gold",
      special: true, c1: "#C9982F",
      units: [{ code: "XSP", name: "X specials",
        stickers: Array.from({ length: 12 }, (_, i) => ["X" + (i + 1), "Special X" + (i + 1)]) }] },
  ],
};
