/* ==================================================================
   PANINI · FÚTBOL ARGENTINO 2025 — 567
   Argentina's most recent album — Panini has not published a 2026 one.
   Like the other Panini South America collections it is coded rather
   than numbered: every club has its own prefix (BOC1–BOC17 for Boca),
   and the "20 Años" tribute run is printed as eleven double stickers
   whose ids span two numbers at once (FAP1-FAP2).

   Verified: LPF1–2 + 11 double stickers + (30 clubs × 17) + 12 El
   Semillero + 8 Campeones + 24 Camino Al Mundial = 567, which is the
   total laststicker.com publishes and the sum of every block in its
   checklist. Thirty clubs is the correct size of the 2025 Liga
   Profesional.

   Evidence note: Argentine retailers confirm the *composition* —
   "todos los equipos del Clausura, el semillero y una sección de
   Argentina camino al mundial" — but none of them quotes a sticker
   count, so 567 rests on the enumerated checklist alone.
   Ranges: laststicker.com full checklist (Sept 2026).
   ================================================================== */

/* Each club page: badge, kit, then the squad. */
const club = (code, name, c1) => ({
  code, name, c1,
  stickers: Array.from({ length: 17 }, (_, i) =>
    [`${code}${i + 1}`, i === 0 ? "Escudo" : i === 1 ? "Camiseta" : name]),
});

/* [code, club, colour] — album order, 17 stickers each */
const CLUBS_A = [
  ["ALD", "Aldosivi",                  "#F7C600"],
  ["ARJ", "Argentinos Juniors",        "#D0202A"],
  ["BAN", "Banfield",                  "#00A54F"],
  ["BAR", "Barracas Central",          "#B01B22"],
  ["BEL", "Belgrano",                  "#1560BD"],
  ["BOC", "Boca Juniors",              "#0A2472"],
  ["CCO", "Central Córdoba",          "#4A4A4A"],
  ["DYJ", "Defensa y Justicia",        "#E8B000"],
  ["EST", "Estudiantes",               "#D5122A"],
  ["HUR", "Huracán",                  "#C5192D"],
  ["IRM", "Independiente Rivadavia",   "#003DA5"],
  ["NOB", "Newell's Old Boys",         "#B4121B"],
  ["RAC", "Racing Club",               "#6CACE4"],
  ["TIG", "Tigre",                     "#16428C"],
  ["UNI", "Unión",                    "#A81E28"],
];

const CLUBS_B = [
  ["ATU", "Atlético Tucumán",        "#1B4FA0"],
  ["RIE", "Deportivo Riestra",         "#555555"],
  ["GIM", "Gimnasia",                  "#1D74C0"],
  ["GOD", "Godoy Cruz",                "#0B57A4"],
  ["IND", "Independiente",             "#C81E2C"],
  ["INS", "Instituto",                 "#B8232F"],
  ["LAN", "Lanús",                    "#7A1C2E"],
  ["PLA", "Platense",                  "#7A3B2E"],
  ["RIV", "River Plate",               "#D22630"],
  ["ROS", "Rosario Central",           "#0B5CA8"],
  ["SLO", "San Lorenzo",               "#16346E"],
  ["SMA", "San Martín",               "#CE1126"],
  ["SAR", "Sarmiento de Junín",       "#0F8E4F"],
  ["TAL", "Talleres",                  "#1B4FA0"],
  ["VEL", "Vélez Sarsfield",          "#4A4A4A"],
];

const coded = (prefix, count, label) =>
  Array.from({ length: count }, (_, i) => [prefix + (i + 1), label]);

export default {
  id: "panini-futbol-argentino-2025",
  publisher: "Panini",
  title: "Fútbol Argentino 2025",
  shortTitle: "ARGENTINA",
  slug: "futbolargentino2025",
  kicker: "LIGA PROFESIONAL · ARGENTINA",
  tagline: "567 stickers across 30 clubs.",
  year: 2025,
  sport: "football",
  category: "Football",
  total: 567,
  status: "numbered",
  note: "Argentina's most recent album — no 2026 collection has been published. Clubs are coded (BOC1…), not numbered; player names aren't included.",
  hasMeta: false,
  vocab: { unit: "Club", unitPlural: "Clubs", section: "Section",
           sectionPlural: "Sections", meta: "Section" },
  displayOrder: ["★", "CLU"],
  sections: [
    {
      id: "★", label: "Specials", short: "★ SPECIALS", color: "--gold", special: true,
      c1: "#C9982F",
      units: [
        { code: "LPF", name: "Liga Profesional de Fútbol",
          stickers: coded("LPF", 2, "Liga Profesional de Fútbol") },
        { code: "FAP", name: "Panini 20 Años",
          stickers: Array.from({ length: 11 }, (_, i) =>
            [`FAP${i * 2 + 1}-FAP${i * 2 + 2}`, "Panini 20 Años"]) },
        { code: "SEM", name: "El Semillero",     stickers: coded("SEM", 12, "El Semillero") },
        { code: "COP", name: "Campeones",        stickers: coded("COP", 8, "Campeones") },
        { code: "ARG", name: "Camino Al Mundial", stickers: coded("ARG", 24, "Camino Al Mundial") },
      ],
    },
    {
      id: "CLU", label: "Clubs", short: "CLUBS", color: "--grass",
      units: [...CLUBS_A, ...CLUBS_B].map(([code, name, c1]) => club(code, name, c1)),
    },
  ],
};
