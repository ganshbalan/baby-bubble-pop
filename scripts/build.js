const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '../baby-game.html'), 'utf8');

const HEAD_INJECT = `
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#4d96ff" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <link rel="apple-touch-icon" href="/icons/icon-192.png" />`;

const SW_INJECT = `
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
<\/script>`;

const out = src
  .replace('</title>', '</title>' + HEAD_INJECT)
  .replace('</body>', SW_INJECT + '\n</body>');

fs.mkdirSync(path.join(__dirname, '../www'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '../www/index.html'), out);
console.log('www/index.html written successfully.');
