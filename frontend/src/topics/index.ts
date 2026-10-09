import type { Topic } from './types';

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
  // Add your topics here
];

export const getTopicById = (id: string): Topic | undefined => {
  return TOPICS.find((t) => t.id === id);
};

export const getModule = (topicId: string, moduleId: string) => {
  const topic = getTopicById(topicId);
  return topic?.modules.find((m) => m.id === moduleId);
};
