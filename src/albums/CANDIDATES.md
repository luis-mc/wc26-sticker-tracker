# Album candidates

Albums considered for the shelf but **not** added, with exactly what is
missing. The bar (see `CLAUDE.md`) is: every section's number range published,
ranges covering `1..total` with no gap or overlap, and the total reconciling
against a second source. A total on its own is never enough.

Anything here becomes a one-file addition the moment its checklist appears —
drop the ranges into a spec, run `npm run verify:albums`, done.

Researched September 2026.

## Football

| Album | What's known | What's missing |
|---|---|---|
| **Panini LaLiga Este 2026/27** (ES 1st) | 494 at launch per Panini; "700+" once the *Nuevos* waves land. 20 clubs, 409 squad stickers, subsets ADN LaLiga Prime / Draft 23 / LaLiga Fantasy | Totals irreconcilable, no club ranges. Needs the base-album checklist |
| **Panini Brasileirão 2026** | 512 per Panini BR (610 per Stickers.app). 19 per Série A club × 20, 3 per Série B club × 20, Feminino 18, Mascotes 20, "São eles!" 11, Jogão 11, Homens-Gol 10 — sums to 510 | The numbering. A *tabela de figurinhas* PDF would close it |
| **Panini CONMEBOL Libertadores 2026** | 443 per Panini (521 per Stickers.app); 32 teams across 8 groups; 35 holographic + 40 transparent; 80 cards | Per-team ranges; totals disagree |
| **Panini Liga F 2025/26** (ES women) | Structure closes cleanly at **380** contiguous: 1 intro, 16 clubs × 20 (2–321), Focus 322–326, Energy 327–353, Flow 354–362, Feeling 363–371, Fresh 372–380, plus unnumbered Premium ×11 and Maxipremium ×1 | A second source says 430. Unresolved ~50-sticker gap |
| **Panini Barclays WSL 2026** | 511, contiguous: 1 welcome, 12 WSL clubs, "This Is…" 236–247, WSL2 welcome 446–457, WSL2 clubs paired 458–505, season opener 506–511 | Arsenal reads 69 stickers where the other 11 clubs have 33; WSL2's 12 clubs are paged in pairs of 8. Needs a second source before the split can be trusted |
| **Topps Bundesliga Offizielle Sticker 2025/26** | **Closest miss.** 362 total = 354 numbered + 8 lettered (LEG-1/2, DFL-1/6). 18 clubs at 15 each across four blocks; intro 1–2, Tore! 3–6, Parallels 7–10, Goalies 101–110; 2. Bundesliga 301–354 | Stickers **201–210** unaccounted for, and Stuttgart (16) / Wolfsburg (14) break the uniform 15. One good German source fixes this |
| **Panini Pro League** (BE) | 2024-25 documented: 453 stickers + 10 cards, 72 pages | No 2025-26 checklist published yet |
| NL, TR, PL, CH, AT, DK, HR, Scotland (SPFL) | — | No current-season league sticker checklist found at all. Scotland only has a 50-sticker Panini/M&S *national team* set |

## Other sport

| Album | What's known | What's missing |
|---|---|---|
| **Panini NBA 2024-25 Sticker & Card** | 514 stickers (100 foil), 30 teams on two-page spreads, plus draft / legends / NBA Cup / Finals sections; 100 cards | Per-team ranges. Sources contradict each other on per-team count (13 vs 9 base + 3 foil). TCDB has a full checklist but blocks automated fetching. Note Panini has **no NBA licence for 2025-26**, so this is the current NBA album |
| **Topps MLB Sticker Collection** | "300 of the best stars" — veterans, rookies, mascots; 32-page album | No structure, no ranges, current year unclear |
| **Panini Tour de France 2026** | 22 teams; 72 special foils | Total quoted as 325, 336 *and* 354 |
| **Panini Italia in Pista** (Milano Cortina 2026) | 192 = 150 athletes + 2 logos + 16 art + 16 pictograms + 8 locations — sums exactly. Plus 40 cards. Not sold in US/CN/RU/BY | Which numbers belong to which block |
| Rugby / cricket / AFL / NRL | — | No 2026 sticker album found |

## Entertainment

Totals are published, the section layout never is. The bigger risk: kids'
albums often number their special stickers separately (`A1`–`A40` style), so
even the id scheme can't be assumed.

| Album | Total | Note |
|---|---|---|
| Panini Bluey *(Play With Friends)* | 192 | "including 40 special" — publisher-confirmed total, layout unknown |
| Diramix One Piece (Netflix) | 185 or 200 | Sources disagree |
| Panini Peanuts | 286 | Stickers.app only |
| Panini Harry Potter *Always* | 236 | Stickers.app only |
| Panini Moomin | 211 | Stickers.app only |
| Diramix K-Pop Demon Hunters | 196 | Stickers.app only |
| Panini Toy Story 5 / Stitch & Angel | 192 each | Stickers.app only |

These would work as plain numbered runs (`numberedPages()` in `build.js`
groups a flat album into pages of 25) **if** the totals can be
publisher-confirmed and the stickers really are numbered `1..N`.

## Source notes

- **[Football Cartophilic Info Exchange](https://cartophilic-info-exch.blogspot.com/)** — by far the best source for European football; publishes per-club ranges. Covers England, Italy, France, Portugal, Spain, Greece well; thin elsewhere.
- **[Checklist Insider](https://www.checklistinsider.com/)** — the equivalent for US sports; gave both NHL and NFL their full team ranges.
- **[Stickers.app](https://stckrs.app/albums/2026/)** — broad index of what exists with totals, but totals alone don't clear the bar, and several of its counts conflict with the publisher's own.
- **TCDB, laststicker.com, Panini America's blog** — have the data, return HTTP 403 to automated fetching. Worth a manual look.
