import type { Speaker } from '../game/story';

// ---------------------------------------------------------------------------
// Full-body villain (the big tappable character in the scene). 120x160.
// ---------------------------------------------------------------------------
export const VILLAIN_BODY = `
<svg class="villain-svg" viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="60" cy="153" rx="34" ry="5" fill="#000" opacity="0.35"/>
  <g class="cape">
    <path d="M34 50 Q60 42 86 50 L110 146 Q84 156 60 150 Q36 156 10 146 Z" fill="url(#g-cape)"/>
    <path d="M22 140 Q36 150 60 146 Q84 150 98 140 L110 146 Q84 156 60 150 Q36 156 10 146 Z" fill="#240659" opacity="0.6"/>
  </g>
  <path d="M34 52 L20 20 L50 42 Z" fill="url(#g-cape-red)"/>
  <path d="M86 52 L100 20 L70 42 Z" fill="url(#g-cape-red)"/>
  <rect x="46" y="112" width="12" height="32" rx="3" fill="#15132a"/>
  <rect x="62" y="112" width="12" height="32" rx="3" fill="#15132a"/>
  <path d="M42 140 h17 v8 a3 3 0 0 1 -3 3 h-16 a4 4 0 0 1 2 -11z" fill="#2b2640"/>
  <path d="M78 140 h-17 v8 a3 3 0 0 0 3 3 h16 a4 4 0 0 0 -2 -11z" fill="#2b2640"/>
  <path d="M40 60 Q60 53 80 60 L78 116 L42 116 Z" fill="url(#g-suit)"/>
  <path d="M49 64 L60 86 L71 64 L65 64 L60 75 L55 64 Z" fill="#b04dff"/>
  <rect x="42" y="104" width="36" height="6" fill="#0d0b18"/>
  <rect x="55" y="102.5" width="10" height="9" rx="2" fill="url(#g-gold)"/>
  <g class="arm-l"><path d="M43 63 Q30 82 33 100" stroke="#2a2644" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="33" cy="102" r="6.5" fill="#6b2bd9"/></g>
  <g class="arm-r"><path d="M77 63 Q90 82 87 100" stroke="#2a2644" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="87" cy="102" r="6.5" fill="#6b2bd9"/></g>
  <rect x="55" y="50" width="10" height="9" fill="#e2b99a"/>
  <g class="head">
    <ellipse cx="60" cy="35" rx="17" ry="19" fill="url(#g-skin)"/>
    <ellipse cx="43.5" cy="37" rx="2.5" ry="4" fill="#e2b99a"/>
    <ellipse cx="76.5" cy="37" rx="2.5" ry="4" fill="#e2b99a"/>
    <path d="M42.5 34 Q40 12 60 11 Q80 12 77.5 34 Q74 22 67 23 L60 33 L53 23 Q46 22 42.5 34Z" fill="#1b1530"/>
    <path d="M48 29.5 L57 33" stroke="#1b1530" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M72 29.5 L63 33" stroke="#1b1530" stroke-width="2.6" stroke-linecap="round"/>
    <g class="eyes">
      <ellipse cx="53" cy="37" rx="3.2" ry="2.6" fill="#fff"/><circle cx="54" cy="37.3" r="1.6" fill="#1b1530"/>
      <ellipse cx="67" cy="37" rx="3.2" ry="2.6" fill="#fff"/><circle cx="66" cy="37.3" r="1.6" fill="#1b1530"/>
    </g>
    <circle cx="67" cy="37" r="5.5" fill="none" stroke="url(#g-gold)" stroke-width="1.6"/>
    <path d="M72.5 38 Q77 48 72 56" stroke="#ffc72c" stroke-width="0.8" fill="none"/>
    <path class="grin" d="M52 48.5 Q60 55 68 48.5 Q60 51 52 48.5Z" fill="#fff" stroke="#5a1a1a" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M60 45 Q54 41.5 49 44.5 Q46.5 46 47.5 42.5 M60 45 Q66 41.5 71 44.5 Q73.5 46 72.5 42.5" stroke="#1b1530" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  </g>
</svg>`;

