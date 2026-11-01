---
title: 简介
description: AStack 是什么、它背后的计算模型，以及它与 PocketFlow 和 Haystack 的对比。
order: 1
examples: [component, pipeline]
api: [core/classes/Component, core/classes/Pipeline]
source: b267f2837ab8f6e1b8df15abc0c51adc77ce7e55afed579ad0f6a6674287773c
---

AStack 是一个用于构建 AI 应用的 TypeScript 框架。它只有一条原则：**一切皆组件**。模型、工具、智能体以及你自己的逻辑都是组件。管道（pipeline）把它们的端口连接成一张图，数据沿着连接流动。

## 计算模型

AStack 只有三个概念，所有功能都由它们构成。

| 概念 | 是什么 | API |
| --- | --- | --- |
| 组件（Component） | 一个带有具名输入端口和输出端口的工作单元。 | `class X extends Component` |
| 端口（Port） | 一条有类型的通道。输出端口连接到输入端口。 | `$i('in').receive()`、`$o('out').send()` |
| 管道（Pipeline） | 由组件构成的图。它把数据从触发端口送到终点。 | `addComponent`、`connect`、`run` |

组件从不直接调用另一个组件。它从输入端口读取数据，向输出端口写入数据；数据流向哪里由管道决定。这样每个组件都小而易测，你也可以重新连接一张图而不用改动其中的组件。

同一个组件可以在两种模式下工作：

- **独立运行：** 像调用函数一样调用 `component.run(input)`。
- **在管道中：** 运行时调用 `_transform($i, $o)`，组件对端口上到达的数据作出响应。

智能体、多步工作流、路由和检索都是由这三个概念组合出来的模式，而不是独立的子系统。

运行时是 [HLang](https://github.com/hlang-tech)，一个基于 RxJS 的流式编程（flow-based programming）运行时。每条连接都是一个可观察的流，所以组件会在数据到达时立即处理。

## 与其他框架的对比

AStack 的计算模型是原创的。有两个项目与它比较接近，对比有助于说明它的设计。

**PocketFlow** 独立得出了相似的结论：一个很小的核心，图*本身*就是框架，智能体、工作流和 RAG 都是构建在它之上的模式。PocketFlow 用 Python 编写，以 100 行的核心作为它的标志性目标。AStack 不以代码行数为优化目标，它优化的是 TypeScript 中有类型的、响应式的数据流。

**Haystack** 启发了 AStack 的 API 形态：组件通过具名的输入和输出连接成管道。AStack 没有使用 Haystack 的代码。

| | AStack | PocketFlow | Haystack |
| --- | --- | --- | --- |
| 语言 | TypeScript | Python | Python |
| 工作单元 | 带具名端口的组件 | 带 `prep`、`exec` 和 `post` 的节点 | 带类型化插槽的组件 |
| 数据如何流动 | 沿每条连接，从输出端口流向输入端口 | 通过节点共同读写的共享存储 | 沿插槽之间的连接 |
| 分支 | 组件把数据发送到它选择的输出端口 | `post` 返回一个动作，流程沿带该标签的边继续 | 路由组件 |
| 执行 | 响应式流；同一路由的并发运行按顺序返回结果 | 流程依次运行节点；另有异步和并行的变体 | 管道运行循环 |
| 设计目标 | 有类型的、响应式的数据流模型 | 约 100 行的最小核心 | 用于搜索和 RAG 的完整框架 |

与 PocketFlow 的主要区别在于状态存放在哪里。在 PocketFlow 中，节点共享一个存储；在 AStack 中，每条连接携带该步骤的数据，因此组件的输入和输出在图中都是显式的。

## 软件包

| 软件包 | 内容 |
| --- | --- |
| `@astack-tech/core` | `Component`、`Pipeline`、`Port` |
| `@astack-tech/components` | `Agent`、`StreamingAgent`、`RLMAgent`、`TextSplitter`、`ToolInvoker` |
| `@astack-tech/tools` | `createTool`、工具集、组件工具、MCP 工具 |
| `@astack-tech/integrations` | 模型提供方：`Deepseek`，以及适用于任何 OpenAI 兼容接口的 `OpenAICompatible`。 |

AStack 目前处于公开测试阶段，不同测试版之间的 API 可能会变化。每个版本的变更都记录在各软件包的更新日志中。
