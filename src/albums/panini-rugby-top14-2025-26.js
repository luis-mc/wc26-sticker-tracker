/* ==================================================================
   PANINI · RUGBY TOP 14 2025/26 — 336
   The first rugby album on the shelf. Fourteen clubs at 22 stickers
   each, the Brennus shield to open, the France XV tribute dropped in
   at 156, and three refereeing stickers to close.

   Verified: 1 + (14 × 22) + 24 Héritiers + 3 Arbitrage = 336,
   contiguous 1–336 with no coded stickers. Panini France publishes
   "336 stickers, dont 98 spéciaux" for a 64-page album and describes
   "4 pages et 24 stickers consacrés aux héritiers du XV de France" —
   which is exactly the 156–179 block.
   Ranges: laststicker.com full checklist (Sept 2026).
   ================================================================== */

/* [code, club, first number, colour] — 22 stickers each */
const CLUBS = [
  ["ASM", "ASM Clermont Auvergne",       2, "#F7C600"],
  ["BAY", "Aviron Bayonnais",           24, "#16428C"],
  ["CAS", "Castres Olympique",          46, "#1B4FA0"],
  ["LOU", "LOU Rugby",                  68, "#B01B22"],
  ["MHR", "Montpellier Hérault Rugby", 90, "#1D74C0"],
  ["RCT", "Rugby Club Toulonnais",     112, "#D0202A"],
  ["R92", "Racing 92",                 134, "#6CACE4"],
  ["SPB", "Section Paloise",           180, "#00A54F"],
  ["SFP", "Stade Français Paris",     202, "#E75480"],
  ["SRO", "Stade Rochelais",           224, "#E8B000"],
  ["STO", "Stade Toulousain",          246, "#C5192D"],
  ["USP", "USA Perpignan",             268, "#A81E28"],
  ["SAP", "USM Sapiac",                290, "#0F8E4F"],
  ["UBB", "Union Bordeaux-Bègles",    312, "#0B57A4"],
];

export default {
  id: "panini-rugby-top14-2025-26",
  publisher: "Panini",
  title: "Rugby Top 14 2025/26",
  shortTitle: "TOP 14",
  slug: "top14rugby2526",
  kicker: "TOP 14 · FRANCE",
  tagline: "336 stickers across the fourteen clubs.",
  year: 2026,
  sport: "rugby",
  category: "Rugby",
  total: 336,
  status: "numbered",
  note: "Club pages and subsets from the published checklist; player names aren't included.",
  hasMeta: false,
  vocab: { unit: "Club", unitPlural: "Clubs", section: "Section",
           sectionPlural: "Sections", meta: "Section" },
  displayOrder: ["★", "T14"],
  sections: [
    {
      id: "★", label: "Features", short: "★ FEATURES", color: "--gold", special: true,
      c1: "#C9982F",
      units: [
        { code: "BRE", name: "Bouclier Brennus",              from: 1,   to: 1   },
        { code: "HER", name: "Les Héritiers du XV de France", from: 156, to: 179 },
        { code: "ARB", name: "Arbitrage",                      from: 334, to: 336 },
      ],
    },
    {
      id: "T14", label: "Top 14", short: "TOP 14", color: "--grass",
      units: CLUBS.map(([code, name, from, c1]) => ({ code, name, c1, from, to: from + 21 })),
    },
  ],
};