// ---------------------------------------------------------------------------
// Walking henchman used in the scene. 40x60.
// ---------------------------------------------------------------------------
export const HENCHMAN_MINI = `
<svg viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="20" cy="58" rx="11" ry="2" fill="#000" opacity="0.3"/>
  <g class="leg-a"><rect x="13" y="40" width="6" height="16" rx="2" fill="#2a2d45"/><rect x="11" y="53" width="9" height="4" rx="2" fill="#111"/></g>
  <g class="leg-b"><rect x="21" y="40" width="6" height="16" rx="2" fill="#2a2d45"/><rect x="20" y="53" width="9" height="4" rx="2" fill="#111"/></g>
  <path d="M10 26 Q20 21 30 26 L29 43 L11 43Z" fill="#f2f2f2"/>
  <path d="M10.5 30 H29.5 M10.8 35 H29.2 M11 40 H29" stroke="#222" stroke-width="2.4"/>
  <circle cx="20" cy="15" r="9.5" fill="#1d1d29"/>
  <rect x="12" y="12" width="16" height="6" rx="3" fill="url(#g-skin)"/>
  <circle cx="16.5" cy="15" r="1.5" fill="#111"/><circle cx="23.5" cy="15" r="1.5" fill="#111"/>
  <circle cx="20" cy="5" r="3" fill="#e0344f"/>
</svg>`;

// ---------------------------------------------------------------------------
// Captain Righteous flying (hero event). 140x70.
// ---------------------------------------------------------------------------
export const HERO_FLYING = `
<svg viewBox="0 0 140 70" xmlns="http://www.w3.org/2000/svg">
  <path class="hero-cape" d="M58 26 Q30 14 4 22 Q18 30 6 40 Q30 36 58 40Z" fill="url(#g-hero-cape)"/>
  <rect x="18" y="34" width="34" height="9" rx="4.5" fill="#1552b8"/>
  <rect x="18" y="26" width="30" height="9" rx="4.5" fill="#1a5fcc"/>
  <rect x="10" y="33.5" width="12" height="10" rx="4" fill="#b3001b"/>
  <rect x="12" y="25.5" width="12" height="10" rx="4" fill="#b3001b"/>
  <path d="M50 22 Q72 20 92 26 L92 42 Q72 46 50 44Z" fill="url(#g-hero-suit)"/>
  <rect x="50" y="39" width="42" height="4" fill="#ffc72c"/>
  <circle cx="74" cy="32" r="6" fill="#ffc72c"/><text x="74" y="35.3" font-size="8.5" font-weight="900" text-anchor="middle" fill="#b3001b" font-family="Arial">R</text>
  <path d="M88 28 Q106 26 122 28" stroke="#1a5fcc" stroke-width="7" stroke-linecap="round" fill="none"/>
  <circle cx="125" cy="28" r="5.5" fill="#b3001b"/>
  <circle cx="100" cy="30" r="12" fill="url(#g-skin)"/>
  <path d="M88 26 Q92 14 104 16 Q112 18 112 26 Q106 20 98 22 Q92 23 88 26Z" fill="#ffd54a"/>
  <rect x="94" y="26" width="17" height="6" rx="3" fill="#1552b8"/>
  <circle cx="104" cy="29" r="1.6" fill="#fff"/><circle cx="109" cy="29" r="1.6" fill="#fff"/>
  <path d="M101 37 Q106 40 110 36" stroke="#6b2a1a" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <path d="M96 40 Q100 44 106 42" stroke="#d9a07f" stroke-width="2" fill="none"/>
</svg>`;

// ---------------------------------------------------------------------------
// Dialog portraits. 100x100 each.
// ---------------------------------------------------------------------------
const bg = (c1: string, c2: string) => `
  <defs><radialGradient id="pbg-${c1.slice(1)}" cx="0.5" cy="0.35" r="0.7"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient></defs>
  <rect width="100" height="100" rx="18" fill="url(#pbg-${c1.slice(1)})"/>`;

