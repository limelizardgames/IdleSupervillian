const SUFFIXES = [
  '', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc',
  'UDc', 'DDc', 'TDc', 'QaDc', 'QiDc', 'SxDc', 'SpDc', 'OcDc', 'NoDc', 'Vg',
];

/** Formats a (possibly huge) number as a short human string: 1.23M, 45.6Qa, etc. */
export function fmt(n: number, decimals = 2): string {
  if (!isFinite(n)) return '∞';
  if (n < 0) return '-' + fmt(-n, decimals);
  if (n < 1000) {
    if (n < 10 && n % 1 !== 0) return n.toFixed(1);
    return Math.floor(n).toString();
  }
  const tier = Math.floor(Math.log10(n) / 3);
  if (tier < SUFFIXES.length) {
    const scaled = n / Math.pow(1000, tier);
    const d = scaled >= 100 ? decimals - 1 : decimals;
    return scaled.toFixed(Math.max(0, d)) + SUFFIXES[tier];
  }
  return n.toExponential(2).replace('+', '');
}

export function fmtMoney(n: number): string {
  return '$' + fmt(n);
}

/** 3725 -> "1h 2m", 65 -> "1m 5s" */
export function fmtTime(seconds: number): string {
  seconds = Math.max(0, Math.ceil(seconds));
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function fmtMult(n: number): string {
  if (n >= 1000) return 'x' + fmt(n);
  return 'x' + (Number.isInteger(n) ? n.toString() : n.toFixed(2).replace(/\.?0+$/, ''));
}
