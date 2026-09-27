// Lair backgrounds. All scenes are 400x260; the villain is layered on top in HTML.

function stars(n: number, seed: number, maxY: number): string {
  let out = '';
  let x = seed;
  const rnd = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < n; i++) {
    const cx = (rnd() * 400).toFixed(1);
    const cy = (rnd() * maxY).toFixed(1);
    const r = (0.4 + rnd() * 1.2).toFixed(2);
    const d = (rnd() * 3).toFixed(2);
    out += `<circle class="twinkle" style="animation-delay:${d}s" cx="${cx}" cy="${cy}" r="${r}" fill="#fff"/>`;
  }
  return out;
}

function bubbles(xs: number[], y: number, color = '#bff6ff'): string {
  return xs
    .map((x, i) => `<circle class="rise" style="animation-delay:${(i * 0.7) % 3}s;animation-duration:${2.5 + (i % 3)}s" cx="${x}" cy="${y}" r="${1.5 + (i % 3)}" fill="none" stroke="${color}" stroke-width="1"/>`)
    .join('');
}

const BASEMENT = `
  <rect width="400" height="260" fill="url(#g-basement-wall)"/>
  <g>
    ${Array.from({ length: 20 }, (_, i) => `<rect x="${i * 20}" y="112" width="20" height="100" fill="url(#g-panel)"/><line x1="${i * 20}" y1="112" x2="${i * 20}" y2="212" stroke="#4a2c18" stroke-width="1.5"/>`).join('')}
    <rect x="0" y="106" width="400" height="7" fill="#5a3820"/>
  </g>
  <rect x="0" y="206" width="400" height="54" fill="#6a3f2a"/>
  <g opacity="0.25">${Array.from({ length: 40 }, (_, i) => `<path d="M${i * 10 + 3} 212 l2 -4 l2 4" stroke="#3a1f12" fill="none"/><path d="M${i * 10 + 8} 232 l2 -4 l2 4" stroke="#3a1f12" fill="none"/><path d="M${i * 10 + 1} 250 l2 -4 l2 4" stroke="#3a1f12" fill="none"/>`).join('')}</g>
  <!-- window -->
  <rect x="36" y="22" width="90" height="42" rx="3" fill="#2a1d33"/>
  <rect x="41" y="27" width="80" height="32" fill="#0f1d4a"/>
  <circle cx="102" cy="37" r="7" fill="#fff7cf"/>
  <circle cx="99" cy="35" r="7" fill="#0f1d4a"/>
  <path d="M41 59 l4 -8 l3 8 l4 -10 l3 10 l5 -7 l3 7 l4 -9 l4 9 l4 -6 l3 6 l5 -9 l3 9 l4 -7 l4 7 l5 -10 l3 10 l4 -6 l3 6 l5 -8 l3 8 Z" fill="#2f8f3a"/>
  <line x1="81" y1="27" x2="81" y2="59" stroke="#2a1d33" stroke-width="3"/>
  <polygon points="41,59 121,59 210,210 90,210" fill="url(#g-beam)" opacity="0.5"/>
  <!-- string lights -->
  <path d="M0 14 Q50 30 100 14 Q150 30 200 14 Q250 30 300 14 Q350 30 400 14" stroke="#222" stroke-width="1.2" fill="none"/>
  ${[20, 45, 70, 120, 145, 170, 220, 245, 270, 320, 345, 370].map((x, i) => {
    const c = ['#ff4d6d', '#ffd23f', '#3ddc84', '#4dabff', '#c77dff'][i % 5];
    const y = 14 + 16 * Math.sin(((x % 100) / 100) * Math.PI) * 0.9;
    return `<circle class="blink" style="animation-delay:${(i * 0.37) % 2}s" cx="${x}" cy="${y.toFixed(1)}" r="3.2" fill="${c}"/>`;
  }).join('')}
  <!-- evil plans corkboard -->
  <rect x="262" y="34" width="104" height="66" rx="3" fill="#6b4226"/>
  <rect x="266" y="38" width="96" height="58" fill="#c4935a"/>
  <rect x="272" y="44" width="26" height="20" fill="#fff" transform="rotate(-5 285 54)"/>
  <rect x="306" y="42" width="24" height="18" fill="#ffe98a" transform="rotate(4 318 51)"/>
  <rect x="334" y="48" width="22" height="24" fill="#fff" transform="rotate(-3 345 60)"/>
  <rect x="280" y="68" width="30" height="22" fill="#bde0ff" transform="rotate(3 295 79)"/>
  <circle cx="345" cy="58" r="6" fill="none" stroke="#e0344f" stroke-width="1.5"/>
  <text x="318" y="54" font-size="5" text-anchor="middle" font-family="Arial" font-weight="bold" fill="#333" transform="rotate(4 318 51)">WORLD</text>
  <text x="285" y="55" font-size="9" text-anchor="middle" fill="#333" transform="rotate(-5 285 54)">🌍</text>
  <path d="M285 54 L318 51 L345 60 L295 79 L285 54" stroke="#e0344f" stroke-width="0.9" fill="none"/>
  <g fill="#e0344f"><circle cx="285" cy="46" r="1.6"/><circle cx="318" cy="44" r="1.6"/><circle cx="345" cy="50" r="1.6"/><circle cx="295" cy="70" r="1.6"/></g>
  <!-- couch -->
  <g transform="translate(18 150)">
    <rect x="0" y="14" width="96" height="40" rx="10" fill="#7a8a3a"/>
    <rect x="8" y="0" width="80" height="30" rx="8" fill="#8a9a45"/>
    <rect x="-4" y="20" width="18" height="36" rx="7" fill="#6b7a30"/>
    <rect x="82" y="20" width="18" height="36" rx="7" fill="#6b7a30"/>
    <rect x="14" y="30" width="34" height="14" rx="5" fill="#96a852"/>
    <rect x="50" y="30" width="34" height="14" rx="5" fill="#96a852"/>
    <rect x="60" y="4" width="18" height="14" rx="3" fill="#e0344f" transform="rotate(12 69 11)"/>
    <rect x="4" y="54" width="6" height="6" fill="#3a2a1a"/><rect x="86" y="54" width="6" height="6" fill="#3a2a1a"/>
  </g>
  <!-- lava lamp on side table -->
  <g transform="translate(330 128)">
    <circle cx="16" cy="18" r="34" fill="url(#g-glow-orange)" class="pulse"/>
    <rect x="-2" y="56" width="36" height="6" fill="#5a3820"/>
    <rect x="2" y="62" width="4" height="26" fill="#4a2c18"/><rect x="26" y="62" width="4" height="26" fill="#4a2c18"/>
    <path d="M6 56 L10 44 L22 44 L26 56Z" fill="#b8b8c8"/>
    <path d="M10 44 L6 8 Q16 0 26 8 L22 44Z" fill="url(#g-lavalamp)" opacity="0.85"/>
    <circle class="blob" cx="15" cy="30" r="4" fill="#ffec5c"/>
    <circle class="blob b2" cx="18" cy="20" r="3" fill="#ffec5c"/>
    <circle class="blob b3" cx="13" cy="38" r="3.5" fill="#ffec5c"/>
    <path d="M8 8 Q16 -2 24 8Z" fill="#b8b8c8"/>
  </g>
  <!-- stairs -->
  <g fill="#4a2c18" stroke="#2e1a0e" stroke-width="1">
    <polygon points="232,206 250,206 250,196 232,196"/>
    <polygon points="244,196 262,196 262,186 244,186"/>
    <polygon points="256,186 274,186 274,176 256,176"/>
  </g>`;

