/* ==================================================================
   PANINI · SUPERSPORT HNL 2025/26 — 363
   Croatia's league album, made with the HNS. Ten clubs over four
   pages each, five feature runs, both lower divisions, and a poster
   sticker numbered 000 rather than 1.

   Verified: 1 poster + 2 + 15 + 5 + 10 + 10 + 10 + (10 × 28) + 12 +
   16 + 2 = 363, with 1–362 contiguous and the poster outside the run.
   The HNS and Panini both announce "363 sličica", ten clubs, the
   memorable-moments and awards pages and the SuperTeam poster —
   every part of that matches the checklist.
   Ranges: laststicker.com full checklist (Sept 2026).
   ================================================================== */

/* [code, club, colour] — 28 stickers each, from 53 */
const CLUBS = [
  ["DIN", "GNK Dinamo Zagreb",   "#1560BD"],
  ["GOR", "HNK Gorica",          "#1B4FA0"],
  ["HAJ", "HNK Hajduk",          "#D0202A"],
  ["IST", "NK Istra 1961",       "#0F8E4F"],
  ["LOK", "NK Lokomotiva",       "#16428C"],
  ["OSI", "NK Osijek",           "#0B57A4"],
  ["RIJ", "HNK Rijeka",          "#B01B22"],
  ["SLA", "NK Slaven Belupo",    "#1D74C0"],
  ["VAR", "NK Varaždin",        "#F7C600"],
  ["VUK", "HNK Vukovar 1991",    "#4A4A4A"],
];

export default {
  id: "panini-hnl-2025-26",
  publisher: "Panini",
  title: "SuperSport HNL 2025/26",
  shortTitle: "HNL",
  slug: "hnl2526",
  kicker: "SUPERSPORT HNL · CROATIA",
  tagline: "363 stickers across ten clubs.",
  year: 2026,
  sport: "football",
  category: "Football",
  total: 363,
  status: "numbered",
  note: "Club pages and subsets from the published checklist; player names aren't included. The SuperTeam poster sticker is numbered 000.",
  hasMeta: false,
  vocab: { unit: "Club", unitPlural: "Clubs", section: "Section",
           sectionPlural: "Sections", meta: "Section" },
  displayOrder: ["★", "HNL", "POS"],
  sections: [
    // Ranges first and in ascending order — clubs end at 332, the
    // feature runs end at 362 — so the 000 poster numbers last.
    {
      id: "HNL", label: "SuperSport HNL", short: "HNL", color: "--grass",
      units: CLUBS.map(([code, name, c1], i) =>
        ({ code, name, c1, from: 53 + i * 28, to: 80 + i * 28 })),
    },
    {
      id: "★", label: "Features", short: "★ FEATURES", color: "--gold", special: true,
      c1: "#C9982F",
      units: [
        { code: "UVO", name: "Uvod",                      from: 1,   to: 2   },
        { code: "TRE", name: "Trenuci za pamćenje",      from: 3,   to: 17  },
        { code: "NAG", name: "SuperSport HNL nagrade",    from: 18,  to: 22  },
        { code: "KAP", name: "Kapetani",                  from: 23,  to: 32  },
        { code: "NAJ", name: "Najbolji igrači",          from: 33,  to: 42  },
        { code: "NAD", name: "Nadolazeće zvijezde",      from: 43,  to: 52  },
        { code: "PRV", name: "SuperSport Prva NL",        from: 333, to: 344 },
        { code: "DRU", name: "SuperSport Druga NL",       from: 345, to: 360 },
        { code: "IKO", name: "Nogometne Ikone",           from: 361, to: 362 },
      ],
    },
    {
      id: "POS", label: "Poster", short: "★ POSTER", color: "--gold", special: true,
      c1: "#C9982F",
      units: [{ code: "POS", name: "SuperTeam poster",
        stickers: [["000", "SuperTeam poster"]] }],
    },
  ],
};
