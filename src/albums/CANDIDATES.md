# Album candidates

Albums considered for the shelf but **not** added, with exactly what is
missing. The bar (see `CLAUDE.md`) is: every section's number range published,
ranges covering `1..total` with no gap or overlap, and the total reconciling
against a second source. A total on its own is never enough.

Anything here becomes a one-file addition the moment its checklist appears —
drop the ranges into a spec, run `npm run verify:albums`, done.

Researched September 2026.

## What the last three passes taught

**Twenty-two candidates have now graduated**, and almost none of them needed
data that didn't already exist. Two patterns did nearly all the work:

**1. Load the page in a browser.** laststicker.com and TCDB return HTTP 403 to
automated fetching but serve the full per-sticker checklist to a real browser
(Cloudflare's check clears itself after a few seconds). Every album added since
the first pass came from there. **Try that before giving up on anything below.**

**2. Search by country, not by album name.** The Netherlands, Romania, Croatia,
Austria and France-rugby were all listed here as "nothing exists" — and all
five had a current album. Searching for the *league* or the *country* found
them; searching for the album name I expected did not. `Eredivisie` turned up a
PLUS supermarket collection, which is exactly the kind of thing a Panini-shaped
search will never surface.

And one rule for reading the data:

**Assume a counting difference, not a contradiction.** Every "sources disagree"
entry that got resolved turned out to be two sources counting different things:

| Album | Looked like | Actually was |
|---|---|---|
| Libertadores | 443 vs 523 | 443 stickers + 80 cards |
| Brasileirão | 512 vs 610 | 512 stickers + 98 cards |
| Liga F | 380 vs 430 | 380 *numbers*, 432 *stickers* — 38 are A/B split pairs |
| Austria | 399 vs 447 | 399 album stickers + 48 C1/C1a chase stickers |
| WSL (Arsenal) | 69 vs 33 | 33 on its own page; the rest merely *name* Arsenal |
| Tour de France | duplicate misspelled teams | the men's and women's squads of one sponsor |
| One Piece | 185 vs 200 | 185; the 200 was simply wrong |

Read the numbers before trusting the labels, and check for cards, chase
stickers, lettered specials and split pairs before recording a conflict.

## Football

| Album | What's known | What's missing |
|---|---|---|
| **LaLiga Este 2026/27** (Colecciones ESTE) | Full checklist exists: 626 stickers, per-club ranges published | **Structurally incompatible, not merely undocumented.** Este numbers each club in a reserved band of 30 (1–, 31–, 61–…) but prints only ~20–24, leaving the rest empty for the mid-season *Nuevos Fichajes* waves. The numbering therefore has permanent holes and grows all season, so it can never satisfy "1..total with no gap". Would need a sparse-slot album model |
| **Panini DFB-Sammelalbum 2026** (DE national team) | 72 numbered + T1–T12 tattoos + KH/JK autographs. laststicker says 86, Stickers.app says 84 | The two-sticker difference is the autograph pair, and nothing says whether those are album slots. Decide that and it's addable — it's the only open case where the checklist is fully read |
| **Topps Women's Euro 2025** | 308 per Stickers.app | laststicker has no checklist for it at all, under any spelling tried. Needs a source with per-section ranges |
| Switzerland, Turkey, Poland, Denmark, Scotland, Mexico, USA | — | Checked directly. **No current sticker album exists.** Scotland's last was Topps SPFL 2021-22; Turkey's last was Süper Lig 2012-13; Mexico's last was Liga MX 2016-17. Poland and the USA have only SportZoo / Topps *trading-card* sets (1,500–10,000 cards), which are a different product |

## Other sport

| Album | What's known | What's missing |
|---|---|---|
| **Topps MLB Sticker Collection** | Editions ran 2015–2020 (301, then 465 and 436) | **The line looks discontinued** — nothing since 2020. The "300 of the best stars" description recorded earlier matches the 2015–18 editions, so it was describing an old album |
| Cricket, AFL, NRL | — | Checked directly. No sticker album in any current year; cricket has only Futera FX and Cricket Attax *cards*, and AFL/NRL nothing at all |

## Entertainment

The section layout is never published for these, so they ship as plain numbered
runs — `numberedPages()` in `build.js` groups a flat album into pages of 25.
What always has to be read from the checklist first is the **id scheme**,
because the lettered specials are numbered separately and the published total
silently includes them:

| Album | Total | Split |
|---|---|---|
| Bluey *Funny Yummy!* | 192 | 1–181 + X1–X11 |
| Toy Story 5 | 192 | 1–180 + X1–X12 |
| Stitch & Angel | 192 | 1–165 + X1–X27 |
| K-Pop Demon Hunters | 196 | 1–190 + A–F |
| Stranger Things | 211 | 1–192 + LE1–6 + MS1–5 + P1–8 |
| Peanuts *A Year to Remember* | 286 | 1–260 + X1–X16 + LE1–LE10 |
| One Piece | 185 | flat, no specials at all |

Three different albums totalling 192 on three different splits is the whole
argument for never trusting a bare total. Panini also has three Bluey albums
that *all* total 192 (2024, *Play with Friends!* 2025, *Funny Yummy!* 2026), so
a source that doesn't name the album by title proves nothing.

Still open:

| Album | Total | Note |
|---|---|---|
| Panini Harry Potter *Always* | 236 | Stickers.app files it under **Total Cards** and calls it "Trading Cards" — a card set, not an album. Probably out of scope rather than pending |
| Panini Moomin 2026 | 211 | Same: listed as cards |

## Source notes

- **[laststicker.com](https://www.laststicker.com/)** — the richest source by
  far: full per-sticker checklists with section labels, for football, other
  sports *and* entertainment, and the only place several of these albums are
  documented at all. 403s to fetchers, fine in a browser. Its site search is
  the fastest way to answer "does this league have an album this season".
  Parse its checklist from the DOM table rows rather than the page text —
  titles wrap onto a second line and will corrupt a text-based regex.
- **[Stickers.app](https://stckrs.app/albums/2026/)** — broad index with
  totals, and reliable for the *stickers vs cards* distinction, which is how
  the Moomin and Harry Potter card sets were caught.
- **The publisher's own page** — worth the extra search every time. Panini.de
  gave Austria's "399 Sticker, davon 40 Spezialsticker"; Eredivisie.nl gave
  "1 logo and 15 players per club plus 4 XXL"; Panini.fr gave Top 14's "24
  stickers consacrés aux héritiers du XV de France"; the HNS gave Croatia's
  363. A composition match is much stronger evidence than a matching total.
- **[Football Cartophilic Info Exchange](https://cartophilic-info-exch.blogspot.com/)** —
  best for European football per-club ranges; covers England, Italy, France,
  Portugal, Spain, Greece well, thin elsewhere.
- **[Checklist Insider](https://www.checklistinsider.com/)** — the US-sports
  equivalent; gave NHL and NFL their team ranges.
