import type { ComponentType } from 'react';

export type ModuleCategory = 'visualizer' | 'interactive-game' | 'step-by-step' | 'sandbox';
export type ModuleDifficulty = 'Foundational' | 'Intermediate' | 'Advanced';

export interface ModuleInfo {
  /** Level code shown in the info panel, e.g. "16.1" */
  levelCode: string;
  /** Short summary of what this (sub-)level contains */
  description?: string;
  /** Specification bullets: number range, question mix, layout, examples */
  notes: string[];
}

export interface TopicOverview {
  classLabel: string;
  ageGroup: string;
  objective: string;
  description: string;
  learningOutcome: string;
  topicsCovered: string[];
}

/** Props every task receives: `onNext` moves on to the following task (a no-op on the last one). */
export interface TaskProps {
  onNext: () => void;
}

export interface ModuleTask {
  /** Tab label, e.g. "Task 1". The URL is /<module-id>/task-<position>. */
  title: string;
  component: ComponentType<TaskProps>;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category?: ModuleCategory;
  difficulty?: ModuleDifficulty;
  pedagogicalGoal?: string;
  /** A single-screen module. Use `tasks` instead for a module made of several tasks. */
  component?: ComponentType;
  /** Ordered tasks: tabs, URLs and "Next task" are generated from this list. */
  tasks?: ModuleTask[];
  tags?: string[];
  /** Spec details revealed by the info icon */
  info?: ModuleInfo;
}

export interface Topic {
  id: string;
  title: string;
  slug: string;
  description: string;
  badge: string;
  iconName: 'PlusCircle' | 'MinusCircle' | 'Layers' | 'Sparkles' | 'Binary';
  accentColor: string;
  modules: LearningModule[];
  /** Level-wide details shown alongside each module's info */
  overview?: TopicOverview;
}