const WAREHOUSE = `
  <rect width="400" height="260" fill="url(#g-warehouse)"/>
  ${Array.from({ length: 16 }, (_, i) => `<line x1="${i * 26}" y1="0" x2="${i * 26}" y2="200" stroke="#1d2533" stroke-width="2"/>`).join('')}
  <!-- windows -->
  ${[30, 160, 290].map((x) => `
    <rect x="${x}" y="18" width="80" height="54" fill="#0e1a36" stroke="#3a465c" stroke-width="3"/>
    <line x1="${x + 40}" y1="18" x2="${x + 40}" y2="72" stroke="#3a465c" stroke-width="2"/>
    <line x1="${x}" y1="45" x2="${x + 80}" y2="45" stroke="#3a465c" stroke-width="2"/>
    <path d="M${x + 44} 48 l12 0 l-6 20z" fill="#0a1226" opacity="0.8"/>
    <polygon points="${x},72 ${x + 80},72 ${x + 130},206 ${x + 30},206" fill="url(#g-beam)" opacity="0.35"/>`).join('')}
  <circle cx="72" cy="30" r="5" fill="#fff7cf"/>
  <rect x="0" y="198" width="400" height="62" fill="#3b4250"/>
  <rect x="0" y="198" width="400" height="4" fill="#545c6c"/>
  <ellipse cx="200" cy="236" rx="60" ry="8" fill="#2c323d" opacity="0.7"/>
  <!-- hanging lamps -->
  ${[110, 290].map((x, i) => `
    <g class="swing" style="transform-origin:${x}px 0px;animation-delay:${i * 0.8}s">
      <line x1="${x}" y1="0" x2="${x}" y2="80" stroke="#111" stroke-width="1.5"/>
      <polygon points="${x},82 ${x - 70},210 ${x + 70},210" fill="url(#g-beam)" opacity="0.6"/>
      <path d="M${x - 14} 90 L${x - 6} 78 L${x + 6} 78 L${x + 14} 90Z" fill="#4a5a3a"/>
      <circle cx="${x}" cy="90" r="4" fill="#fff7a8"/>
    </g>`).join('')}
  <!-- crates -->
  ${[[8, 162], [52, 162], [30, 126], [338, 162]].map(([x, y]) => `
    <g transform="translate(${x} ${y})">
      <rect width="42" height="38" fill="url(#g-crate)" stroke="#5a3d18" stroke-width="2"/>
      <path d="M0 0 L42 38 M42 0 L0 38" stroke="#7a5528" stroke-width="3"/>
      <rect x="6" y="14" width="30" height="10" fill="#c79a5b"/>
      <text x="21" y="22" font-size="6.5" text-anchor="middle" font-family="Arial Black,Arial" font-weight="900" fill="#5a1a1a">EVIL INC</text>
    </g>`).join('')}
  <!-- clone vats -->
  ${[262, 300].map((x, i) => `
    <g transform="translate(${x} 120)">
      <ellipse cx="16" cy="40" rx="30" ry="46" fill="url(#g-glow-green)" class="pulse" style="animation-delay:${i}s"/>
      <rect x="0" y="0" width="32" height="8" rx="2" fill="url(#g-dark-metal)"/>
      <rect x="2" y="8" width="28" height="64" fill="url(#g-green-goo)" opacity="0.75"/>
      <path d="M16 22 q6 0 6 7 q0 6 -3 8 l3 14 l-4 0 l-2 -10 l-2 10 l-4 0 l3 -14 q-3 -2 -3 -8 q0 -7 6 -7z" fill="#0d4a22" opacity="0.6"/>
      ${bubbles([8, 14, 22, 26], 66, '#e0ffd6')}
      <rect x="2" y="8" width="28" height="64" fill="url(#g-glass)"/>
      <rect x="0" y="72" width="32" height="8" rx="2" fill="url(#g-dark-metal)"/>
    </g>`).join('')}`;

