import type { ChestType } from '../game/data';

const svg = (inner: string, vb = '0 0 64 64') => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

/** Icons for each operation/generator, index-aligned with GENERATORS. */
export const GEN_ICONS: string[] = [
  // Henchmen
  svg(`<circle cx="32" cy="34" r="22" fill="#1d1d29"/><path d="M14 24 Q32 8 50 24 Q32 16 14 24Z" fill="#2c2c3d"/><circle cx="32" cy="10" r="5" fill="#e0344f"/>
    <rect x="15" y="28" width="34" height="13" rx="6.5" fill="url(#g-skin)"/><circle cx="25" cy="34.5" r="4" fill="#fff"/><circle cx="39" cy="34.5" r="4" fill="#fff"/>
    <circle cx="26" cy="35" r="2" fill="#111"/><circle cx="38" cy="35" r="2" fill="#111"/><path d="M26 48 Q32 53 38 48" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>`),
  // Pigeons
  svg(`<ellipse cx="30" cy="38" rx="18" ry="14" fill="#8c93a8"/><path d="M14 36 Q4 30 6 44 Q12 42 16 44Z" fill="#6c7288"/>
    <circle cx="44" cy="24" r="10" fill="#9aa1b6"/><path d="M40 30 Q46 36 38 40" fill="#5bbfa0"/><path d="M52 24 L60 26 L52 28Z" fill="#f0a030"/>
    <rect x="37" y="19" width="16" height="6" rx="3" fill="#111"/><circle cx="47" cy="22" r="1.8" fill="#fff"/>
    <path d="M24 34 Q30 28 38 36" stroke="#6c7288" stroke-width="3" fill="none"/>
    <rect x="18" y="46" width="18" height="12" rx="2" fill="#7a4f28"/><rect x="18" y="46" width="18" height="4" fill="#5a3818"/><text x="27" y="57" font-size="7" text-anchor="middle" fill="#ffd23f" font-weight="bold" font-family="Arial">$</text>
    <path d="M26 52 L24 60 M34 52 L36 60" stroke="#f0a030" stroke-width="2"/>`),
  // Clone vat
  svg(`<ellipse cx="32" cy="34" rx="24" ry="28" fill="url(#g-glow-green)"/><rect x="16" y="6" width="32" height="7" rx="2" fill="url(#g-dark-metal)"/>
    <rect x="18" y="13" width="28" height="38" fill="url(#g-green-goo)" opacity="0.85"/>
    <path d="M32 20 q5 0 5 6 q0 5 -3 6 l3 13 h-3 l-2 -8 l-2 8 h-3 l3 -13 q-3 -1 -3 -6 q0 -6 5 -6z" fill="#0d4a22" opacity="0.7"/>
    <circle cx="24" cy="40" r="2" fill="none" stroke="#e0ffd6"/><circle cx="40" cy="30" r="1.5" fill="none" stroke="#e0ffd6"/>
    <rect x="18" y="13" width="28" height="38" fill="url(#g-glass)"/><rect x="16" y="51" width="32" height="8" rx="2" fill="url(#g-dark-metal)"/>`),
  // Call center
  svg(`<rect x="8" y="36" width="48" height="20" rx="4" fill="#3a3f55"/><rect x="12" y="40" width="24" height="12" rx="2" fill="#7fe3ff"/>
    <text x="24" y="49" font-size="7" text-anchor="middle" font-family="Arial" font-weight="bold" fill="#0d3a4f">$$$</text>
    <path d="M14 30 Q14 8 32 8 Q50 8 50 30" stroke="#1b1b24" stroke-width="5" fill="none"/>
    <rect x="8" y="24" width="10" height="14" rx="4" fill="#e0344f"/><rect x="46" y="24" width="10" height="14" rx="4" fill="#e0344f"/>
    <path d="M50 36 Q50 44 40 44" stroke="#1b1b24" stroke-width="2.5" fill="none"/><circle cx="39" cy="44" r="3" fill="#1b1b24"/>
    <circle cx="46" cy="46" r="3" fill="#ffd23f"/><circle cx="50" cy="50" r="2" fill="#3ddc84"/>`),
  // Lab
  svg(`<circle cx="32" cy="40" r="24" fill="url(#g-glow-purple)"/><path d="M26 6 H38 V22 L52 50 Q54 58 46 58 H18 Q10 58 12 50 L26 22Z" fill="#e8f7ff" opacity="0.4" stroke="#cfe" stroke-width="2"/>
    <path d="M18 38 H46 L52 50 Q54 58 46 58 H18 Q10 58 12 50Z" fill="#c04dff"/>
    <circle cx="26" cy="48" r="3" fill="#fff" opacity="0.7"/><circle cx="36" cy="44" r="2" fill="#fff" opacity="0.7"/>
    <circle class="rise" cx="30" cy="32" r="2.5" fill="none" stroke="#e9c9ff" stroke-width="1.5"/><circle class="rise" style="animation-delay:1s" cx="36" cy="28" r="2" fill="none" stroke="#e9c9ff" stroke-width="1.5"/>
    <rect x="24" y="4" width="16" height="5" rx="2" fill="#8a8fa8"/>`),
  // Robot
  svg(`<rect x="12" y="16" width="40" height="34" rx="8" fill="url(#g-metal)"/><rect x="28" y="6" width="8" height="10" fill="#5c6780"/><circle cx="32" cy="6" r="4" fill="#e0344f"/>
    <rect x="17" y="24" width="30" height="12" rx="6" fill="#1b1b24"/><circle cx="25" cy="30" r="4" fill="#ff2b4a"/><circle cx="39" cy="30" r="4" fill="#ff2b4a"/>
    <path d="M25 30 L2 44 M39 30 L62 44" stroke="#ff2b4a" stroke-width="2" opacity="0.8"/>
    <rect x="22" y="40" width="20" height="5" rx="2" fill="#5c6780"/><path d="M26 40 V45 M30 40 V45 M34 40 V45 M38 40 V45" stroke="#1b1b24"/>
    <rect x="18" y="50" width="28" height="10" rx="3" fill="#5c6780"/>`),
  // Shark
  svg(`<path d="M4 38 Q24 20 50 32 L60 36 L50 40 Q24 54 4 38Z" fill="#6d8199"/><path d="M26 28 L32 12 L38 30Z" fill="#6d8199"/>
    <path d="M10 42 Q30 50 52 40 L50 40 Q24 54 4 38Z" fill="#dfe8f2"/><circle cx="48" cy="34" r="2" fill="#111"/>
    <path d="M44 42 l2 3 l2 -3 l2 3 l2 -3" stroke="#fff" stroke-width="1" fill="none"/>
    <rect x="30" y="20" width="16" height="6" rx="2" fill="#3a3a44"/><circle cx="46" cy="23" r="2" fill="#ff2b4a"/><line x1="46" y1="23" x2="64" y2="18" stroke="#ff2b4a" stroke-width="2.5"/>`),
  // Weather
  svg(`<path d="M16 38 Q6 38 8 28 Q10 20 20 22 Q22 10 34 12 Q44 12 46 22 Q58 20 58 30 Q58 38 48 38Z" fill="#5a6178"/>
    <path d="M18 34 Q12 34 13 28 Q15 24 21 26 Q23 16 33 17 Q41 18 42 25 Q52 23 52 30 Q52 34 46 34Z" fill="#7d86a1"/>
    <path d="M34 36 L26 50 H33 L28 62 L42 44 H35 L40 36Z" fill="#ffd23f" stroke="#ff9a3c" stroke-width="1"/>
    <path d="M16 44 l-3 8 M22 46 l-3 8 M48 44 l-3 8" stroke="#7fe3ff" stroke-width="2" stroke-linecap="round"/>`),
  // Satellite
  svg(`<rect x="2" y="24" width="18" height="14" fill="#2e8bff" stroke="#9ab" stroke-width="1"/><rect x="44" y="24" width="18" height="14" fill="#2e8bff" stroke="#9ab" stroke-width="1"/>
    <path d="M8 24 V38 M14 24 V38 M50 24 V38 M56 24 V38" stroke="#9ab"/>
    <rect x="20" y="29" width="24" height="4" fill="#8a8fa8"/><rect x="24" y="18" width="16" height="26" rx="3" fill="url(#g-metal)"/>
    <circle cx="32" cy="50" r="10" fill="#fff"/><path d="M32 50 m-7 0 a7 7 0 1 1 7 7 a5 5 0 1 1 -5 -5 a3 3 0 1 1 3 3" stroke="#b04dff" stroke-width="1.8" fill="none"/>
    <line x1="32" y1="44" x2="32" y2="40" stroke="#8a8fa8" stroke-width="2"/>`),
  // Moon laser
  svg(`<circle cx="24" cy="36" r="20" fill="url(#g-moon)"/><circle cx="18" cy="30" r="4" fill="#9a96ad"/><circle cx="28" cy="44" r="3" fill="#9a96ad"/><circle cx="30" cy="28" r="2" fill="#9a96ad"/>
    <g transform="rotate(-30 34 30)"><rect x="30" y="24" width="26" height="10" rx="3" fill="url(#g-dark-metal)"/><rect x="54" y="22" width="5" height="14" rx="1" fill="#3a3a44"/></g>
    <line x1="56" y1="14" x2="64" y2="8" stroke="#ff2b4a" stroke-width="3"/><circle cx="57" cy="14" r="4" fill="#ff3b5c"/>`),
];