const PORTRAITS: Record<Speaker, string> = {
  villain: `${bg('#7d3cff', '#2a0b5c')}
    <path d="M18 100 Q20 76 50 72 Q80 76 82 100Z" fill="url(#g-suit)"/>
    <path d="M22 100 L10 60 L40 78Z M78 100 L90 60 L60 78Z" fill="url(#g-cape-red)"/>
    <path d="M40 76 L50 94 L60 76 L55 76 L50 85 L45 76Z" fill="#b04dff"/>
    <rect x="44" y="62" width="12" height="12" fill="#e2b99a"/>
    <ellipse cx="50" cy="44" rx="22" ry="24" fill="url(#g-skin)"/>
    <path d="M28 42 Q25 14 50 13 Q75 14 72 42 Q68 27 59 28 L50 41 L41 28 Q32 27 28 42Z" fill="#1b1530"/>
    <path d="M35 36 L46 40 M65 36 L54 40" stroke="#1b1530" stroke-width="3.4" stroke-linecap="round"/>
    <ellipse cx="41" cy="45" rx="4" ry="3.2" fill="#fff"/><circle cx="42.3" cy="45.4" r="2" fill="#1b1530"/>
    <ellipse cx="59" cy="45" rx="4" ry="3.2" fill="#fff"/><circle cx="57.7" cy="45.4" r="2" fill="#1b1530"/>
    <circle cx="59" cy="45" r="7" fill="none" stroke="url(#g-gold)" stroke-width="2"/>
    <path d="M40 59 Q50 67 60 59 Q50 62 40 59Z" fill="#fff" stroke="#5a1a1a" stroke-width="1.4"/>
    <path d="M50 55 Q43 51 36 55 Q33 57 34.5 52.5 M50 55 Q57 51 64 55 Q67 57 65.5 52.5" stroke="#1b1530" stroke-width="3.2" fill="none" stroke-linecap="round"/>`,
  mom: `${bg('#ff9cc8', '#a3336b')}
    <path d="M16 100 Q18 74 50 70 Q82 74 84 100Z" fill="#ff6fa8"/>
    <path d="M40 72 L50 88 L60 72" fill="#fff" />
    <g fill="#fff"><circle cx="38" cy="78" r="2.2"/><circle cx="44" cy="81" r="2.2"/><circle cx="50" cy="82" r="2.2"/><circle cx="56" cy="81" r="2.2"/><circle cx="62" cy="78" r="2.2"/></g>
    <g fill="#8a5a3c"><circle cx="30" cy="30" r="10"/><circle cx="42" cy="20" r="11"/><circle cx="58" cy="20" r="11"/><circle cx="70" cy="30" r="10"/><circle cx="26" cy="46" r="9"/><circle cx="74" cy="46" r="9"/><circle cx="28" cy="60" r="8"/><circle cx="72" cy="60" r="8"/></g>
    <rect x="44" y="60" width="12" height="12" fill="#e2b99a"/>
    <ellipse cx="50" cy="46" rx="20" ry="22" fill="url(#g-skin)"/>
    <g fill="#8a5a3c"><circle cx="38" cy="28" r="8"/><circle cx="50" cy="25" r="8"/><circle cx="62" cy="28" r="8"/></g>
    <circle cx="41" cy="46" r="6.5" fill="#fff" fill-opacity="0.35" stroke="#b0306e" stroke-width="2"/>
    <circle cx="59" cy="46" r="6.5" fill="#fff" fill-opacity="0.35" stroke="#b0306e" stroke-width="2"/>
    <path d="M47.5 46 H52.5" stroke="#b0306e" stroke-width="2"/>
    <circle cx="41" cy="46.5" r="2" fill="#3b2a1a"/><circle cx="59" cy="46.5" r="2" fill="#3b2a1a"/>
    <ellipse cx="34" cy="55" rx="4" ry="2.5" fill="#ff8fa8" opacity="0.6"/><ellipse cx="66" cy="55" rx="4" ry="2.5" fill="#ff8fa8" opacity="0.6"/>
    <path d="M42 58 Q50 65 58 58" stroke="#b0306e" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
  kevin: `${bg('#ffc55a', '#b35f00')}
    <path d="M16 100 Q18 74 50 70 Q82 74 84 100Z" fill="#f4f4f4"/>
    <path d="M17 84 H83 M16 94 H84" stroke="#222" stroke-width="5"/>
    <circle cx="50" cy="44" r="25" fill="#1d1d29"/>
    <path d="M28 30 Q50 14 72 30 Q50 22 28 30Z" fill="#2c2c3d"/>
    <circle cx="50" cy="15" r="6" fill="#e0344f"/>
    <rect x="30" y="37" width="40" height="15" rx="7.5" fill="url(#g-skin)"/>
    <circle cx="41" cy="44.5" r="5" fill="#fff"/><circle cx="59" cy="44.5" r="5" fill="#fff"/>
    <circle cx="42" cy="45" r="2.5" fill="#111"/><circle cx="58" cy="45" r="2.5" fill="#111"/>
    <circle cx="43" cy="44" r="0.9" fill="#fff"/><circle cx="59" cy="44" r="0.9" fill="#fff"/>
    <path d="M36 38 L45 36 M64 38 L55 36" stroke="#6b4a2a" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="50" cy="61" rx="8" ry="5" fill="#2a2a3a"/>
    <path d="M44 60 Q50 66 56 60" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  hero: `${bg('#6fc3ff', '#0f4aa8')}
    <path d="M12 100 Q16 70 50 68 Q84 70 88 100Z" fill="url(#g-hero-suit)"/>
    <path d="M12 100 L6 64 L34 76Z M88 100 L94 64 L66 76Z" fill="url(#g-hero-cape)"/>
    <path d="M40 80 L50 74 L60 80 L56 94 L44 94Z" fill="#ffc72c"/>
    <text x="50" y="90.5" font-size="13" font-weight="900" text-anchor="middle" fill="#b3001b" font-family="Arial">R</text>
    <rect x="42" y="58" width="16" height="14" fill="#e2b99a"/>
    <path d="M28 40 Q28 18 50 18 Q72 18 72 40 L70 58 Q62 70 50 70 Q38 70 30 58Z" fill="url(#g-skin)"/>
    <path d="M26 36 Q24 12 48 10 Q66 8 74 22 Q62 16 56 22 Q66 24 72 34 Q58 22 44 26 Q34 28 26 36Z" fill="#ffd54a"/>
    <path d="M28 38 H72 Q72 50 62 50 Q56 50 50 45 Q44 50 38 50 Q28 50 28 38Z" fill="#1552b8"/>
    <ellipse cx="40" cy="42" rx="4" ry="3" fill="#fff"/><ellipse cx="60" cy="42" rx="4" ry="3" fill="#fff"/>
    <circle cx="40" cy="42.5" r="1.8" fill="#123"/><circle cx="60" cy="42.5" r="1.8" fill="#123"/>
    <path d="M38 58 Q50 66 62 58 Q50 62 38 58Z" fill="#fff" stroke="#6b2a1a" stroke-width="1.2"/>
    <path d="M47 67 Q50 69 53 67" stroke="#d9a07f" stroke-width="1.6" fill="none"/>
    <path d="M70 55 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2z" fill="#fff"/>`,
  snivel: `${bg('#62f0a0', '#0e6b3a')}
    <path d="M14 100 Q18 72 50 70 Q82 72 86 100Z" fill="#f2f4f7"/>
    <path d="M50 72 L42 100 M50 72 L58 100" stroke="#c8ccd6" stroke-width="2"/>
    <rect x="62" y="84" width="10" height="3" fill="#2e8bff"/><rect x="64" y="80" width="2" height="8" fill="#e0344f"/>
    <rect x="44" y="60" width="12" height="12" fill="#d9b394"/>
    <g fill="#f5f5f5" stroke="#cfd3dc" stroke-width="1">
      <path d="M26 44 L12 30 L28 34 L16 16 L34 26 L36 8 L46 24 L54 6 L58 24 L70 8 L68 26 L86 16 L74 34 L90 30 L74 44Z"/>
    </g>
    <ellipse cx="50" cy="46" rx="20" ry="22" fill="url(#g-skin)"/>
    <rect x="28" y="36" width="44" height="8" rx="4" fill="#3a3a4a"/>
    <circle cx="40" cy="44" r="9" fill="#9ff5ff" stroke="#3a3a4a" stroke-width="3.2"/>
    <circle cx="61" cy="44" r="6.5" fill="#9ff5ff" stroke="#3a3a4a" stroke-width="3.2"/>
    <circle cx="41" cy="45" r="3.5" fill="#111"/><circle cx="60.5" cy="45" r="2" fill="#111"/>
    <path d="M40 60 Q48 56 52 61 Q56 64 62 58" stroke="#5a2a1a" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <rect x="47" y="60" width="4" height="4" fill="#fff" stroke="#5a2a1a" stroke-width="0.8"/>`,
  narrator: `${bg('#6a5a8f', '#1c1433')}
    <rect x="26" y="22" width="48" height="58" rx="5" fill="#f3e3c3" transform="rotate(-6 50 50)"/>
    <path d="M32 36 H66 M32 44 H66 M32 52 H60 M32 60 H64" stroke="#8a6a4a" stroke-width="2.4" transform="rotate(-6 50 50)"/>
    <path d="M62 78 L84 28 Q88 22 86 32 L66 80Z" fill="#fff" stroke="#b04dff" stroke-width="1.5"/>
    <path d="M62 78 L64 86 L66 80Z" fill="#1b1530"/>`,
};

export function portrait(who: Speaker): string {
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${PORTRAITS[who]}</svg>`;
}
