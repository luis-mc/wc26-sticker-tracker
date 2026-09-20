/* ==================================================================
   PANINI · PEANUTS — A YEAR TO REMEMBER — 286
   260 numbered stickers, sixteen X specials and a ten-sticker Limited
   Edition run. No section breakdown is published.

   Verified: the checklist runs 1–260 with no gap, plus X1–X16 and
   LE1–LE10 = 286 — the total published by both laststicker.com and
   Stickers.app. Unlike the Milano Cortina Limited Editions, these ten
   sit inside the published total, so they are tracked here.
   Ranges: laststicker.com full checklist (Sept 2026).
   ================================================================== */

import { numberedPages } from "./build.js";

export default {
  id: "panini-peanuts-2026",
  publisher: "Panini",
  title: "Peanuts — A Year to Remember",
  shortTitle: "PEANUTS",
  slug: "peanuts2026",
  kicker: "A YEAR TO REMEMBER",
  tagline: "260 stickers plus X and Limited Edition specials.",
  year: 2026,
  sport: "tv",
  category: "Movies & TV",
  total: 286,
  status: "numbered",
  note: "Panini publishes no section breakdown, so stickers are grouped into pages of 25 and tracked by number.",
  hasMeta: false,
  vocab: { unit: "Page", unitPlural: "Pages", section: "Section",
           sectionPlural: "Sections", meta: "Section" },
  displayOrder: ["NUM", "X"],
  sections: [
    { id: "NUM", label: "Album", short: "ALBUM", color: "--sky", c1: "#5080D0",
      units: numberedPages(1, 260) },
    { id: "X", label: "Specials", short: "★ SPECIALS", color: "--gold",
      special: true, c1: "#C9982F",
      units: [
        { code: "XSP", name: "X specials",
          stickers: Array.from({ length: 16 }, (_, i) => ["X" + (i + 1), "Special X" + (i + 1)]) },
        { code: "LED", name: "Limited Edition", foil: true,
          stickers: Array.from({ length: 10 }, (_, i) => ["LE" + (i + 1), "Limited Edition " + (i + 1)]) },
      ] },
  ],
};
