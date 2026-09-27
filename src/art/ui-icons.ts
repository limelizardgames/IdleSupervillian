// Bold, ink-outlined UI icons for the tab bar and scene buttons (64x64).
const INK = '#1b1530';
const ink = (w = 3) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const svg = (inner: string) => `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

export const UI_ICONS = {
  minions: svg(`
    <path d="M14 58 Q16 42 32 40 Q48 42 50 58Z" fill="#8a3dff" ${ink()}/>
    <path d="M18 44 L10 22 L26 36Z M46 44 L54 22 L38 36Z" fill="#e0344f" ${ink(2.5)}/>
    <path d="M18 24 Q18 10 32 10 Q46 10 46 24 L44 34 Q39 42 32 42 Q25 42 20 34Z" fill="url(#g-face)" ${ink()}/>
    <path d="M16 26 Q13 6 32 5 Q51 6 48 26 Q46 18 41 16 Q37 17 32 24 Q27 17 23 16 Q18 18 16 26Z" fill="url(#g-hair)" ${ink(2.5)}/>
    <path d="M22 24 L29 27 M42 24 L35 27" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="27" cy="29" r="2" fill="${INK}"/><circle cx="37" cy="29" r="2" fill="${INK}"/>
    <path d="M32 34 Q27 32 23 35 Q27 37 32 36 Q37 37 41 35 Q37 32 32 34Z" fill="${INK}"/>`),
  upgrades: svg(`
    <path d="M32 6 L54 30 H41 V56 H23 V30 H10Z" fill="#3ddc84" ${ink()}/>
    <path d="M32 12 L46 27 H38" stroke="#b8ffd6" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M52 44 l2.5 -6 l2.5 6 l6 2.5 l-6 2.5 l-2.5 6 l-2.5 -6 l-6 -2.5z" fill="#ffd23f" ${ink(1.8)}/>`),
  doomsday: svg(`
    <circle cx="28" cy="38" r="20" fill="#3a3358" ${ink()}/>
    <path d="M18 30 Q22 24 29 23" stroke="#8a80b8" stroke-width="4" fill="none" stroke-linecap="round"/>
    <rect x="34" y="14" width="12" height="9" rx="2" fill="#6c7288" ${ink(2.5)} transform="rotate(35 40 18)"/>
    <path d="M44 14 Q48 6 56 8" stroke="${INK}" stroke-width="3" fill="none"/>
    <path d="M56 8 l3 -5 l1 6 l5 1 l-5 3 l1 6 l-4 -4 l-5 2 l2 -5 l-4 -3z" fill="#ffb02e" ${ink(1.5)}/>
    <path d="M22 44 L26 36 L30 42 L34 34" stroke="#e0344f" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`),
  hero: svg(`
    <path d="M32 5 L54 13 V30 Q54 48 32 59 Q10 48 10 30 V13Z" fill="#2a74e0" ${ink()}/>
    <path d="M32 11 L48 17 V30 Q48 44 32 52Z" fill="#1552b8"/>
    <path d="M22 18 Q28 14 32 14" stroke="#9ccaff" stroke-width="3" fill="none" stroke-linecap="round"/>
    <text x="32" y="42" font-size="26" font-weight="900" text-anchor="middle" font-family="Arial Black,Arial" fill="#ffc72c" stroke="${INK}" stroke-width="2" paint-order="stroke">R</text>`),
  shop: svg(`
    <path d="M16 6 H48 L60 22 L32 60 L4 22Z" fill="url(#g-gem)" ${ink()}/>
    <path d="M4 22 H60 M16 6 L24 22 L32 60 L40 22 L48 6 M24 22 L32 6 L40 22" stroke="${INK}" stroke-width="1.8" stroke-opacity="0.5" fill="none"/>
    <path d="M14 11 L20 11 L16 18Z" fill="#fff" opacity="0.8"/>`),
  daily: svg(`
    <rect x="8" y="12" width="48" height="46" rx="6" fill="#fff" ${ink()}/>
    <path d="M8 18 Q8 12 14 12 H50 Q56 12 56 18 V26 H8Z" fill="#e0344f" ${ink()}/>
    <rect x="18" y="6" width="6" height="12" rx="3" fill="#6c7288" ${ink(2)}/><rect x="40" y="6" width="6" height="12" rx="3" fill="#6c7288" ${ink(2)}/>
    <path d="M22 40 L29 47 L43 33" stroke="#3ddc84" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M22 40 L29 47 L43 33" stroke="${INK}" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.4"/>`),
  boost: svg(`
    <circle cx="32" cy="32" r="27" fill="#ffb02e" ${ink()}/>
    <circle cx="32" cy="32" r="21" fill="#ffd23f"/>
    <path d="M36 8 L18 36 H30 L26 56 L46 26 H34Z" fill="#fff" ${ink(2.5)}/>`),
  gift: svg(`
    <rect x="8" y="26" width="48" height="32" rx="4" fill="#b04dff" ${ink()}/>
    <rect x="4" y="18" width="56" height="12" rx="3" fill="#c77dff" ${ink()}/>
    <rect x="27" y="18" width="10" height="40" fill="#ffd23f" ${ink(2.5)}/>
    <path d="M32 18 Q20 2 14 10 Q10 18 32 18 Q54 18 50 10 Q44 2 32 18Z" fill="#ffd23f" ${ink(2.5)}/>
    <path d="M12 32 V52" stroke="#e0b8ff" stroke-width="3" stroke-linecap="round"/>`),
};

export type UiIcon = keyof typeof UI_ICONS;