export const CHEST_ICONS: Record<ChestType, string> = {
  common: svg(`<ellipse cx="32" cy="58" rx="24" ry="4" fill="#000" opacity="0.25"/>
    <path d="M22 16 Q22 8 32 8 Q42 8 42 16" stroke="#8a8fa8" stroke-width="4" fill="none"/>
    <rect x="8" y="16" width="48" height="40" rx="6" fill="url(#g-lunchbox)"/><rect x="8" y="16" width="48" height="12" rx="6" fill="#6fd2ff"/>
    <rect x="28" y="24" width="8" height="8" rx="2" fill="url(#g-gold)"/>
    <circle cx="22" cy="42" r="6" fill="#fff"/><path d="M19 41 h2 M23 41 h2 M19 45 q3 2 6 0" stroke="#111" stroke-width="1.2"/>
    <text x="40" y="47" font-size="11" font-family="Arial" font-weight="900" fill="#ffd23f">$</text>`),
  rare: svg(`<ellipse cx="32" cy="58" rx="26" ry="4" fill="#000" opacity="0.25"/>
    <path d="M24 18 V12 Q24 8 28 8 H36 Q40 8 40 12 V18" stroke="#2a2a33" stroke-width="4" fill="none"/>
    <rect x="6" y="18" width="52" height="38" rx="5" fill="#23232e"/><rect x="6" y="18" width="52" height="4" fill="#3a3a48"/>
    <rect x="6" y="34" width="52" height="3" fill="url(#g-gold)"/>
    <rect x="16" y="30" width="9" height="11" rx="2" fill="url(#g-gold)"/><rect x="39" y="30" width="9" height="11" rx="2" fill="url(#g-gold)"/>
    <text x="32" y="52" font-size="7" text-anchor="middle" font-family="Arial" font-weight="900" fill="#e0344f">TOP SECRET</text>`),
  epic: svg(`<ellipse cx="32" cy="60" rx="26" ry="4" fill="#000" opacity="0.25"/><circle cx="32" cy="32" r="32" fill="url(#g-glow-purple)"/>
    <rect x="6" y="8" width="52" height="50" rx="8" fill="url(#g-vault)" stroke="url(#g-gold)" stroke-width="3"/>
    <circle cx="32" cy="33" r="15" fill="#3a0d7a" stroke="url(#g-gold)" stroke-width="3"/>
    <path d="M32 18 V48 M17 33 H47 M21 22 L43 44 M43 22 L21 44" stroke="url(#g-gold)" stroke-width="2.5"/>
    <circle cx="32" cy="33" r="5" fill="url(#g-gold)"/>
    <rect x="10" y="14" width="4" height="8" rx="1" fill="url(#g-gold)"/><rect x="10" y="44" width="4" height="8" rx="1" fill="url(#g-gold)"/>`),
};

