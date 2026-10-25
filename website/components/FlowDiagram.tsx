'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'motion/react';
import {
  ArrowRightIcon,
  BracketsCurlyIcon,
  DatabaseIcon,
  WrenchIcon,
  PlayIcon,
} from '@phosphor-icons/react';
import { AnimatedBeam } from './magicui/animated-beam';
import { BorderBeam } from './magicui/border-beam';

/** Local illustration of the component graph; no model request is sent. */
export default function FlowDiagram() {
  const container = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLDivElement>(null);
  const agent = useRef<HTMLDivElement>(null);
  const tool = useRef<HTMLDivElement>(null);
  const memory = useRef<HTMLDivElement>(null);
  const output = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [run, setRun] = useState(0);
  const beamProps = {
    containerRef: container,
    pathColor: 'var(--beam-line)',
    pathOpacity: 1,
    gradientStartColor: 'var(--beam-glow)',
    gradientStopColor: 'var(--beam-glow)',
    duration: reduced ? 0 : 2.4,
    repeat: 0,
  };
  return (
    <div className="flow-panel">
      <div className="panel-toolbar">
        <span>
          <span className="status-dot" /> research.pipeline
        </span>
        <span className="mono">01 — COMPONENT GRAPH</span>
      </div>
      <div
        className="flow-canvas"
        ref={container}
        role="img"
        aria-label="Prompt flows through the agent to a response. Tools and memory connect to the agent through separate ports."
      >
        <div className="flow-node input-node" ref={input}>
          <BracketsCurlyIcon size={22} />
          <strong>Prompt</strong>
          <span>input.in</span>
        </div>
        <div className="flow-node agent-node" ref={agent}>
          <Image src="/logo.svg" width={38} height={34} alt="" />
          <strong>Agent</strong>
          <span>extends Component</span>
          {!reduced && (
            <BorderBeam
              key={run}
              colorFrom="#aaa"
              colorTo="#fff"
              size={60}
              duration={4}
              transition={{ repeat: 0 }}
            />
          )}
        </div>
        <div className="flow-node output-node" ref={output}>
          <ArrowRightIcon size={22} />
          <strong>Response</strong>
          <span>agent.out</span>
        </div>
        <div className="flow-node tool-node" ref={tool}>
          <WrenchIcon size={20} />
          <strong>Tools</strong>
          <span>search · write</span>
        </div>
        <div className="flow-node memory-node" ref={memory}>
          <DatabaseIcon size={20} />
          <strong>Memory</strong>
          <span>context · history</span>
        </div>
        <div className="flow-beams" key={run}>
          <AnimatedBeam {...beamProps} fromRef={input} toRef={agent} />
          <AnimatedBeam {...beamProps} fromRef={agent} toRef={output} delay={1.2} />
          <AnimatedBeam {...beamProps} fromRef={tool} toRef={agent} curvature={-30} delay={0.4} />
          <AnimatedBeam {...beamProps} fromRef={memory} toRef={agent} curvature={-30} delay={0.8} />
        </div>
        <span className="flow-annotation">ONE INTERFACE. CONNECTED CAPABILITIES.</span>
      </div>
      <div className="flow-caption">
        <span>Components connected through ports.</span>
        <button type="button" onClick={() => setRun(run + 1)}>
          <PlayIcon size={12} weight="fill" />
          {run ? 'Replay flow' : 'Run preview'}
        </button>
      </div>
      <details className="flow-details">
        <summary>
          Execution preview <span>Local illustration · no API calls</span>
        </summary>
        <ol aria-live="polite">
          <li>
            <code>input.in</code> Receive research prompt
          </li>
          <li>
            <code>agent.tools</code> Connect model and tools · search → collect → write
          </li>
          <li>
            <code>agent.out</code> {run ? 'Return composed response' : 'Ready to compose'}
          </li>
        </ol>
      </details>
    </div>
  );
}
