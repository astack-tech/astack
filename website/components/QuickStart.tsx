'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@phosphor-icons/react';

import CopyButton from './CopyButton';
import SyntaxHighlight from './SyntaxHighlight';
import { agentCode } from '@/lib/examples';
import { BlurFade } from './magicui/blur-fade';

const PACKAGES =
  '@astack-tech/core@beta @astack-tech/components@beta @astack-tech/integrations@beta @astack-tech/tools@beta';
const COMMANDS = {
  npm: `npm install ${PACKAGES}`,
  pnpm: `pnpm add ${PACKAGES}`,
  yarn: `yarn add ${PACKAGES}`,
};
type Manager = keyof typeof COMMANDS;
const MANAGERS: readonly Manager[] = ['npm', 'pnpm', 'yarn'];

export default function QuickStart() {
  const [manager, setManager] = useState<Manager>('npm');
  return (
    <section id="quickstart" className="section" aria-labelledby="quickstart-title">
      <BlurFade className="section-head">
        <h2 id="quickstart-title">From install to first agent.</h2>
        <div>
          <p>
            Install the packages. Create an agent with a model provider. Run the agent from your
            terminal.
          </p>
          <p className="section-note">Node.js 20+ · npm, pnpm, or Yarn</p>
        </div>
      </BlurFade>

      <ol className="board steps">
        <li className="tile step step-install">
          <h3>Install AStack</h3>
          <div className="code">
            <div className="code-bar">
              <div className="segmented" role="group" aria-label="Package manager">
                {MANAGERS.map(pm => (
                  <button
                    type="button"
                    aria-pressed={manager === pm}
                    key={pm}
                    onClick={() => {
                      setManager(pm);
                    }}
                  >
                    {pm}
                  </button>
                ))}
              </div>
              <CopyButton text={COMMANDS[manager]} size="sm" />
            </div>
            <pre tabIndex={0}>
              <code>{COMMANDS[manager]}</code>
            </pre>
          </div>
        </li>

        <li className="tile step step-run">
          <h3>Run your agent</h3>
          <p>
            Set your model provider&apos;s API key in your shell (the example uses{' '}
            <code>DEEPSEEK_API_KEY</code>), then run your TypeScript file. Keep API keys on the
            server.
          </p>
          <div className="code">
            <div className="code-bar">
              <span>npx tsx index.ts</span>
              <CopyButton text="npx tsx index.ts" size="sm" />
            </div>
          </div>
          <div className="step-links">
            <Link className="link" href="/docs/getting-started">
              Read the guide <ArrowRightIcon size={14} />
            </Link>
            <Link className="link" href="/examples">
              Browse examples <ArrowRightIcon size={14} />
            </Link>
          </div>
        </li>

        <li className="tile step step-code">
          <h3>Create your first agent</h3>
          <div className="code">
            <div className="code-bar">
              <span>examples/agent/index.ts</span>
              <CopyButton text={agentCode} size="sm" />
            </div>
            <SyntaxHighlight code={agentCode} />
          </div>
          <Link className="link" href="/examples/agent">
            Read this example step by step <ArrowRightIcon size={14} />
          </Link>
        </li>
      </ol>
    </section>
  );
}
