import type { Speaker } from '../game/story';

// Comic-book style: every major shape gets a dark ink outline, one flat cel
// shadow on the far side, and a small highlight on the near side.
const INK = '#1b1530';
const ink = (w = 2.5) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

// ---------------------------------------------------------------------------
// Full-body villain (the big tappable character in the scene). 160x200.
// Classes used by CSS: cape, torso, head, eyes (blink), mouth-grin / mouth-open
// (swapped while laughing), brows.
// ---------------------------------------------------------------------------
export const VILLAIN_BODY = `
<svg class="villain-svg" viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="80" cy="192" rx="50" ry="7" fill="#000" opacity="0.35"/>

  <g class="cape">
    <path d="M56 70 C40 104 28 150 14 186 L33 178 L47 190 L63 180 L80 192 L97 180 L113 190 L127 178 L146 186 C132 150 120 104 104 70 Z" fill="url(#g-v-cape)" ${ink(3)}/>
    <path d="M62 76 C54 112 50 150 44 181 L63 180 L80 192 L97 180 L116 181 C110 150 106 112 98 76 Z" fill="url(#g-v-lining)" ${ink(2)}/>
    <path d="M104 70 C120 104 132 150 146 186 L127 178 C120 140 112 104 100 76Z" fill="#000" opacity="0.22"/>
    <path d="M52 84 C42 112 34 146 24 176" stroke="#b98bff" stroke-width="2" fill="none" opacity="0.7" stroke-linecap="round"/>
  </g>

  <!-- legs & boots -->
  <path d="M66 126 L64 170 L77 170 L79 128Z" fill="url(#g-v-suit)" ${ink(2.2)}/>
  <path d="M81 128 L83 170 L96 170 L94 126Z" fill="url(#g-v-suit)" ${ink(2.2)}/>
  <path d="M60 164 L78 164 L78 184 Q78 188 74 188 L54 188 Q50 188 52 183 Q55 175 60 171Z" fill="url(#g-v-boot)" ${ink(2.5)}/>
  <path d="M100 164 L82 164 L82 184 Q82 188 86 188 L106 188 Q110 188 108 183 Q105 175 100 171Z" fill="url(#g-v-boot)" ${ink(2.5)}/>
  <rect x="59" y="162" width="20" height="6" rx="2" fill="#8a3dff" ${ink(2)}/>
  <rect x="81" y="162" width="20" height="6" rx="2" fill="#8a3dff" ${ink(2)}/>
  <path d="M57 180 Q62 177 68 178" stroke="#fff" stroke-opacity="0.35" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M88 178 Q94 177 101 180" stroke="#fff" stroke-opacity="0.2" stroke-width="2" fill="none" stroke-linecap="round"/>

  <!-- arms: hands on hips -->
  <g class="arm-l">
    <path d="M60 82 L44 104 L61 119" fill="none" stroke="${INK}" stroke-width="15" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M60 82 L44 104 L61 119" fill="none" stroke="#2e2850" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M57 86 L46 102" stroke="#5c5290" stroke-width="3" stroke-linecap="round"/>
  </g>
  <g class="arm-r">
    <path d="M100 82 L116 104 L99 119" fill="none" stroke="${INK}" stroke-width="15" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M100 82 L116 104 L99 119" fill="none" stroke="#221d3d" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/>
  </g>

  <!-- torso -->
  <g class="torso">
    <path d="M60 76 Q80 70 100 76 L98 112 Q96 126 94 130 L66 130 Q64 126 62 112 Z" fill="url(#g-v-suit)" ${ink(2.5)}/>
    <path d="M80 73 Q92 73 100 76 L98 112 Q96 126 94 130 L80 130Z" fill="#000" opacity="0.2"/>
    <path d="M66 80 L80 106 L94 80 L87 80 L80 93 L73 80 Z" fill="#9b52ff" ${ink(2)}/>
    <path d="M69 82 L73 82 L78 92" stroke="#e0c4ff" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <rect x="62" y="113" width="36" height="8" rx="2" fill="#15121f" ${ink(2)}/>
    <circle cx="80" cy="117" r="7" fill="url(#g-gold)" ${ink(2)}/>
    <path d="M77 114 L80 120 L83 114" stroke="#8a4a00" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M51 80 Q55 68 71 72 L65 88 Q55 90 51 80Z" fill="#8a3dff" ${ink(2.2)}/>
    <path d="M109 80 Q105 68 89 72 L95 88 Q105 90 109 80Z" fill="#5a1bc4" ${ink(2.2)}/>
    <path d="M55 77 Q58 72 66 73" stroke="#e0c4ff" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  </g>
  <!-- gloves (drawn over torso) -->
  <g ${ink(2)}>
    <path d="M55 113 Q54 121 61 124 Q68 124 68 117 Q66 111 60 111Z" fill="url(#g-v-glove)"/>
    <path d="M105 113 Q106 121 99 124 Q92 124 92 117 Q94 111 100 111Z" fill="url(#g-v-glove)"/>
  </g>

  <!-- collar -->
  <path d="M60 78 L42 26 Q56 42 68 62Z" fill="url(#g-v-lining)" ${ink(2.5)}/>
  <path d="M100 78 L118 26 Q104 42 92 62Z" fill="url(#g-v-lining)" ${ink(2.5)}/>
  <path d="M46 34 Q54 46 62 60" stroke="#ff9ab0" stroke-width="1.5" fill="none" opacity="0.8"/>

  <rect x="74" y="60" width="12" height="14" fill="#dfa987" ${ink(2)}/>

  <g class="head">
    <!-- ears -->
    <path d="M63 42 Q55 34 56 48 Q59 55 64 53Z" fill="#f2c4a2" ${ink(2)}/>
    <path d="M97 42 Q105 34 104 48 Q101 55 96 53Z" fill="#dfa987" ${ink(2)}/>
    <!-- face -->
    <path d="M62 38 Q62 21 80 21 Q98 21 98 38 L96 54 Q90 68 80 70 Q70 68 64 54Z" fill="url(#g-face)" ${ink(2.6)}/>
    <path d="M91 40 Q97 48 93 58 Q88 66 82 68 Q91 60 91 40Z" fill="#c98763" opacity="0.45"/>
    <ellipse cx="68" cy="53" rx="4" ry="2.4" fill="#ff8f8f" opacity="0.35"/>
    <!-- hair -->
    <path d="M60 42 Q54 12 80 10 Q106 12 100 42 Q98 30 92 26 Q86 28 80 38 Q74 28 68 26 Q62 30 60 42Z" fill="url(#g-hair)" ${ink(2.5)}/>
    <path d="M68 17 Q78 12 90 16" stroke="#7a68b8" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M64 30 Q66 22 72 19" stroke="#7a68b8" stroke-width="1.4" fill="none" stroke-linecap="round" opacity="0.7"/>
    <!-- brows -->
    <g class="brows" stroke="${INK}" stroke-width="3.6" stroke-linecap="round">
      <path d="M65 35 L77 40"/><path d="M95 35 L83 40"/>
    </g>
    <!-- eyes -->
    <g class="eyes">
      <ellipse cx="72" cy="44" rx="4.6" ry="3.4" fill="#fff" ${ink(1.4)}/>
      <ellipse cx="88" cy="44" rx="4.6" ry="3.4" fill="#fff" ${ink(1.4)}/>
      <circle cx="73.2" cy="44.3" r="2.3" fill="#7b2cff"/><circle cx="73.2" cy="44.3" r="1.1" fill="${INK}"/>
      <circle cx="86.8" cy="44.3" r="2.3" fill="#7b2cff"/><circle cx="86.8" cy="44.3" r="1.1" fill="${INK}"/>
      <circle cx="74" cy="43.4" r="0.7" fill="#fff"/><circle cx="87.6" cy="43.4" r="0.7" fill="#fff"/>
    </g>
    <circle cx="88" cy="44" r="7" fill="#fff" fill-opacity="0.12" stroke="url(#g-gold)" stroke-width="2.2"/>
    <path d="M93 49 Q99 60 94 72" stroke="#ffc72c" stroke-width="0.9" fill="none"/>
    <!-- nose -->
    <path d="M80 45 Q77.5 51 80 53 Q82 53.5 83.5 52" stroke="#b9765a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <!-- mouths -->
    <path class="mouth-grin" d="M70 60.5 Q80 67 90 60.5 Q80 63.5 70 60.5Z" fill="#fff" ${ink(1.6)}/>
    <g class="mouth-open">
      <path d="M69 59 Q80 76 91 59 Q80 62 69 59Z" fill="#5a1020" ${ink(1.8)}/>
      <path d="M73 66 Q80 71 87 66 Q84 72 80 72.5 Q76 72 73 66Z" fill="#ff5a7a"/>
      <path d="M70.5 60 Q80 63.5 89.5 60 L88 62.5 Q80 64.5 72 62.5Z" fill="#fff"/>
    </g>
    <!-- mustache -->
    <path d="M80 56 Q72 52.5 66 55.5 Q61.5 57.5 60.5 53 Q59 59.5 66 59.5 Q73 59.5 80 58 Q87 59.5 94 59.5 Q101 59.5 99.5 53 Q98.5 57.5 94 55.5 Q88 52.5 80 56Z" fill="${INK}"/>
    <path d="M70 55.5 Q74 54.6 78 55.6" stroke="#5c4f8a" stroke-width="1" fill="none"/>
  </g>
</svg>`;

