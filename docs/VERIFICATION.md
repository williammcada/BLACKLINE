# BLACKLINE v0.1.0-alpha.2 verification

**Product:** BLACKLINE: Last Exit, a MathQuest cartridge.
**Deliverable:** Full escape mini-game, standalone playtest file; narrative/math wrapper remains later work.
**Tested gameplay candidate:** `a6dc2b2b88f27c9ea22bbfdca50db70366a36ade`.
**Artifact:** `dist/BLACKLINE-v0.1.0-alpha.2.html` (46,796 bytes).
**SHA-256:** `fd0663736ed88aa6d7335edaf6fb3b13b89d0a52f3ae05b70d95ef7a83667055`.
**Environment:** Linux container, Node.js, Playwright 1.62.1 and Chromium 138.0.7204.0; local file URL. Desktop 1280×720 and emulated mobile 852×393 / 393×852.

Gameplay source/distribution remain unchanged from the tested candidate. Follow-up commit records updated browser harnesses, evidence and release/handoff documents. This is a tested playtest build, not a verified physical-device release.

## Results

| Check | Result | Evidence and limits |
| --- | --- | --- |
| Simulation suite | Passed | 16 tests: preserved handling, reset, AI pause, damage throttling/priority, all jump boundaries, finish/deadline, repairs, enemy travel/corners/gap failure, shot lock/evasion, ram hit/evasion, jump protection and burst deduplication |
| Complete no-boost simulation | Passed | Seeds 7319, 17 and 999 completed all three jumps in 266.096 active seconds; 90 integrity; both enemy attack types occurred |
| Concurrent pursuit caps | Passed | Full seeded runs never exceeded three enemies or one warning/attack owner |
| Lethal enemy failure | Passed | Center-line driver ignoring shots was destroyed by interceptor gunfire; no catch-meter damage |
| Complete browser keyboard run | Passed | Keyboard events with Playwright virtual clock, decisions every 100 ms: 267.240 active seconds, all three gaps, one terminal result, both enemy types; zero enemy hits and one repair collected |
| Browser defeat/retry | Passed | Ignoring gunfire caused defeat at 88.233 active seconds; result explicitly identified interceptor gunfire; retry cleared enemies, bullets, health and hit totals |
| Visual inspection | Passed | Six section captures, gun aiming warning, both ram phases, gap, defeat and mobile attack layout inspected; warnings/control areas remain visible |
| Touch interruption regression | Passed, synthetic | Both multi-contact release orders, cancel, focus loss, native touch-inventory recovery after a missed release, capture failure and stationary held touch |
| Viewport/native-menu regression | Passed, emulated/synthetic | Portrait pauses; landscape return requires resume; controls fit; contextmenu prevented. This does not establish actual iOS gesture/callout behavior |
| Audio lifecycle | Passed, instrumented | Pause suspends/stops voices; resume/retry reuse context; finish jingle completes; music/SFX mute works |
| Browser errors | Passed | No page errors during full keyboard run and synthetic mobile regression |
| Build/package | Passed | Deterministic self-contained build; local source/distribution checked against saved GitHub blobs; archive integrity checked |
| Physical iPhone/iPad Safari/Edge | Not run | Need real device, OS/browser, exact artifact, multi-touch, browser bars, lock/unlock, zoom and native-menu evidence |
| Human difficulty/music review | Not run | Owner approved alpha.1 handling; alpha.2 pursuit/pacing and human listening remain for playtest |
| Physical device frame-rate target | Not run | Virtual-clock completion is not a performance measurement |
| Hosted deployment | Not run | No hosting service or URL configured |
| Cartridge narrative/math integration | Not applicable | Subsequent milestone; the standalone test harness remains ungated |
| Persistent-data deletion | Not applicable | No persistent learner records, progress, scores or settings |

The complete keyboard run used the unmodified delivered file and browser keyboard input with a virtual clock. The mobile attack layout fixture and audio test inject observers to access existing state; they are not claims of unaided human play or physical-device validation.

## Reproduction

`npm run build` and `npm test` require Node.js with no runtime packages. Browser QA additionally requires Playwright and a Chromium executable supplied by the QA environment:

```sh
CHROMIUM_PATH=/absolute/path/to/chromium node tests/browser.cjs
CHROMIUM_PATH=/absolute/path/to/chromium node tests/audio-and-recovery.cjs
CHROMIUM_PATH=/absolute/path/to/chromium node tests/failure.cjs
```

Raw results are under `docs/evidence/alpha.2/`. The alpha.1 verification is retained under `docs/verification/alpha.1.md`, with its evidence in `docs/evidence/alpha.1/` and its original distribution preserved.

Any observed disruptive stuck controls, unintended viewport movement/zoom or native menus remain release blockers on the affected physical target. Automated/emulated passes do not substitute for those device checks.
