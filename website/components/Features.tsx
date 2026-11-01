import Link from 'next/link';
import { MagicCard } from './magicui/magic-card';
import {
  ArrowRightIcon,
  CubeIcon,
  ArrowsSplitIcon,
  ArrowsLeftRightIcon,
  PlugsConnectedIcon,
  StackIcon,
  BracketsCurlyIcon,
} from '@phosphor-icons/react/dist/ssr';

const features = [
  {
    icon: CubeIcon,
    title: 'One component model',
    description:
      'Component extends HLang’s TransformNode. Models, agents and your own logic share one interface: input ports, output ports and run(). Pipelines connect them.',
    code: 'class Agent extends Component',
    wide: true,
  },
  {
    icon: ArrowsSplitIcon,
    title: 'Data flow paradigm',
    description:
      'Components never call each other. You declare the connections, and the runtime sends each value along them. Model calls stay stateless; the agent keeps the history.',
    code: 'input → transform → output',
  },
  {
    icon: ArrowsLeftRightIcon,
    title: 'Dual execution modes',
    description:
      'Independent execution with run() or reactive pipeline mode with _transform(). The same component works in both.',
    code: 'run(data)  /  _transform($i, $o)',
  },
  {
    icon: PlugsConnectedIcon,
    title: 'Named ports',
    description:
      'Port.I() and Port.O() declare named ports. A component chooses which output port to send on, which is how branching works.',
    code: "Port.I('in') → Port.O('out')",
  },
  {
    icon: StackIcon,
    title: 'Modular design',
    description:
      'Core, components, integrations, and tools as separate packages. Choose the pieces your application needs.',
    code: '@astack-tech/{core,components,…}',
  },
  {
    icon: BracketsCurlyIcon,
    title: 'Pluggable models',
    description:
      'Agents accept any object with chatCompletion(). The DeepSeek provider ships today; add others by implementing the same contract.',
    code: 'model.chatCompletion(messages)',
  },
];

export default function Features() {
  return (
    <section id="features" className="section shell">
      <div className="section-heading">
        <p className="eyebrow">COMPONENTS, PORTS, AND PIPELINES</p>
        <h2>Everything is a component.</h2>
        <p>
          Connect them through ports. The graph runs on the{' '}
          <a href="https://github.com/hlang-tech/hlang">HLang</a> flow runtime.
        </p>
      </div>
      <div className="feature-grid">
        {features.map(({ icon: Icon, title, description, code, wide }) => (
          <MagicCard
            key={title}
            className={`feature-card ${wide ? 'feature-wide' : ''}`}
            gradientFrom="var(--silver-edge)"
            gradientTo="var(--line)"
            gradientColor="var(--silver-glow)"
            gradientOpacity={0.35}
          >
            <article className="feature-item">
              <Icon size={23} weight="duotone" />
              <h3>{title}</h3>
              <p>{description}</p>
              <code>{code}</code>
              {wide && (
                <div className="component-contract">
                  <span>Input port</span>
                  <span className="contract-line" />
                  <b>Component</b>
                  <span className="contract-line" />
                  <span>Output port</span>
                </div>
              )}
            </article>
          </MagicCard>
        ))}
      </div>
      <Link className="section-link" href="/docs/components">
        Read about components <ArrowRightIcon size={15} />
      </Link>
    </section>
  );
}
