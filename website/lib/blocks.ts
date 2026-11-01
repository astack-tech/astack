/**
 * Component blocks for the live pipeline on the homepage. Each block is a real
 * AStack component class: the browser builds a `Pipeline` from the blocks the
 * visitor stacks and runs it with `@astack-tech/core`.
 */

/** The translucent block colors. Each package and concept keeps its color across the site. */
export type BlockHue = 'silver' | 'blue' | 'amber' | 'mint' | 'rose';

export interface BlockSpec {
  /** Component name in the pipeline, for example `trim`. */
  id: string;
  /** Class name shown in the generated code, for example `Trim`. */
  className: string;
  /** Body of the generated `run()` method. */
  body: string;
  hue: BlockHue;
  /** The transform the component applies. */
  transform: (text: string) => string;
}

export const BLOCKS: readonly BlockSpec[] = [
  {
    id: 'trim',
    className: 'Trim',
    body: 'return String(text).trim();',
    hue: 'silver',
    transform: text => text.trim(),
  },
  {
    id: 'upper',
    className: 'Uppercase',
    body: 'return String(text).toUpperCase();',
    hue: 'blue',
    transform: text => text.toUpperCase(),
  },
  {
    id: 'reverse',
    className: 'Reverse',
    body: "return Array.from(new Intl.Segmenter().segment(String(text)), s => s.segment).reverse().join('');",
    hue: 'amber',
    transform: text =>
      Array.from(new Intl.Segmenter().segment(text), part => part.segment)
        .reverse()
        .join(''),
  },
  {
    id: 'slug',
    className: 'Slugify',
    body: "return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-');",
    hue: 'mint',
    transform: text => text.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  },
  {
    id: 'exclaim',
    className: 'Exclaim',
    body: 'return `${String(text)}!`;',
    hue: 'rose',
    transform: text => `${text}!`,
  },
];

/** Default stack: the same three components as `examples/pipeline`. */
export const DEFAULT_STACK = ['trim', 'upper', 'exclaim'];

/** Most blocks one stack holds, so the stack fits its tile on every screen. */
export const MAX_STACK = 5;

export function findBlock(id: string): BlockSpec | undefined {
  return BLOCKS.find(block => block.id === id);
}

/** Pipeline names must be unique, so repeated blocks get a number: `upper`, `upper2`. */
export function stackNames(stack: readonly string[]): string[] {
  const seen = new Map<string, number>();
  return stack.map(id => {
    const count = (seen.get(id) ?? 0) + 1;
    seen.set(id, count);
    return count === 1 ? id : `${id}${String(count)}`;
  });
}

/** The TypeScript a developer would write for this stack. */
export function stackCode(stack: readonly string[], input: string): string {
  const names = stackNames(stack);
  const specs = stack.map(findBlock).filter((spec): spec is BlockSpec => spec !== undefined);
  const classes = [...new Map(specs.map(spec => [spec.className, spec])).values()].map(
    spec =>
      `class ${spec.className} extends Component {\n  override run(text: unknown) {\n    ${spec.body}\n  }\n}`
  );
  const first = names[0];
  if (first === undefined) {
    return "import { Pipeline } from '@astack-tech/core';\n\n// Add a block to build the pipeline.";
  }
  const adds = specs.map(
    (spec, index) => `pipeline.addComponent('${names[index] ?? spec.id}', new ${spec.className}());`
  );
  const connects = names
    .slice(1)
    .map((name, index) => `pipeline.connect('${names[index] ?? ''}.out', '${name}.in');`);
  return [
    "import { Component, Pipeline } from '@astack-tech/core';",
    '',
    ...classes.flatMap(source => [source, '']),
    'const pipeline = new Pipeline();',
    ...adds,
    ...connects,
    '',
    `await pipeline.run('${first}.in', ${JSON.stringify(input)});`,
  ].join('\n');
}
