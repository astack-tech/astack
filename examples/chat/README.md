# Chat

Call DeepSeek directly and inside a pipeline.

**Level:** LLM · **Concept:** [Model Providers](https://astack.tech/docs/model-providers) · **Needs:** `DEEPSEEK_API_KEY`

```mermaid
flowchart LR
  P([prompt]) -- prompt --> L[Deepseek] -- completion --> A([answer])
```

## What it shows

- `run(text)` returns text; `chatCompletion(messages)` returns an assistant message.
- In a pipeline the model reads `prompt` or `messages` and writes `completion` or `message`.

## Run

```bash
# Once, from the repository root
pnpm install && pnpm build

export DEEPSEEK_API_KEY=sk-...
pnpm --filter @astack-examples/chat start
```

The full program is [`index.ts`](./index.ts).

Next: [Workflow](../workflow/)
