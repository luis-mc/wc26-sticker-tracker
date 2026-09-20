/* ==================================================================
   PANINI · CALCIATRICI 2025/26 — 351
   The women's companion to Calciatori. Twelve Serie A clubs at 23
   stickers each, then Serie B, the four Serie C gironi and the
   Azzurre national-team run — and one coded squad sticker per club,
   R01–R12, which sits outside the numbering.

   Verified: 4 intro + (12 × 23) + 21 Serie B + (4 × 3) Serie C +
   26 Azzurre = 339, contiguous 1–339, plus R01–R12 = 351 — the total
   published by both laststicker.com and Stickers.app.
   Ranges: laststicker.com full checklist (Sept 2026).
   ================================================================== */

/* [code, club, first number, colour] — 23 stickers each */
const SERIE_A = [
  ["COM", "Como Women",     5, "#1B4FA0"],
  ["FIO", "Fiorentina",    28, "#592C82"],
  ["GEN", "Genoa",         51, "#B01B22"],
  ["INT", "Inter",         74, "#0B1F5C"],
  ["JUV", "Juventus",      97, "#333333"],
  ["LAZ", "Lazio Women",  120, "#6CACE4"],
  ["MIL", "Milan",        143, "#D0202A"],
  ["NAP", "Napoli Women", 166, "#12A0D7"],
  ["PAR", "Parma",        189, "#F7C600"],
  ["ROM", "Roma",         212, "#8E1F2F"],
  ["SAS", "Sassuolo",     235, "#00A65E"],
  ["TER", "Ternana Women", 258, "#4B9B4B"],
];

export default {
  id: "panini-calciatrici-2025-26",
  publisher: "Panini",
  title: "Calciatrici 2025/26",
  shortTitle: "CALCIATRICI",
  slug: "calciatrici2526",
  kicker: "SERIE A FEMMINILE · ITALY",
  tagline: "351 stickers across all three divisions.",
  year: 2026,
  sport: "football",
  category: "Football",
  total: 351,
  status: "numbered",
  note: "Club pages and subsets from the published checklist; player names aren't included. R01–R12 are the coded squad stickers.",
  hasMeta: false,
  vocab: { unit: "Club", unitPlural: "Clubs", section: "Section",
           sectionPlural: "Sections", meta: "Section" },
  displayOrder: ["★", "SA", "ROS"],
  sections: [
    // Ranges first and in ascending order — Serie A ends at 280, the
    // feature ranges end at 339 — so the coded R stickers follow at 340.
    {
      id: "SA", label: "Serie A Femminile", short: "SERIE A", color: "--grass",
      units: SERIE_A.map(([code, name, from, c1]) => ({ code, name, c1, from, to: from + 22 })),
    },
    {
      id: "★", label: "Features", short: "★ FEATURES", color: "--gold", special: true,
      c1: "#C9982F",
      units: [
        { code: "ITR", name: "Introduction",        from: 1,   to: 4   },
        { code: "SEB", name: "Serie B Femminile",   from: 281, to: 301 },
        { code: "SCA", name: "Serie C · Girone A",  from: 302, to: 304 },
        { code: "SCB", name: "Serie C · Girone B",  from: 305, to: 307 },
        { code: "SCC", name: "Serie C · Girone C",  from: 308, to: 310 },
        { code: "SCD", name: "Serie C · Girone D",  from: 311, to: 313 },
        { code: "AZZ", name: "Azzurre",             from: 314, to: 339 },
      ],
    },
    {
      id: "ROS", label: "Rose", short: "★ ROSE", color: "--gold", special: true,
      c1: "#C9982F",
      units: [{ code: "ROS", name: "Rose",
        stickers: SERIE_A.map(([, name], i) =>
          ["R" + String(i + 1).padStart(2, "0"), "Rosa — " + name]) }],
    },
  ],
};
