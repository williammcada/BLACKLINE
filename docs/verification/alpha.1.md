# BLACKLINE v0.1.0-alpha.1 verification

**Product:** BLACKLINE: Last Exit, a MathQuest cartridge.
**Deliverable:** Standalone driving mini-game playtest harness, Milestone A.
**Tested source candidate:** `5f6b441acc2c0d84a29badad1a351d9dfb13a1ad`.
**Artifact:** `dist/BLACKLINE-v0.1.0-alpha.1.html` (33,035 bytes).
**SHA-256:** `330c380114aeddf606c098ed62c7e5400f28ec940887056b0e3ea4dec294f1a2`.
**Environment:** Linux container; Node.js; Playwright 1.62.1 with headless Chromium 138.0.7204.0. File URL, desktop 1280×720 and touch-emulated 852×393 / 393×852 viewports.

The game source and distribution in the final delivery remain byte-identical to this tested candidate. Follow-up repository changes record evidence, the audio/recovery harness and release/handoff documentation only. This is a tested prototype, not a verified physical-device release.

## Results

| Check | Result | Evidence and scope |
| --- | --- | --- |
| Simulation | Passed | All 10 node:test cases; acceleration, brake priority, pause/stall, collision throttling, curve braking, jumps/corridors, swept triggers, deadline, restart and complete run |
| Full desktop keyboard run | Passed | Browser keyboard events drove from start through all bends and jump to finish in 66.921 active seconds; 100 integrity, no impacts, one terminal result |
| No-boost solvability | Passed | Independent deterministic simulation run completed in 66.875 active seconds; 100 integrity, no impacts |
| Pause/retry | Passed | Timer frozen while paused; retry resets round; fresh controls work; audio context reused |
| Multi-contact control | Passed, synthetic | Steering plus boost/brake, both release orders, cancellation, blur and rotation |
| Additional input recovery | Passed, synthetic | 1.6-second stationary hold remains active; capture failure and missing pointer release reconciled from native touch inventory pause safely |
| Native context-menu event | Passed, synthetic | HUD contextmenu default prevented and game paused; this does not reproduce actual iOS long-press behavior |
| Viewport layout | Passed, emulated | Landscape controls inside viewport; portrait pauses with rotation message; returning requires deliberate resume |
| Audio lifecycle | Passed, instrumented | Pause stops/suspends voices; resume/retry reuse context; finish jingle completes before suspension; music/SFX mute produces no voices/engine gain |
| Visual inspection | Passed | Inspected title, gameplay, bend, ramp, airborne, mobile title and mobile gameplay captures; gap corrected to remove misleading repeated bands |
| Browser errors | Passed | No page errors during full keyboard and synthetic touch run |
| Offline assets/build | Passed | Artifact opened from file URL with embedded code/art/audio; deterministic rebuild matches SHA-256 |
| Physical iPhone Safari/Edge | Not run | Need actual device/OS/browser and exact artifact evidence |
| Physical iPad Safari | Not run | Need actual device, safe-area, long-press, browser-bar, lock/unlock and sustained multi-touch checks |
| Audible music quality | Not run | Audio scheduling/gain tested; human listening and musical preference review pending |
| Owner handling/excitement review | Not run | Required before expanding into pursuit/full-course milestones |
| Hosted deployment | Not run | No hosting service or URL configured |
| Cartridge narrative/math integration | Not applicable | Later milestone; standalone Retry is deliberately ungated for playtesting |
| Persistent saved-work deletion | Not applicable | Prototype stores no persistent progress, learner records, scores or settings |

## Reproduce

Run `npm run build` and `npm test` for dependency-free build/simulation checks. Browser harnesses need Playwright and a Chromium binary supplied by the QA environment:

```sh
CHROMIUM_PATH=/absolute/path/to/chromium node tests/browser.cjs
CHROMIUM_PATH=/absolute/path/to/chromium node tests/audio-and-recovery.cjs
```

The audio/recovery test injects observers that expose the existing simulation state and Sound instance. It does not alter the delivered file. The desktop full run uses actual browser keyboard events without state injection. JSON results are in `docs/evidence/`.

Observed disruptive stuck input, unwanted viewport zoom/movement or native menus on any supported physical target remain release blockers for that target. This report does not certify those devices.
