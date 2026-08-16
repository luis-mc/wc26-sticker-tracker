# FIFA World Cup 2026 — Panini Sticker Tracker

Track all **980 stickers** across 48 nations in the official Panini FIFA World Cup 2026 album. Mark what you own, log duplicates, and coordinate swaps with friends — synced to the cloud across all your devices.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=black)
![Stickers](https://img.shields.io/badge/Stickers-980-F4C24A)

## Features

### Collection
- **Full 980-sticker checklist** — 9 Intro foils + 11 FIFA Museum foils + 48 teams × 20 stickers, with real player names from the official Panini checklist
- **Toggle owned** — click a slot to mark it; confirmation step prevents accidental removal
- **Duplicate tracking** — use +/− controls to record how many spare copies you hold
- **Quick Add** — fast keyboard-friendly entry: pick a team, tap a sticker number; shows whether it's a new card or a duplicate
- **Smart filters** — view All, Owned, or Missing; search by player name, team name, or sticker number across the full album

### Stats & exports
- **Stats dashboard** — overall completion %, progress broken down by confederation, and the 6 nations closest to completion
- **PDF export** — download your missing, collected, or duplicate sticker lists as a formatted A4 PDF (one-click from the Stats cards)

### Friends & swaps
- **Accounts** — email/password sign-up with email verification; password reset via email
- **Cloud sync** — collection, preferences, and public profile are stored in Firestore and cached locally; changes sync across all your devices with a 700 ms debounce
- **Shareable handle** — choose a unique `@handle` at setup; share it so friends can find you
- **Privacy controls** — independently toggle whether your owned list, missing list, and duplicates are visible to friends
- **Friend requests** — send a request by handle; both sides see pending/incoming/outgoing state until accepted
- **Real-time friend data** — friend cards update live via Firestore `onSnapshot`; manual refresh also available
- **Swap engine** — overlaps a friend's duplicates with your missing list to build an instant request list; shows what you can offer back from your own spares
- **Swap message composer** — generates a ready-to-send message in WhatsApp or plain-text email format; one-click copy or direct WhatsApp share

## Quick start

```bash
git clone https://github.com/YOUR_USERNAME/wc26-sticker-tracker.git
cd wc26-sticker-tracker
npm install
cp .env.example .env.local   # fill in your Firebase config values
npm run dev
```

Open `http://localhost:5173` and start collecting.

## Environment setup

Copy `.env.example` to `.env.local` and fill in the values from Firebase Console → Project Settings → Your Apps → Web app config:

```
VITE_API_KEY=...
VITE_AUTH_DOMAIN=...
VITE_PROJECT_ID=...
VITE_STORAGE_BUCKET=...
VITE_MESSAGING_SENDER_ID=...
VITE_APP_ID=...
```

## Deploy

```bash
npm run build
firebase deploy   # requires firebase-tools and an initialised project
```

## Project structure

```
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx        # React root mount
    ├── firebase.js     # Firebase initialisation and Auth/Firestore exports
    └── App.jsx         # Full application — all components, sticker data, Firestore helpers
```

## Album structure (980 stickers)

| Section | Code | Count |
|---------|------|-------|
| Introduction (foils) | 00, FWC1–FWC8 | 9 |
| FIFA Museum (foils) | FWC9–FWC19 | 11 |
| Group A: Mexico, South Africa, Korea Republic, Czechia | MEX/RSA/KOR/CZE 1–20 | 80 |
| Group B: Canada, Bosnia & Herzegovina, Qatar, Switzerland | CAN/BIH/QAT/SUI 1–20 | 80 |
| Group C: Brazil, Morocco, Haiti, Scotland | BRA/MAR/HAI/SCO 1–20 | 80 |
| Group D: USA, Paraguay, Australia, Türkiye | USA/PAR/AUS/TUR 1–20 | 80 |
| Group E: Germany, Curaçao, Ivory Coast, Ecuador | GER/CUW/CIV/ECU 1–20 | 80 |
| Group F: Netherlands, Japan, Sweden, Tunisia | NED/JPN/SWE/TUN 1–20 | 80 |
| Group G: Belgium, Egypt, Iran, New Zealand | BEL/EGY/IRN/NZL 1–20 | 80 |
| Group H: Spain, Cape Verde, Saudi Arabia, Uruguay | ESP/CPV/KSA/URU 1–20 | 80 |
| Group I: France, Senegal, Iraq, Norway | FRA/SEN/IRQ/NOR 1–20 | 80 |
| Group J: Argentina, Algeria, Austria, Jordan | ARG/ALG/AUT/JOR 1–20 | 80 |
| Group K: Portugal, DR Congo, Uzbekistan, Colombia | POR/COD/UZB/COL 1–20 | 80 |
| Group L: England, Croatia, Ghana, Panama | ENG/CRO/GHA/PAN 1–20 | 80 |
| **Total** | | **980** |

Per team: #1 Team Logo (foil) · #2–12 Players · #13 Team Photo · #14–20 Players

## Customising the checklist

Player names live in the `TD` array near the top of `src/App.jsx`. Each entry is:

```js
["CODE", "Team Name", "Group", "Confederation", "🇫🇱", "#color1", "#color2", [
  "Player 1", ..., "Player 18"   // 18 players per team
]]
```

Edit the array directly if Panini releases corrections or you spot a discrepancy.

## License

MIT
