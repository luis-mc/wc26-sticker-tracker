/* ==================================================================
   PLUS · EREDIVISIE 2025/26 — 292
   Not a Panini or Topps product: a Dutch supermarket collection, run
   by PLUS with Eredivisie CV, and the league's first sticker album in
   five years. Eighteen clubs, sixteen stickers each — the club logo
   and fifteen players — plus four XXL limited editions.

   Verified: 18 × 16 = 288, contiguous 1–288, plus XXL1–XXL4 = 292.
   PLUS and Eredivisie.nl both publish the same composition: "288
   stickers, 1 logo and 15 players per club, plus 4 XXL Limited
   Editions".
   Ranges: laststicker.com full checklist (Sept 2026).
   ================================================================== */

/* [code, club, colour] — 16 stickers each, in checklist order */
const CLUBS = [
  ["AJA", "Ajax",                  "#D2122E"],
  ["AZA", "AZ Alkmaar",            "#D4111F"],
  ["EXC", "Excelsior Rotterdam",   "#B01B22"],
  ["GRO", "FC Groningen",          "#00A54F"],
  ["TWE", "FC Twente",             "#D0202A"],
  ["UTR", "FC Utrecht",            "#B8232F"],
  ["VOL", "FC Volendam",           "#E95A0C"],
  ["FEY", "Feyenoord",             "#DB0A13"],
  ["FOR", "Fortuna Sittard",       "#F7C600"],
  ["GAE", "Go Ahead Eagles",       "#CE1126"],
  ["HER", "Heracles Almelo",       "#4A4A4A"],
  ["NEC", "NEC Nijmegen",          "#C5192D"],
  ["NAC", "NAC Breda",             "#E8B000"],
  ["PEC", "PEC Zwolle",            "#1560BD"],
  ["PSV", "PSV Eindhoven",         "#ED1C24"],
  ["HEE", "SC Heerenveen",         "#1B4FA0"],
  ["SPA", "Sparta Rotterdam",      "#A81E28"],
  ["TEL", "Telstar",               "#6A6A6A"],
];

export default {
  id: "plus-eredivisie-2025-26",
  publisher: "PLUS",
  title: "Eredivisie 2025/26",
  shortTitle: "EREDIVISIE",
  slug: "eredivisie2526",
  kicker: "EREDIVISIE · NETHERLANDS",
  tagline: "292 stickers across 18 clubs.",
  year: 2026,
  sport: "football",
  category: "Football",
  total: 292,
  status: "numbered",
  note: "A PLUS supermarket collection, not a newsstand album. Club pages from the published checklist; player names aren't included.",
  hasMeta: false,
  vocab: { unit: "Club", unitPlural: "Clubs", section: "Section",
           sectionPlural: "Sections", meta: "Section" },
  displayOrder: ["ERE", "XXL"],
  sections: [
    {
      id: "ERE", label: "Eredivisie", short: "EREDIVISIE", color: "--grass",
      units: CLUBS.map(([code, name, c1], i) =>
        ({ code, name, c1, from: 1 + i * 16, to: 16 + i * 16 })),
    },
    {
      id: "XXL", label: "XXL stickers", short: "★ XXL", color: "--gold",
      special: true, c1: "#C9982F",
      units: [{ code: "XXL", name: "XXL stickers",
        stickers: Array.from({ length: 4 }, (_, i) => ["XXL" + (i + 1), "XXL sticker " + (i + 1)]) }],
    },
  ],
};
