/* ==================================================================
   TOPPS · FORMULA 1 2025 — 156
   The Diamond Anniversary edition of Topps' F1 collection, and the
   first motorsport album on the shelf. A 40-page album with no
   published section breakdown, so it is tracked as numbered pages.

   Verified: the checklist runs 1–156 with no gap and holds no coded
   stickers. Topps publish "all 156 stickers, including 36 foil
   stickers and 10 kiss-cut car stickers" for the 40-page album.
   Which numbers are foil or kiss-cut is not published, so no finish
   is recorded here.
   Ranges: laststicker.com full checklist (Sept 2026).
   ================================================================== */

import { numberedPages } from "./build.js";

export default {
  id: "topps-formula-1-2025",
  publisher: "Topps",
  title: "Formula 1 2025",
  shortTitle: "FORMULA 1",
  slug: "formula1-2025",
  kicker: "DIAMOND ANNIVERSARY",
  tagline: "156 stickers, numbered straight through.",
  year: 2025,
  sport: "motorsport",
  category: "Motorsport",
  total: 156,
  status: "numbered",
  note: "Topps publishes no section breakdown, so stickers are grouped into pages of 25 and tracked by number.",
  hasMeta: false,
  vocab: { unit: "Page", unitPlural: "Pages", section: "Section",
           sectionPlural: "Sections", meta: "Section" },
  displayOrder: ["NUM"],
  sections: [
    { id: "NUM", label: "Album", short: "ALBUM", color: "--need", c1: "#C0392B",
      units: numberedPages(1, 156) },
  ],
};
