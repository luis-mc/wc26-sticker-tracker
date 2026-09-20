/* ==================================================================
   PANINI · STRANGER THINGS — ONE LAST STRANGE ADVENTURE — 211
   192 numbered stickers plus three separately-coded runs: six Limited
   Editions, five Maxi stickers and eight posters. No section
   breakdown is published for the numbered part.

   Verified: the checklist runs 1–192 with no gap, plus LE1–LE6,
   MS1–MS5 and P1–P8 = 211 — the total published by both
   laststicker.com and Stickers.app.
   Ranges: laststicker.com full checklist (Sept 2026).
   ================================================================== */

import { numberedPages } from "./build.js";

const coded = (prefix, count, label) =>
  Array.from({ length: count }, (_, i) => [prefix + (i + 1), label + " " + (i + 1)]);

export default {
  id: "panini-stranger-things-2025",
  publisher: "Panini",
  title: "Stranger Things — One Last Strange Adventure",
  shortTitle: "STRANGER THINGS",
  slug: "strangerthings2025",
  kicker: "ONE LAST STRANGE ADVENTURE",
  tagline: "192 stickers plus Limited Edition, Maxi and poster runs.",
  year: 2025,
  sport: "tv",
  category: "Movies & TV",
  total: 211,
  status: "numbered",
  note: "Panini publishes no section breakdown, so stickers are grouped into pages of 25 and tracked by number.",
  hasMeta: false,
  vocab: { unit: "Page", unitPlural: "Pages", section: "Section",
           sectionPlural: "Sections", meta: "Section" },
  displayOrder: ["NUM", "X"],
  sections: [
    { id: "NUM", label: "Album", short: "ALBUM", color: "--need", c1: "#B3202A",
      units: numberedPages(1, 192) },
    { id: "X", label: "Specials", short: "★ SPECIALS", color: "--gold",
      special: true, c1: "#C9982F",
      units: [
        { code: "LED", name: "Limited Edition", foil: true, stickers: coded("LE", 6, "Limited Edition") },
        { code: "MAX", name: "Maxi stickers",   stickers: coded("MS", 5, "Maxi sticker") },
        { code: "POS", name: "Posters",         stickers: coded("P", 8, "Poster") },
      ] },
  ],
};
