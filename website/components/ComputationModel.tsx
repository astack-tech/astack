'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@phosphor-icons/react';

import CopyButton from './CopyButton';
import SyntaxHighlight from './SyntaxHighlight';
import { AnimatedList } from './magicui/animated-list';
import { agentCode, componentCode, pipelineCode, streamingCode } from '@/lib/examples';
import { BlurFade } from './magicui/blur-fade';

const MODES = [
  {
    id: 'component',
    label: 'Component',
    hue: 'silver',
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
    hue: 'blue',
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
    hue: 'amber',
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
    hue: 'rose',
    title: 'Stream every step',
    description:
      'StreamingAgent runs the same loop and yields events: text deltas, tool starts, tool results and a final completion with usage.',
    code: streamingCode,
    example: 'streaming-agent',
    doc: 'streaming',
    nodes: ['Text deltas', 'Tool events', 'Completed'],
    details: ['Async generator API', 'Same events in a pipeline', 'Server-Sent Events over HTTP'],
  },
] as const;

const NODE_HUES = ['silver', 'blue', 'rose'] as const;

export default function ComputationModel() {
  const [active, setActive] = useState(0);
  const mode = MODES[active] ?? MODES[0];

  function selectByKey(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const targets: Partial<Record<string, number>> = {
      ArrowRight: (index + 1) % MODES.length,
      ArrowDown: (index + 1) % MODES.length,
      ArrowLeft: (index - 1 + MODES.length) % MODES.length,
      ArrowUp: (index - 1 + MODES.length) % MODES.length,
      Home: 0,
      End: MODES.length - 1,
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
    <section id="computation-model" className="section" aria-labelledby="model-title">
      <BlurFade className="section-head">
        <h2 id="model-title">One model. Four ways to build.</h2>
        <p>
          Components, ports and pipelines. Workflows, branching, agents and streaming are built from
          these three ideas, not from separate subsystems.
        </p>
      </BlurFade>

      <div className="board model">
        <div role="tablist" aria-label="Computation model" className="model-tabs">
          {MODES.map((m, i) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              id={`model-tab-${String(i)}`}
              className={`model-tab block hue-${m.hue}`}
              aria-selected={active === i}
              aria-controls="model-panel"
              tabIndex={active === i ? 0 : -1}
              onClick={() => {
                setActive(i);
              }}
              onKeyDown={event => {
                selectByKey(event, i);
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div
          className="model-panel"
          id="model-panel"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`model-tab-${String(active)}`}
        >
          <div className="tile model-text">
            <div>
              <h3>{mode.title}</h3>
              <p>{mode.description}</p>
            </div>
            {mode.id === 'streaming' ? (
              <AnimatedList key={mode.id} className="model-events" delay={700}>
                {mode.nodes.map((node, i) => (
                  <span key={node} className={`event block hue-${NODE_HUES[i] ?? 'rose'}`}>
                    {node}
                  </span>
                ))}
              </AnimatedList>
            ) : (
              <p className="model-nodes" aria-label={mode.nodes.join(', then ')}>
                {mode.nodes.map((node, i) => (
                  <span key={node} className={`pane hue-${NODE_HUES[i] ?? 'rose'}`}>
                    {node}
                  </span>
                ))}
              </p>
            )}
            <ul className="model-details">
              {mode.details.map(detail => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
            <div className="model-links">
              <Link className="link" href={`/docs/${mode.doc}`}>
                Read the docs <ArrowRightIcon size={14} />
              </Link>
              <Link className="link" href={`/examples/${mode.example}`}>
                Open the example <ArrowRightIcon size={14} />
              </Link>
            </div>
          </div>
          <div className="code model-code">
            <div className="code-bar">
              <span>examples/{mode.example}/index.ts</span>
              <CopyButton text={mode.code} size="sm" />
            </div>
            <SyntaxHighlight code={mode.code} />
          </div>
        </div>

        <div className="tile principle">
          <h3>Explicit connections</h3>
          <p>Every path data can take is a connect() call you can read.</p>
        </div>
        <div className="tile principle">
          <h3>Built once</h3>
          <p>Each route&apos;s topology is built on its first run and reused afterwards.</p>
        </div>
        <div className="tile principle">
          <h3>Reactive streams</h3>
          <p>Each connection is an RxJS stream. Components react as values arrive.</p>
        </div>
      </div>
    </section>
  );
}
