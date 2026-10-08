import type { Topic } from '../types';
import { BaseTenBorrowingModule } from './BaseTenBorrowingModule';
import { TakeAwayVisualizerModule } from './TakeAwayVisualizerModule';

export const placeValueSubtractionTopic: Topic = {
  id: 'place-value-subtraction',
  title: 'Place Value & Subtraction Regrouping',
  slug: 'subtraction-regrouping',
  description: 'Physical decomposition of ten-rods into ones cubes, and concrete object take-away models.',
  badge: 'Foundation 1-3',
  gradeLevel: 'Grade 2 - 3',
  iconName: 'MinusCircle',
  accentColor: '#f43f5e', // Rose
  modules: [
    {
      id: 'base-ten-borrowing',
      title: 'Base-10 Regrouping ("Borrowing")',
      description: 'Break apart a 10-rod into 10 unit cubes when ones are insufficient.',
      category: 'visualizer',
      difficulty: 'Intermediate',
      pedagogicalGoal: 'Eliminate confusion around "borrowing" by showing it as standard place-value renaming.',
      component: BaseTenBorrowingModule,
      tags: ['Base 10', 'Regrouping', 'Tens Rods', 'Place Value'],
    },
    {
      id: 'take-away-playground',
      title: 'Interactive Take-Away Playground',
      description: 'Click and strike out physical items to visualize subtraction as removal.',
      category: 'sandbox',
      difficulty: 'Foundational',
      pedagogicalGoal: 'Concrete object removal anchor for young elementary students.',
      component: TakeAwayVisualizerModule,
      tags: ['Concrete Math', 'Object Removal', 'Interactive Sandbox'],
    },
  ],
};
