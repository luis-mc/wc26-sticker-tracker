/* ==================================================================
   PANINI (FRANCE) · FOOT LIGUE 1 2025-2026 — 556 stickers
   18 Ligue 1 clubs at 28 stickers each (504), seven six-sticker
   derby spreads between the club pages, and the trophy, referees,
   VAR and calendar closers.

   Verified: 504 + 1 + 42 + 4 + 4 + 1 = 556, numbering contiguous
   1–556. The Mercato d'Hiver update (T1–T46) is numbered separately
   and is not part of this sequence.
   Ranges: Football Cartophilic Info Exchange (Dec 2025).
   ================================================================== */

/* [code, club, first number, primary colour] — 28 stickers each */
const CLUBS = [
  ["ANG", "Angers SCO",                 8, "#000000"],
  ["AJA", "AJ Auxerre",                36, "#0057B8"],
  ["BRE", "Stade Brestois 29",         64, "#E4002B"],
  ["HAC", "Havre AC",                  98, "#87CEEB"],
  ["LEN", "RC Lens",                  126, "#FFD100"],
  ["LIL", "LOSC Lille",               154, "#E4002B"],
  ["LOR", "FC Lorient",               188, "#F58220"],
  ["LYO", "Olympique Lyonnais",       216, "#00529F"],
  ["OM",  "Olympique de Marseille",   244, "#2FAEE0"],
  ["MET", "FC Metz",                  278, "#8A1538"],
  ["MON", "AS Monaco",                306, "#CE2044"],
  ["NAN", "FC Nantes",                334, "#FFD100"],
  ["NIC", "OGC Nice",                 368, "#E4002B"],
  ["PFC", "Paris FC",                 396, "#0057B8"],
  ["PSG", "Paris Saint-Germain",      424, "#004170"],
  ["REN", "Stade Rennais FC",         458, "#E4002B"],
  ["STR", "RC Strasbourg Alsace",     486, "#009EE0"],
  ["TOU", "Toulouse FC",              514, "#65199C"],
];

export default {
  id: "panini-foot-ligue1-2025-26",
  publisher: "Panini",
  title: "Foot Ligue 1 2025-26",
  shortTitle: "LIGUE 1 25/26",
  slug: "ligue1-2526",
  kicker: "LIGUE 1 McDONALD'S",
  tagline: "556 stickers across 18 clubs.",
  year: 2026,
  sport: "football",
  category: "Football",
  total: 556,
  status: "numbered",
  note: "Club pages and derby spreads from the published checklist; player names aren't included.",
  hasMeta: false,
  vocab: { unit: "Club", unitPlural: "Clubs", section: "Section",
           sectionPlural: "Sections", meta: "Section" },
  displayOrder: ["CLUB", "★"],
  sections: [
    {
      id: "CLUB", label: "Ligue 1", short: "LIGUE 1", color: "--p2",
      units: CLUBS.map(([code, name, from, c1]) => ({ code, name, from, to: from + 27, c1 })),
    },
    {
      id: "★", label: "Spéciaux", short: "★ SPÉCIAUX", color: "--gold", special: true,
      c1: "#C9982F",
      units: [
        { code: "TRO", name: "Le Trophée",                from: 1,   to: 1,   foil: true },
        { code: "CLA", name: "Le Classique",                   from: 2,   to: 7 },
        { code: "DNO", name: "Le Derby du Nord",               from: 92,  to: 97 },
        { code: "DCA", name: "Le Derby de la Côte d'Azur", from: 182, to: 187 },
        { code: "OLY", name: "L'Olympique",                    from: 272, to: 277 },
        { code: "DBR", name: "Le Derby Breton",                from: 362, to: 367 },
        { code: "DES", name: "Le Derby de l'Est",              from: 452, to: 457 },
        { code: "DPA", name: "Le Derby de Paris",              from: 542, to: 547 },
        { code: "ARB", name: "Les Arbitres Français",     from: 548, to: 551 },
        { code: "VAR", name: "La VAR",                         from: 552, to: 555 },
        { code: "CAL", name: "Calendrier",                     from: 556, to: 556 },
      ],
    },
  ],
};
