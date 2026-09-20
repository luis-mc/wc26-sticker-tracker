/* ==================================================================
   PANINI · BARCLAYS WOMEN'S SUPER LEAGUE 2026 — 511
   The WSL logo, a three-sticker intro for each of the 12 WSL clubs,
   the 12 club pages at 33 each, the "This is..." subset dropped in
   mid-run at 236, then WSL2: a welcome sticker per club, the 12 clubs
   themselves and the six season-opener fixtures.

   Verified: 1 + 36 + (12 × 33) + 12 + 12 + 48 + 6 = 511, contiguous
   1–511 — the total published by both laststicker.com and Stickers.app.
   Ranges: laststicker.com full checklist (Sept 2026).

   Two things that look wrong in a filtered view but aren't. Arsenal
   reads 69 stickers if you count the intro and "This is..." entries
   that merely *name* the club; its own page is 38–70, 33 like everyone
   else. And WSL2's clubs are printed two to a page — badge, badge,
   then the two squads interleaved — so 458–505 is six pair-pages of 8,
   not twelve blocks of 4, and no club there holds a contiguous run.
   ================================================================== */

/* [code, club, first number, colour] — 33 stickers each */
const WSL = [
  ["ARS", "Arsenal",                 38, "#EF0107"],
  ["AVL", "Aston Villa",             71, "#670E36"],
  ["BHA", "Brighton & Hove Albion", 104, "#0057B8"],
  ["CHE", "Chelsea",                137, "#034694"],
  ["EVE", "Everton",                170, "#003399"],
  ["LEI", "Leicester City",         203, "#003090"],
  ["LIV", "Liverpool",              248, "#C8102E"],
  ["LCL", "London City Lionesses",  281, "#1D2B5C"],
  ["MCI", "Manchester City",        314, "#6CABDD"],
  ["MUN", "Manchester United",      347, "#DA291C"],
  ["TOT", "Tottenham Hotspur",      380, "#132257"],
  ["WHU", "West Ham United",        413, "#7A263A"],
];

/* [code, shared page, from, to, colour] — WSL2 clubs run two to a page */
const WSL2 = [
  ["BIR", "Birmingham City & Bristol City",     458, 465, "#0B27A0"],
  ["CHA", "Charlton Athletic & Crystal Palace", 466, 473, "#D4021D"],
  ["DUR", "Durham & Ipswich Town",              474, 481, "#14284B"],
  ["NEW", "Newcastle United & Nottingham Forest", 482, 489, "#DD0000"],
  ["POR", "Portsmouth & Sheffield United",      490, 497, "#001489"],
  ["SOU", "Southampton & Sunderland",           498, 505, "#D71920"],
];

export default {
  id: "panini-wsl-2026",
  publisher: "Panini",
  title: "Barclays Women's Super League 2026",
  shortTitle: "WSL",
  slug: "wsl2026",
  kicker: "WSL · ENGLAND",
  tagline: "511 stickers across both divisions.",
  year: 2026,
  sport: "football",
  category: "Football",
  total: 511,
  status: "numbered",
  note: "Club pages and subsets from the published checklist; player names aren't included. WSL2 clubs share a page in pairs, as the album prints them.",
  hasMeta: true,
  vocab: { unit: "Club", unitPlural: "Clubs", section: "Division",
           sectionPlural: "Divisions", meta: "Division" },
  displayOrder: ["★", "WSL", "WSL2"],
  sections: [
    {
      id: "★", label: "Features", short: "★ FEATURES", color: "--gold", special: true,
      c1: "#C9982F", meta: "Features",
      units: [
        { code: "WEL", name: "Welcome",            from: 1,   to: 1   },
        { code: "INT", name: "WSL Teams Intro",    from: 2,   to: 37  },
        { code: "TIS", name: "This is...",         from: 236, to: 247 },
        { code: "W2W", name: "WSL2 Welcome",       from: 446, to: 457 },
        { code: "W2O", name: "WSL2 Season Opener", from: 506, to: 511 },
      ],
    },
    {
      id: "WSL", label: "Women's Super League", short: "WSL", color: "--p4",
      units: WSL.map(([code, name, from, c1]) => ({ code, name, from, to: from + 32, c1, meta: "WSL" })),
    },
    {
      id: "WSL2", label: "WSL2", short: "WSL2", color: "--p6",
      units: WSL2.map(([code, name, from, to, c1]) => ({ code, name, from, to, c1, meta: "WSL2" })),
    },
  ],
};
