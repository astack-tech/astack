const sharp = require('sharp');
const path = require('path');

const svgPath = path.join(__dirname, '../assets/logo.svg');
const pngPath = path.join(__dirname, '../assets/logo.png');

sharp(svgPath)
  .resize(240, 240)
  .png()
  .toFile(pngPath)
  .then(() => {
    console.log('✅ Successfully converted logo.svg to logo.png (240x240, transparent background)');
  })
  .catch(err => {
    console.error('❌ Error converting logo:', err);
    process.exit(1);
  });
