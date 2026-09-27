/**
 * Shared SVG gradients/filters. Injected once into the document (in an
 * invisible-but-rendered <svg>) so every inline SVG can reference them.
 */
export const SVG_DEFS = `
<svg width="0" height="0" style="position:absolute;width:0;height:0" aria-hidden="true">
  <defs>
    <linearGradient id="g-cape" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#7b2cff"/><stop offset="1" stop-color="#3a0d7a"/>
    </linearGradient>
    <linearGradient id="g-cape-red" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ff3b5c"/><stop offset="1" stop-color="#a30d2b"/>
    </linearGradient>
    <linearGradient id="g-hero-cape" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ff4747"/><stop offset="1" stop-color="#b3001b"/>
    </linearGradient>
    <linearGradient id="g-hero-suit" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3d9bff"/><stop offset="1" stop-color="#1552b8"/>
    </linearGradient>
    <linearGradient id="g-suit" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#34304f"/><stop offset="1" stop-color="#17152a"/>
    </linearGradient>
    <radialGradient id="g-skin" cx="0.45" cy="0.4" r="0.7">
      <stop offset="0" stop-color="#fbe3cf"/><stop offset="1" stop-color="#e2b99a"/>
    </radialGradient>
    <radialGradient id="g-skin-dark" cx="0.45" cy="0.4" r="0.7">
      <stop offset="0" stop-color="#c98f66"/><stop offset="1" stop-color="#9b6644"/>
    </radialGradient>
    <linearGradient id="g-gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff2a8"/><stop offset="0.5" stop-color="#ffc72c"/><stop offset="1" stop-color="#d98a00"/>
    </linearGradient>
    <linearGradient id="g-gem" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ff9cf2"/><stop offset="0.5" stop-color="#c04dff"/><stop offset="1" stop-color="#6a17c9"/>
    </linearGradient>
    <linearGradient id="g-green-goo" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#9dff7a"/><stop offset="1" stop-color="#1fa84a"/>
    </linearGradient>
    <linearGradient id="g-metal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#e3e8f2"/><stop offset="0.5" stop-color="#9aa6bd"/><stop offset="1" stop-color="#5c6780"/>
    </linearGradient>
    <linearGradient id="g-dark-metal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#5a6178"/><stop offset="1" stop-color="#262a3a"/>
    </linearGradient>
    <linearGradient id="g-lava" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffe066"/><stop offset="0.4" stop-color="#ff7a1a"/><stop offset="1" stop-color="#b3160b"/>
    </linearGradient>
    <linearGradient id="g-lavalamp" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ff5ec4"/><stop offset="1" stop-color="#ff9a3c"/>
    </linearGradient>
    <linearGradient id="g-panel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#6b4226"/><stop offset="0.5" stop-color="#7d5030"/><stop offset="1" stop-color="#6b4226"/>
    </linearGradient>
    <linearGradient id="g-basement-wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3b2a45"/><stop offset="1" stop-color="#241a2e"/>
    </linearGradient>
    <linearGradient id="g-warehouse" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2a3446"/><stop offset="1" stop-color="#151b27"/>
    </linearGradient>
    <linearGradient id="g-volcano" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2a0f12"/><stop offset="0.7" stop-color="#5a1a12"/><stop offset="1" stop-color="#8a2a0e"/>
    </linearGradient>
    <linearGradient id="g-sea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0d6fa8"/><stop offset="1" stop-color="#062447"/>
    </linearGradient>
    <linearGradient id="g-space" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#05030f"/><stop offset="1" stop-color="#1a0f3d"/>
    </linearGradient>
    <radialGradient id="g-earth" cx="0.35" cy="0.35" r="0.75">
      <stop offset="0" stop-color="#7fd4ff"/><stop offset="0.6" stop-color="#2a7fd6"/><stop offset="1" stop-color="#0b2f6b"/>
    </radialGradient>
    <radialGradient id="g-moon" cx="0.4" cy="0.3" r="0.8">
      <stop offset="0" stop-color="#e8e6f0"/><stop offset="1" stop-color="#8f8aa6"/>
    </radialGradient>
    <radialGradient id="g-glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#fff" stop-opacity="0.9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g-glow-purple" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#c77dff" stop-opacity="0.8"/><stop offset="1" stop-color="#c77dff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g-glow-green" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#6bff8f" stop-opacity="0.7"/><stop offset="1" stop-color="#6bff8f" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g-glow-orange" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#ff9a3c" stop-opacity="0.8"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g-glow-blue" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#7fe3ff" stop-opacity="0.6"/><stop offset="1" stop-color="#7fe3ff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="g-beam" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fffbe0" stop-opacity="0.35"/><stop offset="1" stop-color="#fffbe0" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="g-glass" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.35"/><stop offset="0.3" stop-color="#ffffff" stop-opacity="0.05"/><stop offset="1" stop-color="#ffffff" stop-opacity="0.2"/>
    </linearGradient>
    <linearGradient id="g-wood" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#b07a45"/><stop offset="1" stop-color="#7a4f28"/>
    </linearGradient>
    <linearGradient id="g-crate" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#c79a5b"/><stop offset="1" stop-color="#8a6230"/>
    </linearGradient>
    <linearGradient id="g-lunchbox" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#4fc3ff"/><stop offset="1" stop-color="#1769c4"/>
    </linearGradient>
    <linearGradient id="g-vault" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#b56bff"/><stop offset="1" stop-color="#4a118f"/>
    </linearGradient>
    <filter id="f-soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2"/>
    </filter>
    <filter id="f-blur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6"/>
    </filter>
    <!-- Comic-book textures -->
    <pattern id="p-halftone" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
      <circle cx="3" cy="3" r="1.3" fill="#000"/>
    </pattern>
    <pattern id="p-halftone-light" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
      <circle cx="3.5" cy="3.5" r="1.2" fill="#fff"/>
    </pattern>
    <pattern id="p-bricks" width="40" height="20" patternUnits="userSpaceOnUse">
      <rect width="40" height="20" fill="#00000000"/>
      <path d="M0 0.5 H40 M0 10.5 H40 M10 0 V10 M30 10 V20" stroke="#000" stroke-opacity="0.25" stroke-width="1.2"/>
    </pattern>
    <pattern id="p-carpet" width="8" height="8" patternUnits="userSpaceOnUse">
      <path d="M0 8 L4 0 L8 8" stroke="#000" stroke-opacity="0.18" fill="none"/>
    </pattern>
    <pattern id="p-grate" width="10" height="10" patternUnits="userSpaceOnUse">
      <path d="M0 0 L10 10 M10 0 L0 10" stroke="#000" stroke-opacity="0.35" stroke-width="1.2"/>
    </pattern>
    <!-- Character palette -->
    <linearGradient id="g-v-cape" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#8a3dff"/><stop offset="0.55" stop-color="#5a1bc4"/><stop offset="1" stop-color="#2a0870"/>
    </linearGradient>
    <linearGradient id="g-v-lining" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ff3d64"/><stop offset="1" stop-color="#8f0b2c"/>
    </linearGradient>
    <linearGradient id="g-v-suit" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#4a4270"/><stop offset="0.5" stop-color="#2e2850"/><stop offset="1" stop-color="#1a1630"/>
    </linearGradient>
    <linearGradient id="g-v-boot" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#4b3f78"/><stop offset="1" stop-color="#1f1838"/>
    </linearGradient>
    <linearGradient id="g-v-glove" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#b57bff"/><stop offset="1" stop-color="#5a1bc4"/>
    </linearGradient>
    <linearGradient id="g-hair" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3b2d63"/><stop offset="1" stop-color="#140e26"/>
    </linearGradient>
    <linearGradient id="g-face" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffe7d4"/><stop offset="0.6" stop-color="#f6cfb0"/><stop offset="1" stop-color="#dfa987"/>
    </linearGradient>
    <linearGradient id="g-hench-shirt" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd3e0"/>
    </linearGradient>
    <linearGradient id="g-mask" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3a3a52"/><stop offset="1" stop-color="#15151f"/>
    </linearGradient>
    <linearGradient id="g-hero-hair" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff08a"/><stop offset="1" stop-color="#f0a800"/>
    </linearGradient>
    <linearGradient id="g-mom-cardigan" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ff9cc8"/><stop offset="1" stop-color="#d9477f"/>
    </linearGradient>
    <linearGradient id="g-mom-hair" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#b07a52"/><stop offset="1" stop-color="#6b4228"/>
    </linearGradient>
    <linearGradient id="g-labcoat" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c9d2e3"/>
    </linearGradient>
    <radialGradient id="g-spot" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#fff6d8" stop-opacity="0.55"/><stop offset="0.6" stop-color="#fff6d8" stop-opacity="0.12"/><stop offset="1" stop-color="#fff6d8" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="g-shine" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0.55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
  </defs>
</svg>`;
