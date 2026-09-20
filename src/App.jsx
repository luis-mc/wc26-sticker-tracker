import { useState, useEffect, useMemo, useRef, useCallback, createContext, useContext } from "react";
import {
  Search, Check, Plus, Minus, Users, Gift, LogOut, Copy,
  RefreshCw, ChevronDown, Trophy, Sparkles, X, UserPlus, Repeat, Share2, Zap, Download, BookOpen
} from "lucide-react";
import { jsPDF } from "jspdf";
import { getAlbum, knownAlbum, CATALOG, CATEGORIES, DEFAULT_ALBUM_ID } from "./albums/index.js";
import {
  auth, db,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendPasswordResetEmail, fbSignOut, onAuthStateChanged, sendEmailVerification,
  doc, getDoc, setDoc, deleteDoc, collection, query, where, onSnapshot,
} from "./firebase.js";

/* ================================================================== */
/*  ALBUM LAYER                                                        */
/*  Sticker data no longer lives in this file — every album is a spec   */
/*  under src/albums/ and is read through the context below, so each    */
/*  screen renders whichever album is open without knowing which one    */
/*  that is. See src/albums/build.js for the runtime shape.             */
/* ================================================================== */

const AlbumCtx = createContext(null);
const useAlbum = () => useContext(AlbumCtx);


/* ------------------------------------------------------------------ */
/*  CLOUD STORAGE helpers (Firestore)                                  */
/*  Private data: /users/{uid}/data/{key}                              */
/*  Public  data: /public/{key}                                        */
/* ------------------------------------------------------------------ */
let _uid = null;

async function load(k, sh = false) {
  try {
    if (sh) {
      const snap = await getDoc(doc(db, "public", k));
      return snap.exists() ? snap.data() : null;
    }
    if (!_uid) return null;
    const snap = await getDoc(doc(db, "users", _uid, "data", k));
    return snap.exists() ? snap.data().v : null;
  } catch { return null; }
}

async function save(k, v, sh = false) {
  try {
    if (sh) {
      const ref = doc(db, "public", k);
      if (v === null) await deleteDoc(ref);
      else await setDoc(ref, v);
    } else {
      if (!_uid) return;
      const ref = doc(db, "users", _uid, "data", k);
      if (v === null) await deleteDoc(ref);
      else await setDoc(ref, { v });
    }
  } catch(e) { console.error("save failed", k, e); }
}

// Public publish — does NOT swallow the error so the caller can surface a
// rules rejection (the usual reason public data drifts out of sync). Returns
// the Firestore error code on failure, or null on success.
async function publishPublic(docId, snapshot) {
  try {
    await setDoc(doc(db, "public", docId), snapshot);
    return null;
  } catch (e) {
    console.error("PUBLIC PUBLISH FAILED", docId, e?.code, e?.message, e);
    return e?.code || e?.message || "unknown-error";
  }
}

/* Storage keys — one collection per album.
   The default album keeps the original unsuffixed keys so collections saved
   before multi-album support keep loading with nothing to migrate.
     private  /users/{uid}/data/collection[:albumId]
     public   /public/user:{handle}            → identity + album index
              /public/user:{handle}:{albumId}  → that album's shared lists  */
const dataKey  = (k, albumId) => albumId === DEFAULT_ALBUM_ID ? k : `${k}:${albumId}`;
const cacheKey = (k, albumId) => `wc26_${dataKey(k, albumId)}`;
const pubKey      = handle => `user:${handle}`;
const pubAlbumKey = (handle, albumId) => `user:${handle}:${albumId}`;

// localStorage helpers — never throw, used only as an instant-paint cache
const lsGet = k => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

const DEFAULT_PREFS = { owned: true, missing: true, dupes: true };

// Friend public docs store dupes as {id, qty} objects (Firestore can't nest
// arrays). Convert back to the [id, qty] pair shape the UI works with. Tolerates
// the legacy pair shape too, so older docs keep working.
function normalizeFriend(d) {
  if (d && Array.isArray(d.dupes)) {
    return { ...d, dupes: d.dupes.map(x => Array.isArray(x) ? x : [x.id, x.qty]) };
  }
  return d;
}

// Public docs written before multi-album support kept the WC26 lists on the
// identity doc itself. Treat those as that album's snapshot so a friend who
// hasn't opened the app since the update still shows up as swappable.
function legacyLists(indexDoc, albumId) {
  if (albumId !== DEFAULT_ALBUM_ID || !indexDoc) return null;
  return Array.isArray(indexDoc.owned) || Array.isArray(indexDoc.missing) || Array.isArray(indexDoc.dupes)
    ? indexDoc : null;
}

function deriveLists(counts, album) {
  const owned = [], missing = [], dupes = [];
  let dupeUnits = 0;
  for (const s of album.stickers) { const c = counts[s.id]||0; if (c>=1) owned.push(s.id); if (c===0) missing.push(s.id); if (c>=2) { dupes.push([s.id, c-1]); dupeUnits += c-1; } }
  return { owned, missing, dupes, dupeUnits };
}

// Canonical ID for a mutual friendship document (order-independent)
const friendshipId = (a, b) => [a, b].sort().join("__");

// Categorize raw friendship docs (relative to me) into accepted friends and
// pending requests. A doc starts as status:"pending" when one side adds the
// other; the initiator sees it as outgoing, the recipient as incoming. It only
// becomes a real friendship once the recipient sets status:"accepted". Legacy
// docs written before friend requests have no status field — treat them as
// already-accepted so existing friendships keep working.
function splitFriendships(docs, me) {
  const friends = [], incoming = [], outgoing = [];
  for (const d of docs) {
    const other = (d.handles || []).find(h => h !== me);
    if (!other) continue;
    if (!d.status || d.status === "accepted") friends.push(other);
    else if (d.initiator === me) outgoing.push(other);
    else incoming.push(other);
  }
  return { friends, incoming, outgoing };
}

