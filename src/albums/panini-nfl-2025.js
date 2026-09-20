/* ==================================================================
   PANINI · NFL STICKER & CARD COLLECTION 2025 — 564 stickers
   Opens with the 2024 international games and Super Bowl LIX (1–38),
   then all 32 teams in division order at 16 stickers each (39–550),
   the top 2025 draft picks and a four-piece foil logo puzzle.

   Verified: 38 + 512 + 10 + 4 = 564, numbering contiguous 1–564;
   every team range confirmed individually.
   Ranges: Checklist Insider (2025 Panini NFL Sticker & Card Collection).
   ================================================================== */

/* [code, team, first number, division, primary colour] — 16 each */
const TEAMS = [
  ["BUF", "Buffalo Bills",         39, "AFC East",  "#00338D"],
  ["MIA", "Miami Dolphins",        55, "AFC East",  "#008E97"],
  ["NE",  "New England Patriots",  71, "AFC East",  "#002244"],
  ["NYJ", "New York Jets",         87, "AFC East",  "#125740"],
  ["BAL", "Baltimore Ravens",     103, "AFC North", "#241773"],
  ["CIN", "Cincinnati Bengals",   119, "AFC North", "#FB4F14"],
  ["CLE", "Cleveland Browns",     135, "AFC North", "#311D00"],
  ["PIT", "Pittsburgh Steelers",  151, "AFC North", "#FFB612"],
  ["HOU", "Houston Texans",       167, "AFC South", "#03202F"],
  ["IND", "Indianapolis Colts",   183, "AFC South", "#002C5F"],
  ["JAX", "Jacksonville Jaguars", 199, "AFC South", "#006778"],
  ["TEN", "Tennessee Titans",     215, "AFC South", "#4B92DB"],
  ["DEN", "Denver Broncos",       231, "AFC West",  "#FB4F14"],
  ["KC",  "Kansas City Chiefs",   247, "AFC West",  "#E31837"],
  ["LV",  "Las Vegas Raiders",    263, "AFC West",  "#A5ACAF"],
  ["LAC", "Los Angeles Chargers", 279, "AFC West",  "#0080C6"],
  ["DAL", "Dallas Cowboys",       295, "NFC East",  "#003594"],
  ["NYG", "New York Giants",      311, "NFC East",  "#0B2265"],
  ["PHI", "Philadelphia Eagles",  327, "NFC East",  "#004C54"],
  ["WAS", "Washington Commanders", 343, "NFC East", "#5A1414"],
  ["CHI", "Chicago Bears",        359, "NFC North", "#0B162A"],
  ["DET", "Detroit Lions",        375, "NFC North", "#0076B6"],
  ["GB",  "Green Bay Packers",    391, "NFC North", "#203731"],
  ["MIN", "Minnesota Vikings",    407, "NFC North", "#4F2683"],
  ["ATL", "Atlanta Falcons",      423, "NFC South", "#A71930"],
  ["CAR", "Carolina Panthers",    439, "NFC South", "#0085CA"],
  ["NO",  "New Orleans Saints",   455, "NFC South", "#D3BC8D"],
  ["TB",  "Tampa Bay Buccaneers", 471, "NFC South", "#D50A0A"],
  ["ARI", "Arizona Cardinals",    487, "NFC West",  "#97233F"],
  ["LAR", "Los Angeles Rams",     503, "NFC West",  "#003594"],
  ["SF",  "San Francisco 49ers",  519, "NFC West",  "#AA0000"],
  ["SEA", "Seattle Seahawks",     535, "NFC West",  "#002244"],
];

export default {
  id: "panini-nfl-2025",
  publisher: "Panini",
  title: "NFL 2025",
  shortTitle: "NFL 2025",
  slug: "nfl2025",
  kicker: "NATIONAL FOOTBALL LEAGUE",
  tagline: "564 stickers across all 32 NFL teams.",
  year: 2026,
  sport: "american football",
  category: "American football",
  total: 564,
  status: "numbered",
  note: "Team pages and subsets from the published checklist; player names aren't included.",
  hasMeta: true,
  vocab: { unit: "Team", unitPlural: "Teams", section: "Section",
           sectionPlural: "Sections", meta: "Division" },
  displayOrder: ["TEAM", "★"],
  sections: [
    {
      id: "TEAM", label: "Teams", short: "TEAMS", color: "--p4",
      units: TEAMS.map(([code, name, from, meta, c1]) => ({ code, name, meta, from, to: from + 15, c1 })),
    },
    {
      id: "★", label: "Specials", short: "★ SPECIALS", color: "--gold", special: true,
      c1: "#C9982F", meta: "Specials",
      units: [
        { code: "ITL", name: "International Games & Super Bowl LIX", from: 1,   to: 38 },
        { code: "DFT", name: "2025 NFL Draft",                       from: 551, to: 560 },
        { code: "PUZ", name: "NFL Logo Puzzle",                      from: 561, to: 564, foil: true },
      ],
    },
  ],
};