const VOLCANO = `
  <rect width="400" height="260" fill="url(#g-volcano)"/>
  <!-- lava fall -->
  <path d="M40 0 Q48 60 38 120 Q34 170 46 206 L78 206 Q70 160 72 110 Q76 50 70 0Z" fill="url(#g-lava)" class="lava-flow"/>
  <ellipse cx="58" cy="100" rx="60" ry="110" fill="url(#g-glow-orange)" opacity="0.6" class="pulse"/>
  <!-- cave rocks -->
  <path d="M0 0 H400 V26 L380 40 L362 22 L340 44 L318 20 L292 36 L270 18 L246 38 L224 16 L200 34 L176 14 L150 36 L128 18 L104 30 L90 12 L80 0Z" fill="#1a0808"/>
  <path d="M340 0 L400 0 L400 210 L372 200 L386 150 L364 110 L380 70 L356 40Z" fill="#240c0c"/>
  <!-- monitor wall -->
  <g transform="translate(120 44)">
    <rect x="-6" y="-6" width="172" height="92" rx="6" fill="#1b1b24"/>
    <rect width="160" height="80" rx="3" fill="#07212e"/>
    <path d="M18 30 q10 -12 26 -6 q8 8 2 18 q-10 8 -8 20 q-10 2 -14 -10 q-10 -8 -6 -22z M70 20 q16 -8 30 2 q6 12 -6 16 q-4 14 -14 8 q-8 -10 -10 -26z M110 26 q16 -6 34 4 q4 12 -10 12 q-8 10 -16 4 q-10 -8 -8 -20z M118 54 q10 -2 14 8 q-6 8 -14 2z" fill="#1d6b4a"/>
    ${Array.from({ length: 6 }, (_, i) => `<line x1="0" y1="${i * 16}" x2="160" y2="${i * 16}" stroke="#0e3a4f" stroke-width="0.6"/>`).join('')}
    <circle class="blink" cx="40" cy="40" r="3" fill="#ff3b3b"/>
    <circle class="blink" style="animation-delay:.5s" cx="88" cy="30" r="3" fill="#ff3b3b"/>
    <circle class="blink" style="animation-delay:1s" cx="128" cy="36" r="3" fill="#ff3b3b"/>
    <text x="80" y="74" font-size="7" text-anchor="middle" font-family="Courier New,monospace" fill="#3ddc84">TARGETS ACQUIRED: ALL OF THEM</text>
    <rect width="160" height="80" rx="3" fill="url(#g-glass)" opacity="0.5"/>
  </g>
  <!-- catwalk -->
  <rect x="96" y="150" width="210" height="6" fill="#3a3a44"/>
  ${Array.from({ length: 11 }, (_, i) => `<rect x="${98 + i * 20}" y="132" width="3" height="18" fill="#3a3a44"/>`).join('')}
  <rect x="96" y="130" width="210" height="4" fill="#4a4a56"/>
  <!-- tesla coil -->
  <g transform="translate(318 96)">
    <circle cx="20" cy="4" r="30" fill="url(#g-glow-blue)" class="pulse"/>
    <rect x="12" y="10" width="16" height="96" fill="url(#g-dark-metal)"/>
    ${Array.from({ length: 8 }, (_, i) => `<rect x="9" y="${16 + i * 10}" width="22" height="4" rx="2" fill="#c07a3a"/>`).join('')}
    <ellipse cx="20" cy="6" rx="16" ry="8" fill="url(#g-metal)"/>
    <path class="spark" d="M20 0 l-8 -14 l6 2 l-10 -16" stroke="#bff" stroke-width="1.5" fill="none"/>
    <path class="spark s2" d="M22 0 l10 -12 l-6 0 l12 -14" stroke="#bff" stroke-width="1.5" fill="none"/>
  </g>
  <!-- floor & lava pool -->
  <path d="M0 206 H400 V260 H0Z" fill="#2b1414"/>
  <path d="M0 206 Q100 196 200 206 T400 206 V214 H0Z" fill="#3a1a14"/>
  <ellipse cx="200" cy="246" rx="120" ry="12" fill="url(#g-lava)" opacity="0.9" class="lava-flow"/>
  ${bubbles([110, 150, 200, 250, 290], 246, '#ffd166')}`;

