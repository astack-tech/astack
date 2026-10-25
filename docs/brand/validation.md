# Website and brand validation

Date: 25 October 2026. Branch: `codex/brand-website-redesign`.

## Scope

Pages: home, blog index, RLM article, brand guide, and not-found page. Light and dark appearances are checked separately. The preview runs at `http://127.0.0.1:43187`.

Viewport widths: 320, 360, 375, 390, 414, 430, 600, 640, 768, 820, 1024, 1280, 1440, 1920, 2560, and 3440 CSS pixels. Mobile captures use 844-pixel height; desktop captures use 1000-pixel height. These are Chromium viewport simulations, not physical-device or Safari/Firefox certification.

## Repairs from review

- Separate graph descriptions from icon/title columns; preserve complete Memory and Agent labels.
- Remove the overlapping RLM decoration; retain the independent navigation arrow.
- Separate syntax colors from brand colors and support both appearances.
- Remove the article's duplicate title and its fixed dark syntax background.
- Constrain article code and tables to keyboard-scrollable containers.
- Reflow the blog listing at intermediate narrow widths.
- Include Documentation in mobile navigation; support Escape to close.
- Increase icon-button touch targets to at least 44 × 44 CSS pixels.
- Replace the raw SVG footer destination with the `/brand` guide and explicit downloads.
- Add a matching not-found page and PNG Apple touch icon.
- Keep development and production caches separate to prevent build/dev conflicts.

## Checks

- Website `pnpm lint`, `pnpm check-types`, and `pnpm build`: pass.
- Repository `pnpm lint`: pass.
- Repository `pnpm test`: fails because the four package test commands find no test files. No package runtime source was changed. This is not reported as a passing test suite.
- `node assets/brand/check.cjs`: pass. All brand variants share the three production paths; repository and website construction SVGs are byte-identical.
- All five page types: 160 viewport/theme checks pass for page overflow, graph collisions, text escaping graph nodes, duplicate main headings, and broken loaded images. See `viewport-results.json`.
- Mobile menu, Escape, keyboard tab selection, package-manager selection, copy feedback, and execution preview: checked in Ego Browser.
- Text-token contrast against both primary and secondary surfaces: minimum 4.98:1 in light mode and 5.81:1 in dark mode across 18 pairs per theme. This is a token check, not a complete accessibility certification.

## Brand publication

The GitHub organization avatar was replaced with the silver asset. GitHub's saved avatar URL changed to the new image version. English and Chinese repository READMEs reference the same black-and-silver SVG banner. Repository and website changes use the feature branch and require the normal review/merge workflow before appearing on the default branch or deployed website.

## Content

The content map records the preserved topics. The RLM article retains its historical measurements with their original test conditions; those experiments were not rerun. Brand guidance applies ASD-STE100 editing principles without claiming full dictionary certification.

The organization avatar uses an opaque, full-bleed background. Host services apply their own rounded or circular crop; the source image has no transparent corners.
