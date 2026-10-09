import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  PlusCircle,
  MinusCircle,
  Layers,
  X,
  ChevronRight,
  Play,
  LayoutGrid,
  Code2,
  Atom,
} from 'lucide-react';
import { TOPICS } from './topics';
import type { Topic, LearningModule } from './topics';
import './index.css';

export const App: React.FC = () => {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);

  // Active topic object
  const activeTopic = useMemo(
    () => TOPICS.find((t) => t.id === selectedTopicId),
    [selectedTopicId]
  );

  // Active module object
  const activeModule = useMemo(() => {
    if (!activeTopic) return null;
    if (selectedModuleId) {
      return activeTopic.modules.find((m) => m.id === selectedModuleId) || activeTopic.modules[0];
    }
    return activeTopic.modules[0];
  }, [activeTopic, selectedModuleId]);

  // Filtered topics based on search
  const filteredTopics = useMemo(() => {
    return TOPICS.filter((topic) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.modules.some(
          (m) =>
            m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        );

      return matchesSearch;
    });
  }, [searchQuery]);

  // Handler to open a specific module
  const handleOpenModule = (topic: Topic, module: LearningModule) => {
    setSelectedTopicId(topic.id);
    setSelectedModuleId(module.id);
  };

  // Icon mapping
  const renderTopicIcon = (iconName: string, size = 18) => {
    switch (iconName) {
      case 'PlusCircle':
        return <PlusCircle size={size} />;
      case 'MinusCircle':
        return <MinusCircle size={size} />;
      case 'Layers':
        return <Layers size={size} />;
      default:
        return <Sparkles size={size} />;
    }
  };

  const totalPrototypesCount = useMemo(
    () => TOPICS.reduce((acc, t) => acc + t.modules.length, 0),
    []
  );

  return (
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <aside className="app-sidebar">
        <div className="sidebar-header">
          <div
            className="brand-badge"
            id="brand-home-btn"
            onClick={() => {
              setSelectedTopicId(null);
              setSelectedModuleId(null);
            }}
          >
            <div className="brand-icon">
              <Atom size={22} />
            </div>
            <div className="brand-text">
              <h1>Tenali Math</h1>
              <p>Prototype Gallery</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            id="nav-overview-btn"
            className={`sidebar-item ${selectedTopicId === null ? 'active' : ''}`}
            onClick={() => {
              setSelectedTopicId(null);
              setSelectedModuleId(null);
            }}
          >
            <div className="sidebar-item-left">
              <LayoutGrid size={17} />
              <span>All Topics Hub</span>
            </div>
            <span className="pill-count">{TOPICS.length}</span>
          </button>

          <div className="nav-section-title">Topics & Modules</div>

          {TOPICS.map((topic) => {
            const isCurrent = selectedTopicId === topic.id;
            return (
              <button
                key={topic.id}
                id={`sidebar-topic-${topic.id}`}
                className={`sidebar-item ${isCurrent ? 'active' : ''}`}
                onClick={() => {
                  setSelectedTopicId(topic.id);
                  setSelectedModuleId(topic.modules[0]?.id || null);
                }}
              >
                <div className="sidebar-item-left">
                  {renderTopicIcon(topic.iconName)}
                  <span>{topic.title}</span>
                </div>
                <span className="pill-count">{topic.modules.length}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button
            id="open-dev-guide-btn"
            className="dev-guide-btn"
            onClick={() => setIsGuideModalOpen(true)}
          >
            <Code2 size={16} /> How to Add a Topic
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="app-main">
        {/* Topbar */}
        <header className="app-topbar">
          <div className="breadcrumbs">
            <button
              id="breadcrumb-home"
              className="crumb-link"
              onClick={() => {
                setSelectedTopicId(null);
                setSelectedModuleId(null);
              }}
            >
              Gallery
            </button>
            {activeTopic && (
              <>
                <ChevronRight size={14} />
                <button
                  id="breadcrumb-topic"
                  className="crumb-link"
                  onClick={() => setSelectedModuleId(activeTopic.modules[0]?.id || null)}
                >
                  {activeTopic.title}
                </button>
              </>
            )}
            {activeModule && (
              <>
                <ChevronRight size={14} />
                <span className="crumb-current">{activeModule.title}</span>
              </>
            )}
          </div>

          <div className="topbar-actions">
            <div className="search-box">
              <Search size={15} />
              <input
                id="search-topics-input"
                type="text"
                placeholder="Search modules or math concepts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="btn-ghost"
                  style={{ padding: 0 }}
                  onClick={() => setSearchQuery('')}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic View: Gallery Overview OR Active Prototype Canvas */}
        {!selectedTopicId || !activeTopic || !activeModule ? (
          /* Overview / Catalog Mode */
          <div className="overview-container" id="overview-gallery">
            <div className="hero-banner">
              <div className="hero-tag">
                <Sparkles size={14} /> Interactive Math Lab
              </div>
              <h2 className="hero-title">
                Visualizing <span>Addition & Subtraction</span> Concepts
              </h2>
              <p className="hero-desc">
                A sandbox and repository of high-fidelity learning module prototypes designed to
                transform finger-counting and rote algorithms into concrete, visual intuition.
              </p>

              <div className="hero-stats-row">
                <div className="stat-item">
                  <span className="stat-value">{TOPICS.length}</span>
                  <span className="stat-label">Core Topics</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{totalPrototypesCount}</span>
                  <span className="stat-label">Active Prototypes</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">Vite + React</span>
                  <span className="stat-label">Fast HMR Engine</span>
                </div>
              </div>
            </div>

            <div className="section-header">
              <h3 className="section-title">Explore Learning Topics</h3>
            </div>

            {TOPICS.length === 0 ? (
              <div className="empty-topics-card" id="empty-topics-state">
                <div className="empty-icon-wrapper">
                  <Atom size={36} />
                </div>
                <h4>No Topics Added Yet</h4>
                <p>
                  The gallery is ready for your prototype topics. Create a folder in <code>src/topics/&lt;topic-slug&gt;/</code> and register it in <code>src/topics/index.ts</code>.
                </p>
                <button
                  id="empty-state-guide-btn"
                  className="btn btn-primary"
                  onClick={() => setIsGuideModalOpen(true)}
                >
                  <Code2 size={16} /> How to Add a Topic
                </button>
              </div>
            ) : filteredTopics.length === 0 ? (
              <div className="empty-topics-card">
                <h4>No matching topics found</h4>
                <p>Try searching for a different keyword.</p>
              </div>
            ) : (
              <div className="topics-grid">
                {filteredTopics.map((topic) => (
                  <div key={topic.id} className="topic-card" id={`topic-card-${topic.id}`}>
                    <div className="topic-card-header">
                      <div className="topic-card-title-group">
                        <div
                          className="topic-avatar"
                          style={{ backgroundColor: `${topic.accentColor}25`, color: topic.accentColor }}
                        >
                          {renderTopicIcon(topic.iconName, 22)}
                        </div>
                        <div>
                          <h4 className="topic-card-title">{topic.title}</h4>
                        </div>
                      </div>
                    </div>

                    <p className="topic-card-desc">{topic.description}</p>

                    <div className="module-mini-list">
                      {topic.modules.map((mod) => (
                        <div key={mod.id} className="module-mini-item">
                          <div className="module-mini-info">
                            <h5>{mod.title}</h5>
                            <p>{mod.description}</p>
                          </div>
                          <button
                            id={`launch-${topic.id}-${mod.id}`}
                            className="btn btn-primary btn-sm"
                            onClick={() => handleOpenModule(topic, mod)}
                          >
                            <Play size={12} /> Launch
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Active Prototype Sandbox Mode */
          <div className="playground-view" id="active-playground">
            {/* Topic Module Switcher Tabs */}
            <div className="module-tabs-nav">
              {activeTopic.modules.map((mod) => (
                <button
                  key={mod.id}
                  id={`tab-module-${mod.id}`}
                  className={`module-tab-btn ${activeModule.id === mod.id ? 'active' : ''}`}
                  onClick={() => setSelectedModuleId(mod.id)}
                >
                  {mod.title}
                </button>
              ))}
            </div>

            {/* Render Selected Prototype Component */}
            <activeModule.component />
          </div>
        )}
      </main>

      {/* Guide Modal: How to add a new topic or module */}
      {isGuideModalOpen && (
        <div className="modal-overlay" onClick={() => setIsGuideModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🛠️ How to Add a Topic or Prototype</h3>
              <button
                id="close-guide-modal-btn"
                className="btn-ghost"
                onClick={() => setIsGuideModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6 }}>
              The gallery architecture is designed so you can create new prototypes in seconds:
            </p>
            <div className="modal-code-block">
              {`// 1. Create your component in src/topics/my-topic/MyModule.tsx
// 2. Export your topic in src/topics/my-topic/index.ts:
export const myTopic: Topic = {
  id: 'my-topic',
  title: 'My Math Concept',
  modules: [{ id: 'm1', title: 'Interactive Viz', component: MyModule, ... }]
};
// 3. Register it in src/topics/index.ts in TOPICS array!`}
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Your new module will instantly show up in the sidebar, search bar, and home gallery.
            </p>
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button
                className="btn btn-primary"
                onClick={() => setIsGuideModalOpen(false)}
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
