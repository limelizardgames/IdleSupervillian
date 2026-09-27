// Lair backgrounds. All scenes are 400x260; the villain stands centre-bottom
// (layered on top in HTML), so big props live at the left and right edges.

const INK = '#1b1530';
const ink = (w = 2) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

/** Deterministic pseudo-random generator so scenes look the same every render. */
function rng(seed: number) {
  let x = seed;
  return () => (x = (x * 9301 + 49297) % 233280) / 233280;
}

function stars(n: number, seed: number, maxY: number): string {
  const r = rng(seed);
  let out = '';
  for (let i = 0; i < n; i++) {
    const cx = (r() * 400).toFixed(1);
    const cy = (r() * maxY).toFixed(1);
    const rad = (0.4 + r() * 1.3).toFixed(2);
    out += `<circle class="twinkle" style="animation-delay:${(r() * 3).toFixed(2)}s" cx="${cx}" cy="${cy}" r="${rad}" fill="#fff"/>`;
  }
  return out;
}

function bubbles(xs: number[], y: number, color = '#bff6ff'): string {
  return xs
    .map((x, i) => `<circle class="rise" style="animation-delay:${(i * 0.7) % 3}s;animation-duration:${2.5 + (i % 3)}s" cx="${x}" cy="${y}" r="${1.5 + (i % 3)}" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="1"/>`)
    .join('');
}

/** Floating ambient particles (dust, embers, plankton...). */
function motes(n: number, seed: number, color: string, cls: string, yMin: number, yMax: number, rMax = 1.6): string {
  const r = rng(seed);
  let out = '';
  for (let i = 0; i < n; i++) {
    const cx = (r() * 400).toFixed(1);
    const cy = (yMin + r() * (yMax - yMin)).toFixed(1);
    out += `<circle class="${cls}" style="animation-delay:${(-r() * 8).toFixed(2)}s;animation-duration:${(6 + r() * 6).toFixed(1)}s" cx="${cx}" cy="${cy}" r="${(0.6 + r() * rMax).toFixed(2)}" fill="${color}"/>`;
  }
  return out;
}

/** Comic halftone shading in the corners plus a soft vignette. */
const FINISH = `
  <rect width="400" height="260" fill="url(#p-halftone)" opacity="0.16" mask="url(#m-vignette)"/>
  <rect width="400" height="260" fill="url(#g-vignette)"/>`;

const FINISH_DEFS = `
  <defs>
    <radialGradient id="g-vig-mask" cx="0.5" cy="0.55" r="0.75"><stop offset="0.45" stop-color="#000"/><stop offset="1" stop-color="#fff"/></radialGradient>
    <mask id="m-vignette"><rect width="400" height="260" fill="url(#g-vig-mask)"/></mask>
    <radialGradient id="g-vignette" cx="0.5" cy="0.6" r="0.8"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.5"/></radialGradient>
  </defs>`;