/* ================================================================== */
export default function App() {
  const [phase, setPhase] = useState("loading");
  const [profile, setProfile] = useState(null);
  const [albumId, setAlbumId] = useState(DEFAULT_ALBUM_ID);
  const [myAlbums, setMyAlbums] = useState([DEFAULT_ALBUM_ID]);
  const [counts, setCounts] = useState({});
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [friends, setFriends] = useState([]);
  const [quickAdd, setQuickAdd] = useState(false);
  const [quickCheck, setQuickCheck] = useState(false);
  const [quickGive, setQuickGive] = useState(false);
  const [quickCheckKey, setQuickCheckKey] = useState(0);
  const [quickGiveKey, setQuickGiveKey] = useState(0);
  const [incoming, setIncoming] = useState([]); // pending requests others sent me
  const [outgoing, setOutgoing] = useState([]); // pending requests I sent
  const [friendData, setFriendData] = useState({});   // handle -> identity + album index
  const [friendLists, setFriendLists] = useState({}); // handle -> snapshot of the OPEN album
  const [tab, setTab] = useState("stats");
  const [quickAddKey, setQuickAddKey] = useState(0);
  const [accountOpen, setAccountOpen] = useState(false);
  const [albumsOpen, setAlbumsOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [hydrated, setHydrated] = useState(false); // true once authoritative Firestore data has loaded
  const [verifyEmail, setVerifyEmail] = useState("");
  const first = useRef(true);
  // My public album index, merged across albums: publishing album X must not
  // wipe the summary of album Y from the identity doc.
  const albumIndex = useRef({});

  const A = useMemo(() => getAlbum(albumId), [albumId]);
  const derived = useMemo(() => deriveLists(counts, A), [counts, A]);

  async function initAppSession(user) {
    _uid = user.uid;
    const cachedProfile = lsGet("wc26_profile");
    if (cachedProfile?.handle) setProfile(cachedProfile);
    const p = cachedProfile?.handle ? cachedProfile : await load("profile");
    if (!p?.handle) { setPhase("setup"); return; }
    // Profiles written before multi-album support have no album list.
    const list = (Array.isArray(p.albums) ? p.albums.filter(knownAlbum) : []);
    if (!list.length) list.push(DEFAULT_ALBUM_ID);
    const active = list.includes(p.activeAlbum) ? p.activeAlbum : list[0];
    setProfile(p);
    setMyAlbums(list);
    setAlbumId(active);
    lsSet("wc26_profile", p);
    const cachedCounts = lsGet(cacheKey("collection", active));
    const cachedPrefs = lsGet("wc26_prefs");
    const cachedFriends = lsGet("wc26_friends");
    if (cachedCounts) setCounts(cachedCounts);
    if (cachedPrefs) setPrefs({ ...DEFAULT_PREFS, ...cachedPrefs });
    if (cachedFriends) setFriends(cachedFriends);
    setPhase("app");
    const [c, pr, idx] = await Promise.all([
      load(dataKey("collection", active)),
      load("share_prefs"),
      load(pubKey(p.handle), true),
    ]);
    albumIndex.current = (idx && typeof idx.albums === "object" && idx.albums) || {};
    const authCounts = c ?? cachedCounts ?? {};
    const authPrefs = { ...DEFAULT_PREFS, ...(pr ?? cachedPrefs ?? {}) };
    setCounts(authCounts);
    setPrefs(authPrefs);
    lsSet(cacheKey("collection", active), authCounts);
    lsSet("wc26_prefs", authPrefs);
    first.current = true;
    setHydrated(true);
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { _uid = null; setHydrated(false); first.current = true; setPhase("auth"); return; }
      if (!user.emailVerified) {
        setVerifyEmail(user.email || "");
        setPhase("verify");
        return;
      }
      await initAppSession(user);
    });
    return unsub;
  }, []);

  useEffect(() => {
    // Gate on `hydrated`: never write until the authoritative Firestore reconcile
    // has run, otherwise a stale localStorage paint would clobber newer remote data.
    // An album switch drops the gate too, so album A's counts can never be written
    // under album B's key while the swap is in flight.
    if (phase !== "app" || !profile || !hydrated) return;

    // uid is what the Firestore rule checks (request.resource.data.uid == auth.uid).
    // Read it live from auth, not the mutable module global, so the public doc can
    // never be written with a stale/null uid that the rules would silently reject.
    const uid = auth.currentUser?.uid || _uid;
    const stats = {
      title: A.title, publisher: A.publisher, total: A.total, updatedAt: Date.now(),
      ownedCount:   prefs.owned   ? derived.owned.length   : null,
      missingCount: prefs.missing ? derived.missing.length : null,
      dupeUnits:    prefs.dupes   ? derived.dupeUnits      : null,
    };
    albumIndex.current = { ...albumIndex.current, [A.id]: stats };
    const indexDoc = { uid, handle: profile.handle, name: profile.name,
                       updatedAt: Date.now(), albums: albumIndex.current };
    const albumDoc = { uid, handle: profile.handle, name: profile.name, albumId: A.id,
      updatedAt: Date.now(), total: A.total, prefs,
      ownedCount: stats.ownedCount, dupeUnits: stats.dupeUnits,
      owned:   prefs.owned   ? derived.owned   : null,
      missing: prefs.missing ? derived.missing : null,
      // Firestore forbids nested arrays, so [id, qty] pairs are stored as {id, qty}
      // objects on the wire and normalized back to pairs on read (normalizeFriend).
      dupes:   prefs.dupes   ? derived.dupes.map(([id, qty]) => ({ id, qty })) : null };

    const publish = async () => {
      if (!uid) { flash("Not signed in — can't share"); return; }
      const err = await publishPublic(pubAlbumKey(profile.handle, A.id), albumDoc)
               || await publishPublic(pubKey(profile.handle), indexDoc);
      if (err) flash(`Share sync failed (${err})`); // surfaces rules rejections instead of silently drifting
    };

    if (first.current) {
      // First run after hydration: publish the authoritative public snapshot once (no debounce).
      first.current = false;
      publish();
      return;
    }
    // A real user edit — mirror to cache immediately, debounce the remote writes.
    lsSet(cacheKey("collection", A.id), counts);
    lsSet("wc26_prefs", prefs);
    const t = setTimeout(() => {
      // Private and public writes are independent so a public-rule rejection
      // can never block the private save (and vice-versa).
      save(dataKey("collection", A.id), counts);
      save("share_prefs", prefs);
      publish();
    }, 700);
    return () => clearTimeout(t);
  }, [counts, prefs, profile, phase, hydrated, derived, A]);

  const flash = m => { setToast(m); setTimeout(() => setToast(null), 2200); };
  useEffect(() => { window.scrollTo(0, 0); }, [tab, quickAdd, quickCheck, quickGive, accountOpen, albumsOpen, albumId]);

  const resetViews = () => { setQuickAdd(false); setQuickCheck(false); setQuickGive(false); setAccountOpen(false); setAlbumsOpen(false); };
  const openTab = t => { resetViews(); setTab(t); };
  const openQuick = kind => {
    resetViews();
    if (kind === "add")   { setQuickAdd(true);   setQuickAddKey(k => k + 1); }
    if (kind === "check") { setQuickCheck(true); setQuickCheckKey(k => k + 1); }
    if (kind === "give")  { setQuickGive(true);  setQuickGiveKey(k => k + 1); }
  };

  function persistProfile(next) {
    setProfile(next);
    lsSet("wc26_profile", next);
    save("profile", next);
  }

  function setupHandle(handle, displayName) {
    handle = handle.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (!handle || !auth.currentUser) return;
    _uid = auth.currentUser.uid;
    const p = { handle, name: displayName || handle, createdAt: Date.now(),
                albums: [DEFAULT_ALBUM_ID], activeAlbum: DEFAULT_ALBUM_ID };
    setProfile(p);
    lsSet("wc26_profile", p);
    save("profile", p);
    setMyAlbums(p.albums);
    setAlbumId(DEFAULT_ALBUM_ID);
    albumIndex.current = {};
    // Brand-new user: nothing to reconcile, so mark hydrated directly. The save
    // effect then publishes the (empty) authoritative public snapshot, creating
    // the public doc so friends can find this handle.
    first.current = true;
    setHydrated(true);
    setPhase("app");
  }

  /* ---- albums ----------------------------------------------------- */
  // Opening an album swaps the whole working set. `hydrated` drops in the same
  // render as the id change, so the save effect stays parked until the new
  // album's collection has actually arrived.
  // `shelf` overrides the current album list for callers that have just
  // changed it — state from this render is still the pre-change array.
  async function openAlbum(id, { silent = false, shelf = null } = {}) {
    if (!knownAlbum(id)) return;
    resetViews();
    if (id === albumId) return;
    setHydrated(false);
    first.current = true;
    setAlbumId(id);
    setCounts(lsGet(cacheKey("collection", id)) || {});
    const base = shelf || myAlbums;
    const list = base.includes(id) ? base : [...base, id];
    setMyAlbums(list);
    if (profile) persistProfile({ ...profile, albums: list, activeAlbum: id });
    const c = await load(dataKey("collection", id));
    const authCounts = c ?? lsGet(cacheKey("collection", id)) ?? {};
    setCounts(authCounts);
    lsSet(cacheKey("collection", id), authCounts);
    setHydrated(true);
    if (!silent) flash(`${getAlbum(id).title} opened`);
  }

  function addAlbum(id) {
    if (!knownAlbum(id) || myAlbums.includes(id)) return;
    openAlbum(id);
  }

  // Removing only hides an album from the switcher — the collection stays in
  // Firestore, so adding it back later restores every sticker.
  function removeAlbum(id) {
    if (myAlbums.length < 2) return flash("Keep at least one album");
    const list = myAlbums.filter(x => x !== id);
    setMyAlbums(list);
    if (id === albumId) {
      openAlbum(list[0], { silent: true, shelf: list });
    } else if (profile) {
      persistProfile({ ...profile, albums: list, activeAlbum: profile.activeAlbum });
    }
    flash("Album removed from your shelf");
  }

  async function signOut() {
    Object.keys(localStorage).filter(k => k.startsWith("wc26_")).forEach(k => localStorage.removeItem(k));
    _uid = null;
    first.current = true;
    albumIndex.current = {};
    setHydrated(false);
    setProfile(null);
    setCounts({});
    setPrefs(DEFAULT_PREFS);
    setFriends([]);
    setIncoming([]);
    setOutgoing([]);
    setFriendData({});
    setFriendLists({});
    setMyAlbums([DEFAULT_ALBUM_ID]);
    setAlbumId(DEFAULT_ALBUM_ID);
    setTab("stats");
    resetViews();
    setVerifyEmail("");
    setPhase("auth");
    await fbSignOut(auth);
  }
  async function onEmailVerified() {
    const user = auth.currentUser;
    if (!user) return;
    await initAppSession(user);
  }
  const bump = useCallback((id, d) => setCounts(p => { const n = Math.max(0, (p[id]||0)+d); const o = {...p}; n===0 ? delete o[id] : o[id]=n; return o; }), []);
  const toggle = useCallback(id => setCounts(p => { const o={...p}; (p[id]||0)>0 ? delete o[id] : o[id]=1; return o; }), []);
  // Sending a friend request creates a pending friendship doc. The friendship
  // only becomes mutual once the recipient accepts (acceptRequest).
  async function addFriend(h) {
    h = h.trim().toLowerCase().replace(/[^a-z0-9_]/g,"");
    if (!h) return;
    if (h === profile?.handle) return flash("That's you!");
    if (friends.includes(h)) return flash(`Already friends with @${h}`);
    if (outgoing.includes(h)) return flash(`Request already sent to @${h}`);
    if (incoming.includes(h)) return acceptRequest(h); // they already asked — accept instead of re-asking
    const d = await load(pubKey(h), true);
    if (!d) return flash(`No collection shared as "${h}"`);
    await setDoc(doc(db, "friendships", friendshipId(profile.handle, h)), {
      handles: [profile.handle, h].sort(),
      initiator: profile.handle,
      status: "pending",
      createdAt: Date.now(),
    });
    setOutgoing(p => p.includes(h) ? p : [...p, h]); // optimistic; snapshot reconciles
    setFriendData(p => ({...p, [h]: d}));
    flash(`Friend request sent to ${d.name}`);
  }
  // Recipient accepts: overwrite the pending doc as accepted (preserving who
  // initiated). The friendships snapshot then promotes it on both devices.
  async function acceptRequest(h) {
    await setDoc(doc(db, "friendships", friendshipId(profile.handle, h)), {
      handles: [profile.handle, h].sort(),
      initiator: h,
      status: "accepted",
      createdAt: Date.now(),
      acceptedAt: Date.now(),
    });
    setIncoming(p => p.filter(x => x !== h));
    setFriends(p => p.includes(h) ? p : [...p, h]);
    const d = await load(pubKey(h), true);
    if (d) setFriendData(p => ({...p, [h]: d}));
    flash(`You're now friends with ${d?.name || h}`);
  }
  // Used for both declining an incoming request and cancelling an outgoing one —
  // either way the pending doc is deleted.
  function dismissRequest(h) {
    deleteDoc(doc(db, "friendships", friendshipId(profile.handle, h)));
    setIncoming(p => p.filter(x => x !== h));
    setOutgoing(p => p.filter(x => x !== h));
    flash(`Request removed`);
  }
  async function refreshFriend(h) {
    const [idx, lists] = await Promise.all([load(pubKey(h), true), load(pubAlbumKey(h, albumId), true)]);
    if (idx) setFriendData(p => ({...p, [h]: idx}));
    const snap = lists || legacyLists(idx, albumId);
    setFriendLists(p => ({...p, [h]: snap ? normalizeFriend(snap) : null}));
    flash("Refreshed");
  }
  function removeFriend(h) {
    deleteDoc(doc(db, "friendships", friendshipId(profile.handle, h)));
    const n = friends.filter(x => x !== h);
    setFriends(n);
    lsSet("wc26_friends", n);
    setFriendData(p => { const o = {...p}; delete o[h]; return o; });
    setFriendLists(p => { const o = {...p}; delete o[h]; return o; });
  }
  // Live friendships + pending requests for my handle.
  useEffect(() => {
    if (phase !== "app" || !profile?.handle) return;
    const q = query(collection(db, "friendships"), where("handles", "array-contains", profile.handle));
    const unsub = onSnapshot(q, snap => {
      const { friends, incoming, outgoing } = splitFriendships(snap.docs.map(d => d.data()), profile.handle);
      setFriends(friends);
      setIncoming(incoming);
      setOutgoing(outgoing);
      lsSet("wc26_friends", friends);
    }, () => {});
    return unsub;
  }, [phase, profile?.handle]);
  // Live identity docs for everyone we know about (friends + pending requests),
  // so names and the albums they collect show in every row.
  const knownHandles = useMemo(() => [...new Set([...friends, ...incoming, ...outgoing])], [friends, incoming, outgoing]);
  useEffect(() => {
    if (phase !== "app" || !knownHandles.length) return;
    const unsubs = knownHandles.map(h =>
      onSnapshot(doc(db, "public", pubKey(h)), snap => {
        if (snap.exists()) {
          const d = snap.data()?.v ?? snap.data();
          setFriendData(prev => ({...prev, [h]: d}));
        }
      })
    );
    return () => unsubs.forEach(u => u());
  }, [phase, knownHandles]);
  // Live per-album snapshots for the album that is currently open. Re-subscribes
  // on every album switch, so swap matching always compares like with like.
  useEffect(() => {
    if (phase !== "app" || !knownHandles.length) return;
    const unsubs = knownHandles.map(h =>
      onSnapshot(doc(db, "public", pubAlbumKey(h, albumId)), snap => {
        const d = snap.exists() ? (snap.data()?.v ?? snap.data()) : null;
        setFriendLists(prev => ({...prev, [h]: d ? normalizeFriend(d) : null}));
      })
    );
    return () => unsubs.forEach(u => u());
  }, [phase, knownHandles, albumId]);
  // Falls back to the pre-multi-album doc shape for friends who haven't
  // opened the app since the update.
  const friendSnapshots = useMemo(() => {
    const out = {};
    for (const h of knownHandles) out[h] = friendLists[h] || normalizeFriend(legacyLists(friendData[h], albumId));
    return out;
  }, [knownHandles, friendLists, friendData, albumId]);

  if (phase === "loading") return <Boot />;
  return (
    <AlbumCtx.Provider value={A}>
    <div style={S.root}><Css />
      {phase === "auth" && <Auth />}
      {phase === "verify" && <Verify email={verifyEmail} onVerified={onEmailVerified} onSignOut={signOut} />}
      {phase === "setup" && <Setup onSetup={setupHandle} />}
      {phase === "app" && <>
        <TopBar profile={profile} tab={tab} quickAdd={quickAdd} quickCheck={quickCheck} quickGive={quickGive} albumsOpen={albumsOpen} setTab={openTab} derived={derived} incomingCount={incoming.length} onQuickAdd={()=>openQuick("add")} onQuickCheck={()=>openQuick("check")} onQuickGive={()=>openQuick("give")} onOpenAccount={()=>{const o=!accountOpen;resetViews();setAccountOpen(o);}} onOpenAlbums={()=>{const o=!albumsOpen;resetViews();setAlbumsOpen(o);}} />
        <main style={S.main}>
          {albumsOpen
            ? <Albums myAlbums={myAlbums} activeId={albumId} counts={counts} onOpen={openAlbum} onAdd={addAlbum} onRemove={removeAlbum} />
            : accountOpen
            ? <Account profile={profile} email={auth.currentUser?.email} derived={derived} prefs={prefs} setPrefs={setPrefs} flash={flash} albumCount={myAlbums.length} onOpenAlbums={()=>{resetViews();setAlbumsOpen(true);}} onClose={()=>setAccountOpen(false)} onSignOut={signOut} />
            : quickGive
              ? <QuickGive key={quickGiveKey} counts={counts} bump={bump} onExit={()=>setQuickGive(false)} />
              : quickCheck
              ? <QuickCheck key={quickCheckKey} counts={counts} onExit={()=>setQuickCheck(false)} />
              : quickAdd
              ? <QuickAdd key={quickAddKey} counts={counts} bump={bump} flash={flash} onExit={()=>setQuickAdd(false)} />
              : <>
                  {tab==="tracker" && <Tracker counts={counts} toggle={toggle} bump={bump} />}
                  {tab==="stats" && <Stats counts={counts} derived={derived} albumCount={myAlbums.length} onOpenAlbums={()=>{resetViews();setAlbumsOpen(true);}} onQuickAdd={()=>openQuick("add")} onQuickCheck={()=>openQuick("check")} onQuickGive={()=>openQuick("give")} />}
                  {tab==="friends" && <Friends profile={profile} friends={friends} incoming={incoming} outgoing={outgoing} friendData={friendData} friendSnapshots={friendSnapshots} addFriend={addFriend} acceptRequest={acceptRequest} dismissRequest={dismissRequest} refreshFriend={refreshFriend} removeFriend={removeFriend} flash={flash} derived={derived} />}
</>
          }
        </main>
        <BottomNav tab={tab} quickAdd={quickAdd} quickCheck={quickCheck} quickGive={quickGive} setTab={openTab} incomingCount={incoming.length} onQuickAdd={()=>openQuick("add")} onQuickCheck={()=>openQuick("check")} onQuickGive={()=>openQuick("give")} />
      </>}
      {toast && <div style={S.toast}>{toast}</div>}
    </div>
    </AlbumCtx.Provider>
  );
}

/* ================================================================== */
function friendlyError(code) {
  return ({
    "auth/invalid-email": "Invalid email address.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/user-not-found": "No account with that email.",
    "auth/wrong-password": "Incorrect email or password.",
    "auth/email-already-in-use": "An account with that email already exists.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/network-request-failed": "Network error. Check your connection.",
  })[code] || "Something went wrong. Please try again.";
}

function Auth() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError(null); setResetSent(false);
    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
        await sendEmailVerification(auth.currentUser);
      }
      // onAuthStateChanged in App handles the phase transition
    } catch (e) {
      setError(friendlyError(e.code));
      setBusy(false);
    }
  }

  async function handleReset() {
    if (!email.trim()) { setError("Enter your email address above first."); return; }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setError(null); setResetSent(true);
    } catch (e) { setError(friendlyError(e.code)); }
  }

  const tabStyle = active => ({
    flex:1, padding:"8px", borderRadius:8, fontSize:13, fontWeight:600, transition:".15s",
    ...(active ? {background:"var(--surface2)",color:"var(--text)"} : {color:"var(--muted)"}),
  });

  return (
    <div style={S.authWrap}><div style={S.authGrid} />
      <div style={S.authCard}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
          <Trophy size={26} color="var(--gold)" />
          <span className="num" style={{color:"var(--muted)",letterSpacing:".22em",fontSize:12}}>PANINI · TOPPS · AND MORE</span>
        </div>
        <h1 className="wc-wordmark" style={S.bigMark}>STICKER<br/>ALBUM <span style={S.markAccent}>'26</span></h1>
        <p style={{color:"var(--muted)",margin:"2px 0 20px",lineHeight:1.5,fontSize:14.5}}>Track every album you collect — Panini, Topps and more. Your collections sync across all your devices.</p>
        <div style={{display:"flex",background:"var(--ink2)",borderRadius:11,padding:4,border:"1px solid var(--line)",marginBottom:20}}>
          <button style={tabStyle(mode==="signin")} onClick={()=>{setMode("signin");setError(null);setResetSent(false);}}>Sign In</button>
          <button style={tabStyle(mode==="signup")} onClick={()=>{setMode("signup");setError(null);setResetSent(false);}}>Create Account</button>
        </div>
        <form onSubmit={submit}>
          <Fld label="Email" value={email} onChange={setEmail} placeholder="your@email.com" type="email" />
          <Fld label="Password" value={password} onChange={setPassword} placeholder={mode==="signup"?"At least 6 characters":""} type="password" />
          {error && <p style={{color:"var(--need)",fontSize:12.5,margin:"0 0 12px",lineHeight:1.4}}>{error}</p>}
          {resetSent && <p style={{color:"var(--grass)",fontSize:12.5,margin:"0 0 12px"}}>Reset email sent — check your inbox.</p>}
          <button type="submit" style={{...S.primaryBtn,width:"100%",opacity:busy?0.6:1}} disabled={busy}>
            {busy ? "…" : mode==="signin" ? "Sign In" : "Create Account"}
          </button>
        </form>
        {mode==="signin" && (
          <button onClick={handleReset} style={{marginTop:14,background:"none",border:"none",color:"var(--muted)",fontSize:12.5,cursor:"pointer",textDecoration:"underline",padding:0}}>
            Forgot password?
          </button>
        )}
      </div>
    </div>
  );
}

