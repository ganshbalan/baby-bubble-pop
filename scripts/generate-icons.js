const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SVG = fs.readFileSync(path.join(__dirname, '../resources/icon.svg'));

const sizes = [
  { size: 192,  dest: path.join(__dirname, '../www/icons/icon-192.png') },
  { size: 512,  dest: path.join(__dirname, '../www/icons/icon-512.png') },
  { size: 1024, dest: path.join(__dirname, '../resources/icon.png') },
  { size: 2732, dest: path.join(__dirname, '../resources/splash.png'), bg: '#1a1a2e' },
];

async function run() {
  fs.mkdirSync(path.join(__dirname, '../www/icons'), { recursive: true });
  fs.mkdirSync(path.join(__dirname, '../resources'), { recursive: true });

  for (const { size, dest, bg } of sizes) {
    let pipeline = sharp(SVG).resize(size, size);

    if (bg) {
      // Splash: centre the icon on a solid background
      const iconSize = Math.round(size * 0.35);
      const iconBuf = await sharp(SVG).resize(iconSize, iconSize).toBuffer();
      pipeline = sharp({
        create: {
          width: size, height: size,
          channels: 4,
          background: bg,
        }
      }).composite([{ input: iconBuf, gravity: 'center' }]);
    }

    await pipeline.png().toFile(dest);
    console.log(`Generated: ${dest}`);
  }
}

run().catch(err => { console.error(err); process.exit(1); });
