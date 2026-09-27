export function $(sel: string, root: ParentNode = document): HTMLElement {
  const el = root.querySelector<HTMLElement>(sel);
  if (!el) throw new Error(`Missing element ${sel}`);
  return el;
}

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  cls = '',
  html = '',
): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

/** Sets textContent only when changed (avoids layout thrash at 10Hz). */
export function setText(e: Element | null | undefined, text: string) {
  if (e && e.textContent !== text) e.textContent = text;
}

export function toggle(e: Element | null | undefined, cls: string, on: boolean) {
  if (e && e.classList.contains(cls) !== on) e.classList.toggle(cls, on);
}

export function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

/** Pointer-down activation that feels instant on touch devices. */
export function onTap(target: HTMLElement, handler: (e: PointerEvent) => void) {
  target.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    handler(e);
  });
}
