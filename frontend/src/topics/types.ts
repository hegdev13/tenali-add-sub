import type { ComponentType } from 'react';

export type ModuleCategory = 'visualizer' | 'interactive-game' | 'step-by-step' | 'sandbox';
export type ModuleDifficulty = 'Foundational' | 'Intermediate' | 'Advanced';

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: ModuleCategory;
  difficulty: ModuleDifficulty;
  pedagogicalGoal: string;
  component: ComponentType;
  tags?: string[];
}

export interface Topic {
  id: string;
  title: string;
  slug: string;
  description: string;
  badge: string;
  gradeLevel: string;
  iconName: 'PlusCircle' | 'MinusCircle' | 'Layers' | 'Sparkles' | 'Binary';
  accentColor: string;
  modules: LearningModule[];
}
