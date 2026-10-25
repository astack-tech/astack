'use client';

import { useState } from 'react';
import { ArrowRightIcon, ArrowUpRightIcon } from '@phosphor-icons/react';
import CopyButton from './CopyButton';
import SyntaxHighlight from './SyntaxHighlight';
import { agentCode } from '@/lib/examples';

const commands = {
  npm: 'npm install @astack-tech/core@beta @astack-tech/components@beta @astack-tech/integrations@beta',
  pnpm: 'pnpm add @astack-tech/core@beta @astack-tech/components@beta @astack-tech/integrations@beta',
  yarn: 'yarn add @astack-tech/core@beta @astack-tech/components@beta @astack-tech/integrations@beta',
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
        <p className="prerequisite">Node.js 18+ · npm, pnpm, or Yarn</p>
        <a className="text-link" href="https://deepwiki.com/astack-tech/astack/1.2-getting-started">
          Read Documentation <ArrowUpRightIcon size={15} />
        </a>
        <a className="text-link" href="https://github.com/astack-tech/astack/tree/master/examples">
          View Examples <ArrowUpRightIcon size={15} />
        </a>
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
                  onClick={() => setManager(pm)}
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
              <span>agent.ts</span>
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
            <code>npx tsx agent.ts</code>
            <CopyButton text="npx tsx agent.ts" size="sm" />
          </div>
          <a
            className="section-link"
            href="https://github.com/astack-tech/astack/tree/master/examples/agent-with-tools"
          >
            Next: connect your own tools <ArrowRightIcon size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
