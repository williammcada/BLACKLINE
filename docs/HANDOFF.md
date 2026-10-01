# BLACKLINE continuation

BLACKLINE is a MathQuest cartridge. The standalone HTML is the cartridge racing mini-game’s playtest file. Narrative, choices and math gates follow after the action game is accepted.

## Current source and decisions

- Repository: https://github.com/williammcada/BLACKLINE
- Alpha.1 checkpoint: `7e625fe5572b27f4ddd25d756685d35a6b8c945a`.
- Owner feedback: “I like it. But I never encountered enemies and it was over in a minute.” The owner then approved a full 4–5-minute course with interceptors/rammers and three gaps.
- Alpha.2 approved specification: `256e0a893dae1eb5842da942fe3321d31f70e43b`, docs/change-specs/v0.1.0-alpha.2.md.
- Alpha.2 tested gameplay candidate: `a6dc2b2b88f27c9ea22bbfdca50db70366a36ade`.
- Handbook: v0.1.3 / `c50115ba1fea9cb552f3ad1415e670a219118b56`.
- Artifact: `dist/BLACKLINE-v0.1.0-alpha.2.html`.
- SHA-256: `fd0663736ed88aa6d7335edaf6fb3b13b89d0a52f3ae05b70d95ef7a83667055`.

## Implemented

14.5 km, six sections, 27 bends, three automatic gap jumps, two repair pickups, original alpha.1 driving response, pause/retry and 300-second active maximum. Adds real shooting interceptors and armored rammers, one concurrent attack, at most three active enemies, entry grace, jump-safe windows, real enemy gap failures, locked shots, committed rams, rear scanner, attack cues and cause-of-defeat reporting. Section palettes/structures and music variation extend the original presentation. No persistent records.

All 16 simulation tests passed. Seeded no-boost runs completed in approximately 4:26. Full browser keyboard run completed in 4:27. Ignoring gunfire caused browser defeat at 1:28. Synthetic touch/viewport/native-menu and instrumented audio regressions passed. Details/limits are in VERIFICATION.md. Physical iPhone/iPad checks, human audio evaluation and hosted deployment remain Not run.

## Next work

Obtain owner feedback on alpha.2 pursuit, difficulty, visibility and length. Preserve accepted handling. If the mini-game is accepted, prepare the MathQuest cartridge narrative/choice/math-gate integration specification after inspecting the actual canonical MathQuest source and its cartridge interfaces. Do not equate Math Arcade’s round grant policy with native MathQuest cartridge policy without checking the host.

At integration reuse the canonical shared mathematics; no new skill catalog in this racing engine. Record source/bundle hashes and actual host compatibility. Continue in checkpoints so a package/upload failure cannot require recreating tested gameplay.

## Recovery

The previous alpha.1 file remains in dist. Resume from the exact alpha.2 candidate above or the latest documented tested source, not chat summaries. Distribution is generated from src via scripts/build.cjs. Unperformed physical checks remain Not run; do not call the prototype a verified mobile release.
