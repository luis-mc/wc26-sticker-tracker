/* ==================================================================
   PANINI · LIGA F MOEVE 2025/26 — 432
   Spain's women's league. The numbering runs 1–380 — the cover
   sticker, 16 clubs at 20 numbers each (2–321) and the five feature
   subsets (322–380) — but 38 of those numbers are *split*: two
   half-stickers, 8A and 8B, sharing one space in the album. Add the
   eleven Once Premium, the Maxi Premium and the two Conmemorativo
   stickers, which carry letter codes instead of numbers.

   Verified: 342 plain numbers + 38 complete A/B pairs = 380 numbers
   covering 1–380 with no gap, no overlap and no half-pair; 342 + 76 =
   418 stickers, + 14 coded = 432, the total laststicker.com publishes.
   Ranges: laststicker.com full checklist (Sept 2026).

   This is what the old "380 or 430?" disagreement was about: 380 is
   how far the numbering goes, 430 is a sticker count taken before the
   two Conmemorativo stickers were added. Neither was wrong.

   Every sticker is authored explicitly rather than as a number range,
   because a range can't express a split number.
   ================================================================== */

/* The 38 numbers printed as an A/B pair. */
const SPLIT = new Set([
    8,  16,  19,  29,  39,  47,  50,  73,  79,  87,
   94, 106, 114, 119, 121, 129, 131, 134, 155, 156,
  166, 180, 197, 201, 210, 228, 235, 253, 266, 267,
  272, 279, 288, 299, 300, 306, 308, 317,
]);

/* A plain numbered run, as an explicit list. */
const run = (from, to, label) =>
  Array.from({ length: to - from + 1 }, (_, i) => [String(from + i), label]);

/* A club page: 20 numbers, each either one sticker or an A/B pair. */
const squad = (code, name, from, c1) => ({
  code, name, c1,
  stickers: Array.from({ length: 20 }, (_, i) => from + i).flatMap(num =>
    SPLIT.has(num) ? [[`${num}A`, name], [`${num}B`, name]] : [[String(num), name]]),
});

/* [code, club, first number, colour] */
const CLUBS = [
  ["ALH", "Alhama CF ElPozo",     2, "#C8102E"],
  ["ATH", "Athletic Club",        22, "#EE2523"],
  ["ATM", "Atlético de Madrid",  42, "#CB3524"],
  ["BAD", "Badalona Women",       62, "#1B4FA0"],
  ["BAR", "FC Barcelona",         82, "#A50044"],
  ["TEN", "Costa Adeje Tenerife", 102, "#0E6BB0"],
  ["DEP", "Deportivo Abanca",     122, "#1B72BC"],
  ["DUX", "DUX Logroño",         142, "#B4121B"],
  ["EIB", "SD Eibar",             162, "#16428C"],
  ["ESP", "RCD Espanyol",         182, "#0072CE"],
  ["GRA", "Granada CF",           202, "#D1122E"],
  ["LEV", "Levante UD",           222, "#9E1B32"],
  ["MAD", "Madrid CFF",           242, "#6B2E8F"],
  ["RMA", "Real Madrid",          262, "#D4AF37"],
  ["RSO", "Real Sociedad",        282, "#143C8C"],
  ["SEV", "Sevilla FC",           302, "#D9001B"],
];

export default {
  id: "panini-liga-f-2025-26",
  publisher: "Panini",
  title: "Liga F Moeve 2025/26",
  shortTitle: "LIGA F",
  slug: "ligaf2526",
  kicker: "LIGA F · SPAIN",
  tagline: "432 stickers across 16 clubs, 38 of them split pairs.",
  year: 2026,
  sport: "football",
  category: "Football",
  total: 432,
  status: "numbered",
  note: "Club pages and subsets from the published checklist; player names aren't included. Numbers like 8A/8B are two half-stickers sharing one space.",
  hasMeta: false,
  vocab: { unit: "Club", unitPlural: "Clubs", section: "Section",
           sectionPlural: "Sections", meta: "Section" },
  displayOrder: ["OPN", "CLU", "★"],
  sections: [
    // Album order throughout: every sticker is explicit, so the running
    // counter follows the checklist.
    {
      id: "OPN", label: "Opening", short: "OPENING", color: "--gold", special: true,
      c1: "#C9982F",
      units: [{ code: "LGF", name: "Liga F Moeve", stickers: [["1", "Liga F Moeve"]] }],
    },
    {
      id: "CLU", label: "Clubs", short: "CLUBS", color: "--grass",
      units: CLUBS.map(([code, name, from, c1]) => squad(code, name, from, c1)),
    },
    {
      id: "★", label: "Specials", short: "★ SPECIALS", color: "--gold", special: true,
      c1: "#C9982F",
      units: [
        { code: "FOC", name: "Focus",        stickers: run(322, 326, "Focus") },
        { code: "ENE", name: "Energy Moeve", stickers: run(327, 353, "Energy Moeve") },
        { code: "FLW", name: "Flow",         stickers: run(354, 362, "Flow") },
        { code: "FEE", name: "Feeling",      stickers: run(363, 371, "Feeling") },
        { code: "FRE", name: "Fresh",        stickers: run(372, 380, "Fresh") },
        { code: "OPR", name: "Once Premium",
          stickers: Array.from({ length: 11 }, (_, i) => [`OP${i + 1}`, "Once Premium"]) },
        { code: "MPR", name: "Maxi Premium", stickers: [["MP1", "Maxi Premium"]] },
        { code: "CON", name: "Conmemorativo",
          stickers: [["C1", "Conmemorativo"], ["C2", "Conmemorativo"]] },
      ],
    },
  ],
};
