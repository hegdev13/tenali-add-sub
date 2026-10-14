import type { PointerEvent as ReactPointerEvent } from 'react';

/** Begin dragging an element: stop text selection and keep receiving pointer events. */
export const startPointerDrag = (e: ReactPointerEvent<HTMLElement>) => {
  e.preventDefault();
  e.currentTarget.setPointerCapture(e.pointerId);
};

/** Pointer position as a percentage of the canvas, kept `margin`% away from the edges. */
export const canvasPercent = (
  canvas: HTMLElement | null,
  clientX: number,
  clientY: number,
  margin = 2
) => {
  const r = canvas?.getBoundingClientRect();
  if (!r) return null;
  const clamp = (v: number) => Math.min(100 - margin, Math.max(margin, v));
  return {
    x: clamp(((clientX - r.left) / r.width) * 100),
    y: clamp(((clientY - r.top) / r.height) * 100),
  };
};

/** Pointer position in px relative to the canvas. */
export const canvasPoint = (canvas: HTMLElement | null, clientX: number, clientY: number) => {
  const r = canvas?.getBoundingClientRect();
  return r ? { x: clientX - r.left, y: clientY - r.top } : { x: 0, y: 0 };
};

/** Centre of an element in px relative to the canvas. */
export const centerIn = (canvas: HTMLElement, el: HTMLElement) => {
  const c = canvas.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2 - c.left, y: r.top + r.height / 2 - c.top };
};

/** Start and end points (px in the canvas) for a hint hand going from one element to another. */
export type HintPath = { sx: number; sy: number; ex: number; ey: number };

export const pathBetween = (canvas: HTMLElement, from: HTMLElement, to: HTMLElement): HintPath => {
  const a = centerIn(canvas, from);
  const b = centerIn(canvas, to);
  return { sx: a.x, sy: a.y, ex: b.x, ey: b.y };
};

export const isPointInside = (el: HTMLElement | null, x: number, y: number, pad = 0) => {
  const r = el?.getBoundingClientRect();
  if (!r) return false;
  return x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad;
};

/** Index of the first element under the point, or -1. */
export const indexOfElementAt = (
  els: (HTMLElement | null)[],
  x: number,
  y: number,
  pad = 0
) => els.findIndex((el) => isPointInside(el, x, y, pad));
