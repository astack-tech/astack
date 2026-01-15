'use client';

/**
 * ComputationModel Component
 *
 * Visual explanation of AStack's computation model based on HLang's TransformNode.
 * Shows the real architecture:
 * - Port-based composition (Port.I, Port.O)
 * - Dual execution modes (run vs _transform)
 * - Agent tool loop iteration
 * - Zero adaptation layer
 */

import { useState } from 'react';
import SyntaxHighlight from './SyntaxHighlight';

export default function ComputationModel() {
  const [activeTab, setActiveTab] = useState(0);

  const modes = [
    {
      id: 'component',
      label: 'Component',
      title: 'Monadic Component Base',
      description: "Built on HLang's TransformNode with monadic composition laws",
      visual: <ComponentVisual />,
      code: `// Every component extends TransformNode
class MyComponent extends Component {
  // Type-safe input/output ports
  inPort = Port.I('in');
  outPort = Port.O('out');

  // Dual execution modes:
  // 1. Independent execution
  async run(data) {
    return this.process(data);
  }

  // 2. Reactive pipeline execution
  _transform($i, $o) {
    $i(this.inPort, async (data) => {
      const result = await this.process(data);
      $o(this.outPort, result);
    });
  }
}`,
    },
    {
      id: 'pipeline',
      label: 'Pipeline',
      title: 'Direct Port Connections',
      description: 'Components connect via ports without adaptation layers or serialization',
      visual: <PipelineVisual />,
      code: `// Components connect directly via ports
const pipeline = new Pipeline();

pipeline.addComponent('splitter', new TextSplitter());
pipeline.addComponent('embedder', new Embedder());
pipeline.addComponent('store', new VectorStore());

// Direct port-to-port connections
// No adapters, no serialization, no protocol translation
pipeline.connect('splitter.out', 'embedder.in');
pipeline.connect('embedder.out', 'store.in');

// Execute the pipeline
const result = await pipeline.run('splitter.in', document);`,
    },
    {
      id: 'agent',
      label: 'Agent',
      title: 'Agent as Component',
      description: 'Agents are components that use LLMs - composable with any other component type',
      visual: <AgentVisual />,
      code: `// Agent is just another component type
const agent = new Agent({
  model: new Deepseek({ model: "deepseek-chat" }),
  tools: [searchTool, writeTool],
  maxIterations: 10,
});

// Multi-round execution loop:
// 1. LLM decides which tool to call
// 2. Execute tool, add result to context
// 3. LLM processes result, decides next action
// 4. Repeat until complete or max iterations

const result = await agent.run("Research and write about AI");

// Or use in a pipeline like any other component
pipeline.addComponent('agent', agent);
pipeline.connect('input.out', 'agent.in');`,
    },
  ];

  return (
    <section id="computation-model" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div
          className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-[#00F0FF]/5 rounded-full"
          style={{ filter: 'blur(200px)' }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Computation </span>
            <span className="gradient-text">Model</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Built on{' '}
            <a
              href="https://github.com/hlang-tech/hlang"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00F0FF] hover:underline font-medium"
            >
              HLang
            </a>
            &apos;s monadic paradigm - the foundation for all agent patterns
          </p>
        </div>

        {/* Main visualization card */}
        <div className="w-full mx-auto">
          <div className="glass rounded-2xl overflow-hidden">
            {/* Tab navigation */}
            <div className="flex border-b border-white/10">
              {modes.map((mode, index) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setActiveTab(index)}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-300 ${
                    activeTab === index
                      ? 'text-[#00F0FF] bg-[#00F0FF]/5 border-b-2 border-[#00F0FF]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 md:p-8">
              {/* Left: Visual */}
              <div className="w-full">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {modes[activeTab].title}
                </h3>
                <p className="text-sm md:text-base text-gray-400 mb-6">
                  {modes[activeTab].description}
                </p>

                {/* Visual diagram */}
                <div className="min-h-[250px] md:min-h-[300px] flex items-center justify-center bg-black/30 rounded-xl p-4 md:p-6 overflow-x-auto overflow-y-visible">
                  {modes[activeTab].visual}
                </div>
              </div>

              {/* Right: Code */}
              <div className="w-full">
                <div className="rounded-xl bg-black/50 border border-white/10 overflow-hidden h-full">
                  <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-mono">
                      {modes[activeTab].id}.ts
                    </span>
                  </div>
                  <div className="p-4 overflow-auto max-h-[350px] md:max-h-[400px]">
                    <SyntaxHighlight code={modes[activeTab].code} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core principles */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full mx-auto">
          <div className="text-center p-6 glass rounded-xl relative overflow-hidden group hover:bg-white/5 hover:border-[#00F0FF]/30 transition-all duration-300">
            {/* Hover glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/5 via-transparent to-transparent" />
              <div
                className="absolute -top-24 -right-24 w-48 h-48 bg-[#00F0FF]/10 rounded-full"
                style={{ filter: 'blur(100px)' }}
              />
            </div>

            <div className="relative z-10">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all">
                <svg
                  className="w-6 h-6 text-[#00F0FF]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    style={{
                      strokeDasharray: '60',
                      animation: 'dashFlow 3s linear infinite',
                    }}
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-white mb-2 group-hover:text-[#00F0FF] transition-colors">
                Monadic Laws
              </h4>
              <p className="text-sm text-gray-400">
                Composition follows mathematical laws ensuring predictable behavior
              </p>
            </div>
          </div>

          <div className="text-center p-6 glass rounded-xl relative overflow-hidden group hover:bg-white/5 hover:border-[#00F0FF]/30 transition-all duration-300">
            {/* Hover glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/5 via-transparent to-transparent" />
              <div
                className="absolute -top-24 -right-24 w-48 h-48 bg-[#00F0FF]/10 rounded-full"
                style={{ filter: 'blur(100px)' }}
              />
            </div>

            <div className="relative z-10">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all">
                <svg
                  className="w-6 h-6 text-[#00F0FF]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <g style={{ animation: 'electricPulse 1.5s ease-in-out infinite' }}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </g>
                </svg>
              </div>
              <h4 className="font-semibold text-white mb-2 group-hover:text-[#00F0FF] transition-colors">
                Direct Connections
              </h4>
              <p className="text-sm text-gray-400">
                Port-to-port data flow without intermediate layers
              </p>
            </div>
          </div>

          <div className="text-center p-6 glass rounded-xl relative overflow-hidden group hover:bg-white/5 hover:border-[#00F0FF]/30 transition-all duration-300">
            {/* Hover glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/5 via-transparent to-transparent" />
              <div
                className="absolute -top-24 -right-24 w-48 h-48 bg-[#00F0FF]/10 rounded-full"
                style={{ filter: 'blur(100px)' }}
              />
            </div>

            <div className="relative z-10">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all">
                <svg
                  className="w-6 h-6 text-[#00F0FF]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    style={{
                      animation: 'rotatePulse 4s ease-in-out infinite',
                    }}
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-white mb-2 group-hover:text-[#00F0FF] transition-colors">
                Reactive Streams
              </h4>
              <p className="text-sm text-gray-400">
                Built-in backpressure and flow control for real-time processing
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Component architecture visualization
 */
function ComponentVisual() {
  return (
    <div className="w-full px-2">
      {/* Component box with ports - using grid layout to reserve space for labels */}
      <div
        className="grid grid-cols-[auto_1fr_auto] items-center gap-2 md:gap-3 mx-auto"
        style={{ maxWidth: '400px' }}
      >
        {/* Left port label */}
        <div className="text-right whitespace-nowrap">
          <div className="flex items-center gap-1 md:gap-2 justify-end">
            <span className="text-gray-400 text-[10px] md:text-xs font-mono">data</span>
            <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
          </div>
          <code className="text-[9px] md:text-[10px] text-[#00F0FF] font-mono whitespace-nowrap block">
            Port.I(&apos;in&apos;)
          </code>
        </div>

        {/* Main component */}
        <div className="relative">
          <div
            className="relative w-full h-32 rounded-xl border-2 flex flex-col items-center justify-center text-center"
            style={{
              animation: 'componentHighlight 3s ease-in-out infinite',
              borderColor: 'rgba(0, 240, 255, 0.5)',
              background: 'rgba(0, 240, 255, 0.2)',
            }}
          >
            <span className="text-[#00F0FF] font-bold text-base md:text-lg mb-1">Component</span>
            <span className="text-gray-400 text-xs">extends TransformNode</span>

            {/* Input port (left side) */}
            <div
              className="absolute top-1/2"
              style={{ left: 0, transform: 'translate(-50%, -50%)' }}
            >
              <div className="w-4 h-4 rounded-full bg-[#00F0FF] border-2 border-black animate-pulse" />
            </div>

            {/* Output port (right side) */}
            <div
              className="absolute top-1/2"
              style={{ right: 0, transform: 'translate(50%, -50%)' }}
            >
              <div
                className="w-4 h-4 rounded-full bg-[#00F0FF] border-2 border-black animate-pulse"
                style={{ animationDelay: '0.5s' }}
              />
            </div>

            {/* Data flow visualization - particle moving from left to right */}
            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
              <div
                className="absolute top-1/2 w-2 h-2 rounded-full bg-[#00F0FF]"
                style={{
                  animation: 'dataFlowHorizontal 3s ease-in-out infinite',
                  transform: 'translateY(-50%)',
                  boxShadow: '0 0 8px rgba(0, 240, 255, 0.8)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Right port label */}
        <div className="text-left whitespace-nowrap">
          <div className="flex items-center gap-1 md:gap-2">
            <div
              className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse"
              style={{ animationDelay: '0.5s' }}
            />
            <span className="text-gray-400 text-[10px] md:text-xs font-mono">result</span>
          </div>
          <code className="text-[9px] md:text-[10px] text-[#00F0FF] font-mono whitespace-nowrap block">
            Port.O(&apos;out&apos;)
          </code>
        </div>
      </div>

      {/* Dual mode indicator */}
      <div className="mt-12 md:mt-16 flex justify-center gap-4 md:gap-8">
        <div className="text-center">
          <div className="px-2 md:px-3 py-1 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 mb-1 hover:bg-[#00F0FF]/20 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all duration-300">
            <code className="text-[10px] md:text-xs text-[#00F0FF] font-mono">run(data)</code>
          </div>
          <span className="text-[9px] md:text-[10px] text-gray-500">Standalone</span>
        </div>
        <div className="text-center">
          <div className="px-2 md:px-3 py-1 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 mb-1 hover:bg-[#00F0FF]/20 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all duration-300">
            <code className="text-[10px] md:text-xs text-[#00F0FF] font-mono">
              _transform($i, $o)
            </code>
          </div>
          <span className="text-[9px] md:text-[10px] text-gray-500">Pipeline</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Pipeline composition visualization
 */
function PipelineVisual() {
  return (
    <div className="w-full space-y-6 md:space-y-8 px-2">
      {/* Pipeline flow */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        {/* Component 1 */}
        <div className="flex flex-col items-center">
          <div
            className="w-20 h-20 rounded-xl bg-[#00F0FF]/20 border-2 border-[#00F0FF]/50 flex items-center justify-center"
            style={{ animation: 'componentPulse 6s ease-in-out infinite' }}
          >
            <span className="text-[#00F0FF] text-sm font-bold">Split</span>
          </div>
          <code className="text-[9px] text-gray-500 font-mono mt-1">.out</code>
        </div>

        {/* Connection arrow with flow */}
        <div className="flex md:flex-1 items-center justify-center relative">
          <div className="flex flex-col md:flex-row items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
            <div className="relative w-0.5 h-10 md:w-20 md:h-0.5 bg-[#00F0FF]/30">
              <div
                className="absolute w-1.5 h-1.5 rounded-full bg-[#00F0FF] md:animate-[dataFlowHorizontal_6s_ease-in-out_infinite] animate-[dataFlowVertical_6s_ease-in-out_infinite]"
                style={{
                  animationDelay: '1s',
                  boxShadow: '0 0 8px rgba(0, 240, 255, 0.8)',
                  left: '-2px',
                  top: '-2px',
                }}
              />
            </div>
            <svg
              className="w-4 h-4 text-[#00F0FF] rotate-90 md:rotate-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Component 2 */}
        <div className="flex flex-col items-center">
          <div
            className="w-20 h-20 rounded-xl bg-[#00F0FF]/20 border-2 border-[#00F0FF]/50 flex items-center justify-center"
            style={{ animation: 'componentPulse 6s ease-in-out infinite', animationDelay: '2s' }}
          >
            <span className="text-[#00F0FF] text-sm font-bold">Embed</span>
          </div>
          <code className="text-[9px] text-gray-500 font-mono mt-1">.in → .out</code>
        </div>

        {/* Connection arrow with flow */}
        <div className="flex md:flex-1 items-center justify-center">
          <div className="flex flex-col md:flex-row items-center gap-1">
            <div
              className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse"
              style={{ animationDelay: '0.3s' }}
            />
            <div className="relative w-0.5 h-10 md:w-20 md:h-0.5 bg-[#00F0FF]/30">
              <div
                className="absolute w-1.5 h-1.5 rounded-full bg-[#00F0FF] md:animate-[dataFlowHorizontal_6s_ease-in-out_infinite] animate-[dataFlowVertical_6s_ease-in-out_infinite]"
                style={{
                  animationDelay: '3s',
                  boxShadow: '0 0 8px rgba(0, 240, 255, 0.8)',
                  left: '-2px',
                  top: '-2px',
                }}
              />
            </div>
            <svg
              className="w-4 h-4 text-[#00F0FF] rotate-90 md:rotate-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Component 3 */}
        <div className="flex flex-col items-center">
          <div
            className="w-20 h-20 rounded-xl bg-[#00F0FF]/20 border-2 border-[#00F0FF]/50 flex items-center justify-center"
            style={{ animation: 'componentPulse 6s ease-in-out infinite', animationDelay: '4s' }}
          >
            <span className="text-[#00F0FF] text-sm font-bold">Store</span>
          </div>
          <code className="text-[9px] text-gray-500 font-mono mt-1">.in</code>
        </div>
      </div>

      {/* Connection code */}
      <div className="text-center">
        <div className="inline-block px-3 md:px-4 py-2 rounded-lg bg-black/50 border border-[#00F0FF]/20">
          <code className="text-[10px] md:text-xs text-gray-400 font-mono break-all">
            pipeline.connect(<span className="text-green-400">&apos;split.out&apos;</span>,{' '}
            <span className="text-green-400">&apos;embed.in&apos;</span>)<br />
            pipeline.connect(<span className="text-green-400">&apos;embed.out&apos;</span>,{' '}
            <span className="text-green-400">&apos;store.in&apos;</span>)
          </code>
        </div>
      </div>
    </div>
  );
}

/**
 * Agent tool loop visualization
 */
function AgentVisual() {
  return (
    <div className="w-full max-w-md mx-auto px-2">
      {/* Iteration loop */}
      <div className="relative">
        {/* Loop container with animated dashed border */}
        <div className="relative rounded-2xl p-4 md:p-6">
          {/* Animated SVG border */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ overflow: 'visible' }}
          >
            <rect
              x="1"
              y="1"
              width="calc(100% - 2px)"
              height="calc(100% - 2px)"
              rx="16"
              fill="none"
              stroke="rgba(0, 240, 255, 0.3)"
              strokeWidth="2"
              strokeDasharray="8 8"
              style={{
                animation: 'dashRotate 20s linear infinite',
              }}
            />
          </svg>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
              <span className="text-[10px] md:text-xs text-gray-500 font-mono">
                while (iteration &lt; maxIterations)
              </span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
                <span className="text-xs text-[#00F0FF]">Iterating...</span>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3 md:space-y-4">
              {/* Step 1: LLM Decision */}
              <div className="flex items-start gap-3 md:gap-4">
                <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#00F0FF]/20 border border-[#00F0FF] flex items-center justify-center text-[#00F0FF] text-xs md:text-sm font-bold">
                  1
                </div>
                <div className="flex-1 p-2 md:p-3 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30">
                  <div className="text-xs md:text-sm text-white font-medium mb-1">LLM Decides</div>
                  <code className="text-[10px] md:text-xs text-gray-400 font-mono break-all">
                    model.chatCompletion(messages, tools)
                  </code>
                </div>
              </div>

              {/* Arrow down */}
              <div className="flex justify-center">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-[#00F0FF]/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{
                    animation: 'arrowFloat 2s ease-in-out infinite',
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>

              {/* Step 2: Tool Execution */}
              <div className="flex items-start gap-3 md:gap-4">
                <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#00F0FF]/20 border border-[#00F0FF] flex items-center justify-center text-[#00F0FF] text-xs md:text-sm font-bold">
                  2
                </div>
                <div className="flex-1 p-2 md:p-3 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30">
                  <div className="text-xs md:text-sm text-white font-medium mb-1">Execute Tool</div>
                  <code className="text-[10px] md:text-xs text-gray-400 font-mono break-all">
                    tool.invoke(args) → result
                  </code>
                </div>
              </div>

              {/* Arrow down */}
              <div className="flex justify-center">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-[#00F0FF]/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{
                    animation: 'arrowFloat 2s ease-in-out infinite',
                    animationDelay: '0.3s',
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>

              {/* Step 3: Context Update */}
              <div className="flex items-start gap-3 md:gap-4">
                <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#00F0FF]/20 border border-[#00F0FF] flex items-center justify-center text-[#00F0FF] text-xs md:text-sm font-bold">
                  3
                </div>
                <div className="flex-1 p-2 md:p-3 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30">
                  <div className="text-xs md:text-sm text-white font-medium mb-1">
                    Add to Context
                  </div>
                  <code className="text-[10px] md:text-xs text-gray-400 font-mono break-all">
                    messages.push(toolResult)
                  </code>
                </div>
              </div>
            </div>

            {/* Loop back arrow */}
            <div className="mt-3 md:mt-4 flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4 md:w-5 md:h-5 text-[#00F0FF]/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{
                  animation: 'loopRotate 4s linear infinite',
                  transformOrigin: 'center center',
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="text-[10px] md:text-xs text-gray-500">Repeat until complete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
