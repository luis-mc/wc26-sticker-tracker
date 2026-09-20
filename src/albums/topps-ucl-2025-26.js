/* ==================================================================
   TOPPS · UEFA CHAMPIONS LEAGUE OFFICIAL STICKERS 2025/26 — 574
   36 clubs in the league phase: the 29 clubs on full pages carry 14
   stickers, the last 7 carry 12, plus six feature sections.

   Tracked by sticker number (Topps doesn't publish a per-sticker name
   list). Checklist ranges: Football Cartophilic Info Exchange (Nov 2025).
   ================================================================== */

/* [code, club, first number, stickers, primary colour] */
const CLUBS = [
  ["AJA", "AFC Ajax",                    42, 14, "#D2122E"],
  ["ARS", "Arsenal",                     56, 14, "#EF0107"],
  ["MON", "AS Monaco",                   70, 14, "#CE2044"],
  ["ATA", "Atalanta BC",                 84, 14, "#1D71B8"],
  ["ATH", "Athletic Club",               98, 14, "#EE2523"],
  ["ATM", "Atlético Madrid",       112, 14, "#CB3524"],
  ["B04", "Bayer 04 Leverkusen",        126, 14, "#E32221"],
  ["BVB", "Borussia Dortmund",          140, 14, "#FDE100"],
  ["CHE", "Chelsea",                    154, 14, "#034694"],
  ["SGE", "Eintracht Frankfurt",        168, 14, "#E1000F"],
  ["FCB", "FC Barcelona",               182, 14, "#A50044"],
  ["BAY", "FC Bayern München",     196, 14, "#DC052D"],
  ["INT", "FC Internazionale Milano",   210, 14, "#0068A8"],
  ["GAL", "Galatasaray SK",             224, 14, "#FDB913"],
  ["JUV", "Juventus",                   238, 14, "#000000"],
  ["LIV", "Liverpool",                  252, 14, "#C8102E"],
  ["MCI", "Manchester City",            298, 14, "#6CABDD"],
  ["NEW", "Newcastle United",           312, 14, "#241F20"],
  ["OLY", "Olympiacos FC",              326, 14, "#D6001C"],
  ["OM",  "Olympique Marseille",        340, 14, "#2FAEE0"],
  ["PSG", "Paris Saint-Germain",        354, 14, "#004170"],
  ["PSV", "PSV Eindhoven",              368, 14, "#E4002B"],
  ["RMA", "Real Madrid CF",             382, 14, "#FEBE10"],
  ["SLA", "SK Slavia Praha",            396, 14, "#D7141A"],
  ["SCP", "Sporting CP",                410, 14, "#008057"],
  ["NAP", "SSC Napoli",                 424, 14, "#12A0D7"],
  ["TOT", "Tottenham Hotspur",          438, 14, "#132257"],
  ["USG", "Union Saint-Gilloise",       452, 14, "#FFD800"],
  ["VIL", "Villarreal CF",              466, 14, "#FFE667"],
  ["BRU", "Club Brugge",                480, 12, "#005BAA"],
  ["FCK", "FC København",          492, 12, "#12326E"],
  ["KAI", "FC Kairat Almaty",           504, 12, "#FFCC00"],
  ["BOD", "FK Bodø/Glimt",         516, 12, "#FFE500"],
  ["PAF", "FC Pafos",                   528, 12, "#004B87"],
  ["QAR", "Qarabağ FK",            540, 12, "#000000"],
  ["SLB", "SL Benfica",                 552, 12, "#E31B23"],
];

export default {
  id: "topps-ucl-2025-26",
  publisher: "Topps",
  title: "UEFA Champions League 2025/26",
  shortTitle: "CHAMPIONS 25/26",
  slug: "ucl2526",
  kicker: "UEFA CHAMPIONS LEAGUE",
  tagline: "574 stickers across the 36 league-phase clubs.",
  year: 2026,
  sport: "football",
  category: "Football",
  total: 574,
  status: "numbered",
  note: "Sticker numbers and club pages from the published checklist; player names aren't included.",
  hasMeta: false,
  vocab: { unit: "Club", unitPlural: "Clubs", section: "Section",
           sectionPlural: "Sections", meta: "Section" },
  displayOrder: ["CLUB", "★"],
  sections: [
    {
      id: "CLUB", label: "Clubs", short: "CLUBS", color: "--p1",
      units: CLUBS.map(([code, name, from, n, c1]) => ({ code, name, from, to: from + n - 1, c1 })),
    },
    {
      id: "★", label: "Features", short: "★ FEATURES", color: "--gold", special: true,
      c1: "#C9982F",
      units: [
        { code: "ITR", name: "Introduction",              from: 1,   to: 3,   foil: true },
        { code: "TOS", name: "Men's Team of the Season",  from: 4,   to: 14 },
        { code: "WTS", name: "Women's Team of the Season", from: 15, to: 25 },
        { code: "HTH", name: "Hat Trick Hero Legends",    from: 26,  to: 41,  foil: true },
        { code: "LEG", name: "Leading Legacies",          from: 266, to: 285 },
        { code: "1ST", name: "1st Sticker",               from: 286, to: 297 },
        { code: "UYL", name: "UEFA Youth League",         from: 564, to: 566 },
        { code: "ENL", name: "Energy Legends",            from: 567, to: 574, foil: true },
      ],
    },
  ],
};
