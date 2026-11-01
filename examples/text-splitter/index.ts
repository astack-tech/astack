import { TextSplitter } from '@astack-tech/components';
import { Pipeline } from '@astack-tech/core';

const article = `
Flow-based programming describes an application as a graph of components.

Each component reads from input ports and writes to output ports.

Components do not call each other. The graph decides where data goes.

This makes each component small, testable and reusable.
`.trim();

// Pack paragraphs into chunks of at most 160 characters.
// Paragraphs that fit in `overlap` are repeated at the start of the next chunk.
const splitter = new TextSplitter({ chunkSize: 160, overlap: 80 });

const pipeline = new Pipeline();
pipeline.addComponent('splitter', splitter);

// TextSplitter reads from its `text` port and writes the chunks to `out`.
// A pipeline is wired at run time, so its result is `unknown`. Check it before you use it.
const chunks = await pipeline.run('splitter.text', article, 'splitter.out');
if (!Array.isArray(chunks)) {
  throw new TypeError('Expected an array of chunks.');
}

chunks.forEach((chunk: unknown, index) => {
  const text = String(chunk);
  console.log(`--- chunk ${String(index + 1)} (${String(text.length)} chars)\n${text}`);
});
