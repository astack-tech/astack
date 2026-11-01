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
const chunks = await pipeline.run<string[]>('splitter.text', article, 'splitter.out');

chunks.forEach((chunk, index) => {
  console.log(`--- chunk ${String(index + 1)} (${String(chunk.length)} chars)\n${chunk}`);
});
