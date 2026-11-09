# Editorial Upgrade Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Apply the approved second visual concept to the existing presentation, add local artwork, and refine motion without changing research.
**Architecture:** Retain HTML and vanilla JS. Add a focused editorial stylesheet; use the existing slide controller and local raster assets.
**Tech Stack:** HTML, CSS, JavaScript, Node built-in checks.
**Spec:** ../editorial-design.md (approved in chat).

## Global Constraints
Preserve 23 slides, research text and values, author and year, all current modes and shortcuts. Keep assets local. Work on design/editorial-upgrade; do not merge or deploy GitHub Pages.

## Review Focus
Rapid repeated navigation must leave one visible slide. Reduced motion must settle immediately. Portrait must scroll without clipped controls. Missing artwork must leave readable text. Source data and notes must remain unchanged.

### Task 1: Editorial presentation and assets
- [ ] Capture baseline slide research content and run existing smoke test.
- [ ] Generate standalone portrait and supporting cosmetic artifact illustration.
- [ ] Update intro markup and add editorial.css; preserve existing action attributes and research content.
- [ ] Check all local image references and JS syntax; compare research content against baseline.

### Task 2: Motion and verification
- [ ] Reproduce rapid-navigation overlap with a focused controller test before fixing it.
- [ ] Clean stale transition state, refine directional motion, honor live reduced-motion changes, and pause inactive decorative effects.
- [ ] Run focused and existing checks. Preview in browser at desktop and mobile; verify modes, keyboard, reduced motion and console.
- [ ] Compare reference and rendered intro, resolve material issues, record design QA. Request whole-change independent review and address substantive findings.
- [ ] Prepare a user-facing source archive and report verification and preview.
