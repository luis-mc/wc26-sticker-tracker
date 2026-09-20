/* ==================================================================
   PANINI (SPAIN) · LALIGA HYPERMOTION 2025/26 — 473 stickers
   Spain's second tier: 22 clubs at 19 stickers each (418), the
   introduction, and the four Hyper foil subsets.

   Verified: 1 + 418 + 18 + 18 + 9 + 9 = 473, numbering contiguous
   1–473. The 'B' variant stickers and the 11 Premium foils are
   numbered separately and are not part of this sequence.
   Ranges: Football Cartophilic Info Exchange (Dec 2025).
   ================================================================== */

/* [code, club, first number, primary colour] — 19 stickers each */
const CLUBS = [
  ["ALB", "Albacete Balompié",      2, "#FFFFFF"],
  ["ALM", "UD Almería",            21, "#E4002B"],
  ["AND", "FC Andorra",                 40, "#C60B1E"],
  ["BUR", "Burgos CF",                  59, "#000000"],
  ["CAD", "Cádiz CF",              78, "#FFD100"],
  ["CAS", "CD Castellón",          97, "#F58220"],
  ["CEU", "AD Ceuta FC",               116, "#E4002B"],
  ["COR", "Córdoba CF",           135, "#00A04A"],
  ["CUL", "Cultural Leonesa",          154, "#0057B8"],
  ["DEP", "RC Deportivo",              173, "#009EE0"],
  ["EIB", "SD Eibar",                  192, "#0057B8"],
  ["GRA", "Granada CF",                211, "#E4002B"],
  ["HUE", "SD Huesca",                 230, "#0057B8"],
  ["LPA", "UD Las Palmas",             249, "#FFD100"],
  ["LGN", "CD Leganés",           268, "#0057B8"],
  ["MAL", "Málaga CF",            287, "#009EE0"],
  ["MIR", "CD Mirandés",          306, "#E4002B"],
  ["RAC", "Real Racing Club",          325, "#009EE0"],
  ["RSB", "Real Sociedad B",           344, "#0057B8"],
  ["SPG", "Real Sporting de Gijón", 363, "#E4002B"],
  ["VLL", "Real Valladolid CF",        382, "#6B2C91"],
  ["ZAR", "Real Zaragoza",             401, "#0057B8"],
];

export default {
  id: "panini-laliga-hypermotion-2025-26",
  publisher: "Panini",
  title: "LaLiga Hypermotion 2025/26",
  shortTitle: "HYPERMOTION",
  slug: "hypermotion2526",
  kicker: "LALIGA HYPERMOTION · SPAIN",
  tagline: "473 stickers across 22 clubs.",
  year: 2026,
  sport: "football",
  category: "Football",
  total: 473,
  status: "numbered",
  note: "Club pages and subsets from the published checklist; player names aren't included.",
  hasMeta: false,
  vocab: { unit: "Club", unitPlural: "Clubs", section: "Section",
           sectionPlural: "Sections", meta: "Section" },
  displayOrder: ["CLUB", "★"],
  sections: [
    {
      id: "CLUB", label: "LaLiga Hypermotion", short: "HYPERMOTION", color: "--p6",
      units: CLUBS.map(([code, name, from, c1]) => ({ code, name, from, to: from + 18, c1 })),
    },
    {
      id: "★", label: "Especiales", short: "★ ESPECIALES", color: "--gold", special: true,
      c1: "#C9982F",
      units: [
        { code: "ITR", name: "Introducción",      from: 1,   to: 1 },
        { code: "HSH", name: "Hyper Show",             from: 420, to: 437, foil: true },
        { code: "HWS", name: "Hyper World Series",     from: 438, to: 455, foil: true },
        { code: "HIC", name: "Hyper Iconos",           from: 456, to: 464, foil: true },
        { code: "HEN", name: "Hyper Energy",           from: 465, to: 473, foil: true },
      ],
    },
  ],
};
