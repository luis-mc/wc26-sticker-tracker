/* ==================================================================
   ALBUM VERIFIER  ·  node scripts/verify-albums.mjs
   Guards against half-entered checklists. An album only passes if:
     1. it builds, and the built size matches the size declared in the spec
     2. sticker ids are unique
     3. the sticker numbers form 1..total with no gap, overlap or duplicate
        (catches a club range that is off by one, or a section left out)
     4. every unit holds at least one sticker
     5. every section in displayOrder exists, and no section is orphaned
     6. template albums give every unit a full page of slots, with no
        "Player 12" placeholder left where a real name should be
     7. required display metadata is present
     8. the built album is renderable: every sticker carries the display
        strings and a valid colour, byId agrees with the sticker list, no
        two units in a section share a name, and no unit name is long
        enough to wreck the album rows
   ================================================================== */

import { CATALOG, getAlbum } from "../src/albums/index.js";

let failed = 0;
const rows = [];

for (const entry of CATALOG) {
  const problems = [];
  let A;
  try {
    A = getAlbum(entry.id);
  } catch (e) {
    console.log(`FAIL ${entry.id}: does not build — ${e.message}`);
    failed++;
    continue;
  }

  // 1. declared vs built
  if (entry.total == null) problems.push("spec has no declared total");
  else if (entry.total !== A.total) problems.push(`declared ${entry.total} but built ${A.total}`);

  // 2. unique ids
  const ids = new Set();
  for (const s of A.stickers) {
    if (ids.has(s.id)) problems.push(`duplicate sticker id "${s.id}"`);
    ids.add(s.id);
  }

  // 3. contiguous numbering
  const ns = A.stickers.map(s => s.n).sort((a, b) => a - b);
  const dupes = ns.filter((n, i) => i && n === ns[i - 1]);
  if (dupes.length) problems.push(`sticker numbers used twice: ${[...new Set(dupes)].slice(0, 8).join(", ")}`);
  const gaps = [];
  for (let i = 1; i <= A.total; i++) if (!ns.includes(i)) gaps.push(i);
  if (gaps.length) problems.push(`${gaps.length} missing number(s): ${gaps.slice(0, 12).join(", ")}${gaps.length > 12 ? "…" : ""}`);
  if (ns[0] !== 1) problems.push(`numbering starts at ${ns[0]}, not 1`);
  if (ns[ns.length - 1] !== A.total) problems.push(`numbering ends at ${ns[ns.length - 1]}, not ${A.total}`);

  // 4/5. structure
  const seenCodes = new Set();
  for (const code of A.unitOrder) {
    if (seenCodes.has(code)) problems.push(`unit code "${code}" is used twice — one of them is unreachable`);
    seenCodes.add(code);
  }
  // every built unit bucket must be owned by the unit meta of the same code
  for (const [secId, bucket] of Object.entries(A.sections)) {
    for (const code of Object.keys(bucket)) {
      if (A.units[code]?.group !== secId) problems.push(`unit "${code}" has stickers in section "${secId}" but its meta points at "${A.units[code]?.group}"`);
    }
  }
  for (const code of A.unitOrder) {
    const u = A.units[code];
    const list = A.sections[u.group]?.[code] || [];
    if (!list.length) problems.push(`unit ${code} has no stickers`);
    if (!u.name) problems.push(`unit ${code} has no name`);
  }
  for (const id of A.sectionOrder) {
    if (!A.sectionMeta[id]) problems.push(`displayOrder names unknown section "${id}"`);
    if (!A.sections[id] || !Object.keys(A.sections[id]).length) problems.push(`section "${id}" has no units`);
  }
  for (const id of Object.keys(A.sections)) {
    if (!A.sectionOrder.includes(id)) problems.push(`section "${id}" is built but never displayed`);
  }

  // 6. template albums: full pages, real names
  const templated = A.stickers.filter(s => s.kind === "player" || s.kind === "emblem" || s.kind === "squad");
  if (templated.length) {
    const perUnit = {};
    for (const s of templated) perUnit[s.code] = (perUnit[s.code] || 0) + 1;
    const sizes = [...new Set(Object.values(perUnit))];
    if (sizes.length > 1) problems.push(`uneven team pages: ${sizes.join("/")} stickers per unit`);
    const placeholder = A.stickers.filter(s => /^Player \d+$/.test(s.label || ""));
    if (placeholder.length) problems.push(`${placeholder.length} unnamed player slot(s), e.g. ${placeholder[0].id}`);
  }

  // 7. display metadata
  for (const k of ["publisher", "title", "shortTitle", "year", "status", "category"]) {
    if (!entry[k]) problems.push(`spec is missing "${k}"`);
  }
  if (A.shortTitle.length > 18) problems.push(`shortTitle "${A.shortTitle}" is too long for the header`);
  // the runtime album must carry the fields the UI reads, not just the spec
  for (const k of ["publisher", "title", "shortTitle", "category", "slug", "total", "vocab"]) {
    if (A[k] == null) problems.push(`built album is missing "${k}" — check buildAlbum() passes it through`);
  }
  for (const s of A.stickers) {
    if (!s.label) { problems.push(`sticker ${s.id} has no label`); break; }
    if (!s.fullCode) { problems.push(`sticker ${s.id} has no display code`); break; }
  }

  // 8. renderable
  const HEX = /^#[0-9A-Fa-f]{6}$/;
  const UNIT_NAME_MAX = 40;   // longer than this and the album row wraps badly
  for (const s of A.stickers) {
    if (!s.dispCode || !s.slotLabel) { problems.push(`sticker ${s.id} has no display label`); break; }
    if (!HEX.test(s.c1)) { problems.push(`sticker ${s.id} has a malformed colour "${s.c1}"`); break; }
    if (A.byId[s.id] !== s) { problems.push(`byId does not resolve ${s.id} to its own sticker`); break; }
  }
  if (Object.keys(A.byId).length !== A.stickers.length) problems.push("byId does not cover every sticker");
  for (const [secId, bucket] of Object.entries(A.sections)) {
    const names = Object.keys(bucket).map(c => A.units[c].name);
    const dupe = names.find((n, i) => names.indexOf(n) !== i);
    if (dupe) problems.push(`section "${secId}" has two units named "${dupe}"`);
  }
  for (const code of A.unitOrder) {
    const n = A.units[code].name;
    if (n.length > UNIT_NAME_MAX) problems.push(`unit ${code} name is ${n.length} chars, over the ${UNIT_NAME_MAX} the album row fits`);
  }
  for (const code of A.unitOrderMain) {
    if (A.sectionMeta[A.units[code].group].special) problems.push(`unit ${code} is in a special section but counts towards completion`);
  }

  rows.push({ id: entry.id, total: A.total, units: A.unitOrder.length,
              sections: A.sectionOrder.length, status: entry.status, problems });
  if (problems.length) failed++;
}

const w = Math.max(...rows.map(r => r.id.length));
for (const r of rows) {
  const head = `${r.problems.length ? "FAIL" : "ok  "} ${r.id.padEnd(w)}  ${String(r.total).padStart(4)} stickers · ${String(r.units).padStart(3)} units · ${r.sections} sections · ${r.status}`;
  console.log(head);
  for (const p of r.problems) console.log(`       ↳ ${p}`);
}
console.log(`\n${rows.length - failed}/${rows.length} albums verified.`);
process.exit(failed ? 1 : 0);
