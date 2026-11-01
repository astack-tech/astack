# Text splitter

Split a document into overlapping chunks with a built-in component.

**Level:** Basics · **Concept:** [Components](https://astack.tech/docs/components)

```mermaid
flowchart LR
  D([document]) -- text --> S[TextSplitter] -- out --> C([chunks])
```

## What it shows

- `TextSplitter` packs paragraphs into chunks of at most `chunkSize` characters.
- Paragraphs that fit in `overlap` repeat at the start of the next chunk.

## Run

```bash
# Once, from the repository root
pnpm install && pnpm build

pnpm --filter @astack-examples/text-splitter start
```

The full program is [`index.ts`](./index.ts).

Next: [Tools](../tools/)
