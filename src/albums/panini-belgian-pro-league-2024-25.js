/* ==================================================================
   PANINI · BELGIAN PRO LEAGUE 2024/25 — 463
   Belgium has no 2025/26 album — Panini has not published one — so
   this is the current Belgian collection, on the same footing as the
   NBA 2024-25 album already on the shelf.

   Sixteen Pro League clubs at 26 stickers each, then two divisions
   printed four clubs to a page: a 6-sticker block of two club-badge
   stickers followed by the four team photos. Four such blocks cover
   the 16 Challenger Pro League clubs, two more cover the 8 Super
   League (women's) clubs.

   Verified: 1 ball + (16 × 26) + (4 × 6) + (2 × 6) = 453, contiguous
   1–453, plus LE1–LE10 = 463. The 453 + 10 split is what the earlier
   research recorded; 463 is laststicker.com's total. They agree.
   Ranges: laststicker.com full checklist (Sept 2026).
   ================================================================== */

/* [code, club, colour] — 26 stickers each, from 2 */
const PRO_LEAGUE = [
  ["AND", "RSC Anderlecht",      "#562C82"],
  ["ANT", "Royal Antwerp FC",    "#E2001A"],
  ["BEE", "K. Beerschot V.A.",   "#6B2D8B"],
  ["CER", "Cercle Brugge",       "#00A54F"],
  ["CHA", "Sporting Charleroi",  "#4A4A4A"],
  ["CLB", "Club Brugge",         "#1560BD"],
  ["DEN", "FCV Dender EH",       "#B01B22"],
  ["GEN", "KRC Genk",            "#0B57A4"],
  ["GNT", "KAA Gent",            "#1D74C0"],
  ["KOR", "KV Kortrijk",         "#D0202A"],
  ["MEC", "KV Mechelen",         "#F7C600"],
  ["OHL", "OH Leuven",           "#4F4F4F"],
  ["USG", "Union SG",            "#E8B000"],
  ["STA", "Standard de Liège",  "#D01317"],
  ["STV", "STVV",                "#E0A800"],
  ["WES", "KVC Westerlo",        "#EAB308"],
];

/* Four clubs to a page: two badges then four team photos. */
const CHALLENGER = [
  ["CP1", "Beveren · NXT · Deinze · Eupen",                    418],
  ["CP2", "Borains · Jong Genk · RAAL · Liège",  424],
  ["CP3", "Lierse · Lokeren · Lommel · Patro",   430],
  ["CP4", "RSCA Futures · RWDM · Seraing · Zulte", 436],
];

const SUPER_LEAGUE = [
  ["SL1", "RSCA · Club YLA · Genk · Gent",       442],
  ["SL2", "OHL · Standard · Westerlo · Essevee", 448],
];

export default {
  id: "panini-belgian-pro-league-2024-25",
  publisher: "Panini",
  title: "Belgian Pro League 2024/25",
  shortTitle: "PRO LEAGUE",
  slug: "proleague2425",
  kicker: "PRO LEAGUE · BELGIUM",
  tagline: "463 stickers across three divisions.",
  year: 2025,
  sport: "football",
  category: "Football",
  total: 463,
  status: "numbered",
  note: "Belgium's most recent album — no 2025/26 collection has been published. Club pages from the published checklist; player names aren't included.",
  hasMeta: true,
  vocab: { unit: "Club", unitPlural: "Clubs", section: "Division",
           sectionPlural: "Divisions", meta: "Division" },
  displayOrder: ["OPN", "PL", "CPL", "SL", "LE"],
  sections: [
    // Ranges first and in ascending order — 1, then 2–417, 418–441,
    // 442–453 — so the lettered Limited Editions follow at 454.
    {
      id: "OPN", label: "Opening", short: "OPENING", color: "--gold", special: true,
      c1: "#C9982F", meta: "Opening",
      units: [{ code: "BAL", name: "Pro League Ball", from: 1, to: 1 }],
    },
    {
      id: "PL", label: "Pro League", short: "PRO LEAGUE", color: "--grass",
      units: PRO_LEAGUE.map(([code, name, c1], i) =>
        ({ code, name, c1, meta: "Pro League", from: 2 + i * 26, to: 27 + i * 26 })),
    },
    {
      id: "CPL", label: "Challenger Pro League", short: "CHALLENGER", color: "--p6",
      units: CHALLENGER.map(([code, name, from]) =>
        ({ code, name, meta: "Challenger Pro League", from, to: from + 5 })),
    },
    {
      id: "SL", label: "Super League", short: "SUPER LEAGUE", color: "--sky",
      units: SUPER_LEAGUE.map(([code, name, from]) =>
        ({ code, name, c1: "#5080D0", meta: "Super League", from, to: from + 5 })),
    },
    {
      id: "LE", label: "Limited Edition", short: "★ LIMITED", color: "--gold",
      special: true, c1: "#C9982F", meta: "Limited Edition",
      units: [{ code: "LED", name: "Limited Edition", foil: true,
        stickers: Array.from({ length: 10 }, (_, i) => ["LE" + (i + 1), "Limited Edition " + (i + 1)]) }],
    },
  ],
};
