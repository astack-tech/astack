import Link from 'next/link';
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr';

import FlowTile from './home/FlowTile';
import Tile from './home/Tile';
import { BlurFade } from './magicui/blur-fade';

/**
 * "Everything is a component" as a board: each tile shows one property of the
 * component model at large scale, with its name and one line below.
 */
export default function Features() {
  return (
    <section id="features" className="section" aria-labelledby="features-title">
      <BlurFade className="section-head">
        <h2 id="features-title">Everything is a component.</h2>
        <p>
          Connect them through ports. The graph runs on the{' '}
          <a href="https://github.com/hlang-tech/hlang">HLang</a> flow runtime.
        </p>
      </BlurFade>

      <div className="board features">
        <Tile className="feature f-model">
          <div className="contract" aria-hidden="true">
            <span className="pane hue-silver">Input port</span>
            <span className="pane hue-blue">Component</span>
            <span className="pane hue-rose">Output port</span>
          </div>
          <div className="feature-text">
            <code>class Agent extends Component</code>
            <h3>One component model</h3>
            <p>
              Component extends HLang’s TransformNode. Models, agents and your own logic share one
              interface: input ports, output ports and run(). Pipelines connect them.
            </p>
          </div>
        </Tile>

        <Tile className="feature f-flow">
          <FlowTile />
          <div className="feature-text">
            <code>input → transform → output</code>
            <h3>Data flow paradigm</h3>
            <p>
              Components never call each other. You declare the connections, and the runtime sends
              each value along them. Model calls stay stateless; the agent keeps the history.
            </p>
          </div>
        </Tile>

        <Tile className="feature f-modes">
          <p className="feature-figure" aria-hidden="true">
            <span>run(data)</span>
            <span>_transform($i, $o)</span>
          </p>
          <div className="feature-text">
            <h3>Dual execution modes</h3>
            <p>
              Independent execution with run() or reactive pipeline mode with _transform(). The same
              component works in both.
            </p>
          </div>
        </Tile>

        <Tile className="feature f-ports">
          <p className="feature-figure ports" aria-hidden="true">
            <span className="chip block hue-silver">Port.I(&apos;in&apos;)</span>
            <span className="chip block hue-amber">Port.O(&apos;out&apos;)</span>
          </p>
          <div className="feature-text">
            <h3>Named ports</h3>
            <p>
              Port.I() and Port.O() declare named ports. A component chooses which output port to
              send on, which is how branching works.
            </p>
          </div>
        </Tile>

        <Tile className="feature f-models">
          <p className="feature-figure" aria-hidden="true">
            <span>
              model.chatCompletion(
              <wbr />
              messages)
            </span>
          </p>
          <div className="feature-text">
            <h3>Pluggable models</h3>
            <p>
              Agents accept any object with chatCompletion(). The DeepSeek provider ships today; add
              others by implementing the same contract.
            </p>
          </div>
        </Tile>

        <Tile className="feature f-modular">
          <p className="packages" aria-hidden="true">
            <span className="pane hue-silver">core</span>
            <span className="pane hue-blue">components</span>
            <span className="pane hue-amber">tools</span>
            <span className="pane hue-mint">integrations</span>
          </p>
          <div className="feature-text">
            <code>{'@astack-tech/{core,components,…}'}</code>
            <h3>Modular design</h3>
            <p>
              Core, components, integrations, and tools as separate packages. Choose the pieces your
              application needs.
            </p>
          </div>
        </Tile>

        <Link className="tile feature-link" href="/docs/components">
          <span>Read about components</span>
          <ArrowRightIcon size={24} />
        </Link>
      </div>
    </section>
  );
}
