/* ==================================================================
   PANINI (GREECE) · SUPER LEAGUE GREECE 2025-2026 — 470 stickers
   14 clubs at 30 stickers each (420), the introduction and season
   highlights, the Elite foils, Star Signings and Super League III.

   Verified: 2 + 10 + 420 + 18 + 18 + 2 = 470, numbering contiguous
   1–470. Ranges: Football Cartophilic Info Exchange (Aug 2026).
   ================================================================== */

/* [code, club, first number, primary colour] — 30 stickers each */
const CLUBS = [
  ["AEK", "AEK",                 13, "#FFD100"],
  ["LAR", "AE Larisa",           43, "#E4002B"],
  ["ARI", "Aris",                73, "#FFD100"],
  ["AST", "Asteras Aktor",      103, "#FFD100"],
  ["ATR", "Atromitos Athens",   133, "#0057B8"],
  ["VOL", "NPS Volos",          163, "#0057B8"],
  ["KIF", "AE Kifisias",        193, "#009EE0"],
  ["LEV", "Levadiakos",         241, "#00A04A"],
  ["OLY", "Olympiacos",         271, "#E4002B"],
  ["OFI", "OFI Crete",          301, "#000000"],
  ["PAO", "Panathinaikos",      331, "#00A04A"],
  ["PAN", "Panetolikos",        361, "#00A04A"],
  ["PSE", "Panserraikos",       391, "#8A1538"],
  ["PAK", "PAOK",               421, "#000000"],
];

export default {
  id: "panini-superleague-greece-2025-26",
  publisher: "Panini",
  title: "Super League Greece 2025-26",
  shortTitle: "SUPER LEAGUE GR",
  slug: "greece2526",
  kicker: "SUPER LEAGUE · GREECE",
  tagline: "470 stickers across 14 clubs.",
  year: 2026,
  sport: "football",
  category: "Football",
  total: 470,
  status: "numbered",
  note: "Club pages and subsets from the published checklist; player names aren't included.",
  hasMeta: false,
  vocab: { unit: "Club", unitPlural: "Clubs", section: "Section",
           sectionPlural: "Sections", meta: "Section" },
  displayOrder: ["CLUB", "★"],
  sections: [
    {
      id: "CLUB", label: "Super League", short: "SUPER LEAGUE", color: "--p2",
      units: CLUBS.map(([code, name, from, c1]) => ({ code, name, from, to: from + 29, c1 })),
    },
    {
      id: "★", label: "Specials", short: "★ SPECIALS", color: "--gold", special: true,
      c1: "#C9982F",
      units: [
        { code: "ITR", name: "Introduction",        from: 1,   to: 2 },
        { code: "HIG", name: "2024-25 Highlights",  from: 3,   to: 12 },
        { code: "ELI", name: "Elite",               from: 223, to: 240, foil: true },
        { code: "STA", name: "Star Signings",       from: 451, to: 468 },
        { code: "SL3", name: "Super League III",    from: 469, to: 470 },
      ],
    },
  ],
};
