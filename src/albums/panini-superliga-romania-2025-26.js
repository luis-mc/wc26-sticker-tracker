/* ==================================================================
   PANINI · SUPERLIGA ROMÂNIEI 2025/26 — 344
   Romanian football's return to Panini after several years away, made
   with the LPF. Sixteen clubs at 17 stickers each, six feature runs
   and the official ball to close.

   Verified: 1 cover + 2 logo + 8 Campionii + 12 Echipa națională +
   16 Cei mai valoroși + 16 Echipe + 16 Stea în devenire + (16 × 17)
   + 1 ball = 344, contiguous 1–344 with no coded stickers anywhere.
   Panini România describes exactly this shape — 16 clubs on double
   pages, special pages for the best players and for FCSB's 2025
   title — and quotes "over 300 stickers".
   Ranges: laststicker.com full checklist (Sept 2026).
   ================================================================== */

/* [code, club, colour] — 17 stickers each, from 72 */
const CLUBS = [
  ["FCS", "FCSB",                        "#D0202A"],
  ["CFR", "CFR Cluj",                    "#7A1C2E"],
  ["CRA", "U Craiova",                   "#1560BD"],
  ["UCL", "U Cluj",                      "#4A4A4A"],
  ["RAP", "FC Rapid Bucureşti",         "#6B2D8B"],
  ["DIN", "Dinamo Bucureşti",           "#B01B22"],
  ["HER", "AFC Hermannstadt",            "#C5192D"],
  ["OTE", "SC Oţelul Galaţi",          "#1B4FA0"],
  ["PET", "FC Petrolul Ploieşti",       "#F7C600"],
  ["UTA", "UTA Arad",                    "#D22630"],
  ["FAR", "FC Farul Constanţa",         "#0B57A4"],
  ["BOT", "FC Botoşani",                "#A81E28"],
  ["SLO", "AFC Unirea 04 Slobozia",      "#00A54F"],
  ["ARG", "FC Argeş Piteşti",          "#8E44AD"],
  ["CSI", "FC Csíkszereda",             "#BE1E2D"],
  ["MET", "FC Metaloglobus Bucureşti",  "#1D74C0"],
];

export default {
  id: "panini-superliga-romania-2025-26",
  publisher: "Panini",
  title: "Superliga României 2025/26",
  shortTitle: "SUPERLIGA RO",
  slug: "superligaro2526",
  kicker: "SUPERLIGA · ROMANIA",
  tagline: "344 stickers across 16 clubs.",
  year: 2026,
  sport: "football",
  category: "Football",
  total: 344,
  status: "numbered",
  note: "Club pages and subsets from the published checklist; player names aren't included.",
  hasMeta: false,
  vocab: { unit: "Club", unitPlural: "Clubs", section: "Section",
           sectionPlural: "Sections", meta: "Section" },
  displayOrder: ["★", "SL"],
  sections: [
    {
      id: "★", label: "Features", short: "★ FEATURES", color: "--gold", special: true,
      c1: "#C9982F",
      units: [
        { code: "COV", name: "Album",                  from: 1,   to: 1   },
        { code: "LOG", name: "Logo",                   from: 2,   to: 3   },
        { code: "CAM", name: "Campionii 2024-2025",    from: 4,   to: 11  },
        { code: "NAT", name: "Echipa naţională",      from: 12,  to: 23  },
        { code: "VAL", name: "Cei mai valoroşi",      from: 24,  to: 39  },
        { code: "ECH", name: "Echipe",                 from: 40,  to: 55  },
        { code: "STE", name: "Stea în devenire",      from: 56,  to: 71  },
        { code: "MIN", name: "Mingea Oficială",       from: 344, to: 344 },
      ],
    },
    {
      id: "SL", label: "Superliga", short: "SUPERLIGA", color: "--grass",
      units: CLUBS.map(([code, name, c1], i) =>
        ({ code, name, c1, from: 72 + i * 17, to: 88 + i * 17 })),
    },
  ],
};
