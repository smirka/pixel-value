# PIXEL / VALUE — Presentation Experience Design

Date: 2026-11-09
Target branch: `p4-presentation-experience` (based on `p2-3d`)
Scope: polish the existing presentation experience without changing research content.

## Context found in the current branch

The current `index.html` already contains:
- a top progress line and circular progress indicator;
- a presenter overlay with elapsed timer, current/next slide, and private speaker notes;
- directional slide transitions;
- reveal classes and animated chart/bar primitives;
- 23 fixed research slides and keyboard navigation.

These existing features should be improved or completed, not duplicated.

## Proposed design

### 1. Presentation progress
Keep the existing progress line and ring as the single source of progress state. Improve accessible labels and ensure both remain synchronized in presentation and overview modes. No new progress UI or additional persistent chrome.

### 2. Presenter mode
Keep the existing `P` overlay. Improve its usability: clear current/next slide hierarchy, legible notes, visible elapsed time, and robust keyboard handling. The overlay remains a presenter aid and does not alter audience-facing slide content. Do not add a second browser window or depend on popup permissions.

### 3. Data and chart reveals
Reuse the current reveal system. Ensure chart bars, counters, and data visuals animate only when a slide becomes active, do not replay excessively during unrelated DOM updates, and settle immediately under `prefers-reduced-motion`. Preserve all values, labels, denominators, and caveats exactly.

### 4. Slide transitions
Retain the current forward/backward directional transitions. Refine timing and fallback behavior only where it improves clarity. Avoid adding heavy blur or long transitions; respect reduced motion and low-performance mode.

### 5. Q&A ending
Do not add a 24th slide. Add an optional Q&A panel/overlay reachable from the existing final slide and presenter controls. It may contain only neutral prompts derived from the existing research boundaries (sample size, interpretation, cosmetic vs. Pay-to-Win, and limits of inference). It must not introduce new results or imply answers not supported by the project. It must be keyboard-accessible and dismissible with Escape.

## Constraints

- Preserve exactly 23 slides, all research text, numbers, sources, DOI, author, sample size (n=18), and year (2026).
- Keep the one-file HTML/CSS/vanilla-JS architecture; no framework, build step, CDN, or new network requests.
- Preserve offline and `file://` compatibility.
- Keep existing keyboard shortcuts; add no conflicting shortcut. Q&A must also be reachable by a visible control.
- Mobile and portrait layouts must remain usable; reduced-motion must settle to static states.
- Do not modify the liquid-glass CSS block unless a browser-based before/after comparison proves a conflict.
- Do not merge or deploy. Work only on this branch and open a draft PR when ready.

## Error handling and accessibility

- If Q&A controls cannot initialize, the presentation remains fully usable.
- All controls have accessible names, visible focus, and correct dialog semantics.
- Escape closes Q&A before any underlying layer is closed.
- Focus returns to the invoking control after dismissal.
- Animations must not be the only way to perceive data or state.

## Verification plan

1. Add focused static/behavioral checks for 23 slides, unchanged research markers, Q&A open/close behavior, and reduced-motion fallbacks.
2. Run the repository's available checks; do not invent a test command if none exists.
3. Verify keyboard and mobile behavior in a real browser when a browser is available.
4. Compare screenshots at 1920×1080, 1366×768, and 390×844.
5. Check console, network requests, offline/`file://`, print/PDF, and reduced motion.
6. Record unavailable browser checks honestly in the draft PR; do not claim Lighthouse or runtime checks without evidence.

## Out of scope

- Adding or changing research data, claims, citations, or the 23-slide sequence.
- New external images, libraries, fonts, or network dependencies.
- Merging PR #5 or changing GitHub Pages settings.
