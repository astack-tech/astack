'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { PlusIcon, XIcon } from '@phosphor-icons/react';

import CopyButton from '@/components/CopyButton';
import SyntaxHighlight from '@/components/SyntaxHighlight';
import {
  BLOCKS,
  DEFAULT_STACK,
  MAX_STACK,
  findBlock,
  stackCode,
  stackNames,
} from '@/lib/blocks';
import type { BlockSpec } from '@/lib/blocks';
import { CORE_VERSION } from '@/lib/site';

interface StackItem {
  key: number;
  id: string;
}

interface RunResult {
  /** Output of each block, in stack order. */
  values: string[];
  output: string;
}

/** Runs the stack as a real AStack pipeline in the browser. */
async function runStack(specs: readonly BlockSpec[], input: string): Promise<RunResult> {
  if (specs.length === 0) {
    return { values: [], output: input };
  }
  const { Component, Pipeline } = await import('@astack-tech/core');
  const values: string[] = [];

  class Block extends Component {
    constructor(
      private readonly spec: BlockSpec,
      private readonly index: number
    ) {
      super({});
    }

    override run(text: unknown): string {
      const value = this.spec.transform(String(text));
      values[this.index] = value;
      return value;
    }
  }

  const names = stackNames(specs.map(spec => spec.id));
  const pipeline = new Pipeline();
  specs.forEach((spec, index) => {
    pipeline.addComponent(names[index] ?? spec.id, new Block(spec, index));
  });
  names.slice(1).forEach((name, index) => {
    pipeline.connect(`${names[index] ?? ''}.out`, `${name}.in`);
  });
  const output = await pipeline.run<string>(`${names[0] ?? ''}.in`, input);
  return { values, output };
}

let nextKey = 0;
const initialStack = (): StackItem[] => DEFAULT_STACK.map(id => ({ key: nextKey++, id }));

/**
 * The homepage's live thing: stack component blocks and watch a value stream
 * through them. Each block is a component, each overlap is a port connection.
 */
export default function LiveStack() {
  const [stack, setStack] = useState<StackItem[]>(initialStack);
  const [input, setInput] = useState('  hello, astack  ');
  const [result, setResult] = useState<RunResult | null>(null);
  const [revealed, setRevealed] = useState(0);
  const [view, setView] = useState<'stack' | 'code'>('stack');
  const [error, setError] = useState<string | null>(null);
  const reduced = useReducedMotion() === true;
  const inputId = useId();

  const specs = useMemo(
    () => stack.map(item => findBlock(item.id)).filter((s): s is BlockSpec => s !== undefined),
    [stack]
  );
  const names = useMemo(() => stackNames(stack.map(item => item.id)), [stack]);
  const code = useMemo(
    () =>
      stackCode(
        stack.map(item => item.id),
        input
      ),
    [stack, input]
  );

  useEffect(() => {
    let cancelled = false;
    runStack(specs, input)
      .then(next => {
        if (!cancelled) {
          setError(null);
          setResult(next);
          setRevealed(0);
        }
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setError(reason instanceof Error ? reason.message : String(reason));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [specs, input]);

  // Values arrive one block after another, the way they travel along the connections.
  useEffect(() => {
    if (!result) {
      return;
    }
    if (reduced || revealed > result.values.length) {
      return;
    }
    const timer = setTimeout(
      () => {
        setRevealed(revealed + 1);
      },
      revealed === 0 ? 120 : 260
    );
    return () => {
      clearTimeout(timer);
    };
  }, [result, revealed, reduced]);

  const full = stack.length >= MAX_STACK;
  // With reduced motion every value appears at once.
  const shownCount = reduced ? Number.POSITIVE_INFINITY : revealed;
  const done = result !== null && shownCount > result.values.length;

  return (
    <div className="live" data-ui>
      <div className="live-bar">
        <div className="live-views" role="group" aria-label="View">
          <button
            type="button"
            aria-pressed={view === 'stack'}
            onClick={() => {
              setView('stack');
            }}
          >
            Stack
          </button>
          <button
            type="button"
            aria-pressed={view === 'code'}
            onClick={() => {
              setView('code');
            }}
          >
            Code
          </button>
        </div>
        <span className="live-status">
          <span className={`live-dot ${done ? 'is-idle' : 'is-busy'}`} aria-hidden="true" />
          @astack-tech/core {CORE_VERSION} running in your browser
        </span>
      </div>

      {view === 'stack' ? (
        <div className="live-body">
          <label className="live-input" htmlFor={inputId}>
            <span>Input</span>
            <input
              id={inputId}
              value={input}
              maxLength={40}
              spellCheck={false}
              onChange={event => {
                setInput(event.target.value);
              }}
            />
          </label>

          <ol className="stack" aria-label="Pipeline, top to bottom">
            <AnimatePresence initial={!reduced} mode="popLayout">
              {stack.map((item, index) => {
                const spec = specs[index];
                if (spec === undefined) {
                  return null;
                }
                const value = result?.values[index];
                const shown = shownCount > index;
                return (
                  <motion.li
                    key={item.key}
                    layout={!reduced}
                    className={`stack-block hue-${spec.hue} ${shown ? 'is-lit' : ''}`}
                    initial={reduced ? false : { y: -72, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={reduced ? { opacity: 0 } : { x: 48, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 520, damping: 34, mass: 0.7 }}
                  >
                    <span className="block-name">
                      {names[index]}
                      <small>{spec.className}</small>
                    </span>
                    <output className="block-value" aria-live="off">
                      {shown && value !== undefined ? JSON.stringify(value) : ''}
                    </output>
                    <button
                      type="button"
                      className="block-remove"
                      aria-label={`Remove ${names[index] ?? spec.id}`}
                      onClick={() => {
                        setStack(stack.filter(entry => entry.key !== item.key));
                      }}
                    >
                      <XIcon size={14} />
                    </button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
            {Array.from({ length: MAX_STACK - stack.length }, (_, index) => (
              <li key={`slot-${String(index)}`} className="stack-slot" aria-hidden="true">
                {index === 0 ? 'Add a block below' : ''}
              </li>
            ))}
          </ol>

          <div className="live-result" aria-live="polite">
            <span>Output</span>
            <output>
              {error ?? (done ? JSON.stringify(result.output) : '')}
            </output>
          </div>

          <div className="shelf" role="group" aria-label="Add a component">
            {BLOCKS.map(spec => (
              <button
                key={spec.id}
                type="button"
                className={`shelf-block block hue-${spec.hue}`}
                disabled={full}
                onClick={() => {
                  setStack([...stack, { key: nextKey++, id: spec.id }]);
                }}
              >
                <PlusIcon size={12} weight="bold" aria-hidden="true" />
                {spec.className}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="live-code">
          <CopyButton text={code} size="sm" className="live-copy" />
          <SyntaxHighlight code={code} />
        </div>
      )}
    </div>
  );
}