/* ================================================================== */
function Verify({ email, onVerified, onSignOut }) {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  async function check() {
    setBusy(true); setError(null);
    try {
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        await onVerified();
      } else {
        setError("Email not yet verified. Check your inbox and click the link first.");
      }
    } catch { setError("Something went wrong. Please try again."); }
    finally { setBusy(false); }
  }

  async function resend() {
    setSent(false); setError(null);
    try {
      await sendEmailVerification(auth.currentUser);
      setSent(true);
    } catch { setError("Could not resend. Please try again in a moment."); }
  }

  return (
    <div style={S.authWrap}><div style={S.authGrid} />
      <div style={S.authCard}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <Trophy size={26} color="var(--gold)" />
          <span className="num" style={{color:"var(--muted)",letterSpacing:".22em",fontSize:12}}>PANINI · TOPPS · AND MORE</span>
        </div>
        <h2 style={{margin:"0 0 12px",fontSize:22,fontWeight:800,lineHeight:1.2}}>Verify your email</h2>
        <p style={{color:"var(--muted)",margin:"0 0 6px",lineHeight:1.5,fontSize:14}}>We sent a verification link to:</p>
        <p style={{color:"var(--gold)",fontWeight:700,margin:"0 0 18px",wordBreak:"break-all",fontSize:14}}>{email}</p>
        <p style={{color:"var(--muted)",fontSize:13.5,margin:"0 0 8px",lineHeight:1.6}}>Click the link in that email to verify your account, then come back here and press the button below.</p>
        <p style={{color:"var(--muted)",fontSize:13,margin:"0 0 20px",lineHeight:1.5}}>Can't find it? Check your <strong style={{color:"var(--text)"}}>Junk</strong> or <strong style={{color:"var(--text)"}}>Spam</strong> folder.</p>
        {error && <p style={{color:"var(--need)",fontSize:12.5,margin:"0 0 12px",lineHeight:1.4}}>{error}</p>}
        {sent && <p style={{color:"var(--grass)",fontSize:12.5,margin:"0 0 12px"}}>Verification email resent — check your inbox.</p>}
        <button style={{...S.primaryBtn,width:"100%",marginBottom:10,opacity:busy?0.6:1}} onClick={check} disabled={busy}>
          {busy ? "Checking…" : "I've verified my email"}
        </button>
        <button style={{...S.miniBtn,width:"100%",justifyContent:"center",marginBottom:18}} onClick={resend}>
          Resend verification email
        </button>
        <button onClick={onSignOut} style={{background:"none",border:"none",color:"var(--muted)",fontSize:12.5,cursor:"pointer",textDecoration:"underline",padding:0}}>
          Sign out
        </button>
      </div>
    </div>
  );
}

/* ================================================================== */
function Setup({ onSetup }) {
  const [handle, setHandle] = useState("");
  const [name, setName] = useState("");
  const clean = handle.trim().toLowerCase().replace(/[^a-z0-9_]/g,"");
  return (
    <div style={S.authWrap}><div style={S.authGrid} />
      <div style={S.authCard}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}><Trophy size={26} color="var(--gold)" /><span className="num" style={{color:"var(--muted)",letterSpacing:".22em",fontSize:12}}>PANINI · TOPPS · AND MORE</span></div>
        <h1 className="wc-wordmark" style={S.bigMark}>STICKER<br/>ALBUM <span style={S.markAccent}>'26</span></h1>
        <p style={{color:"var(--muted)",margin:"2px 0 22px",lineHeight:1.5,fontSize:14.5}}>Mark what you own, spot duplicates, and swap with friends to finish your albums. You start with Panini FIFA World Cup 26 — add more from the shelf any time.</p>
        <Fld label="Your name" value={name} onChange={setName} placeholder="e.g. Alex" />
        <Fld label="Friend handle" value={handle} onChange={v=>setHandle(v.toLowerCase())} placeholder="e.g. alexp" prefix="@" hint="Lowercase letters, numbers and underscores only. Friends use this to find your lists." />
        <button style={{...S.primaryBtn,marginTop:6,opacity:clean?1:0.5}} disabled={!clean} onClick={()=>onSetup(clean, name.trim())}>Open my album</button>
      </div>
    </div>
  );
}

/* ================================================================== */
function TopBar({ profile, tab, quickAdd, quickCheck, quickGive, albumsOpen, setTab, derived, incomingCount=0, onQuickAdd, onQuickCheck, onQuickGive, onOpenAccount, onOpenAlbums }) {
  const A = useAlbum();
  const pct = Math.round((derived.owned.length/A.total)*100);
  const activeTab = albumsOpen ? "albums" : quickGive ? "quickgive" : quickCheck ? "quickcheck" : quickAdd ? "quickadd" : tab;
  const tabs = [["tracker","Album",BookOpen],["friends","Friends",Users]];
  return (
    <header style={S.topbar}><div style={S.topInner}>
      <div style={{display:"flex",alignItems:"center",gap:11}}>
        <Trophy size={22} color="var(--gold)" />
        <button onClick={onOpenAlbums} title="Switch album" style={{display:"flex",alignItems:"center",gap:5,padding:"3px 7px",borderRadius:9,border:"1px solid "+(albumsOpen?"var(--gold-deep)":"transparent"),background:albumsOpen?"rgba(244,194,74,.08)":"none"}}>
          <Wordmark text={A.shortTitle} size={19}/>
          <ChevronDown size={13} color="var(--muted)"/>
        </button>
        <div className="hdr-prog" style={S.tinyProg}><div style={{...S.tinyProgFill,width:`${pct}%`}} /></div>
        <span className="hdr-prog num" style={{color:"var(--muted)",fontSize:12}}>{pct}%</span>
        <span className="hdr-prog num" style={{color:"var(--muted2)",fontSize:11}}>{derived.owned.length}/{A.total}</span>
      </div>
      <nav className="desktop-nav" style={S.tabs}>
        <button onClick={()=>setTab("stats")} style={{...S.tab,...(activeTab==="stats"?S.tabActive:{}),position:"relative"}}><Sparkles size={15}/><span>Home</span></button>
        <button onClick={onQuickAdd} style={{...S.tab,...(activeTab==="quickadd"?S.tabActive:{}),position:"relative"}}><Zap size={15}/><span>Add</span></button>
        <button onClick={onQuickGive} style={{...S.tab,...(activeTab==="quickgive"?S.tabActive:{}),position:"relative"}}><Gift size={15}/><span>Give</span></button>
        <button onClick={onQuickCheck} style={{...S.tab,...(activeTab==="quickcheck"?S.tabActive:{}),position:"relative"}}><Search size={15}/><span>Check</span></button>
        {tabs.map(([id,label,Icon])=><button key={id} onClick={()=>setTab(id)} style={{...S.tab,...(activeTab===id?S.tabActive:{}),position:"relative"}}><Icon size={15}/><span>{label}</span>{id==="friends"&&incomingCount>0&&<span style={S.tabBadge}>{incomingCount}</span>}</button>)}
      </nav>
      <button onClick={onOpenAccount} style={{display:"flex",alignItems:"center",gap:10,borderRadius:10,padding:"4px 8px 4px 4px",border:"1px solid transparent",transition:".15s"}} title="Account">
        <div style={S.avatar}>{profile.name.slice(0,1).toUpperCase()}</div>
        <div style={{lineHeight:1.1,textAlign:"left"}}><div style={{fontSize:13,fontWeight:600}}>{profile.name}</div><div className="num" style={{fontSize:11,color:"var(--muted)"}}>@{profile.handle}</div></div>
      </button>
    </div></header>
  );
}

function BottomNav({ tab, quickAdd, quickCheck, quickGive, setTab, incomingCount=0, onQuickAdd, onQuickCheck, onQuickGive }) {
  const activeTab = quickGive ? "quickgive" : quickCheck ? "quickcheck" : quickAdd ? "quickadd" : tab;
  return (
    <nav className="bottom-nav">
      <button className={"bn-btn"+(activeTab==="stats"?" bn-active":"")} onClick={()=>setTab("stats")} style={{position:"relative"}}>
        <Sparkles size={20}/><span className="bn-label">Home</span>
      </button>
      <button className={"bn-btn"+(activeTab==="quickadd"?" bn-active":"")} onClick={onQuickAdd}>
        <Zap size={20}/><span className="bn-label">Add</span>
      </button>
      <button className={"bn-btn"+(activeTab==="quickgive"?" bn-active":"")} onClick={onQuickGive}>
        <Gift size={20}/><span className="bn-label">Give</span>
      </button>
      <button className={"bn-btn"+(activeTab==="quickcheck"?" bn-active":"")} onClick={onQuickCheck}>
        <Search size={20}/><span className="bn-label">Check</span>
      </button>
      {[["tracker","Album",BookOpen],["friends","Friends",Users]].map(([id,label,Icon]) => (
        <button key={id} onClick={()=>setTab(id)} className={"bn-btn"+(activeTab===id?" bn-active":"")} style={{position:"relative"}}>
          <Icon size={20}/>
          <span className="bn-label">{label}</span>
          {id==="friends"&&incomingCount>0&&<span style={S.tabBadge}>{incomingCount}</span>}
        </button>
      ))}
    </nav>
  );
}

/* ================================================================== */
function Account({ profile, email, derived, prefs, setPrefs, flash, albumCount, onOpenAlbums, onClose, onSignOut }) {
  const A = useAlbum();
  const pct = Math.round((derived.owned.length / A.total) * 100);
  const joined = profile.createdAt ? new Date(profile.createdAt).toLocaleDateString(undefined, {year:"numeric",month:"long",day:"numeric"}) : null;
  const copyHandle = () => { navigator.clipboard?.writeText(profile.handle); flash("Handle copied"); };
  return (
    <div style={{maxWidth:480,margin:"0 auto"}}>
      <div style={{...S.panel,marginBottom:16,display:"flex",alignItems:"center",gap:18}}>
        <div style={{...S.avatar,width:56,height:56,borderRadius:16,fontSize:26}}>{profile.name.slice(0,1).toUpperCase()}</div>
        <div>
          <div style={{fontSize:20,fontWeight:700,lineHeight:1.15}}>{profile.name}</div>
          <div className="num" style={{fontSize:14,color:"var(--gold)",marginTop:3}}>@{profile.handle}</div>
          {email && <div style={{fontSize:12,color:"var(--muted)",marginTop:3}}>{email}</div>}
          {joined && <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Friend since {joined}</div>}
        </div>
      </div>
      <button onClick={onOpenAlbums} style={{...S.panel,marginBottom:16,width:"100%",display:"flex",alignItems:"center",gap:12,textAlign:"left",cursor:"pointer"}}>
        <BookOpen size={18} color="var(--gold)"/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:600,fontSize:14}}>{A.publisher} · {A.title}</div>
          <div style={{fontSize:11.5,color:"var(--muted)",marginTop:2}}>{albumCount} album{albumCount===1?"":"s"} on your shelf · tap to switch or add</div>
        </div>
        <ChevronDown size={15} color="var(--muted)" style={{transform:"rotate(-90deg)"}}/>
      </button>
      <div style={{...S.panel,marginBottom:16}}>
        <div style={{fontSize:12,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",color:"var(--muted)",marginBottom:12}}>{A.shortTitle}</div>
        <div style={{display:"flex",gap:24}}>
          <S2 n={derived.owned.length} l="owned" c="var(--grass)"/>
          <S2 n={derived.missing.length} l="missing" c="var(--need)"/>
          <S2 n={derived.dupeUnits} l="dupes" c="var(--gold)"/>
          <S2 n={`${pct}%`} l="complete" c="var(--sky)"/>
        </div>
      </div>
      <div style={{...S.panel,marginBottom:16}}>
        <h3 style={S.panelTitle}>Shared lists</h3>
        <p style={S.dim}>Choose what friends can see. Changes auto-publish.</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",margin:"14px 0"}}>{[["owned","Owned"],["missing","Missing"],["dupes","Duplicates"]].map(([k,l])=><button key={k} onClick={()=>setPrefs(p=>({...p,[k]:!p[k]}))} style={{...S.toggle,...(prefs[k]?S.toggleOn:{})}}>{prefs[k]?<Check size={14}/>:<X size={14}/>} {l}</button>)}</div>
        <div style={S.handleBox}><div><div style={S.dim}>Share this handle</div><div className="num" style={{fontSize:18,color:"var(--gold)"}}>@{profile.handle}</div></div><button style={S.miniBtn} onClick={copyHandle}><Copy size={13}/> Copy</button></div>
      </div>
      <button onClick={onSignOut} style={{...S.primaryBtn,width:"100%",background:"var(--need)",color:"#fff",justifyContent:"center",gap:8,padding:"13px"}}>
        <LogOut size={16}/> Sign out
      </button>
    </div>
  );
}