// ---------------------------------------------------------------------------
// Walking henchman used in the scene. 48x64. Carries a loot sack.
// ---------------------------------------------------------------------------
export const HENCHMAN_MINI = `
<svg viewBox="0 0 48 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="22" cy="61.5" rx="13" ry="2.2" fill="#000" opacity="0.3"/>
  <g class="leg-a"><path d="M15 42 L14 56" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M15 42 L14 56" stroke="#2a2d45" stroke-width="4" stroke-linecap="round"/><path d="M9 56.5 Q9 60 13 60 L20 60 Q21 56 17 55Z" fill="#e0344f" ${ink(1.6)}/></g>
  <g class="leg-b"><path d="M27 42 L28 56" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M27 42 L28 56" stroke="#2a2d45" stroke-width="4" stroke-linecap="round"/><path d="M25 55 Q22 56 23 60 L31 60 Q34 60 33 56.5Z" fill="#e0344f" ${ink(1.6)}/></g>
  <!-- loot sack -->
  <path d="M34 20 Q46 22 45 34 Q44 42 35 42 Q27 41 28 32 Q29 24 34 20Z" fill="#c9a15b" ${ink(1.8)}/>
  <path d="M32 21 L37 17" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
  <text x="37" y="36" font-size="9" font-weight="900" text-anchor="middle" font-family="Arial Black,Arial" fill="#5a3a10">$</text>
  <!-- body -->
  <path d="M10 27 Q21 21 32 27 L31 45 L11 45Z" fill="url(#g-hench-shirt)" ${ink(2)}/>
  <path d="M10.6 32 H31.4 M10.8 37 H31.2 M11 42 H31" stroke="${INK}" stroke-width="2.4"/>
  <path d="M29 30 L36 24" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M29 30 L36 24" stroke="#f2f2f2" stroke-width="3" stroke-linecap="round"/>
  <!-- head -->
  <circle cx="21" cy="15" r="11" fill="url(#g-mask)" ${ink(2)}/>
  <rect x="12" y="11.5" width="18" height="7.5" rx="3.75" fill="url(#g-face)" ${ink(1.4)}/>
  <circle cx="17.5" cy="15.2" r="2.1" fill="#fff"/><circle cx="25" cy="15.2" r="2.1" fill="#fff"/>
  <circle cx="18" cy="15.5" r="1.2" fill="${INK}"/><circle cx="25.5" cy="15.5" r="1.2" fill="${INK}"/>
  <path d="M14 7 Q20 3 27 6" stroke="#5a5a78" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <circle cx="21" cy="3.5" r="3.2" fill="#e0344f" ${ink(1.4)}/>
</svg>`;

