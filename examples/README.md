# AStack examples

Each example is one short `index.ts` that shows one idea. Read them in order: every example uses only what the earlier ones introduced.

The same files are rendered on [astack.tech/examples](https://astack.tech/examples), next to the docs they illustrate.

| #   | Example                               | Level    | What it shows                                                                | Docs                                                        | API key |
| --- | ------------------------------------- | -------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------- | ------- |
| 1   | [Component](./component/)             | Basics   | Define a component and run it as a plain function.                           | [components](https://astack.tech/docs/components)           | No      |
| 2   | [Pipeline](./pipeline/)               | Basics   | Connect three components and let the pipeline infer the endpoint.            | [pipelines](https://astack.tech/docs/pipelines)             | No      |
| 3   | [Routing](./routing/)                 | Basics   | Send data to different branches through named output ports.                  | [routing](https://astack.tech/docs/routing)                 | No      |
| 4   | [Text splitter](./text-splitter/)     | Basics   | Split a document into overlapping chunks with a built-in component.          | [components](https://astack.tech/docs/components)           | No      |
| 5   | [Tools](./tools/)                     | Basics   | Create tools and run tool calls without a model.                             | [tools](https://astack.tech/docs/tools)                     | No      |
| 6   | [Chat](./chat/)                       | LLM      | Call a model provider directly and inside a pipeline.                        | [model-providers](https://astack.tech/docs/model-providers) | Yes     |
| 7   | [Workflow](./workflow/)               | LLM      | Chain three LLM steps: outline, draft, edit.                                 | [pipelines](https://astack.tech/docs/pipelines)             | Yes     |
| 8   | [Agent](./agent/)                     | LLM      | Give a model a tool and let it decide when to call it.                       | [agents](https://astack.tech/docs/agents)                   | Yes     |
| 9   | [Custom model](./custom-model/)       | LLM      | Drive an agent with any model: implement chatCompletion() and plug it in.    | [model-providers](https://astack.tech/docs/model-providers) | No      |
| 10  | [Streaming agent](./streaming-agent/) | LLM      | Print the agent's text and tool events as they happen.                       | [streaming](https://astack.tech/docs/streaming)             | Yes     |
| 11  | [RLM agent](./rlm-agent/)             | Advanced | Answer a question about a source directory that is too large for one prompt. | [rlm](https://astack.tech/docs/rlm)                         | Yes     |
| 12  | [HTTP server](./http-server/)         | Advanced | Serve a streaming agent over HTTP with Server-Sent Events.                   | [streaming](https://astack.tech/docs/streaming)             | Yes     |

## Run an example

```bash
# Once, from the repository root
pnpm install && pnpm build

pnpm --filter @astack-examples/pipeline start
```

Examples marked with an API key call a real model. They use DeepSeek, so they need `DEEPSEEK_API_KEY` as written; change the one line that creates the model to use OpenAI, Qwen, Ollama, any other OpenAI-compatible API or your own provider. The others run offline, and CI runs them on every change.

## Add an example

1. Create `examples/<name>/` with `index.ts`, `README.md`, `package.json` and `tsconfig.json`. Copy an existing example.
2. Keep it to one idea and one file. If it needs a second file, it is probably two examples.
3. Fill in the `astack` block in `package.json` (`title`, `order`, `tier`, `doc`, `requiresApiKey`).
4. Run `pnpm sync:examples` to regenerate the website pages, then `pnpm verify`.