function QuickAdd({ counts, bump, onExit, flash }) {
  const A = useAlbum();
  const [code, setCode] = useState(null);
  const [pick, setPick] = useState(null); // {label, wasOwned, newCount}
  const pickTimer = useRef(null);
  const allCodes = A.unitOrderCode;

  function handlePick(s) {
    const wasOwned = (counts[s.id] || 0) > 0;
    const newCount = (counts[s.id] || 0) + 1;
    bump(s.id, 1);
    const label = s.dispCode;
    setPick({ label, wasOwned, newCount });
    clearTimeout(pickTimer.current);
    pickTimer.current = setTimeout(() => { setPick(null); setCode(null); }, 3000);
  }

  if (!code) return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"7px 12px",borderRadius:10,background:"rgba(244,194,74,0.14)",border:"1px solid rgba(244,194,74,0.45)",marginBottom:14,marginTop:-8,overflow:"hidden"}}>
        <Zap size={14} color="var(--gold)" style={{flexShrink:0}}/>
        <div style={{fontWeight:600,fontSize:12,color:"var(--gold)",flexShrink:0}}>Add Sticker</div>
        <div style={{fontSize:12,color:"var(--muted)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",minWidth:0}}>· Pick a {A.vocab.unit.toLowerCase()}, then tap to add</div>
      </div>
      <div style={S.qaCodeGrid}>
        {allCodes.map(c => {
          const m = A.units[c];
          return <button key={c} style={{...S.qaCodeBtn,background:"rgba(244,194,74,0.05)",borderColor:"rgba(244,194,74,0.35)"}} onClick={()=>setCode(c)}>
            <FlagImg emoji={m.flag} code={c} size={22}/>
            <span className="num" style={{fontSize:10,fontWeight:700,marginTop:2}}>{c}</span>
          </button>;
        })}
      </div>
    </div>
  );

  const m = A.units[code];
  const stickers = A.sections[m.group][code] || [];
  return (
    <div>
      <div style={{...S.qaHeader,borderBottom:"2px solid rgba(244,194,74,0.4)",marginBottom:16}}>
        <button style={{...S.miniBtn,color:"var(--gold)"}} onClick={()=>setCode(null)}>← Back</button>
        <div style={{display:"flex",alignItems:"center",gap:8,flex:1,justifyContent:"center"}}>
          <FlagImg emoji={m.flag} code={code} size={20}/>
          <span style={{fontWeight:700,fontSize:16}}>{m.name}</span>
        </div>
        <button style={S.iconGhost} onClick={onExit} title="Exit"><X size={16}/></button>
      </div>
      {pick && (pick.wasOwned ? (
        <div key={pick.label+pick.newCount} style={{margin:"10px 0",padding:"11px 16px",borderRadius:12,background:"rgba(244,194,74,0.12)",border:"1px solid var(--gold)",display:"flex",alignItems:"center",gap:12,animation:"fade .2s ease"}}>
          <span style={{fontSize:22}}>👍</span>
          <div>
            <div className="num" style={{fontSize:14,color:"var(--gold)"}}>{pick.label} — duplicate added</div>
            <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>You now have <span className="num" style={{color:"var(--gold)"}}>{pick.newCount} copies</span> of this sticker</div>
          </div>
        </div>
      ) : (
        <div key={pick.label} style={{margin:"10px 0",padding:"11px 16px",borderRadius:12,background:"rgba(62,200,192,0.14)",border:"1px solid var(--grass)",display:"flex",alignItems:"center",gap:12,animation:"fade .2s ease"}}>
          <span style={{fontSize:22}}>⭐</span>
          <div>
            <div className="num" style={{fontSize:14,color:"var(--grass)"}}>{pick.label} — new sticker!</div>
            <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Added to your album</div>
          </div>
        </div>
      ))}
      <div style={S.qaSlotGrid}>
        {stickers.map(s => {
          const count = counts[s.id] || 0;
          const label = s.dispCode;
          return (
            <button key={s.id} onClick={() => handlePick(s)} style={{...S.qaSlotBtn,background:"rgba(244,194,74,0.05)",borderColor:"rgba(244,194,74,0.3)",...(count>0?{background:"rgba(244,194,74,0.15)",borderColor:"var(--gold)"}:{})}}>
              <span className="num" style={{fontSize:16,fontWeight:700,color:count>0?"var(--gold)":undefined}}>{label}</span>
              {count > 1 && <span className="num" style={{fontSize:10,color:"var(--gold)",marginTop:1}}>×{count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
function QuickCheck({ counts, onExit }) {
  const A = useAlbum();
  const [code, setCode] = useState(null);
  const [checked, setChecked] = useState(null);
  const allCodes = A.unitOrderCode;

  function handlePick(s) {
    setChecked({ s, count: counts[s.id] || 0 });
  }

  if (!code) return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"7px 12px",borderRadius:10,background:"rgba(80,128,208,0.14)",border:"1px solid rgba(80,128,208,0.45)",marginBottom:14,marginTop:-8,overflow:"hidden"}}>
        <Search size={14} color="var(--sky)" style={{flexShrink:0}}/>
        <div style={{fontWeight:600,fontSize:12,color:"var(--sky)",flexShrink:0}}>Check Collection</div>
        <div style={{fontSize:12,color:"var(--muted)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",minWidth:0}}>· Pick a {A.vocab.unit.toLowerCase()}, then tap to check</div>
      </div>
      <div style={S.qaCodeGrid}>
        {allCodes.map(c => {
          const m = A.units[c];
          return <button key={c} style={{...S.qaCodeBtn,background:"rgba(80,128,208,0.05)",borderColor:"rgba(80,128,208,0.35)"}} onClick={() => { setCode(c); setChecked(null); }}>
            <FlagImg emoji={m.flag} code={c} size={22}/>
            <span className="num" style={{fontSize:10,fontWeight:700,marginTop:2}}>{c}</span>
          </button>;
        })}
      </div>
    </div>
  );

  const m = A.units[code];
  const stickers = A.sections[m.group][code] || [];
  return (
    <div>
      <div style={{...S.qaHeader,borderBottom:"2px solid rgba(80,128,208,0.4)",marginBottom:16}}>
        <button style={{...S.miniBtn,color:"var(--sky)"}} onClick={() => { setCode(null); setChecked(null); }}>← Back</button>
        <div style={{display:"flex",alignItems:"center",gap:8,flex:1,justifyContent:"center"}}>
          <FlagImg emoji={m.flag} code={code} size={20}/>
          <span style={{fontWeight:700,fontSize:16}}>{m.name}</span>
        </div>
        <button style={S.iconGhost} onClick={onExit} title="Exit"><X size={16}/></button>
      </div>
      {checked && (() => {
        const owned = checked.count > 0;
        const dupes = checked.count - 1;
        const code2 = checked.s.dispCode;
        return (
          <div style={{margin:"12px 0",padding:"14px 16px",borderRadius:12,background:owned?"rgba(80,128,208,0.12)":"rgba(216,60,46,0.1)",border:`1px solid ${owned?"var(--sky)":"var(--need)"}`,display:"flex",alignItems:"center",gap:14}}>
            <div style={{fontSize:24,lineHeight:1,color:owned?"var(--sky)":"var(--need)"}}>{owned?"✓":"✗"}</div>
            <div>
              <div style={{fontWeight:700,fontSize:14,color:owned?"var(--sky)":"var(--need)"}}>{code2} — {checked.s.label}</div>
              <div style={{fontSize:13,color:"var(--muted)",marginTop:3}}>
                {!owned && "Not in your collection"}
                {owned && dupes === 0 && "1 copy in your collection"}
                {owned && dupes === 1 && <span>1 copy · <span style={{color:"var(--sky)"}}>1 duplicate</span></span>}
                {owned && dupes > 1 && <span>1 copy · <span style={{color:"var(--sky)"}}>{dupes} duplicates</span></span>}
              </div>
            </div>
          </div>
        );
      })()}
      <div style={S.qaSlotGrid}>
        {stickers.map(s => {
          const count = counts[s.id] || 0;
          const isChecked = checked?.s.id === s.id;
          const label2 = s.dispCode;
          return (
            <button key={s.id} onClick={() => handlePick(s)} style={{...S.qaSlotBtn,background:"rgba(80,128,208,0.05)",borderColor:"rgba(80,128,208,0.3)",...(count>0?{background:"rgba(80,128,208,0.14)",borderColor:"var(--sky)"}:{}),...(isChecked?{outline:"2px solid var(--sky)",outlineOffset:2}:{})}}>
              <span className="num" style={{fontSize:16,fontWeight:700,color:count>0?"var(--sky)":undefined}}>{label2}</span>
              {count > 1 && <span className="num" style={{fontSize:10,color:"var(--sky)",marginTop:1}}>×{count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================== */
function QuickGive({ counts, bump, onExit }) {
  const A = useAlbum();
  const [code, setCode] = useState(null);
  const [pick, setPick] = useState(null);
  const pickTimer = useRef(null);
  const allCodes = A.unitOrderCode;

  function handlePick(s) {
    const current = counts[s.id] || 0;
    if (current < 2) return;
    bump(s.id, -1);
    const label = s.dispCode;
    setPick({ label, remaining: current - 1 });
    clearTimeout(pickTimer.current);
    pickTimer.current = setTimeout(() => { setPick(null); setCode(null); }, 3000);
  }

  if (!code) return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"7px 12px",borderRadius:10,background:"rgba(240,126,60,0.14)",border:"1px solid rgba(240,126,60,0.45)",marginBottom:14,marginTop:-8,overflow:"hidden"}}>
        <Gift size={14} color="var(--p5)" style={{flexShrink:0}}/>
        <div style={{fontWeight:600,fontSize:12,color:"var(--p5)",flexShrink:0}}>Give Away</div>
        <div style={{fontSize:12,color:"var(--muted)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",minWidth:0}}>· Pick a {A.vocab.unit.toLowerCase()}, then tap to remove</div>
      </div>
      <div style={S.qaCodeGrid}>
        {allCodes.map(c => {
          const m = A.units[c];
          const hasDupes = (A.sections[m.group][c] || []).some(s => (counts[s.id] || 0) > 1);
          return <button key={c} style={{...S.qaCodeBtn,background:"rgba(240,126,60,0.05)",borderColor:"rgba(240,126,60,0.35)",opacity:hasDupes?1:0.35}} onClick={()=>setCode(c)}>
            <FlagImg emoji={m.flag} code={c} size={22}/>
            <span className="num" style={{fontSize:10,fontWeight:700,marginTop:2}}>{c}</span>
          </button>;
        })}
      </div>
    </div>
  );

  const m = A.units[code];
  const stickers = A.sections[m.group][code] || [];
  return (
    <div>
      <div style={{...S.qaHeader,borderBottom:"2px solid rgba(240,126,60,0.4)",marginBottom:16}}>
        <button style={{...S.miniBtn,color:"var(--p5)"}} onClick={()=>setCode(null)}>← Back</button>
        <div style={{display:"flex",alignItems:"center",gap:8,flex:1,justifyContent:"center"}}>
          <FlagImg emoji={m.flag} code={code} size={20}/>
          <span style={{fontWeight:700,fontSize:16}}>{m.name}</span>
        </div>
        <button style={S.iconGhost} onClick={onExit} title="Exit"><X size={16}/></button>
      </div>
      {pick && (
        <div key={pick.label+pick.remaining} style={{margin:"10px 0",padding:"11px 16px",borderRadius:12,background:"rgba(240,126,60,0.12)",border:"1px solid var(--p5)",display:"flex",alignItems:"center",gap:12,animation:"fade .2s ease"}}>
          <span style={{fontSize:22}}>🤝</span>
          <div>
            <div className="num" style={{fontSize:14,color:"var(--p5)"}}>{pick.label} — duplicate given away</div>
            <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{pick.remaining} cop{pick.remaining===1?"y":"ies"} still in your album</div>
          </div>
        </div>
      )}
      <div style={S.qaSlotGrid}>
        {stickers.map(s => {
          const count = counts[s.id] || 0;
          const label = s.dispCode;
          const hasStock = count > 1;
          return (
            <button key={s.id} disabled={!hasStock} onClick={() => handlePick(s)} style={{...S.qaSlotBtn,background:hasStock?"rgba(240,126,60,0.12)":"rgba(240,126,60,0.03)",borderColor:hasStock?"var(--p5)":"rgba(240,126,60,0.15)",opacity:hasStock?1:0.4,cursor:hasStock?"pointer":"default"}}>
              <span className="num" style={{fontSize:16,fontWeight:700,color:hasStock?"var(--p5)":undefined}}>{label}</span>
              {count > 1 && <span className="num" style={{fontSize:10,color:"var(--p5)",marginTop:1}}>×{count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================== */
function Tracker({ counts, toggle, bump }) {
  const A = useAlbum();
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(() => new Set());
  const [sortBy, setSortBy] = useState("groups");
  const filtering = filter !== "all" || q.trim().length > 0;
  const match = s => {
    const c = counts[s.id] || 0;
    if (filter === "owned" && c < 1) return false;
    if (filter === "missing" && c !== 0) return false;
    if (filter === "dupes" && c < 2) return false;
    if (q.trim()) { const t = q.trim().toLowerCase(); if (!(s.team.toLowerCase().includes(t) || s.label.toLowerCase().includes(t) || s.code.toLowerCase().includes(t) || String(s.n) === t)) return false; }
    return true;
  };
  const toggleTeam = c => setOpen(p => { const n = new Set(p); n.has(c) ? n.delete(c) : n.add(c); return n; });
  const allCodes = A.unitOrder;
  const filters = [["all","All"],["owned","Owned"],["missing","Missing"],["dupes","Dupes"]];
  const sorts = [["groups",A.vocab.sectionPlural],["alpha","A–Z"]];
  const getStickers = c => { const g = A.units[c].group; return A.sections[g][c] || []; };
  const alphaCodes = A.unitOrderAlpha;
  return (
    <div>
      <div style={{marginBottom:22}}>
        <div style={S.searchBox}><Search size={16} color="var(--muted)"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search player, team or sticker #…" style={S.searchInput}/>{q&&<button style={S.clearBtn} onClick={()=>setQ("")}><X size={14}/></button>}</div>
        <div style={{display:"flex",background:"var(--ink2)",borderRadius:11,padding:3,border:"1px solid var(--line)",marginTop:10}}>
          {filters.map(([id,label])=>{const a=filter===id?chipA(id==="dupes"?"owned":id):null;return<button key={id} onClick={()=>setFilter(id)} style={{flex:1,padding:"7px 4px",borderRadius:8,fontSize:13,fontWeight:600,transition:".15s",background:a?a.background:"none",color:a?a.color:"var(--muted)",border:"none"}}>{label}</button>;})}
        </div>
        <div style={{display:"flex",gap:6,marginTop:8,alignItems:"center"}}>
          <span style={{fontSize:12,color:"var(--muted)",fontWeight:600,flexShrink:0}}>Order by</span>
          {sorts.map(([id,label])=><button key={id} onClick={()=>setSortBy(id)} style={{...S.chip,padding:"5px 10px",fontSize:12,flexShrink:0,...(sortBy===id?chipA("all"):{})}}>{label}</button>)}
          <span style={{flex:1}}/>
          <button style={{...S.miniBtn,flexShrink:0,padding:"5px 10px",fontSize:12}} onClick={()=>setOpen(new Set(allCodes))}>Expand all</button>
          <button style={{...S.miniBtn,flexShrink:0,padding:"5px 10px",fontSize:12}} onClick={()=>setOpen(new Set())}>Collapse</button>
        </div>
      </div>
      {sortBy === "alpha" ? (
        <>
          <div style={S.teamGrid}>
            {alphaCodes.map(c=>({c,stickers:getStickers(c).filter(match)})).filter(({stickers})=>!filtering||stickers.length>0).map(({c,stickers})=><TrackerTeamCard key={c} code={c} counts={counts} stickers={filtering?stickers:getStickers(c)} open={open.has(c)} onToggle={()=>toggleTeam(c)} toggle={toggle} bump={bump}/>)}
          </div>
          {filtering && alphaCodes.every(c=>getStickers(c).filter(match).length===0) && <Empty icon={Search} title="Nothing matches" body="Try a different filter or search."/>}
        </>
      ) : (
        <>
          {A.sectionOrder.map(g => {
            const codes = Object.keys(A.sections[g] || {});
            const vis = codes.map(c => ({ c, stickers: (A.sections[g][c] || []).filter(match) })).filter(t => !filtering || t.stickers.length > 0);
            if (filtering && vis.length === 0) return null;
            const clr = `var(${A.sectionMeta[g]?.color || "--gold"})`;
            return <section key={g} style={{marginBottom:26}}>
              <div style={S.groupHead}><span className="num" style={{...S.groupBadge,color:clr,borderColor:clr}}>{A.sectionMeta[g]?.short || g}</span><span style={S.groupRule}/></div>
              <div style={S.teamGrid}>{vis.map(({c,stickers})=><TrackerTeamCard key={c} code={c} counts={counts} stickers={filtering?stickers:A.sections[g][c]} open={open.has(c)} onToggle={()=>toggleTeam(c)} toggle={toggle} bump={bump}/>)}</div>
            </section>;
          })}
          {filtering && A.sectionOrder.every(g=>Object.keys(A.sections[g]||{}).every(c=>(A.sections[g][c]||[]).filter(match).length===0)) && <Empty icon={Search} title="Nothing matches" body="Try a different filter or search."/>}
        </>
      )}
    </div>
  );
}
function TrackerTeamCard({ code, stickers, counts, open, onToggle, toggle, bump }) {
  const A = useAlbum();
  const m = A.units[code]; const full = A.sections[m.group][code] || [];
  const ownedN = full.filter(s => (counts[s.id]||0) >= 1).length;
  const dupeN = full.filter(s => (counts[s.id]||0) >= 2).length;
  const pct = full.length ? Math.round((ownedN / full.length) * 100) : 0;
  return (
    <div style={{...S.teamCard,borderColor:pct===100?"var(--gold)":"var(--line)"}}>
      <button style={S.teamHead} onClick={onToggle}>
        <span style={{...S.flagBadge,background:tint(m.c1)}}><FlagImg emoji={m.flag} code={code} size={28}/></span>
        <div style={{flex:1,textAlign:"left",minWidth:0}}>
          <div style={{display:"flex",alignItems:"baseline",gap:8}}><span style={S.teamName}>{m.name}</span>{pct===100&&<span style={S.completeTag}>COMPLETE</span>}</div>
        </div>
        <div style={{textAlign:"right"}}><div className="num" style={{fontSize:13}}>{ownedN}<span style={{color:"var(--muted2)"}}>/{full.length}</span></div>{dupeN>0&&<div className="num" style={{fontSize:10.5,color:"var(--gold)"}}>{dupeN} duplicates</div>}</div>
        <ChevronDown size={16} color="var(--muted)" style={{transform:open?"rotate(180deg)":"none",transition:".2s"}}/>
      </button>
      <div style={S.cardProg}><div style={{...S.cardProgFill,width:`${pct}%`}}/></div>
      {open && <div style={S.slotGrid}>{stickers.map(s=><TrackerSlot key={s.id} s={s} count={counts[s.id]||0} toggle={toggle} bump={bump}/>)}</div>}
    </div>
  );
}
function TrackerSlot({ s, count, toggle, bump }) {
  const [confirming, setConfirming] = useState(false);
  const owned = count >= 1, dupe = count >= 2;
  const cls = "slot" + (owned?" owned":"") + (dupe?" dupe":"") + (s.foil?" foil":"");
  const bg = owned ? {background:`linear-gradient(150deg,${tint(s.c1)} 0%,${tint(s.c2||s.c1)} 100%)`} : {};
  if (confirming) return (
    <div className={cls} style={{borderColor:shade(s.c1)}}>
      <div className="slot-body" style={bg}>
        <span className="num slot-num">{s.fullCode}</span>
        <span style={{fontSize:9.5,fontWeight:700,color:"var(--text)",marginBottom:4}}>Remove?</span>
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>{toggle(s.id);setConfirming(false);}} style={S.slotConfirmYes}><Check size={12}/></button>
          <button onClick={()=>setConfirming(false)} style={S.slotConfirmNo}><X size={12}/></button>
        </div>
      </div>
    </div>
  );
  return (
    <div className={cls} style={owned?{borderColor:shade(s.c1)}:{}}>
      <button className="slot-body" onClick={()=>owned?setConfirming(true):toggle(s.id)} title={`${s.fullCode}${s.pname?"":` · ${s.label}`}`} style={bg}>
        <span className="num slot-num">{s.fullCode}</span>
        {owned?<FlagImg emoji={s.flag} code={s.code} size={28} style={{filter:'drop-shadow(0 2px 4px rgba(0,0,0,.4))',marginBottom:-2}}/>:<FlagImg emoji={s.flag} code={s.code} size={28} style={{filter:'grayscale(1)',opacity:.16,marginBottom:-2}}/>}
        {dupe&&<span className="num dupe-badge">×{count}</span>}
      </button>
      {owned && <div className="slot-ctrls">
        <button onClick={()=>count<=1?setConfirming(true):bump(s.id,-1)}><Minus size={12}/></button>
        <span className="num">{count}</span>
        <button onClick={()=>bump(s.id,+1)}><Plus size={12}/></button>
      </div>}
    </div>
  );
}

/* ================================================================== */
function Stats({ counts, derived, albumCount, onOpenAlbums, onQuickAdd, onQuickCheck, onQuickGive }) {
  const A = useAlbum();
  const pct = Math.round((derived.owned.length/A.total)*100);
  const byConf = {}; A.stickers.forEach(s => { (byConf[s.conf]||={t:0,o:0}).t++; if((counts[s.id]||0)>=1) byConf[s.conf].o++; });
  const teamRows = A.unitOrderMain.map(code => {
    const u = A.units[code]; const list = A.sections[u.group][code]||[];
    const o = list.filter(s=>(counts[s.id]||0)>=1).length;
    return {code,name:u.name,flag:u.flag,c1:u.c1,o,total:list.length,pct:list.length?o/list.length:0};
  });
  const closest = teamRows.filter(r=>r.pct<1&&r.pct>0).sort((a,b)=>b.pct-a.pct).slice(0,6);
  const done = teamRows.filter(r=>r.pct===1).length;

  function generatePDF(title, colHeader, ids, filename) {
    if (!ids.length) return;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const PW = 210, PH = 297, ML = 12, MR = 12, MT = 12, MB = 10;
    const CW = PW - ML - MR;

    const groups = {};
    for (const id of ids) {
      const s = A.byId[id]; if (!s) continue;
      if (!groups[s.code]) groups[s.code] = { name: s.team, stickers: [] };
      groups[s.code].stickers.push(s);
    }
    const teamKeys = Object.keys(groups).sort((a, b) => A.unitOrder.indexOf(a) - A.unitOrder.indexOf(b));

    const COL_W = 44, PER_ROW = 99; // never wrap within a team
    const totalLogRows = teamKeys.length; // one row per team

    const HDR_H = 22;
    const availH = PH - MT - MB - HDR_H;
    const rowH = availH / (Math.max(A.unitOrder.length, teamKeys.length) * 1.25);
    const sc = rowH / 5.5;
    const fSlot = Math.max(4.5, 8 * sc), fCode = Math.max(4.5, 8.5 * sc), fName = Math.max(4, 7 * sc);
    const lh = fs => fs * 0.353;

    let y = MT;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.setTextColor(30, 110, 60);
    doc.text(title, ML, y + 5); y += 11;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(110, 110, 110);
    const dt = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.text(`${A.publisher} ${A.title}  ·  ${ids.length} stickers  ·  ${dt}`, ML, y); y += 5;
    doc.setDrawColor(180, 220, 180); doc.setLineWidth(0.3);
    doc.line(ML, y, PW - MR, y); y += 4;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); doc.setTextColor(150, 150, 150);
    doc.text('CODE', ML, y); doc.text(A.vocab.unit.toUpperCase(), ML + 13, y); doc.text(colHeader, ML + COL_W, y); y += 2.5;
    doc.setDrawColor(160, 160, 160); doc.setLineWidth(0.2);
    doc.line(ML, y, PW - MR, y);

    for (const key of teamKeys) {
      const { name, stickers } = groups[key];
      const labels = stickers.map(s => s.slotLabel);
      const rowCount = Math.ceil(labels.length / PER_ROW);
      const baseline = y + lh(fCode) + (rowH - lh(fCode)) / 2;
      doc.setFont('helvetica', 'bold'); doc.setFontSize(fCode); doc.setTextColor(30, 110, 60);
      doc.text(key, ML, baseline);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(fName); doc.setTextColor(110, 110, 110);
      doc.text(name.length > 14 ? name.slice(0, 13) + '…' : name, ML + 13, baseline);
      doc.setFont('courier', 'bold'); doc.setFontSize(fSlot); doc.setTextColor(20, 20, 20);
      for (let r = 0; r < rowCount; r++) {
        doc.text(labels.slice(r * PER_ROW, (r + 1) * PER_ROW).join('  '), ML + COL_W, y + lh(fSlot) + (rowH - lh(fSlot)) / 2 + r * rowH);
      }
      y += rowCount * rowH;
      doc.setDrawColor(228, 228, 228); doc.setLineWidth(0.12);
      doc.line(ML, y, PW - MR, y);
      y += rowH * 0.25;
    }
    doc.save(filename);
  }

  const downloadMissingPDF   = () => generatePDF('Missing Stickers',   'MISSING SLOTS',   derived.missing, `missing-stickers-${A.slug}.pdf`);
  const downloadCollectedPDF = () => generatePDF('Collected Stickers', 'COLLECTED SLOTS', derived.owned,   `collected-stickers-${A.slug}.pdf`);
  const downloadDupesPDF     = () => generatePDF('Duplicate Stickers', 'DUPLICATE SLOTS', derived.dupes.flatMap(([id, qty]) => Array(qty).fill(id)), `duplicate-stickers-${A.slug}.pdf`);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <button onClick={onOpenAlbums} style={{...S.panel,width:"100%",display:"flex",alignItems:"center",gap:12,textAlign:"left",cursor:"pointer"}}>
        <BookOpen size={18} color="var(--gold)"/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:700,fontSize:13.5,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{A.publisher} · {A.title}</div>
          <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{A.kicker || `${A.total} stickers`}{albumCount>1?` · ${albumCount} albums on your shelf`:""}</div>
        </div>
        <span style={{fontSize:11.5,color:"var(--gold)",fontWeight:700,flexShrink:0}}>Switch</span>
        <ChevronDown size={14} color="var(--muted)" style={{transform:"rotate(-90deg)",flexShrink:0}}/>
      </button>
      <div style={S.panel}>
        <h3 style={S.panelTitle}>Quick actions</h3>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          <button onClick={onQuickAdd} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,padding:"14px 8px",borderRadius:12,background:"rgba(244,194,74,0.18)",color:"var(--text)",border:"1px solid rgba(244,194,74,0.4)",cursor:"pointer"}}>
            <Zap size={20} color="var(--gold)"/>
            <span style={{fontWeight:700,fontSize:12,lineHeight:1}}>Add</span>
            <span style={{fontSize:10,color:"var(--muted)",lineHeight:1.3,textAlign:"center"}}>Scan a sticker into your album</span>
          </button>
          <button onClick={onQuickGive} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,padding:"14px 8px",borderRadius:12,background:"rgba(240,126,60,0.16)",color:"var(--text)",border:"1px solid rgba(240,126,60,0.45)",cursor:"pointer"}}>
            <Gift size={20} color="var(--p5)"/>
            <span style={{fontWeight:700,fontSize:12,lineHeight:1}}>Give Away</span>
            <span style={{fontSize:10,color:"var(--muted)",lineHeight:1.3,textAlign:"center"}}>Give a spare to someone</span>
          </button>
          <button onClick={onQuickCheck} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,padding:"14px 8px",borderRadius:12,background:"rgba(80,128,208,0.22)",color:"var(--text)",border:"1px solid rgba(80,128,208,0.5)",cursor:"pointer"}}>
            <Search size={20} color="var(--sky)"/>
            <span style={{fontWeight:700,fontSize:12,lineHeight:1}}>Check</span>
            <span style={{fontSize:10,color:"var(--muted)",lineHeight:1.3,textAlign:"center"}}>Check if you already own one</span>
          </button>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <SC label="Collected" value={derived.owned.length} sub={`of ${A.total}`} accent="var(--grass)" action={downloadCollectedPDF} />
        <SC label="Missing" value={derived.missing.length} sub="to finish" accent="var(--need)" action={downloadMissingPDF} />
        <SC label="Duplicates" value={derived.dupes.length} sub="to swap" accent="var(--gold)" action={downloadDupesPDF} />
        <SC label="Completion" value={`${pct}%`} sub={`${done} ${(done===1?A.vocab.unit:A.vocab.unitPlural).toLowerCase()} done`} accent="var(--sky)" />
      </div>
      <div style={S.panel}>
        <h3 style={S.panelTitle}>Progress by {A.vocab.section.toLowerCase()}</h3>
        <div style={{display:"flex",flexDirection:"column",gap:18}}>
          {A.sectionOrder.map(g => {
            const entries = Object.entries(A.sections[g] || {});
            if (!entries.length) return null;
            const clr = `var(${A.sectionMeta[g]?.color || "--gold"})`;
            const totalG = entries.reduce((s,[,ss])=>s+ss.length,0);
            const ownedG = entries.reduce((s,[,ss])=>s+ss.filter(st=>(counts[st.id]||0)>=1).length,0);
            const gPct = totalG ? ownedG/totalG : 0;
            return (
              <div key={g}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                  <span className="num" style={{fontSize:11,color:clr,letterSpacing:.5,flexShrink:0}}>{A.sectionMeta[g]?.short || g}</span>
                  <div style={{flex:1,height:3,background:"var(--line)",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${gPct*100}%`,background:clr,borderRadius:2}}/></div>
                  <span className="num" style={{fontSize:11,color:"var(--muted)",flexShrink:0}}>{ownedG}/{totalG}</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  {entries.map(([code, stickers]) => {
                    const m = A.units[code];
                    const o = stickers.filter(st=>(counts[st.id]||0)>=1).length;
                    const tPct = stickers.length ? o/stickers.length : 0;
                    const barClr = tPct===1?"var(--gold)":m.c1==="#FFFFFF"||m.c1==="white"?"var(--muted)":m.c1;
                    return (
                      <div key={code} style={{display:"flex",alignItems:"center",gap:8}}>
                        <FlagImg emoji={m.flag} code={code} size={18} style={{flexShrink:0}}/>
                        <span style={{fontSize:12,flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.name}</span>
                        <div style={{width:72,height:4,background:"var(--line)",borderRadius:2,overflow:"hidden",flexShrink:0}}><div style={{height:"100%",width:`${tPct*100}%`,background:barClr,borderRadius:2,transition:"width .3s"}}/></div>
                        <span className="num" style={{fontSize:11,color:tPct===1?"var(--gold)":"var(--muted)",width:34,textAlign:"right",flexShrink:0}}>{tPct===1?"✓":`${o}/${stickers.length}`}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={S.statPanels}>
        {A.hasMeta && <div style={S.panel}><h3 style={S.panelTitle}>By {A.vocab.meta.toLowerCase()}</h3>{Object.entries(byConf).sort().map(([k,v])=><div key={k} style={S.confRow}><span className="num" style={{width:78,color:"var(--muted)",fontSize:12}}>{k}</span><div style={S.barTrack}><div style={{...S.barFill,width:`${(v.o/v.t)*100}%`}}/></div><span className="num" style={{width:56,textAlign:"right",fontSize:12}}>{v.o}/{v.t}</span></div>)}</div>}
        <div style={S.panel}><h3 style={S.panelTitle}>Closest to finishing</h3>{closest.length===0&&<p style={S.dim}>Start collecting to see progress here.</p>}{closest.map(r=><div key={r.code} style={S.confRow}><span style={{width:26,display:'inline-flex',alignItems:'center'}}><FlagImg emoji={r.flag} code={r.code} size={22}/></span><span style={{flex:1,fontSize:13}}>{r.name}</span><div style={{...S.barTrack,width:90}}><div style={{...S.barFill,width:`${r.pct*100}%`,background:r.c1==="#FFFFFF"?"var(--gold)":r.c1}}/></div><span className="num" style={{width:48,textAlign:"right",fontSize:12,color:"var(--gold)"}}>{r.total-r.o} left</span></div>)}</div>
      </div>
    </div>
  );
}
function SC({ label, value, sub, accent, action }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:"var(--surface)",border:"1px solid var(--line)",borderRadius:12,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,width:3,height:"100%",background:accent}}/>
      <div style={{paddingLeft:4,flex:1,minWidth:0}}>
        <div className="num" style={{fontSize:22,lineHeight:1,color:accent}}>{value}</div>
        <div style={{fontWeight:600,fontSize:11,marginTop:4,color:"var(--text)"}}>{label}</div>
        <div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>{sub}</div>
      </div>
      {action && <button onClick={action} title="Download PDF" style={{display:"inline-flex",alignItems:"center",padding:"5px",borderRadius:7,background:"transparent",border:"1px solid var(--line)",cursor:"pointer",color:"var(--muted)",flexShrink:0}}><Download size={13}/></button>}
    </div>
  );
}

/* ================================================================== */
function Friends({ profile, friends, incoming, outgoing, friendData, friendSnapshots, addFriend, acceptRequest, dismissRequest, refreshFriend, removeFriend, flash, derived }) {
  const A = useAlbum();
  const [h, setH] = useState("");
  const [selSwap, setSelSwap] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const label = handle => friendData[handle]?.name || handle;

  const myMissing = useMemo(() => new Set(derived.missing), [derived]);
  const swapData = selSwap ? friendSnapshots[selSwap] : null;
  const request = useMemo(() => {
    if (!swapData?.dupes) return [];
    return swapData.dupes.filter(([id]) => myMissing.has(id)).map(([id, qty]) => ({ s: A.byId[id], qty }));
  }, [swapData, myMissing]);
  const offer = useMemo(() => {
    if (!swapData?.missing) return [];
    const tm = new Set(swapData.missing);
    return derived.dupes.filter(([id]) => tm.has(id)).map(([id, qty]) => ({ s: A.byId[id], qty }));
  }, [swapData, derived]);
  function copyList(list, dir) {
    if (!list.length) return;
    const lines = list.map(({ s, qty }) => `#${s.n} ${s.team} — ${s.label}${qty > 1 ? ` (x${qty})` : ""}`);
    navigator.clipboard?.writeText(`${dir} (${friendData[selSwap]?.name}) — ${list.length} stickers\n` + lines.join("\n"));
    flash("Copied to clipboard");
  }
  useEffect(() => setShowMessage(false), [selSwap]);

  if (selSwap && showMessage) return (
    <SwapMessage myName={profile?.name || "Me"} friendName={swapData?.name || friendData[selSwap]?.name || selSwap}
      request={request} offer={offer} onBack={() => setShowMessage(false)} flash={flash} />
  );

  if (selSwap) return (
    <div>
      <button style={{...S.miniBtn,marginBottom:16}} onClick={() => setSelSwap(null)}>← Friends</button>
      <div style={S.swapHead}>
        <div><h2 style={{margin:0,fontSize:18}}>Swap with {swapData?.name || friendData[selSwap]?.name || selSwap}</h2><p style={S.dim}>{A.publisher} · {A.title} — your missing stickers overlapped with their duplicates.</p></div>
        <button disabled={!request.length && !offer.length} style={{...S.primaryBtn,gap:7,padding:"8px 16px",fontSize:13,opacity:(!request.length&&!offer.length)?0.4:1,cursor:(!request.length&&!offer.length)?"not-allowed":"pointer"}} onClick={() => setShowMessage(true)}><Share2 size={14}/> Compose message</button>
      </div>
      <div style={S.swapCols}>
        <SwapCol title="Ask them for" icon={Gift} accent="var(--need)" count={request.length} list={request} empty="None of their spares fill your gaps right now." action={() => copyList(request, "Requesting from")} actionLabel="Copy request"/>
        <SwapCol title="You can give back" icon={Share2} accent="var(--grass)" count={offer.length} list={offer} empty={swapData?.missing ? "Your spares don't match their needs yet." : "They aren't sharing a missing list."} action={() => copyList(offer, "Offering to")} actionLabel="Copy offer"/>
      </div>
    </div>
  );

  return (
    <div style={S.friendsWrap}>
      <div style={S.panel}>
        <h3 style={S.panelTitle}>Add a friend</h3>
        <p style={S.dim}>They'll get a friend request and your lists only link up once they accept. Swaps always compare the album you have open — {A.title}.</p>
        <div style={{display:"flex",gap:8,marginTop:12}}><div style={{...S.searchBox,flex:1,minWidth:0}}><span className="num" style={{color:"var(--muted)"}}>@</span><input value={h} onChange={e=>setH(e.target.value.toLowerCase())} placeholder="their handle" style={S.searchInput} onKeyDown={e=>{if(e.key==="Enter"){addFriend(h);setH("");}}} /></div><button style={{...S.primaryBtn,flexShrink:0}} onClick={()=>{addFriend(h);setH("");}}><UserPlus size={15}/> Request</button></div>

        {incoming.length>0 && <div style={{marginTop:18}}>
          <div style={S.reqHead}>Friend requests <span style={S.reqCount}>{incoming.length}</span></div>
          <div style={{marginTop:10,display:"grid",gap:10}}>
            {incoming.map(handle => (
              <div key={handle} style={S.friendRow}>
                <div style={S.avatar}>{label(handle).slice(0,1).toUpperCase()}</div>
                <div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:14}}>{label(handle)}</div><div className="num" style={{fontSize:11,color:"var(--muted)"}}>@{handle} wants to connect</div></div>
                <button style={S.acceptBtn} onClick={()=>acceptRequest(handle)}><Check size={14}/> Accept</button>
                <button style={S.iconGhost} title="Decline" onClick={()=>dismissRequest(handle)}><X size={14}/></button>
              </div>
            ))}
          </div>
        </div>}

        {outgoing.length>0 && <div style={{marginTop:18}}>
          <div style={S.reqHead}>Pending requests</div>
          <div style={{marginTop:10,display:"grid",gap:10}}>
            {outgoing.map(handle => (
              <div key={handle} style={S.friendRow}>
                <div style={{...S.avatar,opacity:.6}}>{label(handle).slice(0,1).toUpperCase()}</div>
                <div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:14}}>{label(handle)}</div><div className="num" style={{fontSize:11,color:"var(--muted)"}}>@{handle} · awaiting reply</div></div>
                <button style={S.iconGhost} title="Cancel request" onClick={()=>dismissRequest(handle)}><X size={14}/></button>
              </div>
            ))}
          </div>
        </div>}

        <div style={{marginTop:18}}>
          <div style={S.reqHead}>Friends</div>
          <div style={{marginTop:10,display:"grid",gap:10}}>
            {friends.length===0&&<p style={S.dim}>No friends yet. Send a request to a friend's handle to see their lists and build swap requests.</p>}
            {friends.map(handle => {
              const idx = friendData[handle];
              const d = friendSnapshots[handle];
              // Summary from their album index: counts still show even when they
              // keep the lists themselves private.
              const summary = idx?.albums?.[A.id] || null;
              const collects = !!d || !!summary;
              const toAsk = d?.dupes ? d.dupes.filter(([id]) => myMissing.has(id)).length : 0;
              const friendMissing = d?.missing ? new Set(d.missing) : null;
              const toGive = friendMissing ? derived.dupes.filter(([id]) => friendMissing.has(id)).length : 0;
              const hasSwap = !!(d?.dupes);
              return (
                <div key={handle} style={{...S.friendRow,flexDirection:"column",alignItems:"stretch",gap:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={S.avatar}>{(d?.name||handle).slice(0,1).toUpperCase()}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{idx?.name||d?.name||handle}</div>
                      <div className="num" style={{fontSize:11,color:"var(--muted)"}}>@{handle}</div>
                    </div>
                    <button style={S.iconGhost} title="Refresh" onClick={()=>refreshFriend(handle)}><RefreshCw size={14}/></button>
                    <button style={S.iconGhost} title="Remove" onClick={()=>removeFriend(handle)}><X size={14}/></button>
                  </div>
                  {collects
                    ? <div style={{display:"flex",gap:10,marginTop:10,paddingLeft:44}}>
                        <S2 n={d?.ownedCount ?? summary?.ownedCount ?? "—"} l="owned" c="var(--grass)"/>
                        <S2 n={d?.dupeUnits ?? summary?.dupeUnits ?? "—"} l="dupes" c="var(--gold)"/>
                        <S2 n={d?.missing ? d.missing.length : (summary?.missingCount ?? "—")} l="needs" c="var(--need)"/>
                      </div>
                    : <div style={{marginTop:9,paddingLeft:44,fontSize:11.5,color:"var(--muted2)"}}>Not collecting {A.title} — switch album to swap with them</div>}
                  {hasSwap && <button onClick={()=>setSelSwap(handle)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",marginTop:10,padding:"8px 10px",borderRadius:9,background:"rgba(62,200,192,0.07)",border:"1px solid rgba(62,200,192,0.2)",cursor:"pointer",boxSizing:"border-box"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}><Repeat size={13} color="var(--grass)"/><span style={{fontSize:12,fontWeight:700,color:"var(--grass)"}}>Swaps</span></div>
                    <div style={{fontSize:12,color:"var(--muted)",display:"flex",gap:10}}>
                      <span><span className="num" style={{color:"var(--need)"}}>{toAsk}</span> to ask</span>
                      <span><span className="num" style={{color:"var(--grass)"}}>{toGive}</span> to offer</span>
                    </div>
                    <ChevronDown size={13} color="var(--muted)" style={{transform:"rotate(-90deg)",flexShrink:0}}/>
                  </button>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
function S2({n,l,c}){return <div style={{textAlign:"center"}}><div className="num" style={{color:c,fontSize:15}}>{n}</div><div style={{color:"var(--muted2)",fontSize:10}}>{l}</div></div>;}

function SwapMessage({ myName, friendName, request, offer, onBack, flash }) {
  const A = useAlbum();
  const [fmt, setFmt] = useState("whatsapp");

  function groupByTeam(items) {
    const m = {};
    items.forEach(({s,qty}) => { (m[s.code]||={meta:A.units[s.code]||{name:s.team,flag:s.flag},items:[]}).items.push({s,qty}); });
    return Object.values(m);
  }

  function buildText(f) {
    const reqGroups = groupByTeam(request);
    const offGroups = groupByTeam(offer);
    if (f === "whatsapp") {
      const lines = [`🔄 *${A.shortTitle} Sticker Swap* — ${myName}`, ""];
      lines.push(`📥 *Stickers I need from you* (${request.length}):`);
      if (request.length) reqGroups.forEach(({meta,items}) => lines.push(`${meta.flag ? meta.flag + " " : ""}*${meta.name}:* ${items.map(({s,qty})=>s.fullCode).join(' · ')}`));
      else lines.push("  (none)");
      lines.push("");
      lines.push(`📤 *Stickers I can give you* (${offer.length}):`);
      if (offer.length) offGroups.forEach(({meta,items}) => lines.push(`${meta.flag ? meta.flag + " " : ""}*${meta.name}:* ${items.map(({s,qty})=>s.fullCode).join(' · ')}`));
      else lines.push("  (none)");
      lines.push("", "Let me know if this works! 🤝");
      return lines.join("\n");
    } else {
      const lines = [`${A.shortTitle} Sticker Swap — ${myName} × ${friendName}`, ""];
      lines.push(`Hi ${friendName},`, "", `I'd like to propose a ${A.publisher} ${A.title} sticker swap!`, "");
      lines.push(`STICKERS I'D LIKE FROM YOU — ${request.length} sticker${request.length!==1?"s":""}:`);
      if (request.length) reqGroups.forEach(({meta,items}) => lines.push(`  ${meta.name}: ${items.map(({s,qty})=>s.fullCode).join("  ")}`));
      else lines.push("  (none)");
      lines.push("");
      lines.push(`STICKERS I CAN GIVE YOU — ${offer.length} sticker${offer.length!==1?"s":""}:`);
      if (offer.length) offGroups.forEach(({meta,items}) => lines.push(`  ${meta.name}: ${items.map(({s,qty})=>s.fullCode).join("  ")}`));
      else lines.push("  (none)");
      lines.push("", "Let me know if this works for you!", "", myName);
      return lines.join("\n");
    }
  }

  const text = buildText(fmt);

  function handleCopy() { navigator.clipboard?.writeText(text); flash("Message copied!"); }
  function handleWhatsApp() { window.open(`https://wa.me/?text=${encodeURIComponent(buildText("whatsapp"))}`); }
  function handleEmail() {
    const subj = encodeURIComponent(`${A.shortTitle} Sticker Swap — ${myName} × ${friendName}`);
    const body = encodeURIComponent(buildText("email").split("\n").slice(2).join("\n"));
    window.open(`mailto:?subject=${subj}&body=${body}`);
  }

  return (
    <div style={{maxWidth:620,margin:"0 auto"}}>
      <button style={{...S.miniBtn,marginBottom:20}} onClick={onBack}>← Back</button>
      <div style={S.panel}>
        <h3 style={{...S.panelTitle,marginBottom:4}}>Swap message · {friendName}</h3>
        <p style={{...S.dim,marginBottom:16}}>Choose a format to preview, then send or copy.</p>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          {[["whatsapp","WhatsApp"],["email","Email"]].map(([id,label])=>
            <button key={id} onClick={()=>setFmt(id)} style={{...S.chip,...(fmt===id?{background:"var(--surface2)",borderColor:"var(--line2)",color:"var(--text)"}:{})}}>{label}</button>
          )}
        </div>
        <textarea readOnly value={text} style={{width:"100%",minHeight:260,background:"var(--ink2)",borderWidth:1,borderStyle:"solid",borderColor:"var(--line)",borderRadius:12,padding:14,color:"var(--text)",fontSize:12.5,lineHeight:1.7,resize:"vertical",fontFamily:"'Inter',monospace",boxSizing:"border-box"}}/>
        <div style={{display:"flex",gap:8,marginTop:12}}>
          <button style={{...S.primaryBtn,flex:1}} onClick={handleCopy}><Copy size={14}/> Copy to clipboard</button>
        </div>
      </div>
    </div>
  );
}
function SwapCol({title,icon:Icon,accent,count,list,empty,action,actionLabel}){
  const A=useAlbum();
  const byTeam={};list.forEach(it=>(byTeam[it.s.code]||=[]).push(it));
  return <div style={S.panel}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}><h3 style={{...S.panelTitle,margin:0,display:"flex",alignItems:"center",gap:8}}><Icon size={16} color={accent}/>{title}<span className="num" style={{...S.countPill,background:accent}}>{count}</span></h3><button style={{...S.miniBtn,opacity:count?1:0.4}} disabled={!count} onClick={action}><Copy size={13}/> {actionLabel}</button></div>{count===0&&<p style={S.dim}>{empty}</p>}<div style={{display:"grid",gap:10,maxHeight:520,overflowY:"auto"}}>{Object.entries(byTeam).map(([code,items])=>{const m=A.units[code]||{name:code,flag:null};return <div key={code}><div style={S.reqTeam}><FlagImg emoji={m.flag} code={code} size={20} style={{flexShrink:0}}/><span style={{fontWeight:600,fontSize:12.5}}>{m.name}</span><span className="num" style={{color:"var(--muted2)",fontSize:11}}>{items.length}</span></div><div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:6}}>{items.map(({s,qty})=><span key={s.id} className="num" style={S.reqChip} title={s.label}><b style={{color:accent}}>{s.fullCode}</b> {s.pname?s.pname.split(" ").slice(-1)[0]:s.label}{qty>1&&<em style={{color:"var(--gold)",fontStyle:"normal"}}> ×{qty}</em>}</span>)}</div></div>;})}</div></div>;
}

/* ==================================================================
   ALBUM SHELF
   Switch between the albums you collect and add new ones from the
   catalogue. Removing an album only takes it off the shelf — the
   collection stays in Firestore under its own key, so putting it back
   restores every sticker.
   ================================================================== */
const STATUS = {
  official:    { label: "Full checklist", color: "var(--grass)", hint: "Every sticker named from the published checklist." },
  numbered:    { label: "Numbered",       color: "var(--sky)",   hint: "Correct size and sections — stickers are tracked by number." },
  provisional: { label: "Provisional",    color: "var(--gold)",  hint: "Announced product; the checklist isn't final yet." },
};

function Albums({ myAlbums, activeId, counts, onOpen, onAdd, onRemove }) {
  const [cat, setCat] = useState("all");
  const mine = myAlbums.filter(knownAlbum).map(id => getAlbum(id));
  const available = CATALOG.filter(c => !myAlbums.includes(c.id));
  // Categories that still have something to add, in shelf order.
  const cats = CATEGORIES.filter(c => available.some(a => a.category === c));
  const shown = cat === "all" ? available : available.filter(a => a.category === cat);
  // Group the list under its category headings so a shelf of many albums
  // stays readable: sport by sport, then everything else.
  const grouped = cats.map(c => [c, shown.filter(a => a.category === c)]).filter(([, list]) => list.length);

  // Progress for an album that isn't open comes from this device's cache —
  // enough for the shelf, and it costs no reads.
  const progressFor = alb => {
    const c = alb.id === activeId ? counts : lsGet(cacheKey("collection", alb.id));
    if (!c) return null;
    let owned = 0;
    for (const s of alb.stickers) if ((c[s.id] || 0) >= 1) owned++;
    return { owned, pct: alb.total ? Math.round((owned / alb.total) * 100) : 0 };
  };

  return (
    <div style={{maxWidth:760,margin:"0 auto",display:"flex",flexDirection:"column",gap:14}}>
      <div style={S.panel}>
        <h3 style={S.panelTitle}>Your albums</h3>
        <p style={S.dim}>Each album keeps its own collection, duplicates and swap lists.</p>
        <div style={{display:"grid",gap:10,marginTop:14}}>
          {mine.map(alb => {
            const active = alb.id === activeId;
            const prog = progressFor(alb);
            return (
              <div key={alb.id} style={{...S.friendRow,flexDirection:"column",alignItems:"stretch",gap:0,
                    borderColor:active?"var(--gold-deep)":"var(--line)",background:active?"rgba(244,194,74,.06)":undefined}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{...S.avatar,background:active?"var(--gold)":"var(--surface2)",color:active?"#1a1205":"var(--muted)"}}>
                    <BookOpen size={16}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{alb.title}</div>
                    <div style={{fontSize:11.5,color:"var(--muted)",marginTop:2}}>{alb.category} · {alb.publisher} · {alb.total} stickers</div>
                  </div>
                  {active
                    ? <span className="num" style={{fontSize:10.5,color:"var(--gold)",border:"1px solid var(--gold-deep)",borderRadius:7,padding:"3px 8px",flexShrink:0}}>OPEN</span>
                    : <button style={{...S.miniBtn,flexShrink:0}} onClick={()=>onOpen(alb.id)}>Open</button>}
                  {myAlbums.length > 1 && <button style={S.iconGhost} title="Remove from shelf" onClick={()=>onRemove(alb.id)}><X size={14}/></button>}
                </div>
                {prog && <>
                  <div style={{...S.cardProg,marginTop:10}}><div style={{...S.cardProgFill,width:`${prog.pct}%`}}/></div>
                  <div className="num" style={{fontSize:11,color:"var(--muted)",marginTop:6}}>{prog.owned}/{alb.total} · {prog.pct}%</div>
                </>}
              </div>
            );
          })}
        </div>
      </div>

      <div style={S.panel}>
        <h3 style={S.panelTitle}>Add an album</h3>
        {available.length === 0
          ? <p style={S.dim}>You're tracking every album in the catalogue. More collections are added as publishers release their checklists.</p>
          : <>
              <p style={S.dim}>Pick up a new collection — your friends and swap lists carry across.</p>
              {cats.length > 1 && <div style={{display:"flex",gap:6,flexWrap:"wrap",margin:"12px 0 4px"}}>
                {["all", ...cats].map(c => <button key={c} onClick={()=>setCat(c)} style={{...S.chip,padding:"5px 11px",fontSize:12,...(cat===c?chipA("all"):{})}}>{c==="all"?"All":c}</button>)}
              </div>}
              {grouped.map(([group, list]) => (
                <div key={group} style={{marginTop:16}}>
                  <div style={S.groupHead}>
                    <span className="num" style={{...S.groupBadge,color:"var(--muted)",borderColor:"var(--line2)"}}>{group.toUpperCase()}</span>
                    <span style={S.groupRule}/>
                    <span className="num" style={{fontSize:11,color:"var(--muted2)"}}>{list.length}</span>
                  </div>
                  <div style={{display:"grid",gap:10,marginTop:10}}>
                {list.map(c => {
                  const st = STATUS[c.status] || STATUS.official;
                  return (
                    <div key={c.id} style={{...S.friendRow,alignItems:"flex-start"}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                          <span style={{fontWeight:700,fontSize:14}}>{c.title}</span>
                          <span className="num" style={{fontSize:9.5,color:st.color,border:`1px solid ${st.color}`,borderRadius:6,padding:"2px 6px"}} title={st.hint}>{st.label.toUpperCase()}</span>
                        </div>
                        <div style={{fontSize:11.5,color:"var(--muted)",marginTop:3}}>{c.publisher} · {c.year}{c.total?` · ${c.total} stickers`:""}</div>
                        {c.note && <div style={{fontSize:11,color:"var(--muted2)",marginTop:4,lineHeight:1.45}}>{c.note}</div>}
                      </div>
                      <button style={{...S.primaryBtn,flexShrink:0,padding:"8px 14px",fontSize:12.5}} onClick={()=>onAdd(c.id)}><Plus size={13}/> Add</button>
                    </div>
                  );
                })}
                  </div>
                </div>
              ))}
            </>}
      </div>
    </div>
  );
}

/* ================================================================== */
// Splits a short title so its last word picks up the gold accent.
function Wordmark({ text, size=19 }) {
  const i = text.lastIndexOf(" ");
  if (i < 1) return <span className="wc-wordmark" style={{fontSize:size,lineHeight:1,whiteSpace:"nowrap"}}>{text}</span>;
  return (
    <span className="wc-wordmark" style={{fontSize:size,lineHeight:1,whiteSpace:"nowrap"}}>
      {text.slice(0, i)} <span style={{color:"var(--gold)"}}>{text.slice(i + 1)}</span>
    </span>
  );
}

/* ================================================================== */
function Fld({label,value,onChange,placeholder,prefix,hint,type="text"}){return <label style={{display:"block",marginBottom:12}}><span style={{fontSize:12,color:"var(--muted)",fontWeight:600}}>{label}</span><div style={{...S.searchBox,marginTop:5}}>{prefix&&<span className="num" style={{color:"var(--muted)"}}>{prefix}</span>}<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={S.searchInput}/></div>{hint&&<span style={{fontSize:11,color:"var(--muted2)"}}>{hint}</span>}</label>;}
function Empty({icon:Icon,title,body}){return <div style={S.empty}><Icon size={30} color="var(--muted2)"/><h3 style={{margin:"12px 0 4px",fontSize:16}}>{title}</h3><p style={{...S.dim,maxWidth:380,margin:"0 auto"}}>{body}</p></div>;}
function Boot(){return <div style={{...S.root,display:"grid",placeItems:"center"}}><Css/><div style={{animation:"pulse 1.4s ease infinite"}}><Trophy size={40} color="var(--gold)"/></div></div>;}

function hexToRgb(h){const m=h.replace("#","");return[parseInt(m.slice(0,2),16),parseInt(m.slice(2,4),16),parseInt(m.slice(4,6),16)];}
function tint(h){try{const[r,g,b]=hexToRgb(h);return`rgba(${r},${g},${b},0.22)`;}catch{return"rgba(255,255,255,.1)";}}
function shade(h){try{const[r,g,b]=hexToRgb(h);return`rgba(${r},${g},${b},0.65)`;}catch{return"var(--line)";}}

// Subdivision flags (England, Scotland, Wales) use tag sequences, not Regional
// Indicator pairs, so they need an explicit mapping to their flagcdn codes.
const FLAG_OVERRIDE = {
  '🏴󠁧󠁢󠁥󠁮󠁧󠁿': 'gb-eng',
  '🏴󠁧󠁢󠁳󠁣󠁴󠁿': 'gb-sct',
  '🏴󠁧󠁢󠁷󠁬󠁳󠁿': 'gb-wls',
};

// Renders a country flag as an <img> (via flagcdn.com) so it works on Windows
// where flag emoji render as 2-letter codes. Falls back to the emoji span for
// non-country emoji (e.g. 🏆 trophy).
function FlagImg({ emoji, size=28, style={}, code }) {
  // Albums without national teams have no flag — fall back to the unit code.
  if (!emoji) return code
    ? <span className="num" style={{display:"inline-grid",placeItems:"center",width:Math.round(size*1.2),height:Math.round(size*0.78),borderRadius:3,background:"rgba(255,255,255,.07)",border:"1px solid var(--line)",fontSize:Math.max(8,Math.round(size*0.36)),letterSpacing:.2,...style}}>{code}</span>
    : null;
  const cc = FLAG_OVERRIDE[emoji];
  if (cc) {
    return <img src={`https://flagcdn.com/w40/${cc}.png`} width={size} height={Math.round(size*0.75)} style={{display:'inline-block',verticalAlign:'middle',borderRadius:2,...style}} alt={cc} />;
  }
  const pts = [...emoji].map(c => c.codePointAt(0));
  if (pts.length === 2 && pts[0] >= 0x1F1E6 && pts[0] <= 0x1F1FF) {
    const iso = pts.map(p => String.fromCharCode(p - 0x1F1E6 + 97)).join('');
    return <img src={`https://flagcdn.com/w40/${iso}.png`} width={size} height={Math.round(size*0.75)} style={{display:'inline-block',verticalAlign:'middle',borderRadius:2,...style}} alt={iso.toUpperCase()} />;
  }
  return <span style={{fontSize:Math.round(size*0.85),lineHeight:1,...style}}>{emoji}</span>;
}

function chipA(id){return{all:{color:"var(--text)",background:"var(--surface2)",borderColor:"var(--line2)"},owned:{color:"#003C3A",background:"var(--grass)",borderColor:"var(--grass)"},missing:{color:"#3A0A08",background:"var(--need)",borderColor:"var(--need)"},dupes:{color:"#1a1205",background:"var(--gold)",borderColor:"var(--gold)"}}[id];}

/* ================================================================== */
function Css(){return <style>{`
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800;900&family=Archivo+Narrow:wght@600;700&family=Barlow+Condensed:wght@700;800;900&family=Inter:wght@400;500;600&display=swap');
:root{--ink:#0A0B18;--ink2:#0F1028;--surface:#14163A;--surface2:#1C1F4A;--line:rgba(255,255,255,0.09);--line2:rgba(255,255,255,0.18);--gold:#F4C24A;--gold-deep:#C9982F;--grass:#3EC8C0;--grass-deep:#2A9A96;--need:#D83C2E;--need-deep:#B22E24;--sky:#5080D0;--text:#F8F8FF;--muted:rgba(248,248,255,0.62);--muted2:rgba(248,248,255,0.38);--p1:#3EC8C0;--p2:#5080D0;--p3:#7860AA;--p4:#D83C2E;--p5:#F07E3C;--p6:#48B44C}
*{box-sizing:border-box}.wc-wordmark{font-family:'Barlow Condensed','Archivo',system-ui,sans-serif;font-weight:900;text-transform:uppercase;letter-spacing:-.01em}.num{font-family:'Archivo Narrow','Archivo',sans-serif;font-variant-numeric:tabular-nums;font-weight:700}input{font-family:'Inter',sans-serif}input::placeholder{color:var(--muted2)}input:focus{outline:none}button{font-family:'Inter',sans-serif;cursor:pointer;border:none;background:none;color:inherit}button:focus-visible{outline:2px solid var(--gold);outline-offset:2px;border-radius:8px}
@keyframes fade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}@keyframes pulse{0%,100%{opacity:.4;transform:scale(.94)}50%{opacity:1;transform:scale(1.06)}}@keyframes sheen{from{transform:translateX(-120%) rotate(8deg)}to{transform:translateX(220%) rotate(8deg)}}
::-webkit-scrollbar{width:9px;height:9px}::-webkit-scrollbar-thumb{background:var(--line2);border-radius:9px}
.slot{position:relative;border:1px dashed var(--line2);border-radius:11px;background:rgba(255,255,255,.015);overflow:hidden;transition:.18s}.slot.owned{border-style:solid;background:var(--surface2)}.slot.dupe{box-shadow:3px 3px 0 -1px var(--surface2),5px 5px 0 -1px var(--line2)}
.slot-body{position:relative;width:100%;aspect-ratio:3/2.6;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px 4px;gap:0;overflow:hidden}.slot-num{font-size:26px;color:var(--muted2);letter-spacing:-.03em;margin-bottom:2px}.slot.owned .slot-num{color:var(--text);opacity:.9}
.slot-name{font-size:9px;line-height:1.15;text-align:center;color:var(--text);max-width:100%;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;font-weight:600;margin-top:0}.slot-name.muted{color:var(--muted2);font-weight:500}
.slot.owned .slot-body::after{content:"";position:absolute;top:0;left:0;width:38%;height:140%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent);transform:translateX(-120%) rotate(8deg)}.slot.owned:hover .slot-body::after{animation:sheen .7s ease}
.slot.foil.owned .slot-body{background:conic-gradient(from 210deg,#100838,#082038,#083818,#180808,#1c0830,#100838) !important}.slot.foil.owned .slot-num{color:var(--gold)}
.dupe-badge{position:absolute;top:4px;right:5px;background:var(--gold);color:#1a1205;font-size:10px;padding:1px 5px;border-radius:7px;font-weight:700}
.slot-ctrls{display:flex;align-items:center;justify-content:space-between;padding:4px 6px;border-top:1px solid var(--line);background:rgba(0,0,0,.18)}.slot-ctrls button{width:22px;height:22px;border-radius:6px;display:grid;place-items:center;background:var(--line);color:var(--text)}.slot-ctrls button:hover{background:var(--line2)}.slot-ctrls button:disabled{opacity:.3;cursor:default}.slot-ctrls .num{font-size:12px;min-width:14px;text-align:center}
@media(prefers-reduced-motion:reduce){*{animation:none!important}}
.bottom-nav{display:none}
@media(max-width:700px){
  .desktop-nav{display:none!important}
  .hdr-prog{display:none!important}
  .bottom-nav{display:flex;position:fixed;bottom:0;left:0;right:0;z-index:30;background:rgba(10,11,24,.96);backdrop-filter:blur(14px);border-top:1px solid var(--line);padding-bottom:env(safe-area-inset-bottom)}
  .bn-btn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:8px 4px;color:var(--muted);font-size:10px;font-weight:600;letter-spacing:.02em;transition:.15s;border-radius:0}
  .bn-active{color:var(--gold)}
  .bn-label{font-family:'Inter',sans-serif}
  body{padding-bottom:calc(60px + env(safe-area-inset-bottom))}
}
`}</style>;}

const S={
root:{minHeight:"100vh",background:"radial-gradient(1200px 600px at 50% -200px,#1C1848 0%,var(--ink) 60%)",color:"var(--text)",fontFamily:"'Inter',system-ui,sans-serif"},
authWrap:{minHeight:"100vh",display:"grid",placeItems:"center",position:"relative",overflow:"hidden",padding:20},
authGrid:{position:"absolute",inset:0,background:"radial-gradient(circle 600px at 15% 40%,rgba(80,128,208,.22) 0%,transparent 70%),radial-gradient(circle 500px at 80% 20%,rgba(240,126,60,.18) 0%,transparent 65%),radial-gradient(circle 500px at 60% 85%,rgba(120,96,170,.18) 0%,transparent 65%),radial-gradient(circle 380px at 90% 70%,rgba(62,200,192,.16) 0%,transparent 60%)",maskImage:"radial-gradient(800px 600px at 50% 30%,#000,transparent)"},
authCard:{position:"relative",width:"min(440px,100%)",background:"rgba(11,14,28,.85)",backdropFilter:"blur(10px)",border:"1px solid var(--line2)",borderRadius:20,padding:"30px 30px 22px"},
bigMark:{fontSize:46,lineHeight:.92,margin:"6px 0 14px"},
markAccent:{background:"linear-gradient(90deg,var(--p5),var(--p1),var(--p2))",WebkitBackgroundClip:"text",backgroundClip:"text",color:"transparent"},
primaryBtn:{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"var(--gold)",color:"#19130a",fontWeight:700,fontSize:14,padding:"11px 16px",borderRadius:11},
topbar:{position:"sticky",top:0,zIndex:30,background:"rgba(10,11,24,.92)",backdropFilter:"blur(12px)",borderBottom:"1px solid var(--line)"},
topInner:{maxWidth:1180,margin:"0 auto",padding:"11px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16},
tinyProg:{width:70,height:5,borderRadius:5,background:"var(--line)",overflow:"hidden"},
tinyProgFill:{height:"100%",background:"linear-gradient(90deg,var(--sky),var(--grass))",transition:".4s"},
tabs:{display:"flex",gap:4,background:"var(--ink2)",padding:4,borderRadius:12,border:"1px solid var(--line)"},
tab:{display:"flex",alignItems:"center",gap:6,padding:"7px 13px",borderRadius:9,fontSize:13,fontWeight:600,color:"var(--muted)",transition:".15s"},
tabActive:{background:"var(--surface2)",color:"var(--text)"},
avatar:{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,var(--gold-deep),var(--gold))",color:"#19130a",display:"grid",placeItems:"center",fontWeight:800,fontSize:15},
avatarSm:{width:22,height:22,borderRadius:7,background:"var(--surface2)",display:"grid",placeItems:"center",fontWeight:700,fontSize:11},
iconGhost:{width:32,height:32,borderRadius:9,display:"grid",placeItems:"center",color:"var(--muted)",border:"1px solid var(--line)"},
main:{maxWidth:1180,margin:"0 auto",padding:"24px 20px",overflowX:"hidden"},
controlRow:{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center",marginBottom:22},
searchBox:{display:"flex",alignItems:"center",gap:8,background:"var(--ink2)",border:"1px solid var(--line)",borderRadius:11,padding:"9px 12px",minWidth:240,flex:"1 1 240px"},
searchInput:{flex:1,background:"none",border:"none",color:"var(--text)",fontSize:16},
clearBtn:{color:"var(--muted)",display:"grid",placeItems:"center"},
filterChips:{display:"flex",gap:6,flexWrap:"wrap"},
chip:{padding:"8px 14px",borderRadius:10,fontSize:13,fontWeight:600,color:"var(--muted)",borderWidth:1,borderStyle:"solid",borderColor:"var(--line)",background:"var(--ink2)"},
miniBtn:{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 12px",borderRadius:10,fontSize:12.5,fontWeight:600,color:"var(--text)",border:"1px solid var(--line2)",background:"var(--ink2)"},
groupHead:{display:"flex",alignItems:"center",gap:14,marginBottom:13},
groupBadge:{fontSize:13,letterSpacing:".14em",padding:"4px 12px",borderRadius:8,background:"rgba(255,255,255,.05)",borderWidth:1,borderStyle:"solid",borderColor:"transparent"},
groupRule:{flex:1,height:1,background:"var(--line)"},
teamGrid:{display:"grid",gridTemplateColumns:"1fr",gap:14},
teamCard:{background:"var(--surface)",borderWidth:1,borderStyle:"solid",borderColor:"var(--line)",borderRadius:15,overflow:"hidden"},
teamHead:{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"13px 14px 11px",textAlign:"left"},
flagBadge:{width:42,height:42,borderRadius:11,display:"grid",placeItems:"center",fontSize:24,flexShrink:0},
teamName:{fontWeight:700,fontSize:15.5},
completeTag:{fontSize:9,fontWeight:800,letterSpacing:".1em",color:"#19130a",background:"var(--gold)",padding:"2px 6px",borderRadius:5},
cardProg:{height:4,background:"var(--ink2)"},
cardProgFill:{height:"100%",background:"linear-gradient(90deg,var(--sky),var(--grass))",transition:".4s"},
slotGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(82px,1fr))",gap:8,padding:12,animation:"fade .25s ease"},
statCards:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:14,marginBottom:22},
statCard:{position:"relative",background:"var(--surface)",border:"1px solid var(--line)",borderRadius:15,padding:"20px 18px",overflow:"hidden"},
statAccent:{position:"absolute",top:0,left:0,width:"100%",height:3,opacity:.85},
statPanels:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:14},
panel:{background:"var(--surface)",border:"1px solid var(--line)",borderRadius:15,padding:20},
panelTitle:{margin:"0 0 14px",fontSize:14,fontWeight:700,letterSpacing:".01em"},
confRow:{display:"flex",alignItems:"center",gap:10,marginBottom:10},
barTrack:{flex:1,height:8,borderRadius:8,background:"var(--ink2)",overflow:"hidden"},
barFill:{height:"100%",background:"linear-gradient(90deg,var(--sky),var(--grass))",transition:".4s"},
dim:{color:"var(--muted)",fontSize:12.5,lineHeight:1.5},
friendsWrap:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,330px),1fr))",gap:14,alignItems:"start"},
toggle:{display:"inline-flex",alignItems:"center",gap:7,padding:"9px 14px",borderRadius:10,fontSize:13,fontWeight:600,color:"var(--muted)",borderWidth:1,borderStyle:"solid",borderColor:"var(--line)",background:"var(--ink2)"},
toggleOn:{color:"#003C3A",background:"var(--grass)",borderColor:"var(--grass)"},
handleBox:{display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--ink2)",border:"1px solid var(--line)",borderRadius:12,padding:"12px 14px"},
friendRow:{display:"flex",alignItems:"center",gap:11,background:"var(--ink2)",border:"1px solid var(--line)",borderRadius:12,padding:"10px 12px"},
reqHead:{display:"flex",alignItems:"center",gap:8,fontSize:12.5,fontWeight:700,letterSpacing:".04em",textTransform:"uppercase",color:"var(--muted)"},
reqCount:{display:"inline-grid",placeItems:"center",minWidth:18,height:18,padding:"0 5px",borderRadius:9,background:"var(--need)",color:"#fff",fontSize:11,fontWeight:700},
acceptBtn:{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 12px",borderRadius:10,fontSize:12.5,fontWeight:700,color:"#0d1a0d",background:"var(--grass)",whiteSpace:"nowrap"},
tabBadge:{position:"absolute",top:-4,right:-4,display:"inline-grid",placeItems:"center",minWidth:16,height:16,padding:"0 4px",borderRadius:8,background:"var(--need)",color:"#fff",fontSize:10,fontWeight:700},
slotConfirmYes:{width:30,height:30,borderRadius:8,display:"grid",placeItems:"center",background:"var(--need)",color:"#fff"},
slotConfirmNo:{width:30,height:30,borderRadius:8,display:"grid",placeItems:"center",background:"rgba(255,255,255,.15)",color:"var(--text)"},
qaHeader:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,marginBottom:20,padding:"10px 0"},
qaCodeGrid:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:8},
qaCodeBtn:{display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"11px 4px",borderRadius:10,background:"var(--ink2)",borderWidth:1,borderStyle:"solid",borderColor:"var(--line)",transition:".15s"},
qaSlotGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(72px,1fr))",gap:10},
qaSlotBtn:{display:"flex",alignItems:"center",justifyContent:"center",padding:"18px 4px",borderRadius:12,background:"var(--ink2)",borderWidth:1,borderStyle:"solid",borderColor:"var(--line)"},
swapHead:{display:"flex",justifyContent:"space-between",alignItems:"flex-end",gap:16,marginBottom:18,flexWrap:"wrap"},
friendPicker:{display:"flex",gap:8,flexWrap:"wrap"},
pickBtn:{display:"flex",alignItems:"center",gap:8,padding:"7px 12px 7px 7px",borderRadius:11,fontSize:13,fontWeight:600,color:"var(--muted)",borderWidth:1,borderStyle:"solid",borderColor:"var(--line)",background:"var(--ink2)"},
pickActive:{color:"var(--text)",borderColor:"var(--gold-deep)",background:"rgba(244,194,74,.08)"},
swapCols:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,300px),1fr))",gap:14,alignItems:"start"},
countPill:{color:"#19130a",fontSize:11,padding:"1px 8px",borderRadius:8,marginLeft:4},
reqTeam:{display:"flex",alignItems:"center",gap:8,paddingBottom:4,borderBottom:"1px solid var(--line)"},
reqChip:{display:"inline-flex",alignItems:"center",gap:5,fontSize:11.5,padding:"4px 9px",borderRadius:8,background:"var(--ink2)",border:"1px solid var(--line)"},
empty:{textAlign:"center",padding:"70px 20px",animation:"fade .3s ease"},
toast:{position:"fixed",bottom:22,left:"50%",transform:"translateX(-50%)",background:"var(--surface2)",border:"1px solid var(--line2)",color:"var(--text)",padding:"11px 18px",borderRadius:12,fontSize:13.5,fontWeight:600,zIndex:60,boxShadow:"0 10px 40px rgba(0,0,0,.5)",animation:"fade .25s ease"},
};
