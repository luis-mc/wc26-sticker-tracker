/* ==================================================================
   PANINI · CALCIATORI 2025-2026 — 618 stickers
   Italy's institution: 20 Serie A clubs at 22 stickers each (440),
   plus the team-shirt and new-signing openers, eight themed foil
   subsets, and closing sections for Serie B and the three Serie C
   groups.

   Verified: 43 + 440 + 60 + 30 + 45 = 618, numbering contiguous 1–618.
   Ranges: Football Cartophilic Info Exchange (Nov 2025).
   ================================================================== */

/* [code, club, first number, primary colour] — 22 stickers each */
const CLUBS = [
  ["ATA", "Atalanta",       44, "#1D71B8"],
  ["BOL", "Bologna",        66, "#9F1B32"],
  ["CAG", "Cagliari",       88, "#A4133C"],
  ["COM", "Como",          110, "#0057B8"],
  ["CRE", "Cremonese",     132, "#E4002B"],
  ["FIO", "Fiorentina",    154, "#6B2C91"],
  ["GEN", "Genoa",         176, "#B01E28"],
  ["VER", "Hellas Verona", 198, "#FFD100"],
  ["INT", "Inter",         220, "#0068A8"],
  ["JUV", "Juventus",      242, "#000000"],
  ["LAZ", "Lazio",         264, "#87D8F7"],
  ["LEC", "Lecce",         286, "#FFD100"],
  ["MIL", "Milan",         308, "#FB090B"],
  ["NAP", "Napoli",        330, "#12A0D7"],
  ["PAR", "Parma",         352, "#FFDD00"],
  ["PIS", "Pisa",          374, "#003B71"],
  ["ROM", "Roma",          396, "#8E1F2F"],
  ["SAS", "Sassuolo",      418, "#00A04A"],
  ["TOR", "Torino",        440, "#8A1538"],
  ["UDI", "Udinese",       462, "#000000"],
];

export default {
  id: "panini-calciatori-2025-26",
  publisher: "Panini",
  title: "Calciatori 2025-26",
  shortTitle: "CALCIATORI",
  slug: "calciatori2526",
  kicker: "SERIE A ENILIVE",
  tagline: "618 stickers across Serie A, B and C.",
  year: 2026,
  sport: "football",
  category: "Football",
  total: 618,
  status: "numbered",
  note: "Club pages and subsets from the published checklist; player names aren't included.",
  hasMeta: false,
  vocab: { unit: "Club", unitPlural: "Clubs", section: "Section",
           sectionPlural: "Sections", meta: "Section" },
  displayOrder: ["SA", "LOW", "★"],
  sections: [
    {
      id: "SA", label: "Serie A", short: "SERIE A", color: "--p2",
      units: CLUBS.map(([code, name, from, c1]) => ({ code, name, from, to: from + 21, c1 })),
    },
    {
      id: "LOW", label: "Serie B & C", short: "SERIE B & C", color: "--p6", c1: "#48B44C",
      units: [
        { code: "SEB", name: "Serie B",            from: 544, to: 573 },
        { code: "SCA", name: "Serie C · Girone A", from: 574, to: 588 },
        { code: "SCB", name: "Serie C · Girone B", from: 589, to: 603 },
        { code: "SCC", name: "Serie C · Girone C", from: 604, to: 618 },
      ],
    },
    {
      id: "★", label: "Speciali", short: "★ SPECIALI", color: "--gold", special: true,
      c1: "#C9982F",
      units: [
        { code: "ITR", name: "Introduzione",               from: 1,   to: 3 },
        { code: "SQA", name: "Le Squadre della Serie A",   from: 4,   to: 23,  foil: true },
        { code: "NFC", name: "Nuove Firme in Città",  from: 24,  to: 43 },
        { code: "GEM", name: "Gem Squad",                  from: 484, to: 495, foil: true },
        { code: "TUR", name: "Turbofreccia",               from: 496, to: 505, foil: true },
        { code: "COL", name: "Color Up",                   from: 506, to: 512, foil: true },
        { code: "GLZ", name: "Super Glovez",               from: 513, to: 520, foil: true },
        { code: "TRK", name: "Trick Maestro",              from: 521, to: 529, foil: true },
        { code: "BOO", name: "Boom d'Impatto",             from: 530, to: 539, foil: true },
        { code: "PWR", name: "Power Bros",                 from: 540, to: 541, foil: true },
        { code: "FAM", name: "Family Legacy",              from: 542, to: 543, foil: true },
      ],
    },
  ],
};
