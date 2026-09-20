/* ==================================================================
   TOPPS · BUNDESLIGA OFFIZIELLE STICKER 2025/26 — 362
   18 Bundesliga clubs at 15 stickers each (270), all 18 clubs of the
   2. Bundesliga (301–354), five feature sections, and eight
   letter-coded award stickers (DFL1–6, LEG1–2).

   Verified: 2 + 4 + 4 + 270 + 10 + 10 + 54 = 354 numbered, contiguous
   1–354, plus 8 lettered = 362 — matching the Cartophilic checklist.
   (laststicker's 381 additionally counts 19 glitter parallels, which
   are chase variants rather than album slots.)
   Ranges: laststicker.com full checklist + Football Cartophilic Info
   Exchange (Nov 2025). Stickers 201–210 are Top Scorer & Matchwinner.
   ================================================================== */

/* [code, club, first number, primary colour] — 15 stickers each */
const BUNDESLIGA = [
  ["FCA", "FC Augsburg",              11, "#BA3733"],
  ["FCU", "1.FC Union Berlin",        26, "#EB1923"],
  ["SVW", "SV Werder Bremen",         41, "#1D9053"],
  ["BVB", "Borussia Dortmund",        56, "#FDE100"],
  ["SGE", "Eintracht Frankfurt",      71, "#E1000F"],
  ["SCF", "Sport-Club Freiburg",      86, "#E2001A"],
  ["HSV", "Hamburger SV",            111, "#004C9E"],
  ["FCH", "1.FC Heidenheim 1846",    126, "#E30613"],
  ["TSG", "TSG 1899 Hoffenheim",     141, "#1961B5"],
  ["KOE", "1.FC Köln",          156, "#E32219"],
  ["RBL", "RB Leipzig",              171, "#DD0741"],
  ["B04", "Bayer 04 Leverkusen",     186, "#E32221"],
  ["M05", "1.FSV Mainz 05",          211, "#C3141E"],
  ["BMG", "Borussia Mönchengladbach", 226, "#00B04F"],
  ["FCB", "FC Bayern München",  241, "#DC052D"],
  ["STP", "FC St.Pauli 1910",        256, "#61371F"],
  ["VFB", "VfB Stuttgart",           271, "#E32219"],
  ["WOB", "VfL Wolfsburg",           286, "#65B32E"],
];

/* 2. Bundesliga — [code, club, from, to] (mostly three each) */
const BUNDESLIGA_2 = [
  ["BSC", "Hertha BSC Berlin",        301, 303, "#005CA9"],
  ["DSC", "Arminia Bielefeld",        304, 306, "#00529F"],
  ["BOC", "VfL Bochum 1848",          307, 309, "#005CA9"],
  ["BRA", "Eintracht Braunschweig",   310, 312, "#FFD100"],
  ["SVD", "SV Darmstadt 98",          313, 315, "#004E9E"],
  ["SGD", "Dynamo Dresden",           316, 318, "#FFD100"],
  ["F95", "Fortuna Düsseldorf 95", 319, 321, "#E2001A"],
  ["SVE", "SV Elversberg",            322, 323, "#E2001A"],
  ["SGF", "SpVgg Greuther Fürth", 324, 327, "#00996B"],
  ["H96", "Hannover 96",              328, 330, "#00963F"],
  ["FCK", "1.FC Kaiserslautern",      331, 333, "#E2001A"],
  ["KSC", "Karlsruher SC",            334, 336, "#004E9E"],
  ["KIE", "Holstein Kiel 1900",       337, 339, "#005CA9"],
  ["FCM", "1.FC Magdeburg",           340, 342, "#004E9E"],
  ["SCP", "SC Preußen Münster", 343, 345, "#00843D"],
  ["FCN", "1.FC Nürnberg",       346, 348, "#AD1220"],
  ["SCP7", "SC Paderborn 07",         349, 351, "#005CA9"],
  ["S04", "FC Schalke 04",            352, 354, "#004D9D"],
];

export default {
  id: "topps-bundesliga-2025-26",
  publisher: "Topps",
  title: "Bundesliga 2025/26",
  shortTitle: "BUNDESLIGA",
  slug: "bundesliga2526",
  kicker: "BUNDESLIGA · GERMANY",
  tagline: "362 stickers across both divisions.",
  year: 2026,
  sport: "football",
  category: "Football",
  total: 362,
  status: "numbered",
  note: "Club pages and subsets from the published checklist; player names aren't included.",
  hasMeta: true,
  vocab: { unit: "Club", unitPlural: "Clubs", section: "Division",
           sectionPlural: "Divisions", meta: "Division" },
  displayOrder: ["BL", "BL2", "★", "AWD"],
  sections: [
    // Ranges first and in ascending order, so the lettered award stickers
    // at the end keep numbering after 354.
    {
      id: "★", label: "Features", short: "★ FEATURES", color: "--gold", special: true,
      c1: "#C9982F", meta: "Features",
      units: [
        { code: "ITR", name: "Introduction",             from: 1,   to: 2 },
        { code: "TOR", name: "Tore! Tore! Tore!",        from: 3,   to: 6 },
        { code: "PAR", name: "Parallels",                from: 7,   to: 10,  foil: true },
        { code: "GOA", name: "Goalies & Sentinals",      from: 101, to: 110 },
        { code: "TSM", name: "Top Scorer & Matchwinner", from: 201, to: 210 },
      ],
    },
    {
      id: "BL", label: "Bundesliga", short: "BUNDESLIGA", color: "--p4",
      units: BUNDESLIGA.map(([code, name, from, c1]) => ({ code, name, from, to: from + 14, c1, meta: "Bundesliga" })),
    },
    {
      id: "BL2", label: "2. Bundesliga", short: "2. BUNDESLIGA", color: "--p6",
      units: BUNDESLIGA_2.map(([code, name, from, to, c1]) => ({ code, name, from, to, c1, meta: "2. Bundesliga" })),
    },
    {
      id: "AWD", label: "Awards", short: "★ AWARDS", color: "--gold", special: true,
      c1: "#C9982F", meta: "Awards",
      units: [
        { code: "DFL", name: "Die Besten der Bundesliga!", foil: true,
          stickers: Array.from({ length: 6 }, (_, i) => [`DFL${i + 1}`, `Die Besten ${i + 1}`]) },
        { code: "WUN", name: "Deine Wunschelf!", foil: true,
          stickers: [["LEG1", "Legend 1"], ["LEG2", "Legend 2"]] },
      ],
    },
  ],
};
