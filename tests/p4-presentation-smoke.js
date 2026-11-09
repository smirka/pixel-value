/* Run with: node tests/p4-presentation-smoke.js */
"use strict";
const fs = require("node:fs");
const assert = require("node:assert/strict");
const html = fs.readFileSync("index.html", "utf8");

assert.equal((html.match(/<section class="screen"/g) || []).length, 23, "research slide count must remain 23");
assert.match(html, /id="qaDialog"/, "Q&A dialog exists");
assert.match(html, /id="qaOpenFinal"/, "final slide exposes Q&A");
assert.match(html, /id="qaOpenPresenter"/, "presenter controls expose Q&A");
assert.match(html, /aria-valuenow=/, "progress exposes its current value accessibly");
assert.match(html, /function toggleQa\(/, "Q&A has a single toggle controller");
assert.match(html, /qaDialog[\s\S]*?aria-modal="true"/, "Q&A uses modal semantics");
assert.match(html, /Escape[\s\S]*?toggleQa\(false\)/, "Escape can dismiss Q&A");
assert.match(html, /prefers-reduced-motion:reduce/, "reduced-motion fallback remains present");
assert.match(html, /data-notes=/, "speaker notes remain in the document");
console.log("P4 presentation smoke checks passed.");
