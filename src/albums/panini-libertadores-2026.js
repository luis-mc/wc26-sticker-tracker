/* ==================================================================
   PANINI · CONMEBOL LIBERTADORES 2026 — 523
   A Panini Brasil album, so most of it is coded rather than numbered:
   each of the 32 clubs gets its own three-letter prefix (FLB1–FLB17
   for Flamengo, BOA1–BOA8 for Boca Juniors), and only the opening
   tribute, the Milestones history run and the women's "As Brabas"
   subset carry plain numbers 1–38.

   Verified: 38 numbered + (16 clubs × 17) + (16 clubs × 8) + PUMA1 +
   SUD1–4 = 443 stickers, which is exactly the figure Panini itself
   publishes; plus the 80-card set T1–T80 = 523, which is the total
   laststicker.com publishes. The two sources were never in conflict —
   one counts the cards and the other doesn't.
   Ranges: laststicker.com full checklist (Sept 2026).

   Every club range closes at 17 or 8 with no gap. Stickers.app says
   521, two short of every other count, and nothing in the checklist
   explains the difference; the per-sticker list is preferred here.
   ================================================================== */

/* Each club page opens with its badge and kits, then the squad. */
const club = (code, name, count, c1) => ({
  code, name, c1,
  stickers: Array.from({ length: count }, (_, i) =>
    [`${code}${i + 1}`, i === 0 ? "Escudo" : i === 1 ? "Uniforme 1 e 2" : name]),
});

/* [code, club, stickers, colour] — in album order */
const CLUBS = [
  ["FLB", "Flamengo",                 17, "#C52613"],
  ["ESA", "Estudiantes",              17, "#D5122A"],
  ["MEC", "Independiente Medellín",  8, "#C8102E"],
  ["CUP", "Cusco",                     8, "#B8232F"],
  ["COC", "Coquimbo Unido",           17, "#F7C600"],
  ["TOC", "Tolima",                   17, "#B4121B"],
  ["NAU", "Nacional",                  8, "#0C3C78"],
  ["UNP", "Universitario",             8, "#6E1A2B"],
  ["RIA", "Independiente Rivadavia",  17, "#003DA5"],
  ["FLU", "Fluminense",               17, "#7E2532"],
  ["BOB", "Bolívar",                  8, "#1D6FB8"],
  ["GUV", "Deportivo La Guaira",       8, "#E95A0C"],
  ["CAC", "Universidad Católica",    17, "#1B4C9C"],
  ["CRB", "Cruzeiro",                 17, "#143C8C"],
  ["BOA", "Boca Juniors",              8, "#0A2472"],
  ["BAE", "Barcelona SC",              8, "#F5C518"],
  ["COB", "Corinthians",              17, "#333333"],
  ["PLA", "Platense",                 17, "#7A3B2E"],
  ["SAC", "Santa Fé",                 8, "#C8102E"],
  ["PEU", "Peñarol",                  8, "#F0B323"],
  ["CEP", "Cerro Porteño",           17, "#1B4F9C"],
  ["PAB", "Palmeiras",                17, "#006437"],
  ["SPP", "Sporting Cristal",          8, "#4EA1DE"],
  ["JUC", "Junior",                    8, "#D91E2A"],
  ["LDE", "LDU Quito",                17, "#16346E"],
  ["MIB", "Mirassol",                 17, "#D9A800"],
  ["LAA", "Lanús",                    8, "#7A1C2E"],
  ["ALB", "Always Ready",              8, "#C8102E"],
  ["VAE", "Independiente del Valle",  17, "#16335E"],
  ["ROA", "Rosario Central",          17, "#0B5CA8"],
  ["CEV", "Universidad Central",       8, "#C8102E"],
  ["LIP", "Libertad",                  8, "#3A3A3A"],
];

export default {
  id: "panini-libertadores-2026",
  publisher: "Panini",
  title: "CONMEBOL Libertadores 2026",
  shortTitle: "LIBERTADORES",
  slug: "libertadores2026",
  kicker: "CONMEBOL · SOUTH AMERICA",
  tagline: "443 stickers and 80 cards across 32 clubs.",
  year: 2026,
  sport: "football",
  category: "Football",
  total: 523,
  status: "numbered",
  note: "Club pages from the published checklist; player names aren't included. Clubs are coded (FLB1…), not numbered, as Panini Brasil prints them.",
  hasMeta: false,
  vocab: { unit: "Club", unitPlural: "Clubs", section: "Section",
           sectionPlural: "Sections", meta: "Section" },
  displayOrder: ["★", "CLU", "CRD"],
  sections: [
    // The three numbered runs come first so the coded stickers, which
    // take their number from the running counter, carry on from 38.
    {
      id: "★", label: "Specials", short: "★ SPECIALS", color: "--gold", special: true,
      c1: "#C9982F",
      units: [
        { code: "ARN", name: "A América é Rubro-Negra!", from: 1, to: 7 },
        { code: "MIL", name: "Milestones",                from: 8,  to: 30 },
        { code: "BRA", name: "As Brabas",                 from: 31, to: 38 },
        { code: "PUM", name: "Anúncio Puma", stickers: [["PUMA1", "Bola Conmebol Libertadores 2026"]] },
        { code: "SUD", name: "A Grande Conquista",
          stickers: Array.from({ length: 4 }, (_, i) => [`SUD${i + 1}`, "Conmebol Sudamericana 2025"]) },
      ],
    },
    {
      id: "CLU", label: "Clubs", short: "CLUBS", color: "--grass",
      units: CLUBS.map(([code, name, count, c1]) => club(code, name, count, c1)),
    },
    {
      id: "CRD", label: "Cards", short: "★ CARDS", color: "--gold", special: true,
      c1: "#C9982F",
      units: [{
        code: "CRD", name: "Card set", kind: "card",
        stickers: Array.from({ length: 80 }, (_, i) => [`T${i + 1}`, `Card ${i + 1}`]),
      }],
    },
  ],
};
