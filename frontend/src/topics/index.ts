import type { Topic } from './types';
import { singleDigitAdditionTopic } from './single-digit-addition';
import { placeValueSubtractionTopic } from './place-value-subtraction';

export * from './types';

/**
 * Master Topics Registry
 * To add a new topic or learning prototype:
 * 1. Create a folder in src/topics/<your-topic-name>
 * 2. Create your module components
 * 3. Define the Topic config in an index.ts file
 * 4. Add the Topic to this TOPICS array below!
 */
export const TOPICS: Topic[] = [
  singleDigitAdditionTopic,
  placeValueSubtractionTopic,
];

export const getTopicById = (id: string): Topic | undefined => {
  return TOPICS.find((t) => t.id === id);
};

export const getModule = (topicId: string, moduleId: string) => {
  const topic = getTopicById(topicId);
  return topic?.modules.find((m) => m.id === moduleId);
};
