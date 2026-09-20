# Album candidates

Albums considered for the shelf but **not** added, with exactly what is
missing. The bar (see `CLAUDE.md`) is: every section's number range published,
ranges covering `1..total` with no gap or overlap, and the total reconciling
against a second source. A total on its own is never enough.

Anything here becomes a one-file addition the moment its checklist appears —
drop the ranges into a spec, run `npm run verify:albums`, done.

Researched September 2026.

**Fourteen candidates have now graduated**, all the same way — Topps
Bundesliga 2025/26, Panini NBA 2024-25 and Panini *Italia in Pista* Milano
Cortina 2026, then Tour de France 2026, Bluey *Funny Yummy!* and Barclays WSL
2026, then CONMEBOL Libertadores 2026, Brasileirão 2026, Liga F 2025/26,
One Piece, Peanuts, K-Pop Demon Hunters, Toy Story 5 and Stitch & Angel.
Their checklists were always public; the sites holding them (laststicker.com,
TCDB) just return HTTP 403 to automated fetching. Loading the same public page
in a browser gives the full per-sticker list. **Try that before giving up on
anything below.**

**Almost every "unresolved" total here was a counting difference, not a
conflict.** Four of them turned out to be the same thing twice over:

- *Libertadores*: Panini's 443 is the stickers, laststicker's 523 adds the
  80 cards.
- *Brasileirão*: Panini BR's 512 is the stickers, 610 adds the 98 cards.
- *Liga F*: 380 is how far the **numbering** goes; 432 is the **sticker**
  count, because 38 numbers are printed as A/B split pairs and 14 more
  stickers carry letter codes.
- *WSL*: Arsenal's "69" counted every sticker whose title merely names
  Arsenal; its own page is 33 like everyone else's.

So before recording two sources as irreconcilable, check whether one is
counting cards, split stickers or lettered specials that the other isn't.
Read the numbers before trusting the labels.

## Football

| Album | What's known | What's missing |
|---|---|---|
| **LaLiga Este 2026/27** (Colecciones ESTE) | Full checklist exists: 626 stickers, per-club ranges published | **Structurally incompatible, not merely undocumented.** Este numbers each club in a reserved band of 30 (1–, 31–, 61–…) but prints only ~20–24 of them, leaving the rest empty for the mid-season *Nuevos Fichajes* waves. The numbering therefore has permanent holes and grows all season, so it can never satisfy "1..total with no gap". Would need a sparse-slot album model |
| **Panini Pro League** (BE) | 2024-25 documented: 453 stickers + 10 cards, 72 pages | No 2025-26 checklist published yet |
| **Panini Frauen-Bundesliga 2025/26** (DE women) | 420 per laststicker | Newly spotted; checklist not read yet. Likely a quick win |
| NL, TR, PL, CH, AT, DK, HR, Scotland (SPFL) | — | No current-season league sticker checklist found at all. Scotland only has a 50-sticker Panini/M&S *national team* set |

## Other sport

| Album | What's known | What's missing |
|---|---|---|
| **Topps MLB Sticker Collection** | "300 of the best stars" — veterans, rookies, mascots; 32-page album | No structure, no ranges, current year unclear |
| Rugby / cricket / AFL / NRL | — | No 2026 sticker album found |

## Entertainment

The section layout is never published for these, so they ship as plain
numbered runs — `numberedPages()` in `build.js` groups a flat album into
pages of 25. What always has to be read from the checklist first is the **id
scheme**, because the lettered specials are numbered separately and the
published total silently includes them:

| Album | Total | Split |
|---|---|---|
| Bluey *Funny Yummy!* | 192 | 1–181 + X1–X11 |
| Toy Story 5 | 192 | 1–180 + X1–X12 |
| Stitch & Angel | 192 | 1–165 + X1–X27 |
| K-Pop Demon Hunters | 196 | 1–190 + A–F |
| Peanuts *A Year to Remember* | 286 | 1–260 + X1–X16 + LE1–LE10 |
| One Piece | 185 | flat, no specials at all |

Three different albums totalling 192 on three different splits is the whole
argument for never trusting a bare total. Panini also has three Bluey albums
that *all* total 192 (2024, *Play with Friends!* 2025, *Funny Yummy!* 2026),
so a source that doesn't name the album by title proves nothing.

Still open:

| Album | Total | Note |
|---|---|---|
| Panini Harry Potter *Always* | 236 | Stickers.app files it under **Total Cards**, not stickers — likely a trading-card set rather than an album. Confirm which before spending time on it |
| Panini Moomin | 211 | Same: listed as cards |
| Panini *Stranger Things* — One Last Strange Adventure | 211 | Newly spotted on Stickers.app; no checklist read yet |

## Source notes

- **[Football Cartophilic Info Exchange](https://cartophilic-info-exch.blogspot.com/)** — by far the best source for European football; publishes per-club ranges. Covers England, Italy, France, Portugal, Spain, Greece well; thin elsewhere.
- **[Checklist Insider](https://www.checklistinsider.com/)** — the equivalent for US sports; gave both NHL and NFL their full team ranges.
- **[Stickers.app](https://stckrs.app/albums/2026/)** — broad index of what exists with totals, but totals alone don't clear the bar, and several of its counts conflict with the publisher's own.
- **[laststicker.com](https://www.laststicker.com/)** — the richest source of all: full per-sticker checklists with section labels, for football *and* other sports *and* entertainment. Returns HTTP 403 to automated fetching, but loads normally in a browser (Cloudflare's check clears itself after a few seconds). This is where Bundesliga, NBA and Milano Cortina came from.
- **TCDB, Panini America's blog** — same story: real data, 403 to fetchers, fine in a browser.
