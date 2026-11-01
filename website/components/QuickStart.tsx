'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@phosphor-icons/react';
import CopyButton from './CopyButton';
import SyntaxHighlight from './SyntaxHighlight';
import { agentCode } from '@/lib/examples';

const commands = {
  npm: 'npm install @astack-tech/core@beta @astack-tech/components@beta @astack-tech/integrations@beta @astack-tech/tools@beta',
  pnpm: 'pnpm add @astack-tech/core@beta @astack-tech/components@beta @astack-tech/integrations@beta @astack-tech/tools@beta',
  yarn: 'yarn add @astack-tech/core@beta @astack-tech/components@beta @astack-tech/integrations@beta @astack-tech/tools@beta',
};
export default function QuickStart() {
  const [manager, setManager] = useState<keyof typeof commands>('npm');
  return (
    <section id="quickstart" className="section shell quickstart-section">
      <div className="quickstart-intro">
        <p className="eyebrow">QUICK START</p>
        <h2>
          From install
          <br />
          to first agent.
        </h2>
        <p>
          Install the packages. Create an agent with a model provider. Run the agent from your
          terminal.
        </p>
        <p className="prerequisite">Node.js 20+ · npm, pnpm, or Yarn</p>
        <Link className="text-link" href="/docs/getting-started">
          Read the guide <ArrowRightIcon size={15} />
        </Link>
        <Link className="text-link" href="/examples">
          Browse examples <ArrowRightIcon size={15} />
        </Link>
      </div>
      <div className="quickstart-steps">
        <div className="quick-step">
          <h3>
            <span>1</span>Install AStack
          </h3>
          <div className="command-box">
            <div className="manager-switch" role="group" aria-label="Package manager">
              {(Object.keys(commands) as (keyof typeof commands)[]).map(pm => (
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
              <CopyButton text={commands[manager]} size="sm" />
            </div>
            <pre>
              <code>{commands[manager]}</code>
            </pre>
          </div>
        </div>
        <div className="quick-step">
          <h3>
            <span>2</span>Create your first agent
          </h3>
          <div className="code-panel">
            <div className="panel-toolbar">
              <span>examples/agent/index.ts</span>
              <CopyButton text={agentCode} size="sm" />
            </div>
            <SyntaxHighlight code={agentCode} />
          </div>
        </div>
        <div className="quick-step">
          <h3>
            <span>3</span>Run your agent
          </h3>
          <p>
            Set <code>DEEPSEEK_API_KEY</code> in your shell, then run your TypeScript file. Keep API
            keys on the server.
          </p>
          <div className="run-command">
            <code>npx tsx index.ts</code>
            <CopyButton text="npx tsx index.ts" size="sm" />
          </div>
          <Link className="section-link" href="/examples/agent">
            Read this example step by step <ArrowRightIcon size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
