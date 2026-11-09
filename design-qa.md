# Editorial redesign QA

final result: passed

## Evidence
- Source: selected second mock, `exec-ec54b59f-852e-46ae-82f3-289f717bb520.png` (1586 × 992), supplied in chat.
- Desktop implementation: `../../outputs/pixel-value-desktop.png` (1586 × 992 CSS and image pixels, device scale factor 1).
- Mobile implementation: `../../outputs/pixel-value-mobile.png` (390 × 844, device scale factor 1).
- Route/state: `/​#s0`, presentation mode, dark theme. Desktop reference and implementation were emitted together in the same comparison input.

## Comparison history
1. Initial pass: P2 portrait rendered too small and exposed a rectangular background; P2 heading and primary action were smaller than the selected composition. Corrected portrait sizing/masking, increased heading and buttons, removed redundant desktop hero wordmark and pretitle, and added the teal heading rule.
2. Final comparison at the source dimensions: oversized left-aligned heading, violet portrait at right, dark surface and teal primary action match the selected direction. Text, buttons, captions and metadata are readable at full resolution; no additional focused crop was necessary. No remaining actionable P0/P1/P2 findings.

## Intentional adaptations
Existing chapter navigation, compact slide controls, map action, author metadata and presentation modes are retained instead of replacing them with static mock controls. Standalone generated character artwork differs in pose from the concept, with the same visual direction. Original research wording is retained.

## Checks
- Mobile has no horizontal page overflow (body width 390); intro scrolls vertically, text precedes portrait and CTA remains reachable.
- Browser verified map opening and slide selection, presenter overlay including current/next notes, documentation and overview (23 visible slides), and keyboard shortcuts P/S/E/Escape.
- Primary CTA opened the next research slide. Rapid navigation was reproduced in a real controller regression test before the fix and passes afterward, including its reduced-motion branch.
- Browser console checked after testing: no errors or warnings returned.
- Existing P4 smoke checks and research integrity/syntax/local asset checks pass.
- Independent code review: no material findings.

## Limits and P3 follow-up
OS-level reduced-motion emulation, print/PDF and a disconnected-network browser run were not performed. Reduced-motion CSS and controller branch were checked in source and the controller test. Existing external fonts/icon stylesheet remain external. No Lighthouse score is claimed. Header/control typography retains the existing presentation conventions and may be enlarged in a separate usability pass.
