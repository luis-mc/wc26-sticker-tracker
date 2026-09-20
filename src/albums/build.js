/* ==================================================================
   ALBUM BUILDER
   Turns a compact album *spec* (the files next to this one) into the
   runtime index every screen reads: a flat sticker list, lookup maps
   and the section → unit → stickers hierarchy the Album and Home
   screens render.

   Vocabulary is deliberately publisher-neutral, because not every
   album is a World Cup:
     section  a band of the album  (a WC group, a league, "Specials")
     unit     one page inside a section (a nation, a club, a topic)
     slot     the sticker's position inside its unit

   Three ways to author a unit's stickers — mix them freely in one album:
     roster: [...]        + album slotTemplate → Panini-style team pages
     from / to            → plain numbered checklists (no per-sticker names)
     stickers: [[id,label]] → explicit one-off lists (intro / foil pages)

   Sticker field names (id, code, team, group, conf, flag, c1, c2, n,
   slot, kind, label, pname, foil) are kept from the original single-album
   build so the UI didn't have to be rewritten around new nouns.
   ================================================================== */

const DEF_C1 = "#C9982F", DEF_C2 = "#F4C24A";
const pad2 = v => String(v).padStart(2, "0");
// "FWC1" → "FWC 1" for the specials that have no numeric slot of their own
const spaceCode = id => id.replace(/^([A-Za-z]+)(\d+)$/, "$1 $2");

/* Splits a plain numbered range into fixed-size pages, for albums whose
   real section breakdown we don't have yet: the collector still tracks every
   number, just grouped into "#1–#25" style pages instead of clubs. */
export function numberedPages(from, to, size = 25, label = "Page") {
  const out = [];
  for (let start = from, i = 1; start <= to; start += size, i++) {
    const end = Math.min(start + size - 1, to);
    out.push({ code: `P${String(i).padStart(2, "0")}`, name: `${label} ${i}`,
               short: `${start}–${end}`, from: start, to: end });
  }
  return out;
}

export function buildAlbum(spec) {
  const stickers = [];
  const units = {};       // code → unit meta
  const unitOrder = [];   // codes in checklist order
  const sections = {};    // sectionId → { unitCode: [stickers] }
  const sectionMeta = {};
  let n = 0;

  for (const sec of spec.sections) {
    sectionMeta[sec.id] = {
      id: sec.id,
      label: sec.label,
      short: sec.short || sec.label.toUpperCase(),
      color: sec.color || "--gold",
      special: !!sec.special,
    };
    sections[sec.id] ||= {};

    for (const u of sec.units) {
      const meta = {
        code: u.code,
        name: u.name,
        group: sec.id,
        conf: u.meta || sec.label,
        flag: u.flag ?? null,
        c1: u.c1 || sec.c1 || DEF_C1,
        c2: u.c2 || u.c1 || sec.c2 || DEF_C2,
        star: u.roster?.length ? u.roster[u.roster.length - 1] : null,
      };
      units[u.code] = meta;
      unitOrder.push(u.code);
      const list = (sections[sec.id][u.code] = []);

      const push = fields => {
        const s = {
          code: meta.code, team: fields.team || meta.name, group: sec.id,
          conf: meta.conf, flag: meta.flag, c1: meta.c1, c2: meta.c2,
          pname: null, foil: false, ...fields,
        };
        // Pre-computed display strings: the UI never has to know which
        // authoring style a sticker came from.
        if (s.slot != null && s.kind !== "numbered") {
          s.fullCode = `${s.code}${pad2(s.slot)}`;
          s.dispCode = `${s.code} ${pad2(s.slot)}`;
          s.slotLabel = pad2(s.slot);
        } else if (s.kind === "numbered") {
          s.fullCode = String(s.n);
          s.dispCode = `#${s.n}`;
          s.slotLabel = String(s.n);
        } else {
          s.fullCode = s.id;
          s.dispCode = spaceCode(s.id);
          s.slotLabel = spaceCode(s.id);
        }
        stickers.push(s);
        list.push(s);
      };

      if (u.stickers) {
        // Explicit list — [id, label] or [id, label, { team, foil, kind }]
        for (const entry of u.stickers) {
          const [id, label, opt = {}] = entry;
          n++;
          push({ id, n, kind: opt.kind || u.kind || "special", label,
                 foil: opt.foil ?? u.foil ?? false, team: opt.team || u.name });
        }
      } else if (u.from != null) {
        // Numbered range — the sticker number IS the identity
        for (let num = u.from; num <= u.to; num++) {
          n = num;
          push({ id: String(num), n: num, slot: num, kind: "numbered",
                 label: u.name, foil: u.foil ?? false });
        }
      } else if (u.roster) {
        // Template-driven team page
        let ri = 0;
        spec.slotTemplate.forEach((t, i) => {
          const slot = i + 1;
          n++;
          const isPlayer = t.kind === "player";
          const pname = isPlayer ? (u.roster[ri++] || `Player ${slot}`) : null;
          push({ id: `${u.code}-${slot}`, n, slot, kind: t.kind,
                 label: isPlayer ? pname : t.label, pname, foil: !!t.foil });
        });
      }
    }
  }

  const displayOrder = spec.displayOrder || spec.sections.map(s => s.id);
  const vocab = { unit: "Team", unitPlural: "Teams", section: "Group",
                  sectionPlural: "Groups", meta: "Confederation", ...spec.vocab };

  return {
    id: spec.id, publisher: spec.publisher, title: spec.title,
    shortTitle: spec.shortTitle || spec.title, kicker: spec.kicker || "",
    tagline: spec.tagline || "", year: spec.year, sport: spec.sport || "football",
    category: spec.category || "Other",
    provisional: !!spec.provisional, note: spec.note || "",
    slug: spec.slug || spec.id,
    vocab,
    stickers, byId: Object.fromEntries(stickers.map(s => [s.id, s])),
    total: stickers.length,
    units, unitOrder,
    unitOrderAlpha: [...unitOrder].sort((a, b) => units[a].name.localeCompare(units[b].name)),
    unitOrderCode: [...unitOrder].sort(),
    // Units that count towards "teams completed" — intro/foil pages don't.
    unitOrderMain: unitOrder.filter(c => !sectionMeta[units[c].group].special),
    sections, sectionMeta, sectionOrder: displayOrder,
    // Panels that only make sense for some albums
    hasMeta: spec.hasMeta ?? new Set(Object.values(units).map(u => u.conf)).size > 1,
    hasFlags: Object.values(units).some(u => !!u.flag),
  };
}
