const rows = [
  ['Data flow paradigm', 'Flow-Based Programming with monadic composition', 'Control flow loops'],
  ['Dual run modes', 'run() + _transform()', 'Single mode'],
  ['Type-safe ports', 'TypeScript contracts and HLang port system', 'Runtime checks'],
  ['Language', 'TypeScript', 'Python'],
];
export default function Comparison() {
  return (
    <section id="comparison" className="section shell comparison-section">
      <div className="section-heading">
        <p className="eyebrow">DESIGN DECISIONS</p>
        <h2>Independent by design.</h2>
        <p>
          Built in TypeScript, AStack has its own implementation and architecture. Its API style
          takes inspiration from <a href="https://haystack.deepset.ai/">Haystack</a>&apos;s API
          style.
        </p>
      </div>
      <div
        className="comparison-table-wrap"
        tabIndex={0}
        role="region"
        aria-label="Architectural comparison"
      >
        <table className="comparison-table">
          <caption>Architectural differences described in the original AStack overview</caption>
          <thead>
            <tr>
              <th scope="col">Design choice</th>
              <th scope="col">AStack</th>
              <th scope="col">Traditional approach</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, astack, other]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                <td>{astack}</td>
                <td>{other}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="comparison-note">
        This is an architectural contrast, not a benchmark or a claim about every framework.
        Ecosystems evolve; choose the implementation that fits your application.
      </p>
      <blockquote>
        AStack uses a shared component interface for agents, tools, and models. Connect their ports
        to define how data moves through your application.
      </blockquote>
    </section>
  );
}
