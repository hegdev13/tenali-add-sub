import type { Topic } from '../types';
import { makePlaceholder } from '../PlaceholderModule';
import { Task1PaperBin } from './tasks/Task1PaperBin';
import { Task2OrderBlocks } from './tasks/Task2OrderBlocks';
import { Task3CountBlocks } from './tasks/Task3CountBlocks';

const overview = {
  classLabel: 'Class 1',
  ageGroup: 'Age 6-7',
  objective: 'Develop the ability to solve addition problems involving numbers up to 30 without carrying.',
  description:
    'In this level, students build upon their understanding of addition by solving problems involving numbers up to 30. Activities include object-based addition, pictorial representations, and numerical addition exercises. Students practice combining quantities and finding totals while strengthening their number sense and calculation skills.',
  learningOutcome:
    'Students can solve addition problems involving numbers up to 30 without carrying and accurately determine the total quantity.',
  topicsCovered: [
    'Addition without Carrying',
    'Object-Based Addition',
    'Numerical Addition',
    'Numbers up to 30',
  ],
};

export const level16Topic: Topic = {
  id: 'level-16',
  title: 'Level 16: Addition Through Objects & Numbers 1-30',
  slug: 'level-16-addition-1-30',
  description: overview.description,
  badge: 'Class 1',
  iconName: 'PlusCircle',
  accentColor: '#333333',
  overview,
  modules: [
    {
      id: 'level-16-0',
      title: 'Level 16.0 (Main)',
      description: 'The number range is 1-30. 2 digit addition without carry.',
      tasks: [
        { title: 'Task 1', component: Task1PaperBin },
        { title: 'Task 2', component: Task2OrderBlocks },
        { title: 'Task 3', component: Task3CountBlocks },
      ],
      info: {
        levelCode: '16.0',
        notes: [
          'The number range is 1-30',
          '2 digit addition without carry',
          '1 page will contain questions with only numerals and other page with object',
          'Numeral - vertical',
        ],
      },
    },
    {
      id: 'level-16-1',
      title: 'Level 16.1 (Sub-level)',
      description:
        'Contains easier addition problems with smaller numbers and stronger visual support to help students practice combining quantities confidently.',
      component: makePlaceholder('16.1', 'Sub-level'),
      info: {
        levelCode: '16.1',
        description:
          'Contains easier addition problems with smaller numbers and stronger visual support to help students practice combining quantities confidently.',
        notes: ['More questions of object and less of numerals'],
      },
    },
    {
      id: 'level-16-2',
      title: 'Level 16.2 (Sub-level)',
      description:
        'Provides additional remediation through object-based activities and simple addition questions using smaller values within the range.',
      component: makePlaceholder('16.2', 'Sub-level'),
      info: {
        levelCode: '16.2',
        description:
          'Provides additional remediation through object-based activities and simple addition questions using smaller values within the range.',
        notes: ['More easy', 'Will contain both - numeral and object'],
      },
    },
  ],
};