// ---------------------------------------------------------------------------
// 1. Mom's Basement
// ---------------------------------------------------------------------------
const BASEMENT = `
  <rect width="400" height="260" fill="url(#g-basement-wall)"/>
  <!-- wallpaper stripes -->
  ${Array.from({ length: 20 }, (_, i) => `<rect x="${i * 20 + 8}" y="20" width="4" height="92" fill="#fff" opacity="0.035"/>`).join('')}
  <!-- ceiling joists & pipe -->
  <rect x="0" y="0" width="400" height="16" fill="#2a1a20"/>
  ${[0, 60, 120, 180, 240, 300, 360].map((x) => `<rect x="${x}" y="0" width="16" height="22" fill="#5a3a26" ${ink(1.5)}/>`).join('')}
  <path d="M0 26 H400" stroke="${INK}" stroke-width="8"/><path d="M0 26 H400" stroke="#8a8fa8" stroke-width="5"/>
  <path d="M0 24.5 H400" stroke="#c9cfdd" stroke-width="1" opacity="0.6"/>
  <rect x="226" y="20" width="10" height="12" rx="2" fill="#6c7288" ${ink(1.5)}/>
  <circle cx="231" cy="18" r="5" fill="#e0344f" ${ink(1.5)}/>
  <!-- string lights -->
  <path d="M0 32 Q50 48 100 32 Q150 48 200 32 Q250 48 300 32 Q350 48 400 32" stroke="#222" stroke-width="1.2" fill="none"/>
  ${[20, 45, 70, 130, 155, 180, 220, 245, 270, 330, 355, 380].map((x, i) => {
    const c = ['#ff4d6d', '#ffd23f', '#3ddc84', '#4dabff', '#c77dff'][i % 5];
    const y = 32 + 14 * Math.sin(((x % 100) / 100) * Math.PI);
    return `<circle cx="${x}" cy="${(y + 3).toFixed(1)}" r="7" fill="${c}" opacity="0.25" class="blink" style="animation-delay:${(i * 0.37) % 2}s"/><ellipse class="blink" style="animation-delay:${(i * 0.37) % 2}s" cx="${x}" cy="${(y + 3).toFixed(1)}" rx="2.6" ry="3.4" fill="${c}" ${ink(1)}/>`;
  }).join('')}
  <!-- wood paneling -->
  ${Array.from({ length: 20 }, (_, i) => `<rect x="${i * 20}" y="112" width="20" height="98" fill="url(#g-panel)"/><line x1="${i * 20}" y1="112" x2="${i * 20}" y2="210" stroke="#3a2212" stroke-width="1.6"/><line x1="${i * 20 + 3}" y1="114" x2="${i * 20 + 3}" y2="208" stroke="#a06a40" stroke-width="0.8" opacity="0.5"/>`).join('')}
  <rect x="0" y="106" width="400" height="8" fill="#5a3820" ${ink(1.5)}/>
  <!-- window with moonlit yard -->
  <g>
    <rect x="34" y="46" width="94" height="44" rx="3" fill="#2a1d33" ${ink(2)}/>
    <rect x="39" y="51" width="84" height="34" fill="#0f1d4a"/>
    ${stars(8, 3, 30).replace(/cx="(\d+\.?\d*)"/g, (_, v) => `cx="${(40 + (Number(v) / 400) * 82).toFixed(1)}"`).replace(/cy="(\d+\.?\d*)"/g, (_, v) => `cy="${(52 + Number(v) * 0.6).toFixed(1)}"`)}
    <circle cx="104" cy="60" r="7" fill="#fff7cf"/><circle cx="101" cy="58" r="7" fill="#0f1d4a"/>
    <path d="M39 85 l4 -9 l3 9 l4 -11 l3 11 l5 -8 l3 8 l4 -10 l4 10 l4 -7 l3 7 l5 -10 l3 10 l4 -8 l4 8 l5 -11 l3 11 l4 -7 l3 7 l5 -9 l3 9 Z" fill="#2f8f3a"/>
    <!-- garden gnome peeking in -->
    <g transform="translate(58 70)"><path d="M0 16 L6 0 L12 16Z" fill="#e0344f" ${ink(1.2)}/><circle cx="6" cy="16" r="4.5" fill="#f2c4a2" ${ink(1.2)}/><path d="M1.5 18 Q6 26 10.5 18Z" fill="#fff" ${ink(1)}/><circle cx="4.5" cy="15.5" r="0.9" fill="${INK}"/><circle cx="7.5" cy="15.5" r="0.9" fill="${INK}"/></g>
    <line x1="81" y1="51" x2="81" y2="85" stroke="#2a1d33" stroke-width="3"/>
    <rect x="39" y="51" width="84" height="34" fill="url(#g-glass)" opacity="0.5"/>
  </g>
  <polygon points="39,85 123,85 215,210 95,210" fill="url(#g-beam)" opacity="0.45"/>
  <!-- bare bulb -->
  <g class="swing" style="transform-origin:150px 26px">
    <line x1="150" y1="26" x2="150" y2="58" stroke="${INK}" stroke-width="1.5"/>
    <line x1="154" y1="30" x2="154" y2="74" stroke="#c9a15b" stroke-width="0.8"/>
    <circle cx="150" cy="66" r="26" fill="url(#g-spot)" class="pulse"/>
    <rect x="146" y="56" width="8" height="5" fill="#8a8fa8" ${ink(1.2)}/>
    <circle cx="150" cy="65" r="5.5" fill="#fff5c0" ${ink(1.2)}/>
  </g>
  <!-- evil plans corkboard -->
  <g>
    <rect x="258" y="46" width="112" height="60" rx="3" fill="#6b4226" ${ink(2)}/>
    <rect x="263" y="51" width="102" height="50" fill="#c4935a"/>
    <rect x="263" y="51" width="102" height="50" fill="url(#p-carpet)" opacity="0.4"/>
    <g ${ink(1)}>
      <rect x="270" y="56" width="28" height="20" fill="#fff" transform="rotate(-5 284 66)"/>
      <rect x="306" y="54" width="26" height="18" fill="#ffe98a" transform="rotate(4 319 63)"/>
      <rect x="338" y="58" width="22" height="26" fill="#fff" transform="rotate(-3 349 71)"/>
      <rect x="278" y="78" width="34" height="20" fill="#bde0ff" transform="rotate(3 295 88)"/>
    </g>
    <circle cx="284" cy="66" r="7" fill="#4dabff" ${ink(1)}/><path d="M280 63 q3 -2 5 1 q3 1 1 4 q-3 2 -5 -1z" fill="#3ddc84"/>
    <text x="319" y="65" font-size="5.2" text-anchor="middle" font-family="Arial Black,Arial" fill="#333" transform="rotate(4 319 63)">WORLD</text>
    <text x="319" y="70.5" font-size="3.6" text-anchor="middle" font-family="Arial" fill="#555" transform="rotate(4 319 63)">domination 2.0</text>
    <path d="M343 64 h12 M343 69 h10 M343 74 h12" stroke="#777" stroke-width="1" transform="rotate(-3 349 71)"/>
    <path d="M286 84 l6 -4 l6 3 l8 -6" stroke="#e0344f" stroke-width="1.4" fill="none" transform="rotate(3 295 88)"/>
    <path d="M284 66 L319 60 L349 71 L295 88 L284 66" stroke="#e0344f" stroke-width="1" fill="none"/>
    <g fill="#e0344f" ${ink(0.6)}><circle cx="284" cy="57" r="1.8"/><circle cx="319" cy="55" r="1.8"/><circle cx="349" cy="60" r="1.8"/><circle cx="295" cy="80" r="1.8"/></g>
  </g>
  <!-- floor -->
  <rect x="0" y="206" width="400" height="54" fill="#8a4a2a"/>
  <rect x="0" y="206" width="400" height="54" fill="url(#p-carpet)"/>
  <rect x="0" y="206" width="400" height="4" fill="#5a2a18"/>
  <ellipse cx="200" cy="240" rx="120" ry="16" fill="#6b2bd9" opacity="0.55" ${ink(2)}/>
  <ellipse cx="200" cy="240" rx="104" ry="11" fill="none" stroke="#c77dff" stroke-width="2" stroke-dasharray="6 5" opacity="0.7"/>
  <!-- couch -->
  <g transform="translate(6 148)" ${ink(2)}>
    <rect x="8" y="0" width="84" height="34" rx="9" fill="#8a9a45"/>
    <rect x="0" y="16" width="100" height="40" rx="10" fill="#7a8a3a"/>
    <rect x="-6" y="20" width="20" height="38" rx="8" fill="#6b7a30"/>
    <rect x="86" y="20" width="20" height="38" rx="8" fill="#6b7a30"/>
    <rect x="14" y="30" width="36" height="14" rx="5" fill="#9cb055"/>
    <rect x="52" y="30" width="34" height="14" rx="5" fill="#9cb055"/>
    <rect x="58" y="3" width="20" height="15" rx="3" fill="#e0344f" transform="rotate(12 68 10)"/>
    <path d="M14 8 Q28 30 22 44 L40 44 Q34 24 26 6Z" fill="#4dabff"/>
    <rect x="2" y="56" width="6" height="7" fill="#3a2a1a"/><rect x="92" y="56" width="6" height="7" fill="#3a2a1a"/>
  </g>
  <path d="M20 170 Q50 164 80 170" stroke="#b8c870" stroke-width="2" fill="none" opacity="0.6"/>
  <!-- pizza box -->
  <g transform="translate(96 214)" ${ink(1.5)}><path d="M0 8 L34 8 L40 18 L6 18Z" fill="#e8c38a"/><path d="M0 8 L34 8 L30 0 L-4 0Z" fill="#d9a860"/><circle cx="20" cy="13" r="3" fill="#e0344f"/></g>
  <!-- CRT TV on crate -->
  <g transform="translate(290 146)">
    <rect x="-4" y="40" width="54" height="24" fill="url(#g-crate)" ${ink(2)}/>
    <path d="M-4 40 L50 64 M50 40 L-4 64" stroke="#7a5528" stroke-width="2"/>
    <rect x="0" y="0" width="46" height="40" rx="6" fill="#4a4a5a" ${ink(2)}/>
    <rect x="5" y="5" width="30" height="28" rx="5" fill="#123a2a"/>
    <rect x="5" y="5" width="30" height="28" rx="5" fill="#3ddc84" opacity="0.25" class="flicker"/>
    <text x="20" y="24" font-size="13" text-anchor="middle" font-family="Arial Black,Arial" fill="#7dffb0" class="flicker">V</text>
    <circle cx="40" cy="12" r="2" fill="#aaa"/><circle cx="40" cy="20" r="2" fill="#aaa"/>
    <path d="M14 0 L6 -14 M30 0 L38 -16" stroke="${INK}" stroke-width="1.5"/>
  </g>
  <!-- lava lamp on side table -->
  <g transform="translate(350 128)">
    <circle cx="16" cy="22" r="36" fill="url(#g-glow-orange)" class="pulse"/>
    <rect x="-4" y="56" width="40" height="7" fill="#5a3820" ${ink(1.5)}/>
    <rect x="1" y="63" width="4" height="22" fill="#4a2c18" ${ink(1)}/><rect x="27" y="63" width="4" height="22" fill="#4a2c18" ${ink(1)}/>
    <path d="M6 56 L10 44 L22 44 L26 56Z" fill="#b8b8c8" ${ink(1.5)}/>
    <path d="M10 44 L6 8 Q16 0 26 8 L22 44Z" fill="url(#g-lavalamp)" opacity="0.9" ${ink(1.5)}/>
    <circle class="blob" cx="15" cy="30" r="4" fill="#ffec5c"/>
    <circle class="blob b2" cx="18" cy="20" r="3" fill="#ffec5c"/>
    <circle class="blob b3" cx="13" cy="38" r="3.5" fill="#ffec5c"/>
    <path d="M8 8 Q16 -2 24 8Z" fill="#b8b8c8" ${ink(1.5)}/>
  </g>
  <!-- stairs & KEEP OUT door -->
  <g ${ink(1.5)}>
    <rect x="378" y="120" width="30" height="86" fill="#4a2c18"/>
    <rect x="382" y="126" width="24" height="18" fill="#fff"/>
  </g>
  <text x="394" y="134" font-size="5" text-anchor="middle" font-family="Arial Black,Arial" fill="#e0344f">KEEP</text>
  <text x="394" y="141" font-size="5" text-anchor="middle" font-family="Arial Black,Arial" fill="#e0344f">OUT</text>
  ${motes(18, 11, '#fff3c4', 'drift', 50, 200, 1)}`;

