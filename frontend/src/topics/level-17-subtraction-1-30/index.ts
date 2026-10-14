import type { Topic } from '../types';
import { makePlaceholder } from '../PlaceholderModule';

const overview = {
  classLabel: 'Class 1',
  ageGroup: 'Age 6-7',
  objective: 'Develop the ability to solve subtraction problems involving numbers up to 30 without borrowing.',
  description:
    'In this level, students extend their understanding of subtraction by solving problems involving numbers up to 30. Through object-based and numerical activities, students learn to remove quantities from a group and determine the remaining amount. The focus is on developing confidence and accuracy in subtraction without borrowing.',
  learningOutcome:
    'Students can solve subtraction problems involving numbers up to 30 without borrowing and accurately determine the remaining quantity.',
  topicsCovered: [
    'Subtraction without Borrowing',
    'Object-Based Subtraction',
    'Numerical Subtraction',
    'Numbers up to 30',
  ],
};

export const level17Topic: Topic = {
  id: 'level-17',
  title: 'Level 17: Subtraction Through Objects & Numbers 1-30',
  slug: 'level-17-subtraction-1-30',
  description: overview.description,
  badge: 'Class 1',
  iconName: 'MinusCircle',
  accentColor: '#333333',
  overview,
  modules: [
    {
      id: 'level-17-0',
      title: 'Level 17.0 (Main)',
      description:
        'Mix of: object-based subtraction, number-based subtraction, missing difference questions.',
      component: makePlaceholder('17.0', 'Main'),
      info: {
        levelCode: '17.0',
        notes: [
          'Mix of: Object-based subtraction, Number-based subtraction, Missing difference questions',
          'Number range 1-30',
          'Numeral - vertical',
          'Example: 18 − 4 = ___',
          'Example: 🍎×15 − 🍎×3 (This does not mean multiplication)',
          'Example: ___ − ___ = ___',
        ],
      },
    },
    {
      id: 'level-17-1',
      title: 'Level 17.1 (Sub-level)',
      description:
        'Contains easier subtraction problems with smaller values and visual supports to reinforce the concept of taking away.',
      component: makePlaceholder('17.1', 'Sub-level'),
      info: {
        levelCode: '17.1',
        description:
          'Contains easier subtraction problems with smaller values and visual supports to reinforce the concept of taking away.',
        notes: [
          'Number range 1-30',
          'Numeral - vertical',
          'Will contain number and object both questions',
        ],
      },
    },
    {
      id: 'level-17-2',
      title: 'Level 17.2 (Sub-level)',
      description:
        'Provides additional remediation through simple object-based subtraction activities and guided counting exercises.',
      component: makePlaceholder('17.2', 'Sub-level'),
      info: {
        levelCode: '17.2',
        description:
          'Provides additional remediation through simple object-based subtraction activities and guided counting exercises.',
        notes: [
          'Number range 1-30',
          'Numeral - vertical (very easy)',
          'Will contain both - number and object',
        ],
      },
    },
  ],
};
