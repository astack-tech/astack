<div align="center">

<img src="./assets/logo.svg" alt="AStack Logo" width="256" height="256">

# AStack

**A modular component framework for building AI applications**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/qddegtya/astack/pulls)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/qddegtya/astack)

🚧 **Work in Progress** 🚧

*AStack is under active development but already provides significant value for building AI applications*

English | [简体中文](./README.zh-CN.md)

</div>

## 📋 Overview

AStack is a modular component framework designed to simplify the development of AI applications through a "everything is a component" philosophy. It provides a zero-adaptation layer design that enables seamless integration between various AI models, tools, and custom business logic.

AStack is an independent technical framework with its own architecture and ecosystem, while being inspired by and technically compatible with [Hlang](https://github.com/hlang-tech) - the revolutionary high-level AI programming language. The framework emphasizes minimalism and performance, allowing developers to create complex systems with minimal boilerplate code while maintaining complete technical autonomy.

### Key Features

- **Component-Based Architecture**: Build complex AI systems by composing simple, reusable components
- **Zero-Adaptation Layer Design**: Components work together without intermediate adaptation layers
- **Pipeline Execution Model**: Support for both independent and pipeline execution modes
- **Extensible Tool System**: Easily integrate new capabilities through a unified tool interface
- **Multi-Model Support**: Seamless integration with various LLM providers
- **Declarative Workflow**: Define complex AI workflows with minimal code
- **Minimalist API Design**: Focus on simplicity and expressiveness

## 👁 Design Philosophy

AStack is built on several core philosophical principles that guide its development:

### Everything is a Component

In AStack, everything from a simple tool to a complex agent is represented as a component. This unified approach simplifies development and promotes code reuse. Components can be composed, extended, and reconfigured to suit various use cases.

### Zero-Adaptation Layer Design

Unlike many frameworks that require adapters or middleware between components, AStack adopts a zero-adaptation layer design. Components can directly interact with each other without intermediate transformation layers, reducing complexity and improving performance.

### Minimalism Over Complexity

AStack prioritizes simple, intuitive APIs over complex abstractions. This minimalist approach leads to more maintainable code and a gentler learning curve.

## 🎯 Use Cases

AStack is particularly well-suited for:

- **AI Agents**: Build autonomous agents that can reason, plan, and execute tasks using tools
- **Content Generation**: Create pipelines for researching, analyzing, and generating high-quality content
- **Data Processing**: Construct workflows for extracting, transforming, and analyzing data
- **Multi-modal Applications**: Develop applications that combine text, images, and other modalities
- **Research Platforms**: Build experimental platforms for AI research and development

## 👏 Inspiration & Comparison

AStack draws inspiration from several outstanding projects in the AI ecosystem, particularly [Haystack](https://github.com/deepset-ai/haystack) by deepset-ai. We express our gratitude to these projects for their pioneering work and contributions to the open-source community.

> **Important Note**: AStack is a 100% original framework with its own independent technical implementation, architecture, and design. It is built in TypeScript and only shares API style inspiration with Haystack (which is implemented in Python). AStack is not a fork or derivative of Haystack.

### AStack vs. Haystack: Feature Comparison

> This comparison is based on Haystack v2.0 (as of May 2025). Both frameworks continue to evolve, and specific features may change over time.

| Feature | AStack | Haystack |
|---------|--------|----------|
| **Core Design** | Everything is a component | Pipeline with nodes |
| **Adaptation Layer** | Zero-adaptation layer design | Component connections often require adapters |
| **Primary Focus** | General AI application framework | Primarily NLP and RAG applications |
| **Component Interface** | Unified component interface | Different interfaces based on component types |
| **Agent Support** | Multi-round tool execution with minimal overhead | Agent framework with LangGraph integration |
| **Memory Management** | Built-in memory abstractions | Memory implemented through specialized components |
| **Execution Modes** | Both independent and pipeline execution | Both pipeline and component-level execution |
| **Tool Integration** | Standardized tool interface | Various integration patterns depending on use case |
| **Model Integration** | Direct model provider integration | Provider-specific adapters |
| **Learning Curve** | Minimalist API focused on simplicity | Comprehensive but more complex API |
| **Customization** | High flexibility with minimal boilerplate | Flexible but requires more implementation code |
| **Implementation** | **TypeScript** | **Python** |
| **Chinese Support** | **Complete Chinese documentation** | **Limited Chinese documentation** |

Each framework has its strengths and is optimized for different use cases. Haystack excels in RAG applications and document processing with a mature Python ecosystem, while AStack is designed for TypeScript/JavaScript environments with an emphasis on component reusability and minimalist design principles. AStack also offers full Chinese language documentation, making it particularly accessible to Chinese-speaking developers.

## 🔍 Architecture

```mermaid
flowchart TB
    subgraph "AStack Framework"
        Core["Core Module"]
        Components["Components"]
        Pipeline["Pipeline"]
        Tools["Tools"]
        Integrations["Integrations"]
        ModelProviders["Model Providers"]
        
        Core-->|provides|Components
        Core-->|provides|Pipeline
        Components-->|use|Tools
        Components-->|use|Integrations
        Integrations-->|include|ModelProviders
    end

    subgraph "Applications"
        ExampleApps["Example Applications"]
    end

    ExampleApps-->|use|Core
    ExampleApps-->|use|Components
    ExampleApps-->|use|Pipeline

    style Core fill:#e1f5fe,stroke:#0277bd,stroke-width:1px
    style Components,Pipeline,Tools fill:#f5f5f5,stroke:#333,stroke-width:1px
    style Integrations,ModelProviders fill:#f5f5f5,stroke:#333,stroke-width:1px
    style ExampleApps fill:#fff8e1,stroke:#ff8f00,stroke-width:1px
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/qddegtya/astack.git
cd astack

# Install dependencies
pnpm install

# Build the packages
pnpm run build
```

### Examples Directory

AStack includes several examples in the `examples/` directory to demonstrate its capabilities. Each example contains its own README with specific instructions on how to run it with your own API keys and configuration.

## 📚 Examples

### Agent with Tools

This example demonstrates how to create an Agent that can use tools to perform real-world tasks like file operations. It showcases the zero-adaptation layer design principle where components work together without intermediate layers.

```mermaid
sequenceDiagram
    actor User as User
    participant Agent
    participant ModelProvider as "Model Provider"
    participant Tools
    
    User->>Agent: "Read file and write with timestamps"
    Agent->>ModelProvider: Send user request
    Note over ModelProvider: Multi-round tool execution<br/>without adaptation layers
    ModelProvider->>Agent: Request tool execution (readFile)
    Agent->>Tools: Execute readFile tool
    Tools->>Agent: Return file contents
    Agent->>ModelProvider: Send tool results
    ModelProvider->>Agent: Request tool execution (writeFile)
    Agent->>Tools: Execute writeFile tool
    Tools->>Agent: Confirm file written
    Agent->>ModelProvider: Send tool results
    ModelProvider->>Agent: Generate final response
    Agent->>User: Return final answer
```

This example highlights AStack's ability to handle multi-round tool execution, where the agent can process multiple tool calls within a single conversation, maintaining context throughout the interaction.

### Research Pipeline

This example demonstrates a sophisticated research pipeline that automatically searches for information, analyzes content, and generates comprehensive research reports using AI. It showcases AStack's ability to coordinate complex workflows across multiple components.

```mermaid
flowchart TB
    %% Main components
    Gateway["Gateway Component"]
    WebDriver["Web Driver"]
    DataRelay["Data Relay"]
    ContentAnalyzer["Content Analyzer"]
    ReportEnhancer["Report Enhancer"]
    LLM["LLM Model Provider"]
    Output(("Final Report"))
    
    %% Gateway connections
    Gateway -->|topicOut| ContentAnalyzer
    Gateway -->|searchQueryOut| WebDriver
    ContentAnalyzer -->|ready| Gateway
    ReportEnhancer -->|enhancedReport| Gateway
    
    %% WebDriver connections
    WebDriver -->|searchResults| DataRelay
    DataRelay -->|dataOut| ContentAnalyzer
    ContentAnalyzer -->|relevantUrls| WebDriver
    WebDriver -->|pageContent| ContentAnalyzer
    
    %% Content processing
    ContentAnalyzer -->|report| ReportEnhancer
    ReportEnhancer -->|promptMessages| LLM
    LLM -->|message| ReportEnhancer
    
    %% Output
    Gateway -->|"Research Report<br/>(HTML + JSON)"| Output
    
    %% Styling with standard colors
    style Gateway fill:#e1f5fe,stroke:#0277bd,stroke-width:1px
    style WebDriver fill:#e1f5fe,stroke:#0277bd,stroke-width:1px
    style DataRelay fill:#e1f5fe,stroke:#0277bd,stroke-width:1px
    style ContentAnalyzer fill:#e1f5fe,stroke:#0277bd,stroke-width:1px
    style ReportEnhancer fill:#e1f5fe,stroke:#0277bd,stroke-width:1px
    style LLM fill:#e1f5fe,stroke:#0277bd,stroke-width:1px
    style Output fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
```

The pipeline intelligently coordinates web searches, content extraction, and AI-powered analysis to produce in-depth research reports on any topic, complete with proper citations and structured sections.

## 💻 Code Examples

### Creating a Simple Agent with Tools

```typescript
import { Agent } from '@astack/components';
import { createTool } from '@astack/tools';
import { Deepseek } from '@astack/integrations/model-provider';

// Define tools
const readFileTool = createTool(
  'readFile',
  'Read file contents',
  async ({ filePath }) => {
    // Implementation details
    return fileContents;
  }
);

// Create model provider
const model = new Deepseek({
  apiKey: process.env.DEEPSEEK_API_KEY,
  model: 'deepseek-chat'
});

// Create Agent
const agent = new Agent({
  model,
  tools: [readFileTool],
  systemPrompt: 'You are a helpful assistant that can read files.'
});

// Run the agent
const result = await agent.run('Please read the README.md file');
```

### Building a Pipeline

```typescript
import { Pipeline } from '@astack/core';
import { Agent } from '@astack/components';

// Create pipeline
const pipeline = new Pipeline();

// Add components
pipeline.addComponent('agent', agent);
pipeline.addComponent('resultHandler', new ResultHandler());

// Connect components
pipeline.connect('agent.out', 'resultHandler.in');

// Run pipeline
await pipeline.run('agent.in', 'Please analyze this data');
```

## 🔄 Hlang Compatibility

While AStack is a technically independent framework, it offers seamless compatibility with [Hlang](https://github.com/hlang-tech) - a framework inspired by Flow-Based Programming (FBP) paradigm with features particularly well-suited for AI application development. This technical compatibility offers unique advantages:

### Hlang's Distinctive Features

[Hlang](https://github.com/hlang-tech) offers several distinctive concepts that are valuable for modern software development, especially for AI applications:

- **Declarative Programming Approach**: Express complex behaviors in a fraction of the code required by traditional methods
- **Human-Centric Design**: Intuitive syntax that reduces the learning curve for developers
- **Component-Based Architecture**: Built around modular components that can be assembled into complex systems
- **Type Safety with Flexibility**: Strong typing system that also accommodates the dynamic nature of modern applications

### Technical Integration

AStack maintains complete technical autonomy while offering compatibility with Hlang:

- **Compatible Component Models**: AStack's component approach is structurally compatible with Hlang's flow-based programming model
- **Independent Development**: AStack can be used independently or in conjunction with Hlang's capabilities
- **Complementary Strengths**: Combine AStack's fine-grained component control with Hlang's higher-level abstractions
- **Efficient Execution**: AStack's zero-adaptation layer design enables efficient implementation of workflows defined in either framework

This technical compatibility creates a practical synergy for developers leveraging both frameworks' strengths while maintaining the independence of each system.

## 📦 Packages

AStack is organized into several packages:

- **@astack/core**: Core functionality and pipeline execution engine
- **@astack/components**: Reusable AI components like Agents and Memories
- **@astack/tools**: Tool definitions and implementations
- **@astack/integrations**: Integrations with external services and model providers

## 📖 Documentation

[Documentation coming soon]

For now, please refer to the examples and source code for understanding how to use AStack.

## 🛠️ Development

### Project Structure

```
astack/
├── packages/
│   ├── core/             # Core framework functionality
│   ├── components/       # Reusable components
│   ├── tools/            # Tool implementations
│   └── integrations/     # External integrations
├── examples/             # Example applications
└── docs/                 # Documentation
```

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📃 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- Thanks to all contributors who have helped shape AStack
- Inspired by modern AI application architectures and component-based design principles

---

<div align="center">

**AStack** - Building the future of AI applications, one component at a time.

</div>
