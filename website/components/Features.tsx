import { MagicCard } from './magicui/magic-card';
import {
  ArrowUpRightIcon,
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
    title: 'Monadic component system',
    description:
      'The Component class extends HLang’s TransformNode and uses its monadic composition laws. Agents and tools use the same component interface. Pipelines connect them.',
    code: 'class Agent extends Component',
    wide: true,
  },
  {
    icon: ArrowsSplitIcon,
    title: 'Data flow paradigm',
    description:
      'Flow-Based Programming treats LLMs as stateless generators. Define the data dependencies between components. The runtime sends data through their ports.',
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
    title: 'Type-safe port system',
    description:
      'Port.I() and Port.O() define input and output ports. TypeScript describes the data contracts. The HLang runtime connects the ports.',
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
    title: 'Easy integration',
    description:
      'Use OpenAI-compatible model interfaces. Connect your model provider and business logic through the component contract.',
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
          Connect them through ports. AStack uses{' '}
          <a href="https://github.com/hlang-tech/hlang">HLang</a>&apos;s monadic composition model.
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
      <a
        className="section-link"
        href="https://deepwiki.com/astack-tech/astack/2-core-architecture"
      >
        Explore the architecture <ArrowUpRightIcon size={15} />
      </a>
    </section>
  );
}
