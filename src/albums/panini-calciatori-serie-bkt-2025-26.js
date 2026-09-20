/* ==================================================================
   PANINI · CALCIATORI SERIE BKT 2025-2026 — 480 stickers
   The Serie B companion to Calciatori: 20 foil team shirts, 20 clubs
   at 22 stickers each (440), and 20 metallic "Best In Town" closers.

   Verified: 20 + 440 + 20 = 480, numbering contiguous 1–480.
   Ranges: Football Cartophilic Info Exchange (Apr 2026).
   ================================================================== */

/* [code, club, first number, primary colour] — 22 stickers each */
const CLUBS = [
  ["AVE", "Avellino",        21, "#2E7D32"],
  ["BAR", "Bari",            43, "#E4002B"],
  ["CAR", "Carrarese",       65, "#FFD100"],
  ["CAT", "Catanzaro",       87, "#D7B740"],
  ["CES", "Cesena",         109, "#000000"],
  ["EMP", "Empoli",         131, "#00A3E0"],
  ["FRO", "Frosinone",      153, "#FFD100"],
  ["JST", "Juve Stabia",    175, "#FFD100"],
  ["MAN", "Mantova",        197, "#E4002B"],
  ["MOD", "Modena",         219, "#FFD100"],
  ["MZA", "Monza",          241, "#E4002B"],
  ["PAD", "Padova",         263, "#E4002B"],
  ["PAL", "Palermo",        285, "#E4A0B7"],
  ["PES", "Pescara",        307, "#0057B8"],
  ["REG", "Reggiana",       329, "#8A1538"],
  ["SAM", "Sampdoria",      351, "#0057B8"],
  ["SPE", "Spezia",         373, "#000000"],
  ["SUD", "Südtirol",  395, "#E4002B"],
  ["VEN", "Venezia",        417, "#FF8200"],
  ["ENT", "Virtus Entella", 439, "#0057B8"],
];

export default {
  id: "panini-calciatori-bkt-2025-26",
  publisher: "Panini",
  title: "Calciatori Serie BKT 2025-26",
  shortTitle: "SERIE BKT",
  slug: "seriebkt2526",
  kicker: "SERIE BKT · ITALY",
  tagline: "480 stickers across 20 Serie B clubs.",
  year: 2026,
  sport: "football",
  category: "Football",
  total: 480,
  status: "numbered",
  note: "Club pages and subsets from the published checklist; player names aren't included.",
  hasMeta: false,
  vocab: { unit: "Club", unitPlural: "Clubs", section: "Section",
           sectionPlural: "Sections", meta: "Section" },
  displayOrder: ["CLUB", "★"],
  sections: [
    {
      id: "CLUB", label: "Serie BKT", short: "SERIE BKT", color: "--p5",
      units: CLUBS.map(([code, name, from, c1]) => ({ code, name, from, to: from + 21, c1 })),
    },
    {
      id: "★", label: "Speciali", short: "★ SPECIALI", color: "--gold", special: true,
      c1: "#C9982F",
      units: [
        { code: "SQB", name: "Le Squadre della BKT", from: 1,   to: 20,  foil: true },
        { code: "BIT", name: "Best In Town",         from: 461, to: 480, foil: true },
      ],
    },
  ],
};
