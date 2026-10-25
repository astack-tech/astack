const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const source = read('assets/logo.svg');
const paths = [...source.matchAll(/<path d="([^"]+)"/g)].map(match => match[1]);
assert.equal(paths.length, 3, 'The production symbol has exactly three parts.');
for (const name of [
  'logo.svg',
  'logo-ink.svg',
  'logo-white.svg',
  'avatar.svg',
  'readme-banner.svg',
  'logo-construction.svg',
]) {
  for (const prefix of ['assets/brand', 'website/public/brand']) {
    const file = `${prefix}/${name}`;
    for (const d of paths)
      assert.ok(read(file).includes(`<path d="${d}"`), `${file}: geometry differs`);
  }
}
assert.equal(
  read('assets/brand/logo-construction.svg'),
  read('website/public/brand/logo-construction.svg')
);
for (const d of paths)
  assert.ok(read('website/public/brand/construction-mark.svg').includes(`<path d="${d}"`));
console.log('All brand variants and construction drawings use the three production paths.');