// ---------------------------------------------------------------------------
// 2. Abandoned Warehouse
// ---------------------------------------------------------------------------
const WAREHOUSE = `
  <rect width="400" height="260" fill="url(#g-warehouse)"/>
  <rect width="400" height="200" fill="#6a4a3a" opacity="0.35"/>
  <rect width="400" height="200" fill="url(#p-bricks)"/>
  <!-- steel columns -->
  ${[0, 130, 270, 390].map((x) => `<rect x="${x - 6}" y="0" width="16" height="200" fill="#3a465c" ${ink(1.5)}/><path d="M${x - 2} 0 V200" stroke="#6d7c96" stroke-width="1.5"/>${[20, 60, 100, 140, 180].map((y) => `<circle cx="${x + 2}" cy="${y}" r="1.3" fill="#9aa6bd"/>`).join('')}`).join('')}
  <!-- windows -->
  ${[26, 156, 290].map((x) => `
    <rect x="${x}" y="16" width="84" height="56" fill="#0e1a36" ${ink(2.5)}/>
    ${[1, 2, 3].map((k) => `<line x1="${x + k * 21}" y1="16" x2="${x + k * 21}" y2="72" stroke="#3a465c" stroke-width="2"/>`).join('')}
    <line x1="${x}" y1="44" x2="${x + 84}" y2="44" stroke="#3a465c" stroke-width="2"/>
    <path d="M${x + 44} 47 l12 0 l-6 22z" fill="#0a1226"/>
    <rect x="${x}" y="16" width="84" height="56" fill="url(#g-glass)" opacity="0.4"/>
    <polygon points="${x},72 ${x + 84},72 ${x + 140},206 ${x + 30},206" fill="url(#g-beam)" opacity="0.3"/>`).join('')}
  <circle cx="68" cy="28" r="5" fill="#fff7cf"/>
  <!-- roll-up door with hazard stripes -->
  <g>
    <rect x="150" y="92" width="100" height="112" fill="#4a5568" ${ink(2)}/>
    ${Array.from({ length: 10 }, (_, i) => `<line x1="150" y1="${100 + i * 10}" x2="250" y2="${100 + i * 10}" stroke="#2d3748" stroke-width="2"/>`).join('')}
    <rect x="150" y="86" width="100" height="8" fill="#ffc72c" ${ink(1.5)}/>
    ${Array.from({ length: 10 }, (_, i) => `<path d="M${152 + i * 10} 94 l6 -8 h4 l-6 8z" fill="${INK}"/>`).join('')}
    <text x="200" y="130" font-size="11" text-anchor="middle" font-family="Arial Black,Arial" fill="#1a202c" opacity="0.6">EVIL INC.</text>
    <text x="200" y="142" font-size="5" text-anchor="middle" font-family="Arial" fill="#1a202c" opacity="0.6">DEFINITELY NOT A LAIR</text>
  </g>
  <!-- floor -->
  <rect x="0" y="198" width="400" height="62" fill="#4a5060"/>
  <rect x="0" y="198" width="400" height="5" fill="#6a7384" ${ink(1)}/>
  <path d="M0 250 L400 222" stroke="#ffc72c" stroke-width="3" stroke-dasharray="14 10" opacity="0.6"/>
  <ellipse cx="116" cy="238" rx="30" ry="6" fill="#1a1d26" opacity="0.6"/>
  <!-- hanging lamps -->
  ${[100, 300].map((x, i) => `
    <g class="swing" style="transform-origin:${x}px 0px;animation-delay:${i * 0.8}s">
      <line x1="${x}" y1="0" x2="${x}" y2="80" stroke="${INK}" stroke-width="1.5"/>
      <polygon points="${x},88 ${x - 70},210 ${x + 70},210" fill="url(#g-beam)" opacity="0.6"/>
      <path d="M${x - 16} 92 L${x - 7} 78 L${x + 7} 78 L${x + 16} 92Z" fill="#4a6a3a" ${ink(1.8)}/>
      <ellipse cx="${x}" cy="92" rx="6" ry="3" fill="#fff7a8"/>
    </g>`).join('')}
  <!-- crates -->
  ${[[4, 160], [46, 160], [24, 122], [350, 160]].map(([x, y]) => `
    <g transform="translate(${x} ${y})">
      <rect width="44" height="40" fill="url(#g-crate)" ${ink(2)}/>
      <path d="M2 2 L42 38 M42 2 L2 38" stroke="#7a5528" stroke-width="3.5"/>
      <rect x="0" y="0" width="44" height="40" fill="none" stroke="#a87a40" stroke-width="3" stroke-dasharray="44 4" opacity="0.4"/>
      <rect x="5" y="14" width="34" height="11" fill="#d9ac6b" ${ink(1)}/>
      <text x="22" y="22.5" font-size="7" text-anchor="middle" font-family="Arial Black,Arial" fill="#6b1a1a">EVIL INC</text>
    </g>`).join('')}
  <!-- money bags pallet -->
  <g transform="translate(96 186)" ${ink(1.5)}>
    <rect x="0" y="14" width="44" height="6" fill="#a87a40"/>
    <path d="M4 14 Q2 2 12 2 Q20 2 18 14Z" fill="#c9a15b"/><path d="M22 14 Q20 0 30 0 Q40 2 38 14Z" fill="#c9a15b"/>
  </g>
  <text x="106" y="197" font-size="6" font-family="Arial Black,Arial" fill="#5a3a10">$</text><text x="126" y="196" font-size="6" font-family="Arial Black,Arial" fill="#5a3a10">$</text>
  <!-- clone vats with pipes -->
  <path d="M276 118 V100 H336 V118" stroke="${INK}" stroke-width="7" fill="none"/><path d="M276 118 V100 H336 V118" stroke="#6d7c96" stroke-width="4" fill="none"/>
  ${[260, 318].map((x, i) => `
    <g transform="translate(${x} 118)">
      <ellipse cx="16" cy="40" rx="32" ry="48" fill="url(#g-glow-green)" class="pulse" style="animation-delay:${i}s"/>
      <rect x="-2" y="0" width="36" height="9" rx="2" fill="url(#g-dark-metal)" ${ink(1.8)}/>
      <rect x="1" y="9" width="30" height="64" fill="url(#g-green-goo)" opacity="0.8"/>
      <path d="M16 22 q6 0 6 7 q0 6 -3 8 l3 14 l-4 0 l-2 -10 l-2 10 l-4 0 l3 -14 q-3 -2 -3 -8 q0 -7 6 -7z" fill="#0d4a22" opacity="0.65" class="float-slow"/>
      ${bubbles([7, 13, 21, 26], 66, '#e0ffd6')}
      <rect x="1" y="9" width="30" height="64" fill="url(#g-glass)"/>
      <rect x="1" y="9" width="30" height="64" fill="none" ${ink(1.8)}/>
      <rect x="-2" y="73" width="36" height="9" rx="2" fill="url(#g-dark-metal)" ${ink(1.8)}/>
      <circle cx="8" cy="77.5" r="1.8" fill="#3ddc84" class="blink"/><circle cx="14" cy="77.5" r="1.8" fill="#ff4d6d"/>
    </g>`).join('')}
  ${motes(20, 21, '#dfe8f2', 'drift', 70, 200, 0.9)}`;

