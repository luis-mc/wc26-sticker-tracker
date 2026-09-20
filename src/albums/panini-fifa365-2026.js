/* ==================================================================
   PANINI · FIFA 365 2026 — THE GOLDEN WORLD OF FOOTBALL — 524
   22 clubs at 18 stickers each (396), plus nine feature sections
   (128): intro, the 2025 Club World Cup, the WC26 host-city posters,
   five "Head to Head" spreads and the Elite foils.

   Verified: 396 + 128 = 524, numbering contiguous 1–524.
   Ranges: Football Cartophilic Info Exchange (Nov 2025).
   Regional editions (e.g. the Balkan version) add extra centre pages
   that are not part of this numbering.
   ================================================================== */

/* [code, club, first number, primary colour] — 18 stickers each */
const CLUBS = [
  ["BOT", "Botafogo FR",                   45, "#000000"],
  ["AHL", "Al Ahly SC",                    63, "#C8102E"],
  ["LIV", "Liverpool",                     81, "#C8102E"],
  ["MON", "AS Monaco",                     99, "#CE2044"],
  ["OM",  "Olympique de Marseille",       117, "#2FAEE0"],
  ["PSG", "Paris Saint-Germain",          153, "#004170"],
  ["B04", "Bayer 04 Leverkusen",          171, "#E32221"],
  ["SGE", "Eintracht Frankfurt",          189, "#E1000F"],
  ["OLY", "FC Olympiacos",                207, "#D6001C"],
  ["ATA", "Atalanta BC",                  225, "#1D71B8"],
  ["INT", "FC Internazionale Milano",     261, "#0068A8"],
  ["ACM", "AC Milan",                     279, "#FB090B"],
  ["AME", "Club América",            297, "#FFE600"],
  ["AJA", "AFC Ajax",                     315, "#D2122E"],
  ["PSV", "PSV Eindhoven",                333, "#E4002B"],
  ["SLB", "SL Benfica",                   369, "#E31B23"],
  ["POR", "FC Porto",                     387, "#00428C"],
  ["SCP", "Sporting Club de Portugal",    405, "#008057"],
  ["NAS", "Al-Nassr FC",                  423, "#FFD700"],
  ["ATM", "Atlético de Madrid",      441, "#CB3524"],
  ["FCB", "FC Barcelona",                 477, "#A50044"],
  ["RMA", "Real Madrid CF",               495, "#FEBE10"],
];

export default {
  id: "panini-fifa365-2026",
  publisher: "Panini",
  title: "FIFA 365 2026",
  shortTitle: "FIFA 365 '26",
  slug: "fifa365-26",
  kicker: "THE GOLDEN WORLD OF FOOTBALL",
  tagline: "524 stickers across 22 clubs.",
  year: 2026,
  sport: "football",
  category: "Football",
  total: 524,
  status: "numbered",
  note: "Club pages and feature sections from the published checklist; player names aren't included.",
  hasMeta: false,
  vocab: { unit: "Club", unitPlural: "Clubs", section: "Section",
           sectionPlural: "Sections", meta: "Section" },
  displayOrder: ["CLUB", "★"],
  sections: [
    {
      id: "CLUB", label: "Clubs", short: "CLUBS", color: "--p1",
      units: CLUBS.map(([code, name, from, c1]) => ({ code, name, from, to: from + 17, c1 })),
    },
    {
      id: "★", label: "Features", short: "★ FEATURES", color: "--gold", special: true,
      c1: "#C9982F",
      units: [
        { code: "ITR", name: "Introduction",                 from: 1,   to: 3,   foil: true },
        { code: "CWC", name: "FIFA Club World Cup 2025",     from: 4,   to: 10 },
        { code: "HCP", name: "WC26 Host City Posters",       from: 11,  to: 26 },
        { code: "H2A", name: "Head to Head · Legacy Battle",      from: 27,  to: 44 },
        { code: "H2B", name: "Head to Head · National Rivals",    from: 135, to: 152 },
        { code: "H2C", name: "Head to Head · Save or Score",      from: 243, to: 260 },
        { code: "H2D", name: "Head to Head · Continental Clashes", from: 351, to: 368 },
        { code: "H2E", name: "Head to Head · Game of Styles",     from: 459, to: 476 },
        { code: "ELI", name: "Elite",                        from: 513, to: 524, foil: true },
      ],
    },
  ],
};
