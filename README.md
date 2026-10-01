# BLACKLINE: Last Exit

**A MathQuest cartridge.** Race a stolen interceptor through a sealed industrial city. Brake through tight bends, jump the broken skyway and escape the patrol before lockdown.

**Current build:** v0.1.0-alpha.2 — Full escape and pursuit. This standalone HTML is the cartridge mini-game’s playtest file. Narrative, choices and math gates are subsequent cartridge work.

## Play

Download [BLACKLINE-v0.1.0-alpha.2.html](dist/BLACKLINE-v0.1.0-alpha.2.html) using GitHub’s **Download raw file** control. Open the downloaded file in desktop Chrome or Edge. The game embeds its code, graphics and generated audio; no network assets are needed.

- **Steer:** A/D or Left/Right.
- **Brake/drift:** S or Down.
- **Boost:** Space. Refills while driving.
- **Pause:** Escape or P.
- Landscape touch controls are included; physical iPhone/iPad validation is pending.

## The escape

Six sections and 14.5 km: Lockdown Avenue, Foundry Switchbacks, Broken Skyway, Freight Underpass, Siren Spiral and Last Exit. Three mandatory gap jumps have marked speed requirements. Center on each ramp; the car jumps automatically. Boost is optional for every jump. Two off-center repairs restore 20 integrity.

Interceptors fire along a red aim lane; move after their aim locks. Armored rammers pull alongside, warn, then shove toward a committed line; brake behind them or move away. The rear scanner shows their actual positions and distance. Good driving and boost can increase your lead. One mistake need not end a run, but repeated hits destroy the car.

A clean no-boost automated run takes about 4 minutes 26 seconds; the complete browser keyboard run took about 4 minutes 27 seconds. Your time will depend on braking, boost and impacts. Maximum: 300 active seconds. There are no respawns or saved progress in a round. Pause stops time, pursuit, projectiles and recharge.

## Build and verification

Canonical repository: https://github.com/williammcada/BLACKLINE

With Node.js installed:

```sh
npm run build
npm test
```

Build from `src/`; do not edit the distribution directly. No runtime dependencies. Browser QA uses environment-provided Playwright/Chromium, as documented in [verification](docs/VERIFICATION.md).

- [Project brief](docs/PROJECT-BRIEF.md)
- [Full design](docs/change-specs/v0.1.0.md)
- [alpha.2 approved changes](docs/change-specs/v0.1.0-alpha.2.md)
- [Tests and limits](docs/VERIFICATION.md)
- [Continuation record](docs/HANDOFF.md)
- [Previous alpha.1 driving prototype](dist/BLACKLINE-v0.1.0-alpha.1.html)

Handbook baseline: v0.1.3 / `c50115ba1fea9cb552f3ad1415e670a219118b56`. Consulted AI-START-HERE, UNIVERSAL-RULES, CONDITIONAL-STANDARDS, PROJECT-TEMPLATE and RELEASE-CHECKLIST. No handbook amendment.

No hosted deployment, physical-device certification or human music-quality assessment is claimed. All current graphics and music are original preliminary assets; further presentation refinement can follow playtesting.

**A WILLIAM MCADA PRODUCT**
