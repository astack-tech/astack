const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../..');
const mark =
  '<path d="M48 16H62L30 96H16Z"/><path d="M66 16H80L112 96H98Z"/><path d="M46 68H82L88 82H40Z"/>';
const svg = (w, h, body, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title"><title id="title">${label}</title>${body}</svg>\n`;
const write = (file, data) => fs.writeFileSync(path.join(root, file), data);
const metal =
  '<defs><linearGradient id="metal" x1="0" y1="0" x2=".85" y2="1" gradientUnits="objectBoundingBox"><stop stop-color="#fff"/><stop offset=".28" stop-color="#d4d4d8"/><stop offset=".52" stop-color="#8a8a94"/><stop offset=".7" stop-color="#e4e4e7"/><stop offset="1" stop-color="#71717a"/></linearGradient></defs>';
const logo = svg(
  128,
  112,
  ` ${metal}<g fill="url(#metal)">${mark}</g>`,
  'AStack: three components, one open architecture'
);
const white = svg(128, 112, `<g fill="#f4f4f5">${mark}</g>`, 'AStack logo in white');
const ink = svg(128, 112, `<g fill="#18181b">${mark}</g>`, 'AStack logo in ink');
const avatar = svg(
  512,
  512,
  `${metal}<rect width="512" height="512" fill="#09090b"/><g transform="translate(64 88) scale(3)" fill="url(#metal)">${mark}</g>`,
  'AStack organization avatar'
);
for (const p of [
  'assets/logo.svg',
  'assets/brand/logo.svg',
  'website/public/logo.svg',
  'website/public/brand/logo.svg',
])
  write(p, logo);
write('assets/brand/logo-white.svg', white);
write('assets/brand/logo-ink.svg', ink);
write('assets/brand/avatar.svg', avatar);
write(
  'website/public/favicon.svg',
  svg(
    128,
    128,
    `${metal}<rect width="128" height="128" rx="24" fill="#09090b"/><g transform="translate(8 16) scale(.875)" fill="url(#metal)">${mark}</g>`,
    'AStack favicon'
  )
);
// Board style (see docs/brand/README.md): square tiles on black, 8 px gaps, no hairlines,
// Geist embedded so the text renders the same wherever the SVG is shown.
const geist = fs
  .readFileSync(path.join(root, 'website/app/fonts/Geist-Latin.woff2'))
  .toString('base64');
const font = `<style>@font-face{font-family:Geist;src:url(data:font/woff2;base64,${geist}) format('woff2');font-weight:100 900}text{font-family:Geist,Helvetica,Arial,sans-serif}</style>`;
const C = {
  ground: '#09090b',
  tile: '#131316',
  ink: '#f4f4f5',
  ink2: '#c6c6ce',
  muted: '#94949e',
};
// The six block tints of the dark theme: each hue mixed 30 % into the tile colour.
const tints = ['#444548', '#2d3a50', '#274247', '#2d4439', '#4a3e2d', '#4c3134'];
const esc = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;');

/**
 * One layout for every wide brand image: the mark in a square tile, the name and the
 * line in a text tile, and a strip of block tints that ends in the site address.
 */
function board(w, h, { lines, sub }) {
  const pad = 24;
  const gap = 8;
  const strip = Math.round(h * 0.11);
  const main = h - pad * 2 - gap - strip;
  const markTile = Math.min(main, Math.round(w * 0.35));
  const textX = pad + markTile + gap;
  const textW = w - pad - textX;
  const inset = Math.round(main * 0.11);
  const scale = (markTile * 0.5) / 96;
  const markX = pad + (markTile - 96 * scale) / 2 - 16 * scale;
  const markY = pad + (main - 80 * scale) / 2 - 16 * scale;
  const big = Math.round(Math.min(main * 0.19, textW / 11.6));
  const subSize = Math.round(big * 0.36);
  const nameSize = Math.round(big * 0.6);
  const bottom = pad + main - inset;
  const subY = bottom - Math.round(subSize * 0.3);
  const lastLine = subY - Math.round(subSize * 1.9);
  const tagline = lines
    .map(
      (line, i) =>
        `<text x="${textX + inset}" y="${lastLine - (lines.length - 1 - i) * Math.round(big * 0.98)}" fill="${C.ink}" font-size="${big}" font-weight="500" letter-spacing="${(-0.055 * big).toFixed(1)}">${esc(line)}</text>`
    )
    .join('');
  const unit = (w - pad * 2 - gap * 7) / 8;
  const cells = tints
    .map(
      (fill, i) =>
        `<rect x="${(pad + i * (unit + gap)).toFixed(1)}" y="${h - pad - strip}" width="${unit.toFixed(1)}" height="${strip}" fill="${fill}"/>`
    )
    .join('');
  const urlX = pad + 6 * (unit + gap);
  return [
    font,
    metal,
    `<rect width="${w}" height="${h}" fill="${C.ground}"/>`,
    `<rect x="${pad}" y="${pad}" width="${markTile}" height="${main}" fill="${C.tile}"/>`,
    `<g transform="translate(${markX.toFixed(1)} ${markY.toFixed(1)}) scale(${scale.toFixed(3)})" fill="url(#metal)">${mark}</g>`,
    `<rect x="${textX}" y="${pad}" width="${textW}" height="${main}" fill="${C.tile}"/>`,
    `<text x="${textX + inset}" y="${pad + inset + nameSize}" fill="${C.ink}" font-size="${nameSize}" font-weight="600" letter-spacing="${(-0.05 * nameSize).toFixed(1)}">astack</text>`,
    tagline,
    `<text x="${textX + inset}" y="${subY}" fill="${C.ink2}" font-size="${subSize}" letter-spacing="${(-0.01 * subSize).toFixed(1)}">${esc(sub)}</text>`,
    cells,
    `<rect x="${urlX.toFixed(1)}" y="${h - pad - strip}" width="${(w - pad - urlX).toFixed(1)}" height="${strip}" fill="${C.ink}"/>`,
    `<text x="${(urlX + 24).toFixed(1)}" y="${h - pad - strip / 2 + Math.round(strip * 0.12)}" fill="${C.ground}" font-size="${Math.round(strip * 0.34)}" font-weight="500" letter-spacing="-0.4">astack.tech</text>`,
  ].join('');
}

const tagline = ['Everything is', 'a component.'];
write(
  'assets/brand/readme-banner.svg',
  svg(
    1280,
    480,
    board(1280, 480, { lines: tagline, sub: 'The composable TypeScript framework for AI applications.' }),
    'AStack — Everything is a component. The composable TypeScript framework for AI applications.'
  )
);
write(
  'website/public/brand/social-card.svg',
  svg(
    1200,
    630,
    board(1200, 630, { lines: tagline, sub: 'The composable TypeScript framework for AI applications.' }),
    'AStack — Everything is a component. The composable TypeScript framework for AI applications.'
  )
);
write(
  'assets/brand/github-social-preview.svg',
  svg(
    1280,
    640,
    board(1280, 640, { lines: tagline, sub: 'A composable framework for building AI applications.' }),
    'AStack — Everything is a component. A composable framework for building AI applications.'
  )
);

// The construction drawing: the production paths on their 128 × 112 grid, beside the
// three ideas the symbol stands for. Guides are the one place a drawing uses lines.
const ideas = [
  ['Compose', 'Three discrete solids. One shared grammar.'],
  ['Connect', 'The bridge expresses a port-to-port contract.'],
  ['Flow', 'An open apex. A system that can keep growing.'],
];
const skeleton = svg(
  1400,
  850,
  [
    font,
    `<rect width="1400" height="850" fill="${C.ground}"/>`,
    `<rect x="24" y="24" width="792" height="802" fill="${C.tile}"/>`,
    `<text x="64" y="96" fill="${C.ink}" font-size="40" font-weight="500" letter-spacing="-1.6">Composition, made visible.</text>`,
    `<text x="64" y="132" fill="${C.muted}" font-size="18">AStack / symbol construction and design rationale</text>`,
    `<g transform="translate(164 200) scale(3.8)" fill="${C.ink}">${mark}<g fill="none" stroke="#5c5c66" stroke-width=".3"><path d="M0 16H128M0 68H128M0 82H128M0 96H128M16 0V112M48 0V112M62 0V112M66 0V112M80 0V112M112 0V112"/><path d="M20 110L64 0L108 110" stroke-dasharray="1 1"/></g></g>`,
    `<text x="64" y="786" fill="${C.muted}" font-size="17">128 × 112 units · 3 parts · 4-unit apex gap · 14-unit crossbar</text>`,
    ideas
      .map(([title, line], i) => {
        const y = 24 + i * (262 + 8);
        return `<rect x="824" y="${y}" width="552" height="262" fill="${tints[[1, 3, 5][i]]}"/><text x="864" y="${y + 196}" fill="${C.ink}" font-size="34" font-weight="500" letter-spacing="-1.2">${title}</text><text x="864" y="${y + 230}" fill="${C.ink2}" font-size="19">${esc(line)}</text>`;
      })
      .join(''),
  ].join(''),
  'AStack logo construction: three components, a port bridge and an open apex on a 128 by 112 grid'
);
write('assets/brand/logo-construction.svg', skeleton);
write('website/public/brand/logo-construction.svg', skeleton);

for (const name of ['logo-white.svg', 'logo-ink.svg', 'avatar.svg', 'readme-banner.svg']) {
  fs.copyFileSync(
    path.join(root, 'assets/brand', name),
    path.join(root, 'website/public/brand', name)
  );
}
const constructionMark = svg(
  128,
  112,
  `<g fill="#d4d4d8">${mark}</g><g fill="none" stroke="#7b7b86" stroke-width=".25"><path d="M0 16H128M0 68H128M0 82H128M0 96H128M16 0V112M48 0V112M62 0V112M66 0V112M80 0V112M112 0V112"/><rect x="16" y="16" width="96" height="80" stroke-dasharray="1 1"/></g>`,
  'AStack production geometry with alignment guides'
);
write('website/public/brand/construction-mark.svg', constructionMark);

// The board images embed Geist, which librsvg (sharp) cannot load. Export their PNGs
// from a browser instead: open each SVG at its native size and save a screenshot, as
// listed in docs/brand/README.md.
async function exportPngs() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.log('sharp is not installed: SVGs written, logo and favicon PNGs skipped.');
    console.log('Install it next to the script (`npm install --no-save sharp`) and run again.');
    return;
  }
  const exports = [
    ['assets/logo.svg', 'assets/logo.png', 240],
    ['website/public/favicon.svg', 'website/public/favicon-32.png', 32],
    ['assets/brand/avatar.svg', 'assets/brand/avatar.png', 512],
    ['assets/brand/avatar.svg', 'website/public/apple-touch-icon.png', 180],
  ];
  for (const [source, target, width] of exports) {
    await sharp(path.join(root, source)).resize({ width }).png().toFile(path.join(root, target));
  }
  // ICO directory entries contain PNG payloads for three browser-tab sizes.
  const sizes = [16, 32, 48];
  const images = await Promise.all(
    sizes.map(size =>
      sharp(path.join(root, 'website/public/favicon.svg')).resize(size, size).png().toBuffer()
    )
  );
  const header = Buffer.alloc(6 + sizes.length * 16);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  images.forEach((image, i) => {
    const entry = 6 + i * 16;
    header[entry] = sizes[i];
    header[entry + 1] = sizes[i];
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(image.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += image.length;
  });
  fs.writeFileSync(
    path.join(root, 'website/public/favicon.ico'),
    Buffer.concat([header, ...images])
  );
  for (const [source, target] of [
    ['assets/logo.png', 'website/public/logo.png'],
    ['assets/brand/avatar.png', 'website/public/brand/avatar.png'],
  ])
    fs.copyFileSync(path.join(root, source), path.join(root, target));
}
exportPngs().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
