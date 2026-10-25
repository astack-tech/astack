# AStack website

The website for [AStack](https://astack.tech), a TypeScript framework for AI applications. Next.js 15, React 19, and Tailwind CSS 4 serve the landing page and the Markdown blog.

## Run locally

The website has its own lockfile. Install its dependencies from this directory:

```sh
cd website
pnpm install --ignore-workspace
pnpm dev --port 43187 --hostname 127.0.0.1
```

Open [the local preview](http://127.0.0.1:43187).

```sh
pnpm lint
pnpm check-types
pnpm build
```

`pnpm start --port 43187` serves a production build. Next.js writes production output to `.next/` and development output to `.next-dev/`. The two servers can run without sharing a cache.

## Structure

- `app/`: Routes, metadata, API routes, and global styles.
- `components/`: Navigation, landing sections, and reusable controls.
- `components/magicui/`: Magic UI components and their upstream license.
- `lib/examples.ts`: Displayed code examples checked against package exports.
- `content/blog/`: Blog articles. Keep article URLs stable.
- `public/brand/`: Banner, social preview, and logo construction assets.

## Content and interaction

The landing page includes features, component and pipeline examples, a quick start, an architecture comparison, and use cases. The computation model has Component, Pipeline, Agent, and Streaming tabs. All tabs support keyboard navigation. The package selector updates the install command and its copy value together.

The data flow preview is a local illustration. It does not send prompts to a model. GitHub release and star data use internal API routes. These routes work without a token. An optional `GITHUB_TOKEN` can increase the rate limit. If that token expires, the routes retry the public request without it. Keep the token in `.env.local`; never commit it.

The quick-start example requires `DEEPSEEK_API_KEY` on the server. It must not be exposed as a browser environment variable. The example uses `@astack-tech/integrations/model-provider`.

## Design system

The site uses black and silver surfaces with light and dark themes. Geist and Geist Mono load from local files through `next/font/local`. Builds do not need Google Fonts. CSS Grid controls the main layouts. Code panels scroll within their own boundaries. The mobile menu supports keyboard input, and the page has a skip link.

Magic UI's `AnimatedBeam`, `BorderBeam`, `MagicCard`, and `AnimatedThemeToggler` come from the specified local checkout. Their MIT notice is retained. Animation explains the port connections and stops after one pass. Reduced-motion preferences disable that animation.

See the [brand specification](../docs/brand/README.md), [content map](../docs/brand/content-map.md), and [validation record](../docs/brand/validation.md).

## Framework context

AStack has its own implementation and architecture. Its API style takes inspiration from Haystack. It uses the HLang runtime for monadic Flow-Based Programming and Observable-based data flow.
