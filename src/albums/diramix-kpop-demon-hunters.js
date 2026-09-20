/* ==================================================================
   DIRAMIX · K-POP DEMON HUNTERS — 196
   No section breakdown is published, so the album is tracked as
   numbered pages: 190 numbered stickers plus six lettered specials.

   Verified: the checklist runs 1–190 with no gap, plus A–F = 196 —
   the total published by both laststicker.com and Stickers.app.
   Ranges: laststicker.com full checklist (Sept 2026).
   ================================================================== */

import { numberedPages } from "./build.js";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export default {
  id: "diramix-kpop-demon-hunters",
  publisher: "Diramix",
  title: "K-Pop Demon Hunters",
  shortTitle: "DEMON HUNTERS",
  slug: "kpopdh2026",
  kicker: "STICKER ALBUM",
  tagline: "190 stickers plus six lettered specials.",
  year: 2026,
  sport: "tv",
  category: "Movies & TV",
  total: 196,
  status: "numbered",
  note: "Diramix publishes no section breakdown, so stickers are grouped into pages of 25 and tracked by number.",
  hasMeta: false,
  vocab: { unit: "Page", unitPlural: "Pages", section: "Section",
           sectionPlural: "Sections", meta: "Section" },
  displayOrder: ["NUM", "X"],
  sections: [
    { id: "NUM", label: "Album", short: "ALBUM", color: "--p6", c1: "#8B5CC7",
      units: numberedPages(1, 190) },
    { id: "X", label: "Lettered specials", short: "★ SPECIALS", color: "--gold",
      special: true, c1: "#C9982F",
      units: [{ code: "LTR", name: "Lettered specials",
        stickers: LETTERS.map(c => [c, "Special " + c]) }] },
  ],
};
