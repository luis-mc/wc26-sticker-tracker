/* ==================================================================
   PANINI · BLUEY — FUNNY YUMMY! — 192
   The first album here whose publisher never released a section
   breakdown, so the checklist is tracked as plain numbered pages.

   Verified: the checklist runs 1–181 with no gap, plus eleven
   separately-lettered specials X1–X11 (X1–X10 figured, X11 foil) —
   181 + 11 = 192, the total published by both laststicker.com and
   Stickers.app for *Funny Yummy!* specifically.
   Ranges: laststicker.com full checklist (Sept 2026).

   Panini has three Bluey albums that all total 192 — Bluey (2024),
   Play with Friends! (2025) and this one — so a bare "192" from any
   source proves nothing on its own; both sources above name this
   album by title.
   ================================================================== */

import { numberedPages } from "./build.js";

export default {
  id: "panini-bluey-funny-yummy",
  publisher: "Panini",
  title: "Bluey — Funny Yummy!",
  shortTitle: "BLUEY",
  slug: "bluey2026",
  kicker: "FUNNY YUMMY!",
  tagline: "181 stickers plus eleven X specials.",
  year: 2026,
  sport: "tv",
  category: "Movies & TV",
  total: 192,
  status: "numbered",
  note: "Panini publishes no section breakdown for this album, so stickers are grouped into pages of 25 and tracked by number.",
  hasMeta: false,
  vocab: { unit: "Page", unitPlural: "Pages", section: "Section",
           sectionPlural: "Sections", meta: "Section" },
  displayOrder: ["NUM", "X"],
  sections: [
    {
      id: "NUM", label: "Album", short: "ALBUM", color: "--sky", c1: "#5080D0",
      units: numberedPages(1, 181),
    },
    {
      id: "X", label: "X specials", short: "★ X SPECIALS", color: "--gold",
      special: true, c1: "#C9982F",
      units: [{
        code: "XSP", name: "X specials",
        stickers: Array.from({ length: 11 }, (_, i) =>
          [`X${i + 1}`, `Special X${i + 1}`, i === 10 ? { foil: true } : {}]),
      }],
    },
  ],
};
