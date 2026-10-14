import { describe, expect, it } from 'vitest';
import { moduleRoute, parseTask, taskRoute } from './router';

describe('routes', () => {
  it('builds module and task urls', () => {
    expect(moduleRoute('level-16-0')).toBe('/level-16-0');
    expect(taskRoute('level-16-0', 2)).toBe('/level-16-0/task-2');
  });

  it('reads the task number from a path', () => {
    expect(parseTask('/level-16-0/task-3')).toBe(3);
    expect(parseTask('/level-16-0/task-3/')).toBe(3);
    expect(parseTask('/level-16-0')).toBeNull();
    expect(parseTask('/')).toBeNull();
  });
});
