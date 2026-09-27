// Builds a single self-contained HTML file (JS, CSS and fonts inlined) at
// demo/idle-supervillain.html, for sharing a playable demo link.
import { build } from 'vite';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';

const outDir = 'demo-build';
await build({
  logLevel: 'warn',
  build: {
    outDir,
    emptyOutDir: true,
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: { output: { codeSplitting: false } },
  },
});

const assets = readdirSync(`${outDir}/assets`);
const js = assets.filter((f) => f.endsWith('.js'));
if (js.length !== 1) throw new Error(`Expected one JS bundle, got ${js.join(', ')}`);
const css = assets.filter((f) => f.endsWith('.css')).map((f) => readFileSync(`${outDir}/assets/${f}`, 'utf8')).join('\n');
const script = readFileSync(`${outDir}/assets/${js[0]}`, 'utf8').replace(/<\/script/gi, '<\\/script');
const html = readFileSync(`${outDir}/index.html`, 'utf8');
const body = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>')).replace(/<script[\s\S]*?<\/script>/g, '');
const icon = `data:image/svg+xml,${encodeURIComponent(readFileSync('public/icon.svg', 'utf8'))}`;

const page = `<title>Idle Supervillain</title>
<meta name="theme-color" content="#140a26">
<link rel="icon" href="${icon}">
<style>${css}</style>
${body.trim()}
<script type="module">${script}</script>
`;
mkdirSync('demo', { recursive: true });
writeFileSync('demo/idle-supervillain.html', page);
console.log(`demo/idle-supervillain.html ${(page.length / 1024).toFixed(0)} KB`);
