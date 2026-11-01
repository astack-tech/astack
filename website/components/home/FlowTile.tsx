/**
 * A marble diagram, the usual picture of a reactive stream, drawn in blocks. Time runs
 * left to right. Each input value is emitted in turn, and its mapped value drops out of
 * the component onto the output lane directly below it.
 */
const VALUES = ['a', 's', 't', 'a', 'c', 'k'];

function Lane({ label, values, mapped }: { label: string; values: string[]; mapped?: boolean }) {
  return (
    <div className="lane">
      <span className="lane-label">{label}</span>
      <div className="lane-track">
        {values.map((value, index) => (
          <span
            key={`${value}-${String(index)}`}
            className={`marble ${mapped === true ? 'marble-out block hue-blue' : ''}`}
            style={{ '--i': String(index) }}
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function FlowTile() {
  return (
    <div className="marbles" aria-hidden="true">
      <Lane label="in" values={VALUES} />
      <div className="operator block hue-blue">
        <code>upper</code>
        <span>Uppercase</span>
      </div>
      <Lane label="out" values={VALUES.map(value => value.toUpperCase())} mapped />
    </div>
  );
}
