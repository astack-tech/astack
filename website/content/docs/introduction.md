---
title: Introduction
description: What AStack is, the computation model behind it, and how it compares with PocketFlow and Haystack.
order: 1
examples: [component, pipeline]
api: [core/classes/Component, core/classes/Pipeline]
---

AStack is a TypeScript framework for AI applications. It has one rule: **everything is a component**. Models, tools, agents and your own logic are components. A pipeline connects their ports into a graph, and data flows along the connections.

## The computation model

AStack has three ideas, and every feature is built from them.

| Idea | What it is | API |
| --- | --- | --- |
| Component | A unit of work with named input and output ports. | `class X extends Component` |
| Port | A typed channel. Output ports connect to input ports. | `$i('in').receive()`, `$o('out').send()` |
| Pipeline | A graph of components. It runs data from a trigger port to an endpoint. | `addComponent`, `connect`, `run` |

A component never calls another component. It reads from its input ports and writes to its output ports. The pipeline decides where data goes. This keeps each component small and testable, and lets you rewire a graph without editing the components in it.

The same component works in two modes:

- **Standalone:** call `component.run(input)` like a function.
- **In a pipeline:** the runtime calls `_transform($i, $o)`, and the component reacts to data on its ports.

Agents, multi-step workflows, routing and retrieval are patterns built from these three ideas. They are not separate subsystems.

The runtime is [HLang](https://github.com/hlang-tech), a flow-based programming runtime built on RxJS. Each connection is an observable stream, so components process data as it arrives.

## How AStack compares

AStack's computation model is original. Two other projects are close to it, and the comparison helps explain the design.

**PocketFlow** reached a similar conclusion on its own: a small core in which the graph *is* the framework, and agents, workflows and RAG are patterns on top of it. PocketFlow is written in Python and makes a 100-line core its defining goal. AStack does not optimize for line count. It optimizes for typed, reactive data flow in TypeScript.

**Haystack** inspired AStack's API shape: components connected into a pipeline by named inputs and outputs. AStack does not use Haystack code.

| | AStack | PocketFlow | Haystack |
| --- | --- | --- | --- |
| Language | TypeScript | Python | Python |
| Unit of work | Component with named ports | Node with `prep`, `exec` and `post` | Component with typed sockets |
| How data moves | Along each connection, from an output port to an input port | Through a shared store that nodes read and write | Along connections between sockets |
| Branching | A component sends to the output port it chooses | `post` returns an action; the flow follows that labeled edge | Router components |
| Execution | Reactive streams; concurrent runs of a route resolve in order | A flow runs nodes one after another; async and parallel variants exist | A pipeline run loop |
| Design goal | A typed, reactive data-flow model | A minimal core of about 100 lines | A full framework for search and RAG |

The main difference from PocketFlow is where state lives. In PocketFlow, nodes share one store. In AStack, each connection carries the data for that step, so a component's inputs and outputs are explicit in the graph.

## Packages

| Package | Contents |
| --- | --- |
| `@astack-tech/core` | `Component`, `Pipeline`, `Port` |
| `@astack-tech/components` | `Agent`, `StreamingAgent`, `RLMAgent`, `TextSplitter`, `ToolInvoker` |
| `@astack-tech/tools` | `createTool`, tool sets, component tools, MCP tools |
| `@astack-tech/integrations` | Model providers: `Deepseek`, and `OpenAICompatible` for any OpenAI-compatible API. |

AStack is in public beta. APIs can change between beta releases. Each release is described in the package changelogs.
