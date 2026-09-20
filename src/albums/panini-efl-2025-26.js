/* ==================================================================
   PANINI · EFL 2025/26 — 788 stickers
   The biggest album in the catalogue: 24 Championship clubs at 18
   stickers each, 24 League One clubs at 8 (Wycombe 9), a League Two
   section of 96, and five feature sections.

   Verified: 16 + 432 + 24 + 12 + 193 + 15 + 96 = 788, numbering
   contiguous 1–788. Ranges: Football Cartophilic Info Exchange (Nov 2025).
   ================================================================== */

/* Championship — 18 stickers each, split around the Elites spread */
const CHAMPIONSHIP = [
  ["BIR", "Birmingham City",         17, "#0000FF"],
  ["BLB", "Blackburn Rovers",        35, "#009EE0"],
  ["BRC", "Bristol City",            53, "#E31B23"],
  ["CHA", "Charlton Athletic",       71, "#D50032"],
  ["COV", "Coventry City",           89, "#6CACE4"],
  ["DER", "Derby County",           107, "#000000"],
  ["HUL", "Hull City",              125, "#F18A01"],
  ["IPS", "Ipswich Town",           143, "#3A64A3"],
  ["LEI", "Leicester City",         161, "#003090"],
  ["MID", "Middlesbrough",          179, "#E21C38"],
  ["MIL", "Millwall",               197, "#001D5B"],
  ["NOR", "Norwich City",           215, "#FFF200"],
  ["OXF", "Oxford United",          257, "#FFD200"],
  ["POR", "Portsmouth",             275, "#001489"],
  ["PNE", "Preston North End",      293, "#B2B2B2"],
  ["QPR", "Queens Park Rangers",    311, "#1D5BA4"],
  ["SHU", "Sheffield United",       329, "#EE2737"],
  ["SHW", "Sheffield Wednesday",    347, "#0066B3"],
  ["SOU", "Southampton",            365, "#D71920"],
  ["STK", "Stoke City",             383, "#E03A3E"],
  ["SWA", "Swansea City",           401, "#FFFFFF"],
  ["WAT", "Watford",                419, "#FBEE23"],
  ["WBA", "West Bromwich Albion",   437, "#122F67"],
  ["WRE", "Wrexham AFC",            455, "#DD0000"],
];

/* League One — 8 stickers each, except Wycombe with 9 */
const LEAGUE_ONE = [
  ["AFW", "AFC Wimbledon",          485, 8, "#004A97"],
  ["BAR", "Barnsley",               493, 8, "#E4002B"],
  ["BLP", "Blackpool",              501, 8, "#F68712"],
  ["BOL", "Bolton Wanderers",       509, 8, "#263C7E"],
  ["BRA", "Bradford City",          517, 8, "#800000"],
  ["BUR", "Burton Albion",          525, 8, "#FFCC00"],
  ["CAR", "Cardiff City",           533, 8, "#0070B5"],
  ["DON", "Doncaster Rovers",       541, 8, "#E4002B"],
  ["EXE", "Exeter City",            549, 8, "#E4002B"],
  ["HUD", "Huddersfield Town",      557, 8, "#0E63AD"],
  ["LEY", "Leyton Orient",          565, 8, "#E4002B"],
  ["LIN", "Lincoln City",           573, 8, "#E4002B"],
  ["LUT", "Luton Town",             581, 8, "#F78F1E"],
  ["MAN", "Mansfield Town",         589, 8, "#FFD100"],
  ["NOT", "Northampton Town",       597, 8, "#7C2529"],
  ["PET", "Peterborough United",    605, 8, "#0055A5"],
  ["PLY", "Plymouth Argyle",        613, 8, "#007B5F"],
  ["PVA", "Port Vale",              621, 8, "#FFFFFF"],
  ["REA", "Reading",                629, 8, "#004494"],
  ["ROT", "Rotherham United",       637, 8, "#E4002B"],
  ["STE", "Stevenage",              645, 8, "#E4002B"],
  ["STO", "Stockport County",       653, 8, "#0055A5"],
  ["WIG", "Wigan Athletic",         661, 8, "#1D60AA"],
  ["WYC", "Wycombe Wanderers",      669, 9, "#003DA5"],
];

export default {
  id: "panini-efl-2025-26",
  publisher: "Panini",
  title: "EFL 2025/26",
  shortTitle: "EFL 25/26",
  slug: "efl2526",
  kicker: "ENGLISH FOOTBALL LEAGUE",
  tagline: "788 stickers across the EFL.",
  year: 2026,
  sport: "football",
  category: "Football",
  total: 788,
  status: "numbered",
  note: "Club pages and feature sections from the published checklist; player names aren't included.",
  hasMeta: true,
  vocab: { unit: "Club", unitPlural: "Clubs", section: "Division",
           sectionPlural: "Divisions", meta: "Division" },
  displayOrder: ["CH", "L1", "L2", "★"],
  sections: [
    {
      id: "CH", label: "Championship", short: "CHAMPIONSHIP", color: "--p2",
      units: CHAMPIONSHIP.map(([code, name, from, c1]) => ({ code, name, from, to: from + 17, c1 })),
    },
    {
      id: "L1", label: "League One", short: "LEAGUE ONE", color: "--p6",
      units: LEAGUE_ONE.map(([code, name, from, n, c1]) => ({ code, name, from, to: from + n - 1, c1 })),
    },
    {
      id: "L2", label: "League Two", short: "LEAGUE TWO", color: "--p3", c1: "#7860AA",
      units: [{ code: "LT2", name: "League Two", from: 693, to: 788 }],
    },
    {
      id: "★", label: "Features", short: "★ FEATURES", color: "--gold", special: true,
      c1: "#C9982F",
      units: [
        { code: "WEL", name: "Welcome",                      from: 1,   to: 5 },
        { code: "PRO", name: "Promotions & Play-Offs 24/25", from: 6,   to: 16 },
        { code: "ELI", name: "Elites",                       from: 233, to: 256, foil: true },
        { code: "OTW", name: "Ones to Watch",                from: 473, to: 484 },
        { code: "RIE", name: "Raised in the EFL",            from: 678, to: 692 },
      ],
    },
  ],
};
