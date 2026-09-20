/* ==================================================================
   PANINI · NBA STICKER & CARD COLLECTION 2024-25 — 614
   514 stickers: six opening sections (1–98), all 30 teams at 13 each
   (99–488), NBA Legends and the NBA Logo puzzle (489–514). Then the
   100-card set, C1–C100.

   Verified: 1 + 10 + 21 + 22 + 24 + 20 + 390 + 20 + 6 = 514, numbering
   contiguous 1–514, plus 100 cards = 614 — matching both Panini's own
   "514 stickers + 100 cards" and laststicker's 614 total.
   Ranges: laststicker.com full checklist.
   Panini holds no NBA licence for 2025-26, so this is the current
   NBA sticker album.
   ================================================================== */

/* [code, team, first number, conference, primary colour] — 13 each */
const TEAMS = [
  ["ATL", "Atlanta Hawks",          99, "Eastern", "#E03A3E"],
  ["BOS", "Boston Celtics",        112, "Eastern", "#007A33"],
  ["BKN", "Brooklyn Nets",         125, "Eastern", "#000000"],
  ["CHA", "Charlotte Hornets",     138, "Eastern", "#1D1160"],
  ["CHI", "Chicago Bulls",         151, "Eastern", "#CE1141"],
  ["CLE", "Cleveland Cavaliers",   164, "Eastern", "#860038"],
  ["DET", "Detroit Pistons",       177, "Eastern", "#C8102E"],
  ["IND", "Indiana Pacers",        190, "Eastern", "#FDBB30"],
  ["MIA", "Miami Heat",            203, "Eastern", "#98002E"],
  ["MIL", "Milwaukee Bucks",       216, "Eastern", "#00471B"],
  ["NYK", "New York Knicks",       229, "Eastern", "#F58426"],
  ["ORL", "Orlando Magic",         242, "Eastern", "#0077C0"],
  ["PHI", "Philadelphia 76ers",    255, "Eastern", "#006BB6"],
  ["TOR", "Toronto Raptors",       268, "Eastern", "#CE1141"],
  ["WAS", "Washington Wizards",    281, "Eastern", "#002B5C"],
  ["DAL", "Dallas Mavericks",      294, "Western", "#00538C"],
  ["DEN", "Denver Nuggets",        307, "Western", "#0E2240"],
  ["GSW", "Golden State Warriors", 320, "Western", "#1D428A"],
  ["HOU", "Houston Rockets",       333, "Western", "#CE1141"],
  ["LAC", "LA Clippers",           346, "Western", "#C8102E"],
  ["LAL", "Los Angeles Lakers",    359, "Western", "#552583"],
  ["MEM", "Memphis Grizzlies",     372, "Western", "#5D76A9"],
  ["MIN", "Minnesota Timberwolves", 385, "Western", "#236192"],
  ["NOP", "New Orleans Pelicans",  398, "Western", "#0C2340"],
  ["OKC", "Oklahoma City Thunder", 411, "Western", "#007AC1"],
  ["PHX", "Phoenix Suns",          424, "Western", "#1D1160"],
  ["POR", "Portland Trail Blazers", 437, "Western", "#E03A3E"],
  ["SAC", "Sacramento Kings",      450, "Western", "#5A2D81"],
  ["SAS", "San Antonio Spurs",     463, "Western", "#C4CED4"],
  ["UTA", "Utah Jazz",             476, "Western", "#002B5C"],
];

export default {
  id: "panini-nba-2024-25",
  publisher: "Panini",
  title: "NBA 2024-25",
  shortTitle: "NBA 24/25",
  slug: "nba2425",
  kicker: "NBA BASKETBALL",
  tagline: "514 stickers and 100 cards across all 30 teams.",
  year: 2026,
  sport: "basketball",
  category: "Basketball",
  total: 614,
  status: "numbered",
  note: "Team pages, subsets and the card set from the published checklist; player names aren't included.",
  hasMeta: true,
  vocab: { unit: "Team", unitPlural: "Teams", section: "Section",
           sectionPlural: "Sections", meta: "Conference" },
  displayOrder: ["TEAM", "★", "CARD"],
  sections: [
    // Ranges first, so the card list that follows keeps numbering after 514.
    {
      id: "TEAM", label: "Teams", short: "TEAMS", color: "--p5",
      units: TEAMS.map(([code, name, from, meta, c1]) => ({ code, name, meta, from, to: from + 12, c1 })),
    },
    {
      id: "★", label: "Subsets", short: "★ SUBSETS", color: "--gold", special: true,
      c1: "#C9982F", meta: "Subsets",
      units: [
        { code: "ITR", name: "Introduction",   from: 1,   to: 1 },
        { code: "CUP", name: "NBA Cup",        from: 2,   to: 11 },
        { code: "FIN", name: "NBA Finals",     from: 12,  to: 32 },
        { code: "SNK", name: "Sneaker Stars",  from: 33,  to: 54 },
        { code: "GLB", name: "Global Icons",   from: 55,  to: 78 },
        { code: "DFT", name: "Draft 2024",     from: 79,  to: 98 },
        { code: "LEG", name: "NBA Legends",    from: 489, to: 508 },
        { code: "LOG", name: "NBA Logo",       from: 509, to: 514, foil: true },
      ],
    },
    {
      id: "CARD", label: "Cards", short: "★ CARDS", color: "--p3", special: true,
      c1: "#7860AA", meta: "Cards",
      units: [{
        code: "CRD", name: "Card set", kind: "card",
        stickers: Array.from({ length: 100 }, (_, i) => [`C${i + 1}`, `Card ${i + 1}`]),
      }],
    },
  ],
};
