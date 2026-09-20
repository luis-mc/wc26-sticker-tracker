/* ==================================================================
   PANINI (PORTUGAL) · FUTEBOL 2025-26 — 486 stickers
   18 foil club crests, the 18 Liga BetClic squads at 19 stickers
   each (342), five foil subsets, and the 45-sticker Mercado de
   Inverno winter-market update that shares the same numbering.

   Verified: 18 + 342 + 81 + 45 = 486, numbering contiguous 1–486.
   The unnumbered Premium (P-xx) and Substituições (BIS) foils sit
   outside this sequence and are not tracked here.
   Ranges: Football Cartophilic Info Exchange (Jan 2026).
   ================================================================== */

/* [code, club, first number, primary colour] — 19 stickers each */
const CLUBS = [
  ["ALV", "FC Alverca",             19, "#E4002B"],
  ["ARO", "FC Arouca",              38, "#FFD100"],
  ["AVS", "AVS SAD",                57, "#004B87"],
  ["BEN", "SL Benfica",             76, "#E31B23"],
  ["BRA", "SC Braga",               95, "#E4002B"],
  ["CPA", "Casa Pia AC",           114, "#000000"],
  ["EST", "Estoril Praia",         133, "#FFD100"],
  ["EDA", "Estrela da Amadora",    152, "#E4002B"],
  ["FAM", "FC Famalicão",     171, "#004B87"],
  ["GIL", "Gil Vicente FC",        190, "#E4002B"],
  ["MOR", "Moreirense FC",         209, "#00A04A"],
  ["NAC", "CD Nacional",           228, "#000000"],
  ["POR", "FC Porto",              247, "#00428C"],
  ["RAV", "Rio Ave FC",            266, "#00A04A"],
  ["SCL", "CD Santa Clara",        285, "#E4002B"],
  ["SCP", "Sporting CP",           304, "#008057"],
  ["TON", "CD Tondela",            323, "#FFD100"],
  ["VIT", "Vitória SC",       342, "#FFFFFF"],
];

export default {
  id: "panini-futebol-2025-26",
  publisher: "Panini",
  title: "Futebol 2025-26",
  shortTitle: "FUTEBOL 25/26",
  slug: "futebol2526",
  kicker: "LIGA BETCLIC · PORTUGAL",
  tagline: "486 stickers across 18 clubs.",
  year: 2026,
  sport: "football",
  category: "Football",
  total: 486,
  status: "numbered",
  note: "Club pages and subsets from the published checklist; player names aren't included.",
  hasMeta: false,
  vocab: { unit: "Club", unitPlural: "Clubs", section: "Section",
           sectionPlural: "Sections", meta: "Section" },
  displayOrder: ["CLUB", "★"],
  sections: [
    {
      id: "CLUB", label: "Liga BetClic", short: "LIGA BETCLIC", color: "--p6",
      units: CLUBS.map(([code, name, from, c1]) => ({ code, name, from, to: from + 18, c1 })),
    },
    {
      id: "★", label: "Especiais", short: "★ ESPECIAIS", color: "--gold", special: true,
      c1: "#C9982F",
      units: [
        { code: "EMB", name: "Emblemas",            from: 1,   to: 18,  foil: true },
        { code: "MEG", name: "Megacraques",         from: 361, to: 396, foil: true },
        { code: "SIM", name: "Símbolos",       from: 397, to: 405, foil: true },
        { code: "SUP", name: "Supersónicos",   from: 406, to: 414, foil: true },
        { code: "PAR", name: "Parceiros",           from: 415, to: 432, foil: true },
        { code: "ROO", name: "Rookies",             from: 433, to: 441, foil: true },
        { code: "MDI", name: "Mercado de Inverno",  from: 442, to: 486 },
      ],
    },
  ],
};
