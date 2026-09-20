/* ==================================================================
   PANINI · ITALIA IN PISTA — MILANO CORTINA 2026 — 232
   Team Italia at the Winter Olympics and Paralympics: 192 stickers
   grouped by discipline (each block mixing athletes with its own
   "Art" and "Pittogramma" sticker), the two Calendario logos and the
   eight Località views, then the 40-card set C1–C40.

   Verified: the 25 discipline blocks sum to exactly 192, contiguous
   1–192 — and match Panini's own breakdown of 150 athletes + 2 logos
   + 16 art + 16 pictograms + 8 locations. Plus 40 cards = 232.
   The two Limited Edition chase stickers (LE1–LE2) are not album
   slots and are not tracked here.
   Ranges: laststicker.com full checklist.
   Not distributed in the USA, China, Russia or Belarus.
   ================================================================== */

/* [code, discipline, from, to] */
const DISCIPLINES = [
  ["BIA", "Biathlon",                      1,  10],
  ["SAM", "Sci Alpino maschile",          11,  20],
  ["SAL", "Sci Alpinismo",                21,  29],
  ["SAF", "Sci Alpino femminile",         30,  36],
  ["SAP", "Sci Alpino paralimpico",       37,  37],
  ["BOB", "Bob",                          38,  49],
  ["CUR", "Curling",                      50,  61],
  ["CUC", "Curling in carrozzina",        62,  65],
  ["SNP", "Snowboard paralimpico",        66,  68],
  ["SLI", "Slittino",                     69,  77],
  ["SKE", "Skeleton",                     78,  84],
  ["SNB", "Snowboard",                    85,  93],
  ["SKA", "Ski acrobatico",               94, 101],
  ["PDF", "Pattinaggio di figura",       102, 118],
  ["HOC", "Hockey su ghiaccio",          119, 128],
  ["PIH", "Para ice hockey",             129, 131],
  ["PDV", "Pattinaggio di velocità", 132, 144],
  ["SHT", "Short track",                 145, 158],
  ["SAS", "Salto con gli sci",           159, 164],
  ["CNO", "Combinata nordica",           165, 169],
  ["SDF", "Sci di fondo",                170, 179],
  ["SFP", "Sci di fondo paralimpico",    180, 181],
  ["BIP", "Biathlon paralimpico",        182, 182],
  ["CAL", "Calendario",                  183, 184],
  ["LOC", "Località",               185, 192],
];

export default {
  id: "panini-milano-cortina-2026",
  publisher: "Panini",
  title: "Italia in Pista — Milano Cortina 2026",
  shortTitle: "MILANO CORTINA",
  slug: "milanocortina26",
  kicker: "OLYMPIC WINTER GAMES",
  tagline: "192 stickers and 40 cards across 25 disciplines.",
  year: 2026,
  sport: "winter olympics",
  category: "Olympics",
  total: 232,
  status: "numbered",
  note: "Discipline blocks from the published checklist; athlete names aren't included.",
  hasMeta: false,
  vocab: { unit: "Discipline", unitPlural: "Disciplines", section: "Section",
           sectionPlural: "Sections", meta: "Section" },
  displayOrder: ["DISC", "CARD"],
  sections: [
    {
      id: "DISC", label: "Disciplines", short: "DISCIPLINES", color: "--p2", c1: "#5080D0",
      units: DISCIPLINES.map(([code, name, from, to]) => ({ code, name, from, to })),
    },
    {
      id: "CARD", label: "Cards", short: "★ CARDS", color: "--gold", special: true,
      c1: "#C9982F",
      units: [{
        code: "CRD", name: "Card set", kind: "card",
        stickers: Array.from({ length: 40 }, (_, i) => [`C${i + 1}`, `Card ${i + 1}`]),
      }],
    },
  ],
};
