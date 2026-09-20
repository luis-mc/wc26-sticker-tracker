/* ==================================================================
   PANINI · BRASILEIRÃO 2026 — 610
   Panini Brasil's flagship. Each club page opens with a foil escudo
   coded E1–E40; the squad stickers themselves are plain-numbered and
   run straight through both divisions — Série A 1–360 (18 a club),
   Série B 361–400 (2 a club), Feminino 401–418. The rest of the album
   is coded: CB1–CB34 for the intro and the three feature subsets,
   M1–M20 for the mascots, T01–T98 for the cards.

   Verified: 2 intro + (20 × 19) + (20 × 3) + 20 mascotes + 11 + 11 +
   10 + 18 feminino = 512 stickers, exactly the figure Panini Brasil
   publishes; plus 98 cards = 610, the total from laststicker.com and
   Stickers.app. As with Libertadores the "512 vs 610" disagreement
   was only ever about whether the cards are counted.
   Ranges: laststicker.com full checklist (Sept 2026).
   ================================================================== */

/* [code, club, colour] — album order; E-numbers and squad ranges follow
   from the position, 18 a club in Série A and 2 in Série B. */
const SERIE_A = [
  ["FLA", "Flamengo",              "#C52613"],
  ["PAL", "Palmeiras",             "#006437"],
  ["CRU", "Cruzeiro",              "#143C8C"],
  ["MIR", "Mirassol",              "#D9A800"],
  ["FLU", "Fluminense",            "#7E2532"],
  ["BOT", "Botafogo",              "#3A3A3A"],
  ["BAH", "Bahia",                 "#0B57A4"],
  ["SAO", "São Paulo",            "#C8102E"],
  ["GRE", "Grêmio",               "#0D80BF"],
  ["RBB", "Red Bull Bragantino",   "#E2001A"],
  ["CAM", "Atlético Mineiro",     "#1F1F1F"],
  ["SAN", "Santos",                "#5A5A5A"],
  ["COR", "Corinthians",           "#333333"],
  ["VAS", "Vasco da Gama",         "#2A2A2A"],
  ["VIT", "Vitória",              "#C8102E"],
  ["INT", "Internacional",         "#D01317"],
  ["CRT", "Coritiba",              "#00703C"],
  ["CAP", "Athletico Paranaense",  "#B01B22"],
  ["CHA", "Chapecoense",           "#007A3D"],
  ["REM", "Remo",                  "#0B3C8C"],
];

const SERIE_B = [
  ["CEA", "Ceará",                "#4A4A4A"],
  ["FOR", "Fortaleza",             "#1D4E9C"],
  ["JUV", "Juventude",             "#1E7A3C"],
  ["SPT", "Recife",                "#C8102E"],
  ["CRI", "Criciúma",             "#F7C600"],
  ["GOI", "Goiás",                "#007A3D"],
  ["NOV", "Novorizontino",         "#0B3C8C"],
  ["CRB", "CRB",                   "#B01B22"],
  ["AVA", "Avaí",                 "#1560BD"],
  ["CUI", "Cuiabá",               "#E8B000"],
  ["ACG", "Atlético Goianiense",  "#D22630"],
  ["OPE", "Operário Ferroviário","#4F4F4F"],
  ["VIL", "Vila Nova",             "#B4121B"],
  ["AME", "América FC",           "#00693E"],
  ["ATH", "Athletic Club",         "#555555"],
  ["BSP", "Botafogo-SP",           "#C02A2A"],
  ["PON", "Ponte Preta",           "#606060"],
  ["LON", "Londrina",              "#1A4FA0"],
  ["NAU", "Náutico",              "#D0202A"],
  ["SBE", "São Bernardo",         "#E0A800"],
];

/* E1–E40, in the same order the clubs appear above. */
const ESCUDOS = [...SERIE_A, ...SERIE_B].map(([, name], i) =>
  [`E${i + 1}`, `Escudo — ${name}`]);

const coded = (prefix, from, to, label) =>
  Array.from({ length: to - from + 1 }, (_, i) => [`${prefix}${from + i}`, label]);

export default {
  id: "panini-brasileirao-2026",
  publisher: "Panini",
  title: "Brasileirão 2026",
  shortTitle: "BRASILEIRÃO",
  slug: "brasileirao2026",
  kicker: "CAMPEONATO BRASILEIRO",
  tagline: "512 stickers and 98 cards across both divisions.",
  year: 2026,
  sport: "football",
  category: "Football",
  total: 610,
  status: "numbered",
  note: "Club pages and subsets from the published checklist; player names aren't included. The foil escudos are coded E1–E40 and collected together.",
  hasMeta: true,
  vocab: { unit: "Club", unitPlural: "Clubs", section: "Division",
           sectionPlural: "Divisions", meta: "Division" },
  displayOrder: ["SA", "SB", "FEM", "★", "CRD"],
  sections: [
    // Every numbered range first, ending at 418, so the coded stickers
    // number on from 419 without colliding.
    {
      id: "SA", label: "Série A", short: "SÉRIE A", color: "--grass",
      units: SERIE_A.map(([code, name, c1], i) =>
        ({ code, name, c1, meta: "Série A", from: 1 + i * 18, to: 18 + i * 18 })),
    },
    {
      id: "SB", label: "Série B", short: "SÉRIE B", color: "--p6",
      units: SERIE_B.map(([code, name, c1], i) =>
        ({ code, name, c1, meta: "Série B", from: 361 + i * 2, to: 362 + i * 2 })),
    },
    {
      id: "FEM", label: "Brasileirão Feminino", short: "FEMININO", color: "--sky",
      units: [{ code: "FEM", name: "Brasileirão Feminino", c1: "#5080D0",
                meta: "Feminino", from: 401, to: 418 }],
    },
    {
      id: "★", label: "Specials", short: "★ SPECIALS", color: "--gold", special: true,
      c1: "#C9982F", meta: "Specials",
      units: [
        { code: "ESC", name: "Escudos", foil: true, stickers: ESCUDOS },
        { code: "ITR", name: "Introduction", stickers: coded("CB", 1, 2, "Introduction") },
        { code: "SEE", name: "São Eles!",   stickers: coded("CB", 3, 13, "São Eles!") },
        { code: "JOG", name: "Jogão",       stickers: coded("CB", 14, 24, "Jogão") },
        { code: "HOM", name: "Homens-Gol",   stickers: coded("CB", 25, 34, "Homens-Gol") },
        { code: "MAS", name: "Mascotes",
          stickers: Array.from({ length: 20 }, (_, i) => [`M${i + 1}`, `Mascote ${i + 1}`]) },
      ],
    },
    {
      id: "CRD", label: "Cards", short: "★ CARDS", color: "--gold", special: true,
      c1: "#C9982F", meta: "Cards",
      units: [{
        code: "CRD", name: "Cards colecionáveis", kind: "card",
        stickers: Array.from({ length: 98 }, (_, i) =>
          [`T${String(i + 1).padStart(2, "0")}`, `Card ${i + 1}`]),
      }],
    },
  ],
};
