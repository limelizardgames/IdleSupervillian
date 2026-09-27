import { audio } from '../services/audio';
import { el } from './dom';

export interface ModalOptions {
  /** Extra class on the card (e.g. 'modal-wide', 'modal-dialog'). */
  cls?: string;
  /** Allow closing by tapping the backdrop. */
  dismissable?: boolean;
  /** Show immediately on top instead of queueing. */
  urgent?: boolean;
}

type Builder = (close: () => void) => HTMLElement;

interface Entry {
  build: Builder;
  opts: ModalOptions;
  resolve: () => void;
}

const queue: Entry[] = [];
let active: Entry | null = null;
let root: HTMLElement;

export function initModals(r: HTMLElement) {
  root = r;
}

export function modalOpen() {
  return active !== null;
}

/** Queues a modal. Resolves when it closes. */
export function showModal(build: Builder, opts: ModalOptions = {}): Promise<void> {
  return new Promise((resolve) => {
    const entry = { build, opts, resolve };
    if (opts.urgent) queue.unshift(entry);
    else queue.push(entry);
    if (!active) next();
  });
}

function next() {
  const entry = queue.shift();
  if (!entry) {
    active = null;
    return;
  }
  active = entry;
  const backdrop = el('div', 'modal-backdrop');
  const card = el('div', `modal ${entry.opts.cls ?? ''}`);
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    backdrop.classList.add('closing');
    setTimeout(() => {
      backdrop.remove();
      entry.resolve();
      next();
    }, 160);
  };
  card.appendChild(entry.build(close));
  backdrop.appendChild(card);
  if (entry.opts.dismissable !== false) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        audio.play('click');
        close();
      }
    });
  }
  root.appendChild(backdrop);
}

/** Standard modal with title, body html, and buttons. */
export interface ButtonSpec {
  label: string;
  cls?: string;
  onClick?: () => void | boolean | Promise<void | boolean>; // return false to keep open
}

export function simpleModal(title: string, bodyHtml: string, buttons: ButtonSpec[], opts: ModalOptions = {}) {
  return showModal((close) => {
    const wrap = el('div');
    wrap.innerHTML = `<div class="modal-title">${title}</div><div class="modal-body">${bodyHtml}</div>`;
    const row = el('div', 'modal-buttons');
    for (const b of buttons) {
      const btn = el('button', `btn ${b.cls ?? ''}`, b.label);
      btn.addEventListener('click', async () => {
        audio.play('click');
        btn.disabled = true;
        const r = await b.onClick?.();
        btn.disabled = false;
        if (r !== false) close();
      });
      row.appendChild(btn);
    }
    wrap.appendChild(row);
    return wrap;
  }, opts);
}

export function confirmModal(title: string, bodyHtml: string, yes = 'Yes', no = 'Cancel'): Promise<boolean> {
  let result = false;
  return simpleModal(title, bodyHtml, [
    { label: no, cls: 'btn-ghost' },
    { label: yes, cls: 'btn-danger', onClick: () => { result = true; } },
  ], { urgent: true }).then(() => result);
}