const UNDERSEA = `
  <rect width="400" height="260" fill="url(#g-sea)"/>
  ${[60, 150, 250, 340].map((x, i) => `<polygon class="ray" style="animation-delay:${i * 0.9}s" points="${x - 10},0 ${x + 14},0 ${x + 60},210 ${x + 10},210" fill="#bff6ff" opacity="0.08"/>`).join('')}
  <!-- kelp -->
  ${[20, 44, 360, 382].map((x, i) => `<path class="sway" style="transform-origin:${x}px 210px;animation-delay:${i * 0.6}s" d="M${x} 210 q-12 -30 0 -60 q12 -30 0 -70 q-8 -20 4 -40" stroke="#2fae6b" stroke-width="6" fill="none" stroke-linecap="round"/>`).join('')}
  <!-- fish -->
  <g class="swim" style="animation-duration:14s">
    <g transform="translate(0 50)"><ellipse cx="0" cy="0" rx="10" ry="5" fill="#ffb02e"/><path d="M-9 0 l-7 -5 v10z" fill="#ffb02e"/><circle cx="5" cy="-1" r="1.3" fill="#111"/></g>
    <g transform="translate(-30 64)"><ellipse cx="0" cy="0" rx="7" ry="4" fill="#ffd23f"/><path d="M-6 0 l-5 -4 v8z" fill="#ffd23f"/></g>
  </g>
  <!-- laser shark -->
  <g class="swim-rev" style="animation-duration:18s">
    <g transform="translate(0 100)">
      <path d="M-40 0 Q-10 -18 30 -4 L44 0 L30 6 Q-10 16 -40 0Z" fill="#6d8199"/>
      <path d="M-2 -10 L6 -26 L12 -8Z" fill="#6d8199"/>
      <path d="M-40 0 L-56 -14 L-50 0 L-56 14Z" fill="#6d8199"/>
      <path d="M-30 4 Q0 12 32 4 L30 6 Q-10 16 -40 0Z" fill="#dfe8f2"/>
      <circle cx="28" cy="-3" r="1.8" fill="#111"/>
      <rect x="8" y="-16" width="16" height="6" rx="2" fill="#3a3a44"/>
      <line class="laser" x1="24" y1="-13" x2="120" y2="-13" stroke="#ff2b4a" stroke-width="2"/>
    </g>
  </g>
  <!-- dome glass frame -->
  <path d="M0 210 V120 Q200 -40 400 120 V210Z" fill="none" stroke="#9ab3c9" stroke-width="6" opacity="0.8"/>
  <path d="M100 210 V70 M200 210 V38 M300 210 V70" stroke="#9ab3c9" stroke-width="3" opacity="0.6"/>
  <path d="M0 150 Q200 40 400 150" stroke="#9ab3c9" stroke-width="3" fill="none" opacity="0.6"/>
  <path d="M0 210 V120 Q200 -40 400 120 V210Z" fill="url(#g-glass)" opacity="0.4"/>
  ${bubbles([80, 130, 190, 240, 310, 350], 200)}
  <!-- floor -->
  <rect x="0" y="204" width="400" height="56" fill="#1d3448"/>
  <rect x="0" y="204" width="400" height="5" fill="#3a5a78"/>
  ${[50, 130, 270, 350].map((x) => `<circle cx="${x}" cy="232" r="9" fill="#0d1f2e" stroke="#6d8aa6" stroke-width="3"/><circle cx="${x - 2}" cy="230" r="3" fill="#2a6f9f" opacity="0.7"/>`).join('')}`;

