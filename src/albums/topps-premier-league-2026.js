/* ==================================================================
   TOPPS · PREMIER LEAGUE OFFICIAL STICKERS 2026 — 561 stickers
   Topps took the Premier League sticker licence back from Panini for
   the 2026 collection: a 96-page album, 20 clubs at 26 stickers each
   (520) plus 41 across five feature sections.

   Tracked by sticker number — Topps publishes the per-club ranges but
   not a public per-sticker name list, so the album is "numbered".
   Checklist ranges: Football Cartophilic Info Exchange (Jan 2026).
   Confirmed against laststicker.com (Sept 2026): its numbered run is
   1–561 with no gap and every club range matches. Stickers.app's 583
   additionally counts 20 sticker-cards and 2 others that sit outside
   the numbering.
   ================================================================== */

/* [code, club, first number, primary colour] — 26 stickers each, in
   checklist (alphabetical) order, split around the feature spreads. */
const CLUBS = [
  ["ARS", "Arsenal",                  17, "#EF0107"],
  ["AVL", "Aston Villa",              43, "#670E36"],
  ["BOU", "AFC Bournemouth",          69, "#DA291C"],
  ["BRE", "Brentford",                95, "#E30613"],
  ["BHA", "Brighton & Hove Albion",  121, "#0057B8"],
  ["BUR", "Burnley",                 147, "#6C1D45"],
  ["CHE", "Chelsea",                 173, "#034694"],
  ["CRY", "Crystal Palace",          199, "#1B458F"],
  ["EVE", "Everton",                 225, "#003399"],
  ["FUL", "Fulham",                  251, "#000000"],
  ["LEE", "Leeds United",            293, "#FFCD00"],
  ["LIV", "Liverpool",               319, "#C8102E"],
  ["MCI", "Manchester City",         345, "#6CABDD"],
  ["MUN", "Manchester United",       371, "#DA291C"],
  ["NEW", "Newcastle United",        397, "#241F20"],
  ["NFO", "Nottingham Forest",       423, "#DD0000"],
  ["SUN", "Sunderland",              449, "#EB172B"],
  ["TOT", "Tottenham Hotspur",       475, "#132257"],
  ["WHU", "West Ham United",         501, "#7A263A"],
  ["WOL", "Wolverhampton Wanderers", 527, "#FDB913"],
];

export default {
  id: "topps-pl-2026",
  publisher: "Topps",
  title: "Premier League 2026",
  shortTitle: "PREMIER LEAGUE",
  slug: "pl26",
  kicker: "PREMIER LEAGUE 2025/26",
  tagline: "561 stickers across 20 clubs.",
  year: 2026,
  sport: "football",
  category: "Football",
  total: 561,
  status: "numbered",
  note: "Sticker numbers and club pages from the published checklist; player names aren't included.",
  hasMeta: false,
  vocab: { unit: "Club", unitPlural: "Clubs", section: "Section",
           sectionPlural: "Sections", meta: "Section" },
  displayOrder: ["CLUB", "★"],
  sections: [
    {
      id: "CLUB", label: "Clubs", short: "CLUBS", color: "--p2",
      units: CLUBS.map(([code, name, from, c1]) => ({ code, name, from, to: from + 25, c1 })),
    },
    {
      id: "★", label: "Features", short: "★ FEATURES", color: "--gold", special: true,
      c1: "#C9982F",
      units: [
        { code: "INT", name: "Introduction",          from: 1,   to: 4,   foil: true },
        { code: "HOF", name: "Hall of Fame",          from: 5,   to: 16,  foil: true },
        { code: "TRB", name: "Trailblazers 1992–2026", from: 277, to: 284 },
        { code: "DUO", name: "Dominant Duos",         from: 285, to: 292 },
        { code: "DIV", name: "Divine 9",              from: 553, to: 561 },
      ],
    },
  ],
};
