import { Sparkles, Play, Code2, Atom, Info } from 'lucide-react';
import { TOPICS } from '../topics';
import type { Topic, LearningModule } from '../topics';
import { TopicIcon } from './TopicIcon';

interface GalleryOverviewProps {
  topics: Topic[];
  onLaunch: (topic: Topic, module: LearningModule) => void;
  onInfo: (topic: Topic, module: LearningModule) => void;
  onOpenGuide: () => void;
}

const totalPrototypesCount = TOPICS.reduce((acc, t) => acc + t.modules.length, 0);

export const GalleryOverview = ({ topics, onLaunch, onInfo, onOpenGuide }: GalleryOverviewProps) => (
  <div className="overview-container" id="overview-gallery">
    <div className="hero-banner">
      <div className="hero-tag">
        <Sparkles size={14} /> Interactive Math Lab
      </div>
      <h2 className="hero-title">
        Visualizing <span>Addition & Subtraction</span> Concepts
      </h2>
      <p className="hero-desc">
        A sandbox and repository of high-fidelity learning module prototypes designed to transform
        finger-counting and rote algorithms into concrete, visual intuition.
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
          The gallery is ready for your prototype topics. Create a folder in{' '}
          <code>src/topics/&lt;topic-slug&gt;/</code> and register it in{' '}
          <code>src/topics/index.ts</code>.
        </p>
        <button id="empty-state-guide-btn" className="btn btn-primary" onClick={onOpenGuide}>
          <Code2 size={16} /> How to Add a Topic
        </button>
      </div>
    ) : topics.length === 0 ? (
      <div className="empty-topics-card">
        <h4>No matching topics found</h4>
        <p>Try searching for a different keyword.</p>
      </div>
    ) : (
      <div className="topics-grid">
        {topics.map((topic) => (
          <div key={topic.id} className="topic-card" id={`topic-card-${topic.id}`}>
            <div className="topic-card-header">
              <div className="topic-card-title-group">
                <div
                  className="topic-avatar"
                  style={{ backgroundColor: `${topic.accentColor}25`, color: topic.accentColor }}
                >
                  <TopicIcon name={topic.iconName} size={22} />
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
                  {mod.info && (
                    <button
                      id={`info-${topic.id}-${mod.id}`}
                      className="btn-ghost info-icon-btn"
                      aria-label={`Show details for ${mod.title}`}
                      title="Level details"
                      onClick={() => onInfo(topic, mod)}
                    >
                      <Info size={16} />
                    </button>
                  )}
                  <button
                    id={`launch-${topic.id}-${mod.id}`}
                    className="btn btn-primary btn-sm"
                    onClick={() => onLaunch(topic, mod)}
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
);
