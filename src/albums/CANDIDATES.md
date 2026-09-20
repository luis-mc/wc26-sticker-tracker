# Album candidates

Albums considered for the shelf but **not** added, with exactly what is
missing. The bar (see `CLAUDE.md`) is: every section's number range published,
ranges covering `1..total` with no gap or overlap, and the total reconciling
against a second source. A total on its own is never enough.

Anything here becomes a one-file addition the moment its checklist appears —
drop the ranges into a spec, run `npm run verify:albums`, done.

Researched September 2026.

**Six candidates have now graduated**, all the same way — Topps Bundesliga
2025/26, Panini NBA 2024-25, Panini *Italia in Pista* Milano Cortina 2026,
and on a third pass Panini Tour de France 2026, Panini Bluey *Funny Yummy!*
and Panini Barclays WSL 2026. Their checklists were always public; the sites
holding them (laststicker.com, TCDB) just return HTTP 403 to automated
fetching. Loading the same public page in a browser gives the full
per-sticker list. **Try that before giving up on anything below.**

Two of the three latest were blocked by a *misreading*, not by missing data:
Arsenal's "69 stickers" was the club's own 33-sticker page plus every other
sticker whose title merely names Arsenal, and Tour de France's duplicate
misspelled teams were the men's and women's squads of the same sponsor. When
a section list looks malformed, read the numbers before trusting the labels.

## Football

| Album | What's known | What's missing |
|---|---|---|
| **Panini LaLiga Este 2026/27** (ES 1st) | 494 at launch per Panini; "700+" once the *Nuevos* waves land. 20 clubs, 409 squad stickers, subsets ADN LaLiga Prime / Draft 23 / LaLiga Fantasy | Totals irreconcilable, no club ranges. Needs the base-album checklist |
| **Panini Brasileirão 2026** | 512 per Panini BR (610 per Stickers.app). 19 per Série A club × 20, 3 per Série B club × 20, Feminino 18, Mascotes 20, "São eles!" 11, Jogão 11, Homens-Gol 10 — sums to 510 | The numbering. A *tabela de figurinhas* PDF would close it |
| **Panini CONMEBOL Libertadores 2026** | 443 per Panini (521 per Stickers.app); 32 teams across 8 groups; 35 holographic + 40 transparent; 80 cards | Per-team ranges; totals disagree |
| **Panini Liga F 2025/26** (ES women) | Structure closes cleanly at **380** contiguous: 1 intro, 16 clubs × 20 (2–321), Focus 322–326, Energy 327–353, Flow 354–362, Feeling 363–371, Fresh 372–380, plus unnumbered Premium ×11 and Maxipremium ×1 | A second source says 430. Unresolved ~50-sticker gap |
| **Panini Pro League** (BE) | 2024-25 documented: 453 stickers + 10 cards, 72 pages | No 2025-26 checklist published yet |
| NL, TR, PL, CH, AT, DK, HR, Scotland (SPFL) | — | No current-season league sticker checklist found at all. Scotland only has a 50-sticker Panini/M&S *national team* set |

## Other sport

| Album | What's known | What's missing |
|---|---|---|
| **Topps MLB Sticker Collection** | "300 of the best stars" — veterans, rookies, mascots; 32-page album | No structure, no ranges, current year unclear |
| Rugby / cricket / AFL / NRL | — | No 2026 sticker album found |

## Entertainment

Totals are published, the section layout never is. The bigger risk: kids'
albums often number their special stickers separately (`A1`–`A40` style), so
even the id scheme can't be assumed. Bluey *Funny Yummy!* turned out to do
exactly that — 1–181 plus X1–X11 — which is why its 192 only made sense once
the checklist was read. Assume the others do too until shown otherwise.

Panini has three Bluey albums that all total **192** (2024, *Play with
Friends!* 2025, *Funny Yummy!* 2026), so for any of these a bare total from a
source that doesn't name the album by title proves nothing.

| Album | Total | Note |
|---|---|---|
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
- **[laststicker.com](https://www.laststicker.com/)** — the richest source of all: full per-sticker checklists with section labels, for football *and* other sports *and* entertainment. Returns HTTP 403 to automated fetching, but loads normally in a browser (Cloudflare's check clears itself after a few seconds). This is where Bundesliga, NBA and Milano Cortina came from.
- **TCDB, Panini America's blog** — same story: real data, 403 to fetchers, fine in a browser.
