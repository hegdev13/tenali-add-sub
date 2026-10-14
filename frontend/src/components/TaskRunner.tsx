import { useEffect } from 'react';
import type { LearningModule } from '../topics';
import { navigate, parseTask, taskRoute, usePath } from '../router';
import './TaskRunner.css';

interface TaskRunnerProps {
  module: LearningModule;
}

/**
 * Runs a module made of several tasks: shows the task tabs, picks the task from the URL
 * (/<module-id>/task-<n>) and wires "Next task" to the following task in `module.tasks`.
 */
export const TaskRunner = ({ module }: TaskRunnerProps) => {
  const tasks = module.tasks ?? [];
  const urlTask = parseTask(usePath());
  const current = urlTask !== null && urlTask >= 1 && urlTask <= tasks.length ? urlTask : 1;

  // /<module-id> (or an unknown task number) -> /<module-id>/task-1
  useEffect(() => {
    if (urlTask !== current) navigate(taskRoute(module.id, current), { replace: true });
  }, [urlTask, current, module.id]);

  const Task = tasks[current - 1]?.component;
  if (!Task) return null;

  // TODO: dummy for now. The last task has no next task yet.
  const onNext = current < tasks.length ? () => navigate(taskRoute(module.id, current + 1)) : () => {};

  return (
    <div className="level-module" id={`${module.id}-page`}>
      <nav className="task-tabs" id={`${module.id}-task-tabs`} aria-label="Tasks">
        {tasks.map((task, i) => (
          <button
            key={task.title}
            id={`task-tab-${i + 1}`}
            className={`task-tab ${current === i + 1 ? 'active' : ''}`}
            aria-current={current === i + 1 ? 'page' : undefined}
            onClick={() => navigate(taskRoute(module.id, i + 1))}
          >
            {task.title}
          </button>
        ))}
      </nav>
      <Task onNext={onNext} />
    </div>
  );
};