// ---------------------------------------------------------------------------
// Captain Righteous flying (hero event). 140x70.
// ---------------------------------------------------------------------------
export const HERO_FLYING = `
<svg viewBox="0 0 140 70" xmlns="http://www.w3.org/2000/svg">
  <g opacity="0.55" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M2 18 H22"/><path d="M0 46 H18"/><path d="M8 32 H20"/></g>
  <path class="hero-cape" d="M60 25 Q34 10 6 20 Q20 28 8 38 Q22 36 12 48 Q38 42 60 41Z" fill="url(#g-hero-cape)" ${ink(2.2)}/>
  <path d="M60 25 Q40 16 18 18" stroke="#ff9a9a" stroke-width="1.5" fill="none"/>
  <g ${ink(2)}>
    <rect x="16" y="35" width="38" height="9" rx="4.5" fill="#1552b8"/>
    <rect x="18" y="26" width="32" height="9" rx="4.5" fill="#2a74e0"/>
    <path d="M8 34 Q8 44 16 44 L22 44 L22 34Z" fill="#c7102e"/>
    <path d="M10 25 Q10 35 18 35 L24 35 L24 25Z" fill="#e0344f"/>
    <path d="M50 21 Q72 18 93 25 L93 43 Q72 48 50 44Z" fill="url(#g-hero-suit)"/>
  </g>
  <rect x="50" y="39" width="43" height="4" fill="#ffc72c" ${ink(1.2)}/>
  <path d="M68 26 L80 26 L82 30 L74 38 L66 30Z" fill="#ffc72c" ${ink(1.5)}/>
  <text x="74" y="33.5" font-size="7.5" font-weight="900" text-anchor="middle" fill="#b3001b" font-family="Arial Black,Arial">R</text>
  <path d="M88 28 Q106 26 120 27" stroke="${INK}" stroke-width="10" stroke-linecap="round" fill="none"/>
  <path d="M88 28 Q106 26 120 27" stroke="#2a74e0" stroke-width="6.5" stroke-linecap="round" fill="none"/>
  <circle cx="124" cy="27" r="6.5" fill="#e0344f" ${ink(2)}/>
  <circle cx="101" cy="30" r="12.5" fill="url(#g-face)" ${ink(2.2)}/>
  <path d="M88 27 Q90 13 104 15 Q114 17 114 27 Q107 20 99 22 Q92 23 88 27Z" fill="url(#g-hero-hair)" ${ink(2)}/>
  <path d="M95 18 Q101 15 108 17" stroke="#fff" stroke-width="1.4" fill="none" opacity="0.8"/>
  <rect x="94" y="25.5" width="19" height="6.5" rx="3.2" fill="#1552b8" ${ink(1.4)}/>
  <circle cx="104" cy="28.8" r="1.7" fill="#fff"/><circle cx="109.5" cy="28.8" r="1.7" fill="#fff"/>
  <path d="M101 37 Q106.5 41 111 36.5 Q106 38.5 101 37Z" fill="#fff" ${ink(1.2)}/>
  <path d="M97 40.5 Q101 44.5 107 42.5" stroke="#c98763" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>`;

