'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRightIcon, CheckIcon } from '@phosphor-icons/react';
import SyntaxHighlight from './SyntaxHighlight';
import CopyButton from './CopyButton';
import { componentCode, pipelineCode, agentCode, streamingCode } from '@/lib/examples';

const modes = [
  {
    id: 'component',
    label: 'Component',
    title: 'A component is a unit of work',
    description:
      'Extend Component and override run(). The same class works on its own and inside a pipeline, where the runtime feeds its input port.',
    code: componentCode,
    example: 'component',
    doc: 'components',
    nodes: ['Input port', 'Component', 'Output port'],
    details: ['Standalone: run(data)', 'Reactive: _transform($i, $o)', 'Extra named ports'],
  },
  {
    id: 'pipeline',
    label: 'Pipeline',
    title: 'A pipeline is the graph',
    description:
      'Register components, connect output ports to input ports, and run. The route is built once and reused. The endpoint is inferred when the graph has one terminal component.',
    code: pipelineCode,
    example: 'pipeline',
    doc: 'pipelines',
    nodes: ['trim', 'upper', 'exclaim'],
    details: [
      'Inferred or explicit endpoint',
      'Collect several outputs at once',
      'Concurrent runs resolve in order',
    ],
  },
  {
    id: 'agent',
    label: 'Agent',
    title: 'An agent is a component',
    description:
      'Agent asks the model, runs the tools it requests, and repeats until the model answers or maxIterations is reached. It has ports like any other component.',
    code: agentCode,
    example: 'agent',
    doc: 'agents',
    nodes: ['Model decides', 'Run tools', 'Add results'],
    details: [
      'Tools from createTool()',
      'Tool errors go back to the model',
      'Usage summed per run',
    ],
  },
  {
    id: 'streaming',
    label: 'Streaming',
    title: 'Stream every step',
    description:
      'StreamingAgent runs the same loop and yields events: text deltas, tool starts, tool results and a final completion with usage.',
    code: streamingCode,
    example: 'streaming-agent',
    doc: 'streaming',
    nodes: ['Text deltas', 'Tool events', 'Completed'],
    details: ['Async generator API', 'Same events in a pipeline', 'Server-Sent Events over HTTP'],
  },
];

export default function ComputationModel() {
  const [active, setActive] = useState(0);
  const mode = modes[active] ?? modes[0];
  if (mode === undefined) {
    return null;
  }
  function selectByKey(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const targets: Partial<Record<string, number>> = {
      ArrowRight: (index + 1) % modes.length,
      ArrowLeft: (index - 1 + modes.length) % modes.length,
      Home: 0,
      End: modes.length - 1,
    };
    const next = targets[event.key];
    if (next === undefined) {
      return;
    }
    event.preventDefault();
    setActive(next);
    document.getElementById(`model-tab-${String(next)}`)?.focus();
  }
  return (
    <section id="computation-model" className="architecture-section section">
      <div className="shell">
        <div className="section-heading">
          <p className="eyebrow">THE COMPUTATION MODEL</p>
          <h2>One model. Four ways to build.</h2>
          <p>
            Components, ports and pipelines. Workflows, branching, agents and streaming are built
            from these three ideas, not from separate subsystems.
          </p>
        </div>
        <div className="architecture-workbench">
          <div role="tablist" aria-label="Computation model" className="tabs">
            {modes.map((m, i) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                id={`model-tab-${String(i)}`}
                aria-selected={active === i}
                aria-controls="model-panel"
                tabIndex={active === i ? 0 : -1}
                onClick={() => {
                  setActive(i);
                }}
                onKeyDown={e => {
                  selectByKey(e, i);
                }}
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
            aria-labelledby={`model-tab-${String(active)}`}
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
              <div className="workbench-links">
                <Link className="text-link" href={`/docs/${mode.doc}`}>
                  Read the docs <ArrowRightIcon size={14} />
                </Link>
                <Link className="text-link" href={`/examples/${mode.example}`}>
                  Open the example <ArrowRightIcon size={14} />
                </Link>
              </div>
            </div>
            <div className="code-panel">
              <div className="panel-toolbar">
                <span>examples/{mode.example}/index.ts</span>
                <CopyButton text={mode.code} size="sm" />
              </div>
              <SyntaxHighlight code={mode.code} />
            </div>
          </div>
        </div>
        <div className="principles">
          <div>
            <h3>Explicit connections</h3>
            <p>Every path data can take is a connect() call you can read.</p>
          </div>
          <div>
            <h3>Built once</h3>
            <p>Each route&apos;s topology is built on its first run and reused afterwards.</p>
          </div>
          <div>
            <h3>Reactive streams</h3>
            <p>Each connection is an RxJS stream. Components react as values arrive.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
