/* ==================================================================
   TOPPS · NHL STICKER COLLECTION 2025-26 — 800 stickers
   The base set runs 1–544: all 32 NHL teams, alphabetical, 17 stickers
   each (team logo foil, team threads, mascot foil and 14 players).
   Sixteen themed subsets then run 545–800.

   Verified: 544 + 256 = 800, numbering contiguous 1–800.
   Ranges: Checklist Insider (2025-26 Topps NHL Sticker Collection).
   Note: the source's two passes split 545–576 differently; it is the
   Captains block either way (32 = one per team), and no number in the
   sequence is left unaccounted for.
   ================================================================== */

/* [code, team, first number, division, primary colour] — 17 each */
const TEAMS = [
  ["ANA", "Anaheim Ducks",         1, "Pacific",      "#F47A38"],
  ["BOS", "Boston Bruins",        18, "Atlantic",     "#FFB81C"],
  ["BUF", "Buffalo Sabres",       35, "Atlantic",     "#003087"],
  ["CGY", "Calgary Flames",       52, "Pacific",      "#D2001C"],
  ["CAR", "Carolina Hurricanes",  69, "Metropolitan", "#CE1126"],
  ["CHI", "Chicago Blackhawks",   86, "Central",      "#CF0A2C"],
  ["COL", "Colorado Avalanche",  103, "Central",      "#6F263D"],
  ["CBJ", "Columbus Blue Jackets", 120, "Metropolitan", "#002654"],
  ["DAL", "Dallas Stars",        137, "Central",      "#006847"],
  ["DET", "Detroit Red Wings",   154, "Atlantic",     "#CE1126"],
  ["EDM", "Edmonton Oilers",     171, "Pacific",      "#FF4C00"],
  ["FLA", "Florida Panthers",    188, "Atlantic",     "#C8102E"],
  ["LAK", "Los Angeles Kings",   205, "Pacific",      "#A2AAAD"],
  ["MIN", "Minnesota Wild",      222, "Central",      "#154734"],
  ["MTL", "Montreal Canadiens",  239, "Atlantic",     "#AF1E2D"],
  ["NSH", "Nashville Predators", 256, "Central",      "#FFB81C"],
  ["NJD", "New Jersey Devils",   273, "Metropolitan", "#CE1126"],
  ["NYI", "New York Islanders",  290, "Metropolitan", "#00539B"],
  ["NYR", "New York Rangers",    307, "Metropolitan", "#0038A8"],
  ["OTT", "Ottawa Senators",     324, "Atlantic",     "#C52032"],
  ["PHI", "Philadelphia Flyers", 341, "Metropolitan", "#F74902"],
  ["PIT", "Pittsburgh Penguins", 358, "Metropolitan", "#FCB514"],
  ["SJS", "San Jose Sharks",     375, "Pacific",      "#006D75"],
  ["SEA", "Seattle Kraken",      392, "Pacific",      "#99D9D9"],
  ["STL", "St. Louis Blues",     409, "Central",      "#002F87"],
  ["TBL", "Tampa Bay Lightning", 426, "Atlantic",     "#002868"],
  ["TOR", "Toronto Maple Leafs", 443, "Atlantic",     "#00205B"],
  ["UTA", "Utah Mammoth",        460, "Central",      "#71AFE5"],
  ["VAN", "Vancouver Canucks",   477, "Pacific",      "#00843D"],
  ["VGK", "Vegas Golden Knights", 494, "Pacific",     "#B4975A"],
  ["WSH", "Washington Capitals", 511, "Metropolitan", "#C8102E"],
  ["WPG", "Winnipeg Jets",       528, "Central",      "#041E42"],
];

export default {
  id: "topps-nhl-2025-26",
  publisher: "Topps",
  title: "NHL 2025-26",
  shortTitle: "NHL 25/26",
  slug: "nhl2526",
  kicker: "NATIONAL HOCKEY LEAGUE",
  tagline: "800 stickers across all 32 NHL teams.",
  year: 2026,
  sport: "ice hockey",
  category: "Ice hockey",
  total: 800,
  status: "numbered",
  note: "Team pages and subsets from the published checklist; player names aren't included.",
  hasMeta: true,
  vocab: { unit: "Team", unitPlural: "Teams", section: "Section",
           sectionPlural: "Sections", meta: "Division" },
  displayOrder: ["TEAM", "★"],
  sections: [
    {
      id: "TEAM", label: "Teams", short: "TEAMS", color: "--p2",
      units: TEAMS.map(([code, name, from, meta, c1]) => ({ code, name, meta, from, to: from + 16, c1 })),
    },
    {
      id: "★", label: "Subsets", short: "★ SUBSETS", color: "--gold", special: true,
      c1: "#C9982F", meta: "Subsets",
      units: [
        { code: "CAP", name: "2024-25 Captains",         from: 545, to: 576 },
        { code: "TST", name: "Three Stars of the Month", from: 577, to: 594 },
        { code: "LDR", name: "League Leaders",           from: 595, to: 624 },
        { code: "RKS", name: "Rookie Spotlight",         from: 625, to: 634 },
        { code: "GOA", name: "Goaltenders",              from: 635, to: 642 },
        { code: "CHA", name: "The Great Chase",          from: 643, to: 650 },
        { code: "HAT", name: "Hat Trick",                from: 651, to: 666 },
        { code: "R89", name: "1989-90 Rookies",          from: 667, to: 686 },
        { code: "C2C", name: "From Coast to Coast",      from: 687, to: 704, foil: true },
        { code: "OUT", name: "Great Outdoors",           from: 705, to: 716 },
        { code: "QCT", name: "Quarter Century Team",     from: 717, to: 728 },
        { code: "CEN", name: "Centennial Celebration",   from: 729, to: 764 },
        { code: "SCC", name: "Stanley Cup Celebration",  from: 765, to: 769 },
        { code: "THR", name: "2020-21 Throwback",        from: 770, to: 785 },
        { code: "AWD", name: "NHL Awards",               from: 786, to: 794 },
        { code: "PUZ", name: "Stanley Cup Puzzle",       from: 795, to: 800, foil: true },
      ],
    },
  ],
};