// ---------------------------------------------------------------------------
// Dialog portraits. 100x100 each, on a halftone comic panel.
// ---------------------------------------------------------------------------
const panel = (id: string, c1: string, c2: string) => `
  <defs>
    <radialGradient id="pbg-${id}" cx="0.5" cy="0.3" r="0.8"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient>
    <clipPath id="pclip-${id}"><rect width="100" height="100" rx="16"/></clipPath>
  </defs>
  <g clip-path="url(#pclip-${id})">
    <rect width="100" height="100" fill="url(#pbg-${id})"/>
    <rect width="100" height="100" fill="url(#p-halftone-light)" opacity="0.12"/>
    <g stroke="#fff" stroke-opacity="0.1" stroke-width="5">${Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return `<path d="M50 40 L${(50 + Math.cos(a) * 90).toFixed(1)} ${(40 + Math.sin(a) * 90).toFixed(1)}"/>`;
    }).join('')}</g>
    BODY
  </g>`;

function portraitSvg(id: string, c1: string, c2: string, body: string) {
  return panel(id, c1, c2).replace('BODY', body);
}

const PORTRAITS: Record<Speaker, string> = {
  villain: portraitSvg('villain', '#8e4dff', '#26084f', `
    <path d="M14 104 Q16 78 50 73 Q84 78 86 104Z" fill="url(#g-v-suit)" ${ink(2.5)}/>
    <path d="M22 104 L6 56 L40 78Z" fill="url(#g-v-lining)" ${ink(2.5)}/>
    <path d="M78 104 L94 56 L60 78Z" fill="url(#g-v-lining)" ${ink(2.5)}/>
    <path d="M38 77 L50 97 L62 77 L56 77 L50 87 L44 77Z" fill="#9b52ff" ${ink(2)}/>
    <rect x="43" y="60" width="14" height="16" fill="#dfa987" ${ink(2)}/>
    <path d="M25 42 Q16 33 18 50 Q22 58 28 55Z" fill="#f2c4a2" ${ink(2)}/>
    <path d="M75 42 Q84 33 82 50 Q78 58 72 55Z" fill="#dfa987" ${ink(2)}/>
    <path d="M27 38 Q27 16 50 16 Q73 16 73 38 L71 55 Q63 72 50 73 Q37 72 29 55Z" fill="url(#g-face)" ${ink(2.6)}/>
    <path d="M64 40 Q72 50 67 62 Q61 70 53 72 Q65 60 64 40Z" fill="#c98763" opacity="0.45"/>
    <path d="M24 42 Q17 5 50 3 Q83 5 76 42 Q73 27 65 23 Q58 25 50 37 Q42 25 35 23 Q27 27 24 42Z" fill="url(#g-hair)" ${ink(2.6)}/>
    <path d="M36 10 Q50 4 64 9" stroke="#7a68b8" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <g stroke="${INK}" stroke-width="4.2" stroke-linecap="round"><path d="M31 34 L45 40"/><path d="M69 34 L55 40"/></g>
    <ellipse cx="40" cy="45" rx="5.6" ry="4.2" fill="#fff" ${ink(1.6)}/><ellipse cx="60" cy="45" rx="5.6" ry="4.2" fill="#fff" ${ink(1.6)}/>
    <circle cx="41.5" cy="45.4" r="2.8" fill="#7b2cff"/><circle cx="41.5" cy="45.4" r="1.3" fill="${INK}"/>
    <circle cx="58.5" cy="45.4" r="2.8" fill="#7b2cff"/><circle cx="58.5" cy="45.4" r="1.3" fill="${INK}"/>
    <circle cx="42.5" cy="44.3" r="0.9" fill="#fff"/><circle cx="59.5" cy="44.3" r="0.9" fill="#fff"/>
    <circle cx="60" cy="45" r="8.5" fill="#fff" fill-opacity="0.12" stroke="url(#g-gold)" stroke-width="2.6"/>
    <path d="M50 46 Q47 53 50 55.5 Q52.5 56 54 54.5" stroke="#b9765a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M38 63 Q50 72 62 63 Q50 67 38 63Z" fill="#fff" ${ink(1.8)}/>
    <path d="M50 59 Q40 54.5 33 58.5 Q27.5 61 26.5 55 Q25 63 33 63 Q42 63 50 61.5 Q58 63 67 63 Q75 63 73.5 55 Q72.5 61 67 58.5 Q60 54.5 50 59Z" fill="${INK}"/>`),

  mom: portraitSvg('mom', '#ffb3d6', '#9c2c63', `
    <g ${ink(2.4)} fill="url(#g-mom-hair)">
      <circle cx="26" cy="30" r="12"/><circle cx="40" cy="17" r="13"/><circle cx="60" cy="17" r="13"/><circle cx="74" cy="30" r="12"/>
      <circle cx="21" cy="47" r="11"/><circle cx="79" cy="47" r="11"/><circle cx="24" cy="62" r="10"/><circle cx="76" cy="62" r="10"/>
    </g>
    <path d="M12 104 Q16 76 50 72 Q84 76 88 104Z" fill="url(#g-mom-cardigan)" ${ink(2.5)}/>
    <path d="M40 73 L50 90 L60 73Z" fill="#fff" ${ink(2)}/>
    <g fill="#fff" ${ink(1)}><circle cx="37" cy="79" r="2.4"/><circle cx="43" cy="83" r="2.4"/><circle cx="50" cy="84.5" r="2.4"/><circle cx="57" cy="83" r="2.4"/><circle cx="63" cy="79" r="2.4"/></g>
    <circle cx="30" cy="92" r="2" fill="#fff" ${ink(1)}/><circle cx="70" cy="92" r="2" fill="#fff" ${ink(1)}/>
    <rect x="43" y="60" width="14" height="13" fill="#dfa987" ${ink(2)}/>
    <path d="M29 40 Q29 22 50 22 Q71 22 71 40 L69 56 Q62 70 50 70 Q38 70 31 56Z" fill="url(#g-face)" ${ink(2.5)}/>
    <path d="M63 42 Q70 50 65 60 Q60 67 53 69 Q64 58 63 42Z" fill="#c98763" opacity="0.4"/>
    <g ${ink(2.2)} fill="url(#g-mom-hair)"><circle cx="37" cy="27" r="9"/><circle cx="50" cy="23" r="9.5"/><circle cx="63" cy="27" r="9"/></g>
    <path d="M44 20 Q50 17 56 20" stroke="#e8b48a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <g stroke="#b0306e" stroke-width="2.2" fill="#fff" fill-opacity="0.35"><circle cx="40" cy="46" r="7"/><circle cx="60" cy="46" r="7"/></g>
    <path d="M47 46 H53 M33 45 L28 43 M67 45 L72 43" stroke="#b0306e" stroke-width="2.2"/>
    <path d="M37 45.5 Q40 43 43 45.5" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M57 45.5 Q60 43 63 45.5" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M34 37 Q39 35 44 37 M56 37 Q61 35 66 37" stroke="#6b4228" stroke-width="2" fill="none" stroke-linecap="round"/>
    <ellipse cx="33" cy="56" rx="4.5" ry="2.8" fill="#ff7a9c" opacity="0.55"/><ellipse cx="67" cy="56" rx="4.5" ry="2.8" fill="#ff7a9c" opacity="0.55"/>
    <path d="M48 50 Q47 54 50 55" stroke="#b9765a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M41 59 Q50 67 59 59 Q50 62 41 59Z" fill="#e0476f" ${ink(1.8)}/>`),

  kevin: portraitSvg('kevin', '#ffd06a', '#b35500', `
    <path d="M12 104 Q16 74 50 70 Q84 74 88 104Z" fill="url(#g-hench-shirt)" ${ink(2.5)}/>
    <path d="M15 84 H85 M13 95 H87" stroke="${INK}" stroke-width="5.5"/>
    <circle cx="50" cy="44" r="27" fill="url(#g-mask)" ${ink(2.6)}/>
    <path d="M30 26 Q50 12 72 26" stroke="#5a5a78" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M24 34 Q50 18 76 34 L76 30 Q50 12 24 30Z" fill="#e0344f" ${ink(2)}/>
    <circle cx="50" cy="12" r="7" fill="#e0344f" ${ink(2)}/>
    <path d="M46 9 Q50 7 53 9" stroke="#ff9aa8" stroke-width="1.6" fill="none"/>
    <rect x="27" y="36" width="46" height="17" rx="8.5" fill="url(#g-face)" ${ink(2)}/>
    <circle cx="39.5" cy="44.5" r="6" fill="#fff" ${ink(1.5)}/><circle cx="60.5" cy="44.5" r="6" fill="#fff" ${ink(1.5)}/>
    <circle cx="40.5" cy="45.5" r="3" fill="${INK}"/><circle cx="59.5" cy="45.5" r="3" fill="${INK}"/>
    <circle cx="41.6" cy="44.2" r="1.1" fill="#fff"/><circle cx="60.6" cy="44.2" r="1.1" fill="#fff"/>
    <path d="M32 37 L42 34.5 M68 37 L58 34.5" stroke="#6b4a2a" stroke-width="2.4" stroke-linecap="round"/>
    <ellipse cx="50" cy="61" rx="9" ry="6" fill="#26263a" ${ink(1.5)}/>
    <path d="M43 59.5 Q50 67 57 59.5 Q50 62 43 59.5Z" fill="#fff"/>
    <path d="M47 65 Q50 67.5 53 65" stroke="#ff7a9c" stroke-width="2" fill="none" stroke-linecap="round"/>`),

  hero: portraitSvg('hero', '#7fcfff', '#0d3f99', `
    <path d="M10 104 Q14 70 50 67 Q86 70 90 104Z" fill="url(#g-hero-suit)" ${ink(2.5)}/>
    <path d="M10 104 L2 62 L34 75Z" fill="url(#g-hero-cape)" ${ink(2.5)}/>
    <path d="M90 104 L98 62 L66 75Z" fill="url(#g-hero-cape)" ${ink(2.5)}/>
    <path d="M38 79 L62 79 L65 85 L50 99 L35 85Z" fill="#ffc72c" ${ink(2)}/>
    <text x="50" y="91" font-size="12" font-weight="900" text-anchor="middle" fill="#b3001b" font-family="Arial Black,Arial">R</text>
    <rect x="41" y="58" width="18" height="14" fill="#dfa987" ${ink(2)}/>
    <path d="M27 40 Q27 18 50 18 Q73 18 73 40 L71 58 Q63 72 50 72 Q37 72 29 58Z" fill="url(#g-face)" ${ink(2.6)}/>
    <path d="M65 42 Q72 52 67 62 Q62 70 55 71 Q66 60 65 42Z" fill="#c98763" opacity="0.4"/>
    <path d="M25 37 Q22 10 48 8 Q68 6 76 22 Q64 16 57 22 Q68 24 74 35 Q60 22 45 26 Q33 28 25 37Z" fill="url(#g-hero-hair)" ${ink(2.4)}/>
    <path d="M36 14 Q48 9 60 12" stroke="#fff" stroke-width="2" fill="none" opacity="0.8" stroke-linecap="round"/>
    <path d="M27 37 H73 Q73 51 62 51 Q56 51 50 46 Q44 51 38 51 Q27 51 27 37Z" fill="#1552b8" ${ink(2)}/>
    <ellipse cx="39.5" cy="42.5" rx="4.4" ry="3.3" fill="#fff"/><ellipse cx="60.5" cy="42.5" rx="4.4" ry="3.3" fill="#fff"/>
    <circle cx="39.5" cy="43" r="1.9" fill="#0d2a66"/><circle cx="60.5" cy="43" r="1.9" fill="#0d2a66"/>
    <path d="M36 57 Q50 67 64 57 Q50 62 36 57Z" fill="#fff" ${ink(1.8)}/>
    <path d="M45 67.5 Q50 70 55 67.5" stroke="#b9765a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M76 52 l2.2 -5.5 l2.2 5.5 l5.5 2.2 l-5.5 2.2 l-2.2 5.5 l-2.2 -5.5 l-5.5 -2.2z" fill="#fff"/>`),

  snivel: portraitSvg('snivel', '#7dffb8', '#0a5a33', `
    <path d="M10 104 Q14 72 50 69 Q86 72 90 104Z" fill="url(#g-labcoat)" ${ink(2.5)}/>
    <path d="M50 71 L40 104 M50 71 L60 104" stroke="${INK}" stroke-width="2"/>
    <path d="M40 72 L50 82 L60 72" fill="#4a4a5a" ${ink(1.8)}/>
    <rect x="64" y="86" width="12" height="4" rx="1" fill="#2e8bff" ${ink(1)}/><rect x="66" y="81" width="3" height="9" fill="#e0344f" ${ink(1)}/>
    <rect x="43" y="59" width="14" height="13" fill="#d9b394" ${ink(2)}/>
    <path d="M26 46 L10 32 L27 35 L14 16 L34 26 L35 6 L46 23 L54 4 L58 23 L70 7 L68 26 L88 16 L75 35 L92 32 L75 46Z" fill="#f7f7fb" ${ink(2.2)}/>
    <path d="M30 40 Q30 22 50 22 Q70 22 70 40 L68 56 Q62 69 50 70 Q38 69 32 56Z" fill="url(#g-face)" ${ink(2.5)}/>
    <path d="M62 42 Q69 50 65 60 Q60 67 53 69 Q63 58 62 42Z" fill="#c98763" opacity="0.4"/>
    <rect x="27" y="37" width="46" height="8" rx="4" fill="#3a3a4a" ${ink(1.8)}/>
    <circle cx="39" cy="45" r="10" fill="#aef7ff" ${ink(3.4)}/>
    <circle cx="61" cy="45" r="7" fill="#aef7ff" ${ink(3.4)}/>
    <circle cx="40" cy="46" r="4" fill="${INK}"/><circle cx="60.5" cy="46" r="2.2" fill="${INK}"/>
    <path d="M33 40 Q36 37 40 38" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="41.3" cy="44.6" r="1.3" fill="#fff"/>
    <path d="M40 61 Q48 56 52 61.5 Q56 65 62 58" stroke="#5a2a1a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <rect x="47.5" y="60.5" width="4.5" height="4.5" fill="#fff" ${ink(1)}/>`),

  narrator: portraitSvg('narrator', '#7a64a8', '#1a1030', `
    <rect x="24" y="20" width="52" height="62" rx="4" fill="#f6e8c8" ${ink(2.5)} transform="rotate(-6 50 50)"/>
    <path d="M31 34 H69 M31 43 H69 M31 52 H62 M31 61 H66 M31 70 H55" stroke="#8a6a4a" stroke-width="2.6" transform="rotate(-6 50 50)"/>
    <path d="M60 80 L84 26 Q89 18 88 30 L66 82Z" fill="#fff" ${ink(2)}/>
    <path d="M84 26 Q76 36 72 50" stroke="#b04dff" stroke-width="1.6" fill="none"/>
    <path d="M60 80 L62 89 L66 82Z" fill="${INK}"/>`),
};

export function portrait(who: Speaker): string {
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${PORTRAITS[who]}</svg>`;
}
