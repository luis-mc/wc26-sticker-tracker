/* ==================================================================
   PANINI · ADMIRAL BUNDESLIGA ÖSTERREICH 2025/26 — 399
   Twelve Bundesliga clubs at 26 stickers each, all sixteen 2. Liga
   clubs at four each, and two opening runs.

   Verified: 3 + 20 + (12 × 26) + (16 × 4) = 399, contiguous 1–399 —
   and 399 is exactly the figure Panini publishes for the collection
   ("399 Sticker, davon 40 Spezialsticker").

   laststicker.com lists 447. The extra 48 are the C-series — C1/C1a
   through C24/C24a, four per Bundesliga club — which Panini does not
   count in the album, so they are treated as chase stickers and left
   out here, the same call the Milano Cortina spec makes for LE1–LE2.
   Ranges: laststicker.com full checklist (Sept 2026).
   ================================================================== */

/* [code, club, colour] — 26 stickers each, from 24 */
const BUNDESLIGA = [
  ["STU", "SK Sturm Graz",        "#3A3A3A"],
  ["SAL", "FC Red Bull Salzburg", "#D0202A"],
  ["AUW", "FK Austria Wien",      "#6B2D8B"],
  ["WAC", "Wolfsberger AC",       "#4F4F4F"],
  ["RAP", "SK Rapid Wien",        "#00A54F"],
  ["BWL", "FC Blau Weiss Linz",   "#1560BD"],
  ["LAS", "LASK",                 "#555555"],
  ["HAR", "TSV Hartberg",         "#1B4FA0"],
  ["WSG", "WSG Tirol",            "#0F8E4F"],
  ["GAK", "Grazer AK 1902",       "#B01B22"],
  ["ALT", "SCR Altach",           "#C5192D"],
  ["RIE", "SV Ried",              "#0B7A3C"],
];

/* [code, club] — 4 stickers each, from 336 */
const LIGA_2 = [
  ["KLA", "SK Austria Klagenfurt"],
  ["ADM", "Admira Wacker"],
  ["KSV", "KSV 1919"],
  ["STP", "SKN St. Pölten"],
  ["VIE", "First Vienna FC"],
  ["LIE", "FC Liefering"],
  ["AMS", "SKU Amstetten"],
  ["SG2", "Sturm Graz II"],
  ["FAC", "FAC Wien"],
  ["BRE", "Schwarz-Weiss Bregenz"],
  ["RA2", "SK Rapid II"],
  ["LUS", "SC Austria Lustenau"],
  ["STR", "SV Stripfing"],
  ["YVA", "Young Violets Austria Wien"],
  ["ASA", "SV Austria Salzburg"],
  ["WEL", "FC Hertha Wels"],
];

export default {
  id: "panini-bundesliga-osterreich-2025-26",
  publisher: "Panini",
  title: "Admiral Bundesliga Österreich 2025/26",
  shortTitle: "ÖSTERREICH",
  slug: "austria2526",
  kicker: "BUNDESLIGA · AUSTRIA",
  tagline: "399 stickers across both divisions.",
  year: 2026,
  sport: "football",
  category: "Football",
  total: 399,
  status: "numbered",
  note: "Club pages from the published checklist; player names aren't included. The C1/C1a chase stickers sit outside Panini's 399 and aren't tracked.",
  hasMeta: true,
  vocab: { unit: "Club", unitPlural: "Clubs", section: "Division",
           sectionPlural: "Divisions", meta: "Division" },
  displayOrder: ["★", "BL", "L2"],
  sections: [
    {
      id: "★", label: "Features", short: "★ FEATURES", color: "--gold", special: true,
      c1: "#C9982F", meta: "Features",
      units: [
        { code: "ITR", name: "Bundesliga 25-26",       from: 1, to: 3  },
        { code: "LSN", name: "Last Season in Numbers", from: 4, to: 23 },
      ],
    },
    {
      id: "BL", label: "Bundesliga", short: "BUNDESLIGA", color: "--grass",
      units: BUNDESLIGA.map(([code, name, c1], i) =>
        ({ code, name, c1, meta: "Bundesliga", from: 24 + i * 26, to: 49 + i * 26 })),
    },
    {
      id: "L2", label: "2. Liga", short: "2. LIGA", color: "--p6",
      units: LIGA_2.map(([code, name], i) =>
        ({ code, name, meta: "2. Liga", from: 336 + i * 4, to: 339 + i * 4 })),
    },
  ],
};
