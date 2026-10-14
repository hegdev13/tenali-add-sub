import type { Topic } from './types';

import { level16Topic } from './level-16-addition-1-30';
import { level17Topic } from './level-17-subtraction-1-30';

export * from './types';

/**
 * Master Topics Registry
 * To add a new topic or learning prototype:
 * 1. Create a folder in src/topics/<your-topic-slug>
 * 2. Create your module component(s)
 * 3. Define the Topic config in an index.ts file inside that folder
 * 4. Import and append the Topic to this TOPICS array below!
 */
export const TOPICS: Topic[] = [
  level16Topic,
  level17Topic,
];

export const getTopicById = (id: string): Topic | undefined => {
  return TOPICS.find((t) => t.id === id);
};

export const getModule = (topicId: string, moduleId: string) => {
  const topic = getTopicById(topicId);
  return topic?.modules.find((m) => m.id === moduleId);
};