const MOON = `
  <rect width="400" height="260" fill="url(#g-space)"/>
  ${stars(70, 7, 180)}
  <!-- earth -->
  <g transform="translate(318 58)">
    <circle r="56" fill="url(#g-glow-blue)"/>
    <circle r="36" fill="url(#g-earth)"/>
    <path d="M-20 -18 q10 -10 22 -4 q4 10 -6 14 q-2 12 -12 8 q-10 -6 -4 -18z M8 6 q12 -4 18 6 q-2 12 -12 12 q-8 -6 -6 -18z" fill="#3fbf6a" opacity="0.9"/>
    <path d="M-30 -6 Q0 -16 30 -4" stroke="#fff" stroke-width="3" opacity="0.4" fill="none"/>
    <circle class="blink" cx="-6" cy="-2" r="3" fill="none" stroke="#ff3b3b" stroke-width="1.5"/>
  </g>
  <!-- satellite -->
  <g class="orbit" style="transform-origin:318px 58px">
    <g transform="translate(260 20)">
      <rect x="-3" y="-3" width="6" height="6" fill="url(#g-metal)"/>
      <rect x="-15" y="-2" width="10" height="4" fill="#2e8bff"/><rect x="5" y="-2" width="10" height="4" fill="#2e8bff"/>
    </g>
  </g>
  <!-- moon surface -->
  <path d="M0 180 Q60 164 130 176 Q200 188 270 170 Q340 158 400 176 V260 H0Z" fill="url(#g-moon)"/>
  ${[[40, 200, 18], [150, 222, 12], [230, 196, 9], [330, 214, 20], [96, 244, 8]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.4}" fill="#77728c"/><ellipse cx="${x}" cy="${y - 1}" rx="${r * 0.8}" ry="${r * 0.28}" fill="#9a96ad"/>`).join('')}
  <!-- dome base -->
  <g transform="translate(20 120)">
    <path d="M0 64 Q0 10 50 10 Q100 10 100 64Z" fill="#b8e6ff" opacity="0.35" stroke="#dff4ff" stroke-width="2"/>
    <rect x="-4" y="60" width="108" height="10" rx="3" fill="url(#g-dark-metal)"/>
    <rect x="18" y="36" width="24" height="24" fill="#4a3a6a"/><rect x="56" y="30" width="28" height="30" fill="#5a3a8a"/>
    <rect x="22" y="40" width="6" height="6" fill="#ffd23f" class="blink"/><rect x="62" y="36" width="6" height="6" fill="#ffd23f"/><rect x="72" y="46" width="6" height="6" fill="#ffd23f" class="blink" style="animation-delay:1s"/>
    <line x1="50" y1="10" x2="50" y2="-6" stroke="#aaa" stroke-width="2"/><circle class="blink" cx="50" cy="-8" r="3" fill="#ff3b3b"/>
    <path d="M40 18 L60 18 L50 8Z" fill="#b04dff"/>
  </g>
  <!-- doom laser -->
  <g transform="translate(300 150)">
    <rect x="-20" y="22" width="60" height="20" rx="4" fill="url(#g-dark-metal)"/>
    <g transform="rotate(-38 10 20)">
      <rect x="0" y="10" width="70" height="18" rx="6" fill="url(#g-metal)"/>
      <rect x="66" y="6" width="10" height="26" rx="3" fill="#3a3a44"/>
      <circle cx="80" cy="19" r="6" fill="#ff3b5c" class="pulse"/>
      <circle cx="80" cy="19" r="14" fill="url(#g-glow-purple)" class="pulse"/>
    </g>
    <circle cx="10" cy="22" r="14" fill="#4a3a6a"/><circle cx="10" cy="22" r="6" fill="#b04dff"/>
  </g>`;

export const SCENES = [BASEMENT, WAREHOUSE, VOLCANO, UNDERSEA, MOON];

export function sceneSVG(lair: number): string {
  return `<svg class="scene-bg" viewBox="0 0 400 260" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">${SCENES[lair] ?? BASEMENT}</svg>`;
}