export const GEM_ICON = svg(`<path d="M16 4 H48 L60 20 L32 60 L4 20Z" fill="url(#g-gem)"/><path d="M4 20 H60 M16 4 L24 20 L32 60 L40 20 L48 4 M24 20 L32 4 L40 20" stroke="#fff" stroke-opacity="0.5" stroke-width="1.5" fill="none"/><path d="M14 10 L20 10 L16 16Z" fill="#fff" opacity="0.7"/>`);

export const COIN_ICON = svg(`<circle cx="32" cy="32" r="28" fill="url(#g-gold)" stroke="#b36b00" stroke-width="3"/><circle cx="32" cy="32" r="21" fill="none" stroke="#b36b00" stroke-width="2" opacity="0.6"/><text x="32" y="43" font-size="30" text-anchor="middle" font-family="Arial Black,Arial" font-weight="900" fill="#8a4a00">$</text>`);

export const INFAMY_ICON = svg(`<path d="M32 4 L40 22 L60 24 L45 38 L50 58 L32 48 L14 58 L19 38 L4 24 L24 22Z" fill="#e0344f" stroke="#ffd23f" stroke-width="3" stroke-linejoin="round"/><path d="M24 30 L30 34 M40 30 L34 34" stroke="#1b1530" stroke-width="3" stroke-linecap="round"/><path d="M26 42 Q32 38 38 42" stroke="#1b1530" stroke-width="2.5" fill="none"/>`);

export const GRUDGE_ICON = svg(`<circle cx="32" cy="34" r="24" fill="#ff6b3d"/><path d="M18 26 L28 32 M46 26 L36 32" stroke="#1b1530" stroke-width="4" stroke-linecap="round"/><circle cx="25" cy="36" r="3" fill="#1b1530"/><circle cx="39" cy="36" r="3" fill="#1b1530"/><path d="M22 48 Q32 40 42 48" stroke="#1b1530" stroke-width="3" fill="none"/><path d="M44 4 q6 8 0 12 q10 -2 8 -10" fill="#ffd23f"/>`);

export const LOCK_ICON = svg(`<rect x="12" y="28" width="40" height="30" rx="6" fill="#5a5470"/><path d="M20 28 V20 Q20 8 32 8 Q44 8 44 20 V28" stroke="#5a5470" stroke-width="6" fill="none"/><circle cx="32" cy="42" r="5" fill="#2a2640"/><rect x="30" y="42" width="4" height="9" fill="#2a2640"/>`);
