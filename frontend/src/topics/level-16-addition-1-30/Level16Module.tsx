import { useEffect } from 'react';
import { navigate, parseTask, taskRoute, usePath } from '../../router';
import { Task1PaperBin } from './tasks/Task1PaperBin';
import { Task2OrderBlocks } from './tasks/Task2OrderBlocks';
import { Task3CountBlocks } from './tasks/Task3CountBlocks';

const MODULE_ID = 'level-16-0';
const TASKS = [1, 2, 3] as const;

export const Level16Module = () => {
  const path = usePath();
  const urlTask = parseTask(path);
  const task = urlTask === 2 || urlTask === 3 ? urlTask : 1;

  // /level-16-0 -> /level-16-0/task-1 (also fixes unknown task numbers)
  useEffect(() => {
    if (urlTask !== 1 && urlTask !== 2 && urlTask !== 3) navigate(taskRoute(MODULE_ID, 1), { replace: true });
  }, [urlTask]);

  return (
    <div className="level-module" id="level-16-0-page">
      <nav className="task-tabs" id="level-16-task-tabs" aria-label="Tasks">
        {TASKS.map((n) => (
          <button
            key={n}
            id={`task-tab-${n}`}
            className={`task-tab ${task === n ? 'active' : ''}`}
            aria-current={task === n ? 'page' : undefined}
            onClick={() => navigate(taskRoute(MODULE_ID, n))}
          >
            Task {n}
          </button>
        ))}
      </nav>
      {task === 1 && <Task1PaperBin onNext={() => navigate(taskRoute(MODULE_ID, 2))} />}
      {task === 2 && <Task2OrderBlocks onNext={() => navigate(taskRoute(MODULE_ID, 3))} />}
      {/* TODO: dummy for now, wire up to the next task later */}
      {task === 3 && <Task3CountBlocks onNext={() => {}} />}
    </div>
  );
};
