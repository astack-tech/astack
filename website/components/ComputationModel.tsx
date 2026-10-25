'use client';

import { useState } from 'react';
import { ArrowRightIcon, CheckIcon } from '@phosphor-icons/react';
import SyntaxHighlight from './SyntaxHighlight';
import CopyButton from './CopyButton';
import { componentCode, pipelineCode, agentCode, streamingCode } from '@/lib/examples';

const modes = [
  {
    id: 'component',
    label: 'Component',
    title: 'Monadic component base',
    description:
      'Built on HLang’s TransformNode with monadic composition laws. Clear input/output contracts keep individual transformations reusable.',
    code: componentCode,
    nodes: ['Input port', 'Component', 'Output port'],
    details: ['Operator composition', 'Standalone: run(data)', 'Reactive: _transform($i, $o)'],
  },
  {
    id: 'pipeline',
    label: 'Pipeline',
    title: 'Pipeline execution',
    description:
      'Each route builds its topology once and reuses it. Select an inferred endpoint, an explicit endpoint, or multiple outputs.',
    code: pipelineCode,
    nodes: ['Split', 'Embed', 'Store'],
    details: [
      'Workflow orchestration',
      'Auto-infer or choose an endpoint',
      'Collect multiple component outputs',
    ],
  },
  {
    id: 'agent',
    label: 'Agent',
    title: 'Agent as component',
    description:
      'Agents are components that use LLMs, composable with any other component type. Tool results return to context until the task completes or reaches maxIterations.',
    code: agentCode,
    nodes: ['LLM decides', 'Execute tool', 'Update context'],
    details: [
      'Agent-to-agent events',
      'Multi-round tool execution',
      'Memory and conversation history',
    ],
  },
  {
    id: 'streaming',
    label: 'Streaming',
    title: 'Stream agent events',
    description:
      'Observable streams underpin reactive data flow. StreamingAgent exposes iteration, model, tool, completion, and error events through an async generator.',
    code: streamingCode,
    nodes: ['Iteration', 'Tool result', 'Completion'],
    details: ['Reactive data flow', 'Typed streaming chunks', 'Incremental assistant messages'],
  },
];

export default function ComputationModel() {
  const [active, setActive] = useState(0);
  const mode = modes[active];
  function selectByKey(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % modes.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + modes.length) % modes.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = modes.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    document.getElementById(`model-tab-${next}`)?.focus();
  }
  return (
    <section id="computation-model" className="architecture-section section">
      <div className="shell">
        <div className="section-heading">
          <p className="eyebrow">THE COMPUTATION MODEL</p>
          <h2>One model. Four ways to build.</h2>
          <p>
            The computation model uses HLang&apos;s monadic composition rules. Use the same
            components for workflows, reactive streams, and agent communication.
          </p>
        </div>
        <div className="architecture-workbench">
          <div role="tablist" aria-label="Computation model" className="tabs">
            {modes.map((m, i) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                id={`model-tab-${i}`}
                aria-selected={active === i}
                aria-controls="model-panel"
                tabIndex={active === i ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={e => selectByKey(e, i)}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div
            className="workbench-body"
            id="model-panel"
            role="tabpanel"
            tabIndex={0}
            aria-labelledby={`model-tab-${active}`}
          >
            <div className="workbench-description">
              <h3>{mode.title}</h3>
              <p>{mode.description}</p>
              <div className="mini-flow">
                {mode.nodes.map((node, i) => (
                  <span key={node}>
                    <b>{node}</b>
                    {i < 2 && <ArrowRightIcon size={16} />}
                  </span>
                ))}
              </div>
              <ul>
                {mode.details.map(detail => (
                  <li key={detail}>
                    <CheckIcon size={15} />
                    {detail}
                  </li>
                ))}
              </ul>
              <a
                className="text-link"
                href={`https://deepwiki.com/astack-tech/astack/${mode.id === 'agent' || mode.id === 'streaming' ? '3-agent-system' : '2-core-architecture'}`}
              >
                Read the technical guide <ArrowRightIcon size={14} />
              </a>
            </div>
            <div className="code-panel">
              <div className="panel-toolbar">
                <span>{mode.id}.ts</span>
                <CopyButton text={mode.code} size="sm" />
              </div>
              <SyntaxHighlight code={mode.code} />
            </div>
          </div>
        </div>
        <div className="principles">
          <div>
            <h3>Monadic laws</h3>
            <p>HLang defines the monadic composition laws that AStack components use.</p>
          </div>
          <div>
            <h3>Direct connections</h3>
            <p>Port-to-port data flow without intermediate adaptation layers.</p>
          </div>
          <div>
            <h3>Reactive streams</h3>
            <p>
              Observable-based processing with backpressure and flow-control patterns for real-time
              applications.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
