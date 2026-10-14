import { useSyncExternalStore } from 'react';

/**
 * Tiny History API router (no dependency).
 *   /                       -> gallery
 *   /<module-id>            -> module page, e.g. /level-16-0
 *   /<module-id>/task-<n>   -> a task inside a module, e.g. /level-16-0/task-2
 */
const listeners = new Set<() => void>();

const subscribe = (callback: () => void) => {
  listeners.add(callback);
  window.addEventListener('popstate', callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('popstate', callback);
  };
};

export const navigate = (to: string, options: { replace?: boolean } = {}) => {
  if (to === window.location.pathname) return;
  if (options.replace) window.history.replaceState(null, '', to);
  else window.history.pushState(null, '', to);
  listeners.forEach((listener) => listener());
};

export const usePath = () => useSyncExternalStore(subscribe, () => window.location.pathname);

export const moduleRoute = (moduleId: string) => `/${moduleId}`;
export const taskRoute = (moduleId: string, task: number) => `/${moduleId}/task-${task}`;

/** Reads the task number from a path like /level-16-0/task-2 (null if absent). */
export const parseTask = (path: string): number | null => {
  const match = path.match(/\/task-(\d+)\/?$/);
  return match ? Number(match[1]) : null;
};
