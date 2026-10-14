import { useState, useMemo } from 'react';
import { TOPICS } from './topics';
import type { Topic, LearningModule } from './topics';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { GalleryOverview } from './components/GalleryOverview';
import { Playground } from './components/Playground';
import { ModuleInfoModal } from './components/ModuleInfoModal';
import { GuideModal } from './components/GuideModal';
import { navigate, usePath, moduleRoute } from './router';
import './index.css';

export const App = () => {
  const path = usePath();
  const [searchQuery, setSearchQuery] = useState('');
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [infoTarget, setInfoTarget] = useState<{ topic: Topic; module: LearningModule } | null>(null);

  // the URL decides what is open: /<module-id>[/task-<n>]
  const moduleSegment = path.split('/').filter(Boolean)[0];
  const active = TOPICS.flatMap((topic) =>
    topic.modules.map((module) => ({ topic, module }))
  ).find(({ module }) => module.id === moduleSegment);
  const activeTopic = active?.topic;
  const activeModule = active?.module ?? null;

  const filteredTopics = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q === '') return TOPICS;
    return TOPICS.filter(
      (topic) =>
        topic.title.toLowerCase().includes(q) ||
        topic.description.toLowerCase().includes(q) ||
        topic.modules.some(
          (m) =>
            m.title.toLowerCase().includes(q) ||
            m.description.toLowerCase().includes(q) ||
            m.tags?.some((t) => t.toLowerCase().includes(q))
        )
    );
  }, [searchQuery]);

  const goHome = () => navigate('/');

  const selectTopic = (topicId: string) => {
    const first = TOPICS.find((t) => t.id === topicId)?.modules[0];
    if (first) navigate(moduleRoute(first.id));
  };

  const launchModule = (_topic: Topic, module: LearningModule) => navigate(moduleRoute(module.id));

  return (
    <div className="app-shell">
      <Sidebar
        selectedTopicId={activeTopic?.id ?? null}
        onHome={goHome}
        onSelectTopic={selectTopic}
        onOpenGuide={() => setIsGuideModalOpen(true)}
      />

      <main className="app-main">
        <TopBar
          activeTopic={activeTopic}
          activeModule={activeModule}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onHome={goHome}
          onTopic={() => activeTopic && selectTopic(activeTopic.id)}
        />

        {activeTopic && activeModule ? (
          <Playground
            topic={activeTopic}
            module={activeModule}
            onSelectModule={(id) => navigate(moduleRoute(id))}
          />
        ) : (
          <GalleryOverview
            topics={filteredTopics}
            onLaunch={launchModule}
            onInfo={(topic, module) => setInfoTarget({ topic, module })}
            onOpenGuide={() => setIsGuideModalOpen(true)}
          />
        )}
      </main>

      {infoTarget && (
        <ModuleInfoModal
          topic={infoTarget.topic}
          module={infoTarget.module}
          onClose={() => setInfoTarget(null)}
        />
      )}
      {isGuideModalOpen && <GuideModal onClose={() => setIsGuideModalOpen(false)} />}
    </div>
  );
};

export default App;
