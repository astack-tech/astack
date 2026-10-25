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
const grid =
  '<defs><pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#bfc0c7" stroke-opacity=".09"/></pattern></defs><rect width="100%" height="100%" fill="url(#g)"/>';
function banner(w, h) {
  return svg(
    w,
    h,
    `${metal}<rect width="${w}" height="${h}" fill="#09090b"/>${grid}<path d="M0 ${h - 1}H${w}" stroke="#bfc0c7" stroke-opacity=".3"/><g transform="translate(78 68) scale(.55)" fill="url(#metal)">${mark}</g><text x="166" y="116" fill="#f4f4f5" font-family="Arial,Helvetica,sans-serif" font-weight="600" font-size="48" letter-spacing="-2">astack</text><text x="78" y="${Math.round(h * 0.56)}" fill="#f4f4f5" font-family="Arial,Helvetica,sans-serif" font-size="${w === 1200 ? 62 : 58}" letter-spacing="-2">Everything is a component.</text><text x="80" y="${Math.round(h * 0.56) + 46}" fill="#a1a1aa" font-family="Arial,Helvetica,sans-serif" font-size="20">The composable TypeScript framework for AI applications.</text><text x="80" y="${h - 56}" fill="#bfc0c7" font-family="monospace" font-size="14">COMPONENTS → PORTS → PIPELINES</text><text x="${w - 172}" y="${h - 56}" fill="#a1a1aa" font-family="monospace" font-size="14">astack.tech</text><g transform="translate(${w - 290} 52) scale(1.75)" fill="#bfc0c7" opacity=".10">${mark}</g>`,
    'AStack — Everything is a component. The composable TypeScript framework for AI applications.'
  );
}
write('assets/brand/readme-banner.svg', banner(1280, 480));
write('website/public/brand/social-card.svg', banner(1200, 630));
const skeleton = svg(
  1400,
  850,
  `<rect width="1400" height="850" fill="#09090b"/>${grid}<text x="64" y="70" fill="#f4f4f5" font-family="Arial,sans-serif" font-size="30">Composition, made visible.</text><text x="64" y="104" fill="#a1a1aa" font-family="Arial,sans-serif" font-size="16">AStack / symbol construction and design rationale</text><g transform="translate(140 200) scale(4)" fill="#f4f4f5">${mark}<g fill="none" stroke="#bfc0c7" stroke-width=".3"><path d="M0 16H128M0 68H128M0 82H128M0 96H128M16 0V112M48 0V112M62 0V112M66 0V112M80 0V112M112 0V112"/><path d="M20 110L64 0L108 110" stroke-dasharray="1 1"/></g></g><g font-family="Arial,sans-serif" fill="#f4f4f5"><text x="820" y="240" font-size="24">01 / Compose</text><text x="820" y="274" font-size="17" fill="#a1a1aa">Three discrete solids. One shared grammar.</text><text x="820" y="378" font-size="24">02 / Connect</text><text x="820" y="412" font-size="17" fill="#a1a1aa">The bridge expresses a port-to-port contract.</text><text x="820" y="516" font-size="24">03 / Flow</text><text x="820" y="550" font-size="17" fill="#a1a1aa">An open apex. A system that can keep growing.</text></g><path d="M680 270H782M620 490H782M430 178H782V530" stroke="#bfc0c7" stroke-width="1" fill="none"/><text x="64" y="760" fill="#bfc0c7" font-family="monospace" font-size="15">128 × 112 units / 3 parts / 4-unit apex gap / 14-unit crossbar</text><text x="64" y="798" fill="#a1a1aa" font-family="Arial,sans-serif" font-size="16">The component stays simple. The composition creates the capability.</text>`,
  'AStack logo skeleton: three components, port bridge, open apex, modular construction'
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

async function exportPngs() {
  const sharp = require('sharp');
  const exports = [
    ['assets/logo.svg', 'assets/logo.png', 240],
    ['website/public/favicon.svg', 'website/public/favicon-32.png', 32],
    ['assets/brand/avatar.svg', 'assets/brand/avatar.png', 512],
    ['assets/brand/readme-banner.svg', 'assets/brand/readme-banner.png', 1280],
    ['assets/brand/logo-construction.svg', 'assets/brand/concept-board.png', 1400],
    ['website/public/brand/social-card.svg', 'website/public/brand/social-card.png', 1200],
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
    ['assets/brand/readme-banner.png', 'website/public/brand/readme-banner.png'],
  ])
    fs.copyFileSync(path.join(root, source), path.join(root, target));
}
exportPngs().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
