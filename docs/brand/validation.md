# Website and brand validation

Date: 1 November 2026. Scope: the board redesign of astack.tech (PR #56), search, the graceful-degradation layer (PR #61) and the board-style brand images.

## Layout audit

An automated audit opened each page in Chromium (ego-browser) and measured it after load:

- horizontal page overflow;
- elements outside the viewport that are not inside a scroll container;
- text clipped by its box;
- the hero headline overlapping the falling blocks;
- headlines longer than two lines (`h1`, `h2`) or three lines (card titles).

Pages: home, docs introduction, docs pipelines, API overview, an API class page, examples index, an example page, blog index, blog article and brand guide. Widths: 320, 360, 375, 390, 414, 768, 820, 1024, 1280, 1440, 1920 and 2560 CSS pixels. Both themes. That is 240 checks; the raw results are in `viewport-results.json`.

Result: no overflow, no element outside the viewport, no clipped text and no overlap on any page, width or theme. 26 checks are flagged, all for line count on blog content:

| Page         | Widths    | Finding                                                   |
| ------------ | --------- | --------------------------------------------------------- |
| Blog index   | 320–390   | The 84-character article title wraps to 4 lines           |
| Blog article | 320–414   | The same title as `h1` wraps to 4–5 lines                 |
| Blog article | 1280–2560 | The `h1` wraps to 3 lines in the 800-pixel reading column |
| Blog article | 320       | One `h2` wraps to 3 lines                                 |

These are long article titles, not layout defects. Article titles use a smaller size than page titles for this reason.

## Navigation

Measured in the browser, the target heading lands at the header height plus 24 pixels for:

- table-of-contents links;
- `/#computation-model` from another page, on desktop and from the mobile menu;
- deep links into pages with Mermaid diagrams;
- the hero's start link.

Search opens with ⌘K, Ctrl+K or `/`, moves with the arrow keys, opens with Enter and closes with Escape.

## Older browsers

`website/app/styles/resilience.css` replaces `oklch()` hues with sRGB and `color-mix()` tints with tone steps. With both fallbacks forced on in Chromium, home and docs keep layout, hierarchy and contrast in both themes, on desktop and phone. Only Chromium was used; Safari and Firefox were not run.

## Automated checks

- Website: `pnpm lint`, `pnpm check-types`, `pnpm test` (23 tests, coverage above the package thresholds) and `pnpm build` pass. The search-index test fails if a docs section points at an anchor the page does not have.
- Repository: `pnpm verify` passes. `pnpm audit` reports no known vulnerabilities in either install.
- `node assets/brand/check.cjs`: every brand variant uses the three production paths.

## Brand images

The README banner, the website's social card, the GitHub social preview and the construction drawing are generated from one board layout with Geist embedded, then exported from a browser. The organization profile banner (`astack-tech/.github`) and the repository's social preview use the new files; the repository page's `og:image` was checked after upload.
