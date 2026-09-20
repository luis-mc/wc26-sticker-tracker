/* ==================================================================
   PANINI · TOUR DE FRANCE 2026 — LA COLLECTION DE STICKERS — 354
   The base album runs 1–325: the Tour logo, seven Legends foils, the
   22 Grand Départ-to-Paris stage stickers, 18 men's WorldTour squads
   at 14 each (logo, action foil, jersey foil, bike foil + riders), the
   Tour de France Femmes title foil, and 14 women's squads at 3 each.
   The 29-sticker "Update set" (T1–T29) is sold after the race with the
   real stage winners and jersey holders.

   Verified: 1 + 7 + 22 + (18 × 14) + 1 + (14 × 3) = 325 numbered,
   contiguous 1–325, plus 29 lettered = 354 — the same total published
   by both laststicker.com and Stickers.app. (Panini's own "325" quote
   counts the base album only; the update set closes the gap.)
   Ranges: laststicker.com full checklist (Sept 2026).

   laststicker's section list carries each of Lidl-Trek, Movistar,
   Visma-Lease a Bike and Uno-X twice, once misspelled — those pairs are
   the men's and women's squads, split here at 283 where the Femmes
   section starts.
   ================================================================== */

/* [code, squad, from, to, colour] — 14 stickers each */
const MEN = [
  ["ALP", "Alpecin-Premier Tech",       31,  44, "#1B6B6E"],
  ["BAH", "Bahrain Victorious",         45,  58, "#A6192E"],
  ["DEC", "Decathlon CMA CGM Team",     59,  72, "#0082C3"],
  ["EFE", "EF Education-EasyPost",      73,  86, "#E6007E"],
  ["GFD", "Groupama-FDJ United",        87, 100, "#005BAA"],
  ["INE", "Ineos Grenadiers",          101, 114, "#1A2B4C"],
  ["LTM", "Lidl-Trek",                 115, 128, "#0050AA"],
  ["LOT", "Lotto Intermarché",     129, 142, "#E2001A"],
  ["MOV", "Movistar Team",             143, 156, "#009FE3"],
  ["NSN", "NSN Cycling Team",          157, 170, "#2E4A9E"],
  ["RBH", "Red Bull-Bora-Hansgrohe",   171, 184, "#001E5A"],
  ["SQS", "Soudal Quick-Step",         185, 198, "#0B1F3B"],
  ["JAY", "Team Jayco AlUla",          199, 212, "#1BA8DD"],
  ["PIM", "Team Picnic PostNL",        213, 226, "#F26B21"],
  ["VIM", "Team Visma-Lease a Bike",   227, 240, "#F9E300"],
  ["UAE", "UAE Team Emirates XRG",     241, 254, "#D2232A"],
  ["UNM", "Uno-X Mobility",            255, 268, "#F4623A"],
  ["AST", "XDS Astana Team",           269, 282, "#00A0E1"],
];

/* [code, squad, from, to, colour] — 3 stickers each */
const WOMEN = [
  ["AGI", "AG Insurance-Soudal",       284, 286, "#009640"],
  ["CAN", "Canyon//SRAM zondacrypto",  287, 289, "#00B2A9"],
  ["EFO", "EF Education-Oatly",        290, 292, "#E6007E"],
  ["FDJ", "FDJ United-SUEZ",           293, 295, "#005BAA"],
  ["FEN", "Fenix-Premier Tech",        296, 298, "#8E1F3B"],
  ["HPH", "Human Powered Health",      299, 301, "#78BE20"],
  ["LTW", "Lidl-Trek",                 302, 304, "#0050AA"],
  ["LIV", "Liv AlUla Jayco",           305, 307, "#6CB33F"],
  ["MOW", "Movistar Team",             308, 310, "#009FE3"],
  ["PIW", "Team Picnic PostNL",        311, 313, "#F26B21"],
  ["SDW", "Team SD Worx-Protime",      314, 316, "#003DA5"],
  ["VIW", "Team Visma-Lease a Bike",   317, 319, "#F9E300"],
  ["ADQ", "UAE Team ADQ",              320, 322, "#D2232A"],
  ["UNW", "Uno-X Mobility",            323, 325, "#F4623A"],
];

export default {
  id: "panini-tour-de-france-2026",
  publisher: "Panini",
  title: "Tour de France 2026",
  shortTitle: "TOUR DE FRANCE",
  slug: "tdf2026",
  kicker: "LA COLLECTION DE STICKERS",
  tagline: "325 stickers across 32 squads, plus the 29-sticker update set.",
  year: 2026,
  sport: "cycling",
  category: "Cycling",
  total: 354,
  status: "numbered",
  note: "Squad pages and subsets from the published checklist; rider names aren't included.",
  hasMeta: true,
  vocab: { unit: "Squad", unitPlural: "Squads", section: "Section",
           sectionPlural: "Sections", meta: "Peloton" },
  displayOrder: ["★", "MEN", "WOM", "UPD"],
  sections: [
    // Ranges first and ending at 325, so the lettered update set numbers on
    // from 326.
    {
      id: "★", label: "The Tour", short: "★ THE TOUR", color: "--gold", special: true,
      c1: "#C9982F", meta: "The Tour",
      units: [
        { code: "LOG", name: "Tour de France",        from: 1,   to: 1 },
        { code: "LEG", name: "Legends",               from: 2,   to: 8,   foil: true },
        { code: "STG", name: "Stages",                from: 9,   to: 30,  c1: "#5080D0" },
        { code: "FEM", name: "Tour de France Femmes", from: 283, to: 283, foil: true },
      ],
    },
    {
      id: "MEN", label: "Men's squads", short: "MEN", color: "--grass",
      units: MEN.map(([code, name, from, to, c1]) => ({ code, name, from, to, c1, meta: "Men" })),
    },
    {
      id: "WOM", label: "Women's squads", short: "WOMEN", color: "--sky",
      units: WOMEN.map(([code, name, from, to, c1]) => ({ code, name, from, to, c1, meta: "Women" })),
    },
    {
      id: "UPD", label: "Update set", short: "★ UPDATE SET", color: "--gold", special: true,
      c1: "#C9982F", meta: "Update set",
      units: [
        { code: "VET", name: "Vainqueur d'Étape",
          stickers: Array.from({ length: 21 }, (_, i) => [`T${i + 1}`, `Stage ${i + 1} winner`]) },
        { code: "MAI", name: "Maillot",
          stickers: Array.from({ length: 8 }, (_, i) => [`T${i + 22}`, `Maillot ${i + 1}`]) },
      ],
    },
  ],
};
