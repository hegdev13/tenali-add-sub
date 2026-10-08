import type { Topic } from '../types';
import { TenFrameModule } from './TenFrameModule';
import { NumberLineJumpModule } from './NumberLineJumpModule';

export const singleDigitAdditionTopic: Topic = {
  id: 'single-digit-addition',
  title: 'Single-Digit Addition & Making 10',
  slug: 'addition-making-ten',
  description: 'Interactive visual models exploring addition anchors, double ten-frames, and number line hopping.',
  badge: 'Foundation K-2',
  gradeLevel: 'Grade 1 - 2',
  iconName: 'PlusCircle',
  accentColor: '#38bdf8', // Cyan
  modules: [
    {
      id: 'ten-frame-visualizer',
      title: 'Ten-Frame "Make a Ten"',
      description: 'Break apart the second addend to complete the 10-frame anchor.',
      category: 'visualizer',
      difficulty: 'Foundational',
      pedagogicalGoal: 'Transition from counting on fingers to structural 10-grouping.',
      component: TenFrameModule,
      tags: ['Ten Frame', 'Make a 10', 'Visual Tokens'],
    },
    {
      id: 'number-line-hop',
      title: 'Number Line Benchmark Hopping',
      description: 'Hop from the starting value to milestone 10, then leap to the sum.',
      category: 'step-by-step',
      difficulty: 'Foundational',
      pedagogicalGoal: 'Develop mental number sense through spatial landmark hopping.',
      component: NumberLineJumpModule,
      tags: ['Number Line', 'Spatial Math', 'Bridge to 10'],
    },
  ],
};