// ---------------------------------------------------------------------------
// 3. Volcano Lair
// ---------------------------------------------------------------------------
const VOLCANO = `
  <rect width="400" height="260" fill="url(#g-volcano)"/>
  <!-- distant cavern layers -->
  <path d="M0 60 L40 40 L80 70 L130 44 L170 66 L220 38 L270 64 L320 40 L360 62 L400 44 V210 H0Z" fill="#3a1210" opacity="0.8"/>
  <!-- lava fall -->
  <path d="M38 0 Q48 60 36 120 Q32 170 44 206 L80 206 Q70 160 72 110 Q76 50 72 0 Z" fill="url(#g-lava)" class="lava-flow" ${ink(2)}/>
  <g class="lava-stripes" stroke="#ffe8a0" stroke-width="2" opacity="0.7" fill="none" stroke-linecap="round">
    <path d="M52 10 Q58 60 50 110"/><path d="M62 40 Q64 90 58 150"/><path d="M48 120 Q46 160 54 200"/>
  </g>
  <ellipse cx="58" cy="110" rx="62" ry="120" fill="url(#g-glow-orange)" opacity="0.6" class="pulse"/>
  <!-- cave ceiling -->
  <path d="M0 0 H400 V24 L382 42 L364 20 L342 46 L318 18 L292 38 L270 16 L246 40 L222 14 L198 36 L174 12 L150 38 L126 16 L104 32 L90 10 L80 0Z" fill="#1a0808" ${ink(2)}/>
  <path d="M342 46 l2 10 l-4 -4z M246 40 l1 12 l-4 -5z M150 38 l2 9 l-4 -3z" fill="#1a0808"/>
  <path d="M338 0 L400 0 L400 210 L370 200 L386 150 L362 110 L380 70 L354 40Z" fill="#2a0c0c" ${ink(2)}/>
  <!-- skull banner -->
  <g transform="translate(94 50)">
    <path d="M0 0 H28 V44 L14 36 L0 44Z" fill="#6b1030" ${ink(2)}/>
    <circle cx="14" cy="16" r="8" fill="#f2f2f2" ${ink(1.2)}/><rect x="10" y="21" width="8" height="5" fill="#f2f2f2" ${ink(1)}/>
    <circle cx="11" cy="16" r="2" fill="${INK}"/><circle cx="17" cy="16" r="2" fill="${INK}"/>
  </g>
  <!-- monitor wall -->
  <g transform="translate(132 44)">
    <rect x="-7" y="-7" width="150" height="86" rx="6" fill="#1b1b24" ${ink(2.5)}/>
    <rect width="136" height="72" rx="3" fill="#07212e"/>
    <path d="M14 26 q9 -11 23 -5 q7 7 2 16 q-9 7 -7 18 q-9 2 -12 -9 q-9 -7 -6 -20z M60 18 q14 -7 26 2 q5 11 -5 14 q-4 12 -12 7 q-7 -9 -9 -23z M94 24 q14 -5 29 4 q4 11 -9 11 q-7 9 -14 4 q-9 -7 -6 -19z" fill="#1d6b4a"/>
    ${Array.from({ length: 6 }, (_, i) => `<line x1="0" y1="${i * 14}" x2="136" y2="${i * 14}" stroke="#0e3a4f" stroke-width="0.6"/>`).join('')}
    <circle class="blink" cx="34" cy="36" r="3" fill="#ff3b3b"/>
    <circle class="blink" style="animation-delay:.5s" cx="76" cy="26" r="3" fill="#ff3b3b"/>
    <circle class="blink" style="animation-delay:1s" cx="110" cy="32" r="3" fill="#ff3b3b"/>
    <rect class="scanline" x="0" y="0" width="136" height="6" fill="#3ddc84" opacity="0.12"/>
    <text x="68" y="66" font-size="6.2" text-anchor="middle" font-family="Courier New,monospace" fill="#3ddc84">TARGETS ACQUIRED: ALL OF THEM</text>
    <rect width="136" height="72" rx="3" fill="url(#g-glass)" opacity="0.5"/>
  </g>
  <!-- catwalk -->
  <rect x="100" y="150" width="200" height="6" fill="#3a3a44" ${ink(1.5)}/>
  ${Array.from({ length: 11 }, (_, i) => `<rect x="${102 + i * 19.5}" y="132" width="3" height="18" fill="#3a3a44"/>`).join('')}
  <rect x="100" y="130" width="200" height="4" fill="#5a5a66" ${ink(1.2)}/>
  <!-- tesla coil -->
  <g transform="translate(318 92)">
    <circle cx="20" cy="4" r="32" fill="url(#g-glow-blue)" class="pulse"/>
    <rect x="12" y="10" width="16" height="100" fill="url(#g-dark-metal)" ${ink(2)}/>
    ${Array.from({ length: 8 }, (_, i) => `<rect x="9" y="${16 + i * 10}" width="22" height="4" rx="2" fill="#c07a3a" ${ink(1)}/>`).join('')}
    <ellipse cx="20" cy="6" rx="17" ry="8" fill="url(#g-metal)" ${ink(2)}/>
    <path class="spark" d="M20 0 l-8 -14 l6 2 l-10 -16" stroke="#dff" stroke-width="2" fill="none"/>
    <path class="spark s2" d="M22 0 l10 -12 l-6 0 l12 -14" stroke="#dff" stroke-width="2" fill="none"/>
  </g>
  <!-- floor & lava pool -->
  <path d="M0 206 H400 V260 H0Z" fill="#2b1414"/>
  <path d="M0 206 Q100 196 200 206 T400 206 V214 H0Z" fill="#3a1a14" ${ink(1.5)}/>
  <ellipse cx="200" cy="246" rx="126" ry="13" fill="url(#g-lava)" opacity="0.95" class="lava-flow" ${ink(2)}/>
  <ellipse cx="200" cy="244" rx="90" ry="5" fill="#ffe8a0" opacity="0.4"/>
  ${bubbles([110, 150, 200, 250, 290], 246, '#ffd166')}
  ${motes(26, 31, '#ffb347', 'ember', 60, 250, 1.4)}`;

