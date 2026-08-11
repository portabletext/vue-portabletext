---
'@portabletext/vue': major
---

The package is now ESM only, and requires Node.js 22.12 or later

#### When you will see a difference

Only if you load this package with `require()`, or build on Node.js 20 or earlier. If you already `import` it, or use a bundler, nothing changes.

#### What changes

The package no longer ships a CommonJS build. `require("@portabletext/vue")` will fail, where before it resolved to `dist/vue-portable-text.cjs`. Use `import` instead, or a dynamic `await import()` from a CommonJS file.

This brings the package in line with the rest of the Portable Text packages, which are already ESM only.

Node.js 20 reached end of life in April 2026. The package previously declared no `engines` range at all, so nothing was enforced.
