import type { Topic, LearningModule } from '../topics';

interface PlaygroundProps {
  topic: Topic;
  module: LearningModule;
  onSelectModule: (moduleId: string) => void;
}

export const Playground = ({ topic, module, onSelectModule }: PlaygroundProps) => {
  const ModuleComponent = module.component;
  return (
    <div className="playground-view" id="active-playground">
      <div className="module-tabs-nav">
        {topic.modules.map((mod) => (
          <button
            key={mod.id}
            id={`tab-module-${mod.id}`}
            className={`module-tab-btn ${module.id === mod.id ? 'active' : ''}`}
            onClick={() => onSelectModule(mod.id)}
          >
            {mod.title}
          </button>
        ))}
      </div>

      <ModuleComponent key={module.id} />
    </div>
  );
};