// ---------------------------------------------------------------------------
// 4. Undersea Fortress
// ---------------------------------------------------------------------------
const UNDERSEA = `
  <rect width="400" height="260" fill="url(#g-sea)"/>
  ${[60, 150, 250, 340].map((x, i) => `<polygon class="ray" style="animation-delay:${i * 0.9}s" points="${x - 10},0 ${x + 14},0 ${x + 60},210 ${x + 10},210" fill="#bff6ff" opacity="0.08"/>`).join('')}
  <!-- distant rocks & coral -->
  <path d="M0 200 Q30 150 70 180 Q100 140 140 190 L260 190 Q300 150 330 175 Q370 140 400 180 V210 H0Z" fill="#073a5c" opacity="0.8"/>
  <g ${ink(1.5)}>
    <path d="M300 200 q-4 -20 4 -28 q-2 -10 6 -14 M304 172 q8 -4 10 -12" stroke="#ff6b9d" stroke-width="4" fill="none"/>
    <path d="M86 200 q2 -16 -4 -24 M84 186 q8 -6 10 -14" stroke="#ffb02e" stroke-width="4" fill="none"/>
  </g>
  <!-- kelp -->
  ${[16, 40, 364, 386].map((x, i) => `<path class="sway" style="transform-origin:${x}px 210px;animation-delay:${i * 0.6}s" d="M${x} 210 q-12 -30 0 -60 q12 -30 0 -70 q-8 -20 4 -40" stroke="#2fae6b" stroke-width="7" fill="none" stroke-linecap="round"/>`).join('')}
  <!-- jellyfish -->
  ${[[330, 60], [70, 90]].map(([x, y], i) => `
    <g class="bob" style="animation-delay:${i * 1.3}s">
      <circle cx="${x}" cy="${y}" r="16" fill="url(#g-glow-purple)"/>
      <path d="M${x - 9} ${y} Q${x} ${y - 14} ${x + 9} ${y} Z" fill="#e0a8ff" fill-opacity="0.8" ${ink(1.2)}/>
      <path d="M${x - 6} ${y} q-2 8 1 14 M${x} ${y} q2 8 -1 16 M${x + 6} ${y} q-2 8 1 12" stroke="#e0a8ff" stroke-width="1.2" fill="none"/>
    </g>`).join('')}
  <!-- fish school -->
  <g class="swim" style="animation-duration:14s">
    ${[[0, 50, 1], [-24, 60, 0.8], [-12, 40, 0.7], [-40, 48, 0.9]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="10" ry="5.5" fill="#ffb02e" ${ink(1.2)}/><path d="M-9 0 l-8 -6 v12z" fill="#ffb02e" ${ink(1.2)}/><path d="M-2 -5 v10" stroke="#fff" stroke-width="2"/><circle cx="5" cy="-1" r="1.4" fill="${INK}"/></g>`).join('')}
  </g>
  <!-- laser shark -->
  <g class="swim-rev" style="animation-duration:18s">
    <g transform="translate(0 106)" ${ink(1.8)}>
      <path d="M-42 0 Q-10 -19 30 -5 L46 0 L30 7 Q-10 17 -42 0Z" fill="#6d8199"/>
      <path d="M-2 -11 L6 -28 L13 -9Z" fill="#6d8199"/>
      <path d="M-42 0 L-58 -15 L-52 0 L-58 15Z" fill="#6d8199"/>
      <path d="M-30 4 Q0 13 34 4 L30 7 Q-10 17 -42 0Z" fill="#dfe8f2" stroke="none"/>
      <path d="M22 5 l2 3 l2 -3 l2 3 l2 -3" stroke="#fff" stroke-width="1" fill="none"/>
      <circle cx="28" cy="-3" r="1.8" fill="${INK}" stroke="none"/>
      <rect x="8" y="-17" width="18" height="7" rx="2" fill="#3a3a44"/>
      <circle cx="26" cy="-13.5" r="2.5" fill="#ff2b4a"/>
    </g>
    <line class="laser" x1="26" y1="92.5" x2="130" y2="92.5" stroke="#ff2b4a" stroke-width="2.2"/>
  </g>
  <!-- dome glass frame -->
  <path d="M0 210 V120 Q200 -40 400 120 V210Z" fill="none" stroke="${INK}" stroke-width="10" opacity="0.9"/>
  <path d="M0 210 V120 Q200 -40 400 120 V210Z" fill="none" stroke="#9ab3c9" stroke-width="6"/>
  <path d="M100 210 V70 M200 210 V38 M300 210 V70" stroke="#9ab3c9" stroke-width="3" opacity="0.6"/>
  <path d="M0 150 Q200 40 400 150" stroke="#9ab3c9" stroke-width="3" fill="none" opacity="0.6"/>
  ${[[20, 118], [100, 66], [200, 42], [300, 66], [380, 118]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#c9dcec" ${ink(1)}/>`).join('')}
  <path d="M0 210 V120 Q200 -40 400 120 V210Z" fill="url(#g-glass)" opacity="0.4"/>
  <path d="M30 110 Q120 30 200 22" stroke="#fff" stroke-width="3" fill="none" opacity="0.18" stroke-linecap="round"/>
  ${bubbles([80, 130, 190, 240, 310, 350], 200)}
  <!-- floor & console -->
  <rect x="0" y="204" width="400" height="56" fill="#1d3448"/>
  <rect x="0" y="204" width="400" height="56" fill="url(#p-grate)" opacity="0.5"/>
  <rect x="0" y="204" width="400" height="5" fill="#3a5a78" ${ink(1)}/>
  ${[20, 380].map((x) => `<circle cx="${x}" cy="232" r="10" fill="#0d1f2e" ${ink(2)}/><circle cx="${x}" cy="232" r="7" fill="none" stroke="#6d8aa6" stroke-width="2"/><circle cx="${x - 2}" cy="230" r="3" fill="#2a6f9f" opacity="0.8"/>`).join('')}
  <g transform="translate(46 190)" ${ink(1.8)}>
    <path d="M0 20 L6 0 H56 L62 20Z" fill="#2a4a68"/>
    <rect x="10" y="4" width="18" height="10" rx="2" fill="#0d2a3a"/>
  </g>
  <circle cx="61" cy="199" r="2.5" fill="#3ddc84" class="blink"/><circle cx="84" cy="199" r="2.5" fill="#ff4d6d"/><circle cx="92" cy="199" r="2.5" fill="#ffd23f" class="blink" style="animation-delay:.6s"/>
  <path d="M60 196 l3 -3 l3 2 l3 -4 l3 3" stroke="#7fe3ff" stroke-width="1" fill="none"/>
  ${motes(24, 41, '#bff6ff', 'drift', 40, 200, 0.8)}`;

// ---------------------------------------------------------------------------
// 5. Moon Base
// ---------------------------------------------------------------------------
const MOON = `
  <rect width="400" height="260" fill="url(#g-space)"/>
  <ellipse cx="120" cy="60" rx="140" ry="50" fill="#7b2cff" opacity="0.12" filter="url(#f-blur)"/>
  <ellipse cx="260" cy="110" rx="120" ry="40" fill="#ff3d9a" opacity="0.08" filter="url(#f-blur)"/>
  ${stars(80, 7, 180)}
  <path class="shooting-star" d="M60 30 l40 12" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
  <!-- earth -->
  <g transform="translate(320 60)">
    <circle r="58" fill="url(#g-glow-blue)"/>
    <circle r="37" fill="url(#g-earth)" ${ink(2.5)}/>
    <path d="M-20 -18 q10 -10 22 -4 q4 10 -6 14 q-2 12 -12 8 q-10 -6 -4 -18z M8 6 q12 -4 18 6 q-2 12 -12 12 q-8 -6 -6 -18z M-30 10 q6 -2 8 4 q-4 4 -8 0z" fill="#3fbf6a" ${ink(1.2)}/>
    <path d="M-30 -6 Q0 -16 30 -4" stroke="#fff" stroke-width="3" opacity="0.4" fill="none"/>
    <path d="M10 -34 A37 37 0 0 1 37 0 A37 37 0 0 1 10 34 A30 37 0 0 0 10 -34Z" fill="#000" opacity="0.25"/>
    <circle class="blink" cx="-6" cy="-2" r="4" fill="none" stroke="#ff3b3b" stroke-width="1.8"/>
    <path d="M-6 -8 V-12 M-6 4 V8 M-12 -2 H-16 M0 -2 H4" stroke="#ff3b3b" stroke-width="1.4"/>
  </g>
  <!-- satellite -->
  <g class="orbit" style="transform-origin:320px 60px">
    <g transform="translate(262 18)" ${ink(1)}>
      <rect x="-3" y="-3" width="6" height="6" fill="url(#g-metal)"/>
      <rect x="-16" y="-2" width="11" height="4" fill="#2e8bff"/><rect x="5" y="-2" width="11" height="4" fill="#2e8bff"/>
    </g>
  </g>
  <!-- moon surface -->
  <path d="M0 178 Q60 162 130 174 Q200 186 270 168 Q340 156 400 174 V260 H0Z" fill="url(#g-moon)" ${ink(2.5)}/>
  <path d="M0 178 Q60 162 130 174 Q200 186 270 168 Q340 156 400 174 V260 H0Z" fill="url(#p-halftone)" opacity="0.08"/>
  ${[[40, 204, 18], [150, 226, 12], [236, 198, 9], [334, 216, 20], [96, 246, 8]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.4}" fill="#77728c" ${ink(1.5)}/><ellipse cx="${x + 1}" cy="${y + 1}" rx="${r * 0.75}" ry="${r * 0.26}" fill="#5f5a75"/>`).join('')}
  <!-- dome base -->
  <g transform="translate(14 118)">
    <circle cx="50" cy="40" r="60" fill="url(#g-glow-purple)" opacity="0.6"/>
    <rect x="-6" y="60" width="116" height="12" rx="3" fill="url(#g-dark-metal)" ${ink(2)}/>
    <rect x="16" y="34" width="26" height="26" fill="#4a3a6a" ${ink(1.5)}/><rect x="54" y="26" width="30" height="34" fill="#5a3a8a" ${ink(1.5)}/>
    <rect x="21" y="39" width="7" height="7" fill="#ffd23f" class="blink"/><rect x="61" y="32" width="7" height="7" fill="#ffd23f"/><rect x="72" y="44" width="7" height="7" fill="#ffd23f" class="blink" style="animation-delay:1s"/>
    <path d="M0 64 Q0 8 50 8 Q100 8 100 64Z" fill="#b8e6ff" opacity="0.3" ${ink(2.5)}/>
    <path d="M14 30 Q24 14 44 12" stroke="#fff" stroke-width="3" fill="none" opacity="0.5" stroke-linecap="round"/>
    <line x1="50" y1="8" x2="50" y2="-10" stroke="#aaa" stroke-width="2"/><circle class="blink" cx="50" cy="-12" r="3.5" fill="#ff3b3b"/>
  </g>
  <!-- villain flag -->
  <g transform="translate(128 150)">
    <line x1="0" y1="0" x2="0" y2="34" stroke="${INK}" stroke-width="3"/><line x1="0" y1="0" x2="0" y2="34" stroke="#ccc" stroke-width="1.5"/>
    <path class="flag" d="M1 1 H24 L20 8 L24 15 H1Z" fill="#7b2cff" ${ink(1.5)}/>
    <path d="M7 4 L11 12 L15 4" stroke="#ffc72c" stroke-width="2" fill="none"/>
  </g>
  <!-- doom laser -->
  <g transform="translate(296 146)">
    <rect x="-22" y="24" width="66" height="22" rx="4" fill="url(#g-dark-metal)" ${ink(2)}/>
    <g transform="rotate(-38 10 20)">
      <rect x="0" y="9" width="74" height="20" rx="6" fill="url(#g-metal)" ${ink(2)}/>
      <rect x="18" y="9" width="6" height="20" fill="#5c6780"/><rect x="40" y="9" width="6" height="20" fill="#5c6780"/>
      <rect x="70" y="5" width="11" height="28" rx="3" fill="#3a3a44" ${ink(1.8)}/>
      <circle cx="86" cy="19" r="16" fill="url(#g-glow-purple)" class="pulse"/>
      <circle cx="84" cy="19" r="6" fill="#ff3b5c" class="pulse" ${ink(1.2)}/>
    </g>
    <circle cx="10" cy="22" r="15" fill="#4a3a6a" ${ink(2)}/><circle cx="10" cy="22" r="6" fill="#b04dff"/>
  </g>`;

export const SCENES = [BASEMENT, WAREHOUSE, VOLCANO, UNDERSEA, MOON];

export function sceneSVG(lair: number): string {
  return `<svg class="scene-bg" viewBox="0 0 400 260" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">${FINISH_DEFS}${SCENES[lair] ?? BASEMENT}${FINISH}</svg>`;
}
