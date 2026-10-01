# Project brief — BLACKLINE: Last Exit

**Brief version:** v0.1.0
**Date:** 2026-10-01, Asia/Shanghai
**Owner:** William McAda
**Status:** Initial design accepted for staged development; first mini-game implementation authorized.
**Initial source:** BLACKLINE-v0.1.0-Technical-Specification.md, approved to proceed on 2026-10-01. No pre-existing racer or source commit.
**Canonical repository:** williammcada/BLACKLINE; initial source commit `177690799fabab5bd12a057eb9ce4a72fcc42d37`.
**Running version:** v0.1.0-alpha.1 development/playtest harness; verification status in VERIFICATION.md.
**Next build:** v0.1.0-alpha.1, Milestone A.
**Handbook:** v0.1.3, c50115ba1fea9cb552f3ad1415e670a219118b56, confirmed unchanged on 2026-10-01.

## Purpose and audience

BLACKLINE is a MathQuest cartridge, explicitly confirmed by the owner on 2026-10-01. Its first deliverable is a short, exciting single-player racing mini-game for school-age MathQuest players. The standalone game must feel good before adding a math gate or narrative cartridge. Fictional dystopian industrial art and music; no gore.

## Must retain through staged development

- Behind-the-car pseudo-3D perspective, pixel art and visible elevation.
- One authored course with tight turns and mandatory gap jumps.
- Meaningful braking, forgiving drift, automatic acceleration and rechargeable boost.
- Pursuers whose lethal attacks can be avoided through good driving, added in Milestone B.
- Original dystopian music and art; no copied OutRun assets.
- Final round maximum of 300 active seconds, with earlier success/failure.
- Clear terminal failure, retry and win behavior; no invisible damage or required boost for a mandatory jump.
- Touch and keyboard controls; robust interruption recovery from the first playable build.

## Immediate implementation scope

Follow docs/change-specs/v0.1.0-alpha.1.md. Build one 60–90 second driving strip and one gap jump, with pause, retry, HUD, integrity, basic audio and preliminary original scenery. The final six-section course and enemies are later work. A short prototype is a development fixture, not a reduction of the final five-minute maximum.

## Devices and distribution

Target desktop Chrome/Edge keyboard, landscape iPad Safari, and landscape iPhone 15 Pro Safari/Edge where available. Portrait pauses driving safely and requests landscape. Actual browser/OS versions and artifact hashes must accompany physical-device results.

Generate a self-contained HTML distribution from the same source as the embeddable version. No external runtime CDN, account, recurring cost or backend for standalone play. iOS uses a browser-hosted URL when a hosting method is selected; deployment provider and URL remain pending. Publishing is not yet completed.

## Saved work

No persistent progress, scores, learner identifiers or settings in the prototype. Settings are in memory and reset when the page reloads. U-09 deletion is Not applicable at this stage. Adding persistence requires scoped deletion, confirmation/cancel and recovery limits in that same revision.

## Controls and viewport reliability

Apply U-10 with one shared contact ownership/release mechanism. Check release, drag outside, capture failure/loss, cancellation, multi-touch release order, blur, background, lock, orientation, pause, death/retry and teardown. Never cancel a legitimately held touch through a short inactivity timeout. Require fresh intentional input after interruption.

Separately record (1) stuck input, (2) unwanted zoom/layout movement and (3) native selection/callout/menu interference. Protect gameplay surfaces while keeping menus/settings usable. Check safe areas, browser bars and touch coordinates after viewport changes. All physical-device tests are currently Not run.

## Applicable standards

Apply approved U-10 and S-03-A. U-09 applies if persistent work is introduced. Select U-01–U-08 and general S-03/S-04 as local practices while preserving their seeded/draft global status. S-03-M and S-02 apply at future shared-math integration. S-01 and S-05 do not apply. No handbook changes or exceptions are requested.

Handbook files read: AI-START-HERE.md, UNIVERSAL-RULES.md, CONDITIONAL-STANDARDS.md, PROJECT-TEMPLATE.md and RELEASE-CHECKLIST.md at the baseline above.

## Relationship to the hosts

MathQuest cartridge narrative is later work. Math Arcade uses one math gate before each new round, with no interruption during driving. Its actual source/API must be inspected before adapter implementation. Reuse the canonical shared math system and record its source/bundle revision. Do not duplicate curriculum code or claim current host compatibility.

## Definition of done for the first milestone

A standalone playable artifact, source and identifiable implementation checkpoint; automated physics/lifecycle checks; browser inspection of road/jump/HUD/screens; documented touch interruption checks; version and credit visible. Label any absent physical-device evidence Not run. Owner handling feedback is the decision gate for expanding the course. Do not describe this alpha as a verified release for devices that have not been checked.

## Current limitations

Repository confirmed at initial commit 177690799fabab5bd12a057eb9ce4a72fcc42d37. First implementation checkpoint: f4c17081566eda569f15f12af2b962563ad41103. Prototype verification is recorded separately in VERIFICATION.md; no hosted build or physical-device verification is claimed. The standalone test harness does not replace the eventual cartridge narrative, choices, math gates, artwork and music.
