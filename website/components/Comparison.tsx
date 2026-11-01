import Link from 'next/link';
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr';
import { BlurFade } from './magicui/blur-fade';

/** Rows mirror the comparison table in `content/docs/introduction.md`. */
const ROWS: [string, string, string, string][] = [
  ['Language', 'TypeScript', 'Python', 'Python'],
  [
    'Unit of work',
    'Component with named ports',
    'Node with prep, exec and post',
    'Component with typed sockets',
  ],
  [
    'How data moves',
    'Along each connection, from an output port to an input port',
    'Through a shared store that nodes read and write',
    'Along connections between sockets',
  ],
  [
    'Branching',
    'A component sends to the output port it chooses',
    'post returns an action; the flow follows that labeled edge',
    'Router components',
  ],
  [
    'Execution',
    'Reactive streams; concurrent runs of a route resolve in order',
    'A flow runs nodes one after another; async and parallel variants exist',
    'A pipeline run loop',
  ],
  [
    'Design goal',
    'A typed, reactive data-flow model',
    'A minimal core of about 100 lines',
    'A full framework for search and RAG',
  ],
];

export default function Comparison() {
  return (
    <section id="comparison" className="section" aria-labelledby="comparison-title">
      <BlurFade className="section-head is-stacked">
        <h2 id="comparison-title">The graph is the framework.</h2>
        <p>
          AStack&apos;s computation model is original.{' '}
          <a href="https://github.com/The-Pocket/PocketFlow">PocketFlow</a> reached a similar idea
          on its own: a small core where agents, workflows and RAG are patterns, not features.
          PocketFlow makes a 100-line core its goal; AStack does not optimize for line count. Its API
          shape takes inspiration from <a href="https://haystack.deepset.ai/">Haystack</a>.
        </p>
      </BlurFade>

      <div className="board comparison">
        <div
          className="tile compare-table"
          tabIndex={0}
          role="region"
          aria-label="Comparison of AStack, PocketFlow and Haystack"
        >
          <table>
            <caption className="sr-only">Computation models compared</caption>
            <thead>
              <tr>
                <th scope="col">Aspect</th>
                <th scope="col" className="is-astack">
                  AStack
                </th>
                <th scope="col">PocketFlow</th>
                <th scope="col">Haystack</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, astack, pocketflow, haystack]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td className="is-astack" data-label="AStack">
                    {astack}
                  </td>
                  <td data-label="PocketFlow">{pocketflow}</td>
                  <td data-label="Haystack">{haystack}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="tile compare-note">
          The main difference from PocketFlow is where state lives. PocketFlow nodes share one store.
          In AStack each connection carries the data for that step, so every input and output is
          explicit in the graph.
        </p>
        <Link className="tile compare-link" href="/docs/introduction#how-astack-compares">
          <span>Read the full comparison</span>
          <ArrowRightIcon size={24} />
        </Link>
      </div>
    </section>
  );
}
