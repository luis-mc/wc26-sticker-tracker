/* ==================================================================
   PANINI · GOOGLE PIXEL FRAUEN-BUNDESLIGA 2025/26 — 420
   The league's third Panini collection, and the first since it grew
   to 14 clubs. Every club gets two double pages — crest and squad on
   one, team photo and specials on the other — 28 stickers in all.

   Verified: 3 intro + 14 Fans Corner + 11 Last Season In Numbers +
   (14 × 28) = 420, contiguous 1–420 with no coded stickers anywhere.
   Panini Deutschland and the DFB both publish 420 across 14 teams.
   Ranges: laststicker.com full checklist (Sept 2026).
   ================================================================== */

/* [code, club, first number, colour] — 28 stickers each */
const CLUBS = [
  ["FCU", "1.FC Union Berlin",       18, "#EB1923"],
  ["SVW", "SV Werder Bremen",        46, "#1D9053"],
  ["SGS", "SGS Essen",               74, "#1560BD"],
  ["SGE", "Eintracht Frankfurt",    102, "#E1000F"],
  ["SCF", "Sport-Club Freiburg",    130, "#E2001A"],
  ["HSV", "Hamburger SV",           158, "#004C9E"],
  ["TSG", "TSG 1899 Hoffenheim",    186, "#1961B5"],
  ["FCC", "FC Carl Zeiss Jena",     225, "#16428C"],
  ["KOE", "1.FC Köln",             253, "#E32219"],
  ["RBL", "RB Leipzig",             281, "#DD0741"],
  ["B04", "Bayer 04 Leverkusen",    309, "#E32221"],
  ["FCB", "FC Bayern München",     337, "#DC052D"],
  ["FCN", "1.FC Nürnberg",         365, "#AD1220"],
  ["WOB", "VfL Wolfsburg",          393, "#65B32E"],
];

export default {
  id: "panini-frauen-bundesliga-2025-26",
  publisher: "Panini",
  title: "Google Pixel Frauen-Bundesliga 2025/26",
  shortTitle: "FRAUEN-BUNDESLIGA",
  slug: "frauenbl2526",
  kicker: "FRAUEN-BUNDESLIGA · GERMANY",
  tagline: "420 stickers across 14 clubs.",
  year: 2026,
  sport: "football",
  category: "Football",
  total: 420,
  status: "numbered",
  note: "Club pages and subsets from the published checklist; player names aren't included.",
  hasMeta: false,
  vocab: { unit: "Club", unitPlural: "Clubs", section: "Section",
           sectionPlural: "Sections", meta: "Section" },
  displayOrder: ["★", "FBL"],
  sections: [
    {
      id: "★", label: "Features", short: "★ FEATURES", color: "--gold", special: true,
      c1: "#C9982F",
      units: [
        { code: "ITR", name: "Intro",                   from: 1,   to: 3   },
        { code: "FAN", name: "Fans Corner",             from: 4,   to: 17  },
        { code: "LSN", name: "Last Season In Numbers",  from: 214, to: 224 },
      ],
    },
    {
      id: "FBL", label: "Frauen-Bundesliga", short: "CLUBS", color: "--grass",
      units: CLUBS.map(([code, name, from, c1]) => ({ code, name, c1, from, to: from + 27 })),
    },
  ],
};
