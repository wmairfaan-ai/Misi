# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Misi Jeti Kuala Senyum": an offline educational web game for **Sains KSSR Tahun 4, topic Ketumpatan** (40 min, 30 pupils in 6 groups called "bot"). It **accompanies a real water experiment**: pupils predict and test physical objects at their desks, and the app guides missions, records codes and shows hints, infographics, scores and a ceremony. It is mainly used on one teacher laptop and a classroom projector, with optional tablets.

- `reka-bentuk-sistem.md` is the **design spec and source of truth** (written in Bahasa Melayu). Read the relevant section before changing behaviour. If code must deviate from it, record why in `misi-jeti/NOTA-PEMBINAAN.md`.
- `misi-jeti/` holds the app. As of this writing it is being built from the spec (DRAF 2, approved). If a file named in the spec does not exist yet, it has not been built.
- All user-facing text is **Bahasa Melayu (Rumi)**, written for 10-year-olds.

## Commands

No build step, package manager or framework. To run locally (Windows/PowerShell):

```
cd misi-jeti
py -m http.server 8000        # or: python -m http.server 8000
```

- Pupil screen: `http://localhost:8000`.
- Teacher Panel in a second window: `http://localhost:8000/#/guru`.
- Teacher Panel in the same window: Ctrl+Shift+G, then the PIN.
- Curtain Mode (blank projector): `T`.
- Mute: `M`.
- Use localhost rather than `file://`, because localStorage and Web Crypto behave differently on `file://`.

Tests and QA reports (owned by the QA agent):
- Tests go in `misi-jeti/tests/` and must not need any dependencies.
- QA reports go in `qa/laporan-YYYY-MM-DD.md`.
- Spec 6.5 requires an acceptance check: no hint or dialogue text in `js/kandungan.js` may contain that mission's answer words, and no mission code may appear in plain text.

## Architecture (big picture)

- **Single page, hash router** (`#/peta`, `#/misi1`, `#/guru`, …) with one file per screen under `js/skrin/`.
- **Plain `<script>` tags, not ES modules.** This keeps `file://` working. Script load order in `index.html` is significant.
- **No external resources of any kind**: no CDN, web fonts, analytics or audio/image files.
  - Fonts are system fonts.
  - Sounds are synthesised with Web Audio (`bunyi.js`).
  - The cats are inline SVG generated in code.
- **State lives in `localStorage`** under separate keys:
  - `mjks.v1.permainan`: game state.
  - `mjks.v1.guru`: metrics, PIN hash and approvals. Pupil screens never read this key.
  - `mjks.v1.tetapan`: settings.
  - `mjks.v1.sesiSeterusnya`: carry-over to the next session.
  - The pupil window and the `#/guru` window stay in sync through the `storage` event.
- **Derived values are computed, not stored.** For example, Bintang Laut = mission stamps + min(helper stamps, 2) + bonus.
- **Content is separate from logic.** All text, hints, dialogue and objects live in `js/kandungan.js`, which the teacher may edit.
- **Answer secrecy:**
  - Mission codes are stored only as SHA-256 hashes. `cincang.js` uses Web Crypto, with a small JavaScript SHA-256 fallback for `file://`.
  - The readable answer key is in `js/kunci-jawapan.js`. It is local-only, listed in `.gitignore`, and must never be published to GitHub Pages.
- **Cat companions (Si Oyen and Si Kiko):**
  - One shared SVG rig with two skins (`kucing-rig.js`).
  - Three parallel state machines per cat: location, emotion and mouth (`kucing-mesin.js`).
  - Movement to `data-labuh` anchor points uses a single requestAnimationFrame loop that runs only while a cat is moving (`kucing-gerak.js`).
  - Paired play (chasing and play-fighting) is coordinated by `kucing-pasangan.js`.
  - Stroking and hover-meow, with rate limits, are in `kucing-interaksi.js`.
  - Priority order: game events, then touch, then idle micro-actions.
  - Animate only `transform` and `opacity`. There is a Light Mode for old school laptops, and `prefers-reduced-motion` must be honoured.

## Non-negotiable rules (spec 1.3, 4.2, 6.5)

Any change must keep these intact.

- **Never reveal answers on pupil screens before pupils test for real.**
  - No "show answer" control.
  - The correct-physics animations unlock only after Peti Mak Tok opens.
  - Masked code input.
- **Mastery metrics and the answer key appear only in the Teacher Panel.** This includes icons, colours and brackets.
- **Hint ladder P1 → P2 → P3:**
  - No hint contains the answer word, its root or its first letter.
  - After P3 at least two options must remain plausible, otherwise the question becomes open-ended. Mission 2 therefore has no P4.
  - Hints never rewrite the mission question.
- **The cats must never leak outcomes:**
  - Oyen never predicts a specific mission object or liquid before it is tested.
  - Touching a cat never yields hints.
  - During Test Mode, dialogue, hint letters, Curtain Mode or the Teacher Panel there is no meow and no paired play.
- **Feedback is non-punitive.** No "wrong" buzzer. A mismatch between prediction and result is celebrated as "Kejutan Lautan".
- **"Bantu Dahulu":** a group's Peti Bonus stays locked until it has a Cop Penolong (helper stamp).
- **Privacy:** no pupil names are stored, and no data leaves the device.

## Team workflow (multi-agent)

The main agent is **Pak Cik**.
- **Hanis** (`~/.claude/agents/hanis.md`) designs and builds.
- **Slyvie** (`~/.claude/agents/slyvie.md`) tests and reports bugs, and does not edit app code.

Approval flow set by the teacher (Cikgu Afiq): Hanis builds → Slyvie tests → Hanis fixes until satisfied → Pak Cik gives the final decision → the result is delivered to the teacher.
