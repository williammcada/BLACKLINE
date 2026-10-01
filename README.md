# BLACKLINE: Last Exit

**A MathQuest cartridge.** Drive a stolen interceptor through a sealed industrial city: tight bends, broken skyways and, in the completed mini-game, lethal pursuers.

**Current build:** v0.1.0-alpha.1 — Driving Prototype. This is the standalone playtest harness for the cartridge’s mini-game. It is not a separate product or the completed cartridge.

## Play the prototype

Download [BLACKLINE-v0.1.0-alpha.1.html](dist/BLACKLINE-v0.1.0-alpha.1.html) using GitHub’s **Download raw file** control, then open the downloaded file in desktop Chrome or Edge. The game contains its own code, graphics and generated audio; no network assets are needed.

- A/D or Left/Right: steer.
- S or Down: brake/drift.
- Space: boost.
- Escape or P: pause.
- Touch controls are included for landscape play. Physical iPhone/iPad validation remains pending.

Read the bend, brake before entry, then accelerate out. Center on the ramp at 160+ km/h; the jump is automatic. A clean run takes about one minute. The simulation has a five-minute active-play maximum.

## What this milestone includes

One 3.6 km development course, five alternating bends, visible hills, one gap jump, integrity/damage, rechargeable boost, pause/retry, original preliminary pixel scenery and synth/engine audio. No progress or settings persist across reload.

Pursuers, the final six-section course, MathQuest narrative/choices and math gates are later milestones. The standalone Retry button is a playtest feature; the eventual cartridge adapter owns its gate/admission policy.

## Source and build

Canonical repository: https://github.com/williammcada/BLACKLINE

With Node.js installed:

```sh
npm run build
npm test
```

Builds are generated from `src/`; do not edit the distribution directly. There are no npm runtime dependencies. The optional browser regression script uses an environment-provided Playwright install and `CHROMIUM_PATH` pointing to its browser binary; see [verification](docs/VERIFICATION.md).

## Project record

- [Project brief](docs/PROJECT-BRIEF.md)
- [Full v0.1.0 design baseline](docs/change-specs/v0.1.0.md)
- [Milestone A contract](docs/change-specs/v0.1.0-alpha.1.md)
- [Verification and limits](docs/VERIFICATION.md)
- [Current handoff](docs/HANDOFF.md)

Initial source: `177690799fabab5bd12a057eb9ce4a72fcc42d37` (placeholder README).
Design checkpoint: `57de81e97fcac55b6c95bc25a8a228fd24128a68`.
First implementation checkpoint: `f4c17081566eda569f15f12af2b962563ad41103`.

Handbook baseline: v0.1.3 / `c50115ba1fea9cb552f3ad1415e670a219118b56`. Read AI-START-HERE, UNIVERSAL-RULES, CONDITIONAL-STANDARDS, PROJECT-TEMPLATE and RELEASE-CHECKLIST. This project does not amend the handbook.

No hosted deployment or physical-device verification is claimed. The next decision is the owner’s driving-feel review, before the pursuit milestone.

**A WILLIAM MCADA PRODUCT**
