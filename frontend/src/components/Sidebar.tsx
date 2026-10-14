import { LayoutGrid, Code2, Atom } from 'lucide-react';
import { TOPICS } from '../topics';
import { TopicIcon } from './TopicIcon';

interface SidebarProps {
  selectedTopicId: string | null;
  onHome: () => void;
  onSelectTopic: (topicId: string) => void;
  onOpenGuide: () => void;
}

export const Sidebar = ({ selectedTopicId, onHome, onSelectTopic, onOpenGuide }: SidebarProps) => (
  <aside className="app-sidebar">
    <div className="sidebar-header">
      <div className="brand-badge" id="brand-home-btn" onClick={onHome}>
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
        onClick={onHome}
      >
        <div className="sidebar-item-left">
          <LayoutGrid size={17} />
          <span>All Topics Hub</span>
        </div>
        <span className="pill-count">{TOPICS.length}</span>
      </button>

      <div className="nav-section-title">Topics & Modules</div>

      {TOPICS.map((topic) => (
        <button
          key={topic.id}
          id={`sidebar-topic-${topic.id}`}
          className={`sidebar-item ${selectedTopicId === topic.id ? 'active' : ''}`}
          onClick={() => onSelectTopic(topic.id)}
        >
          <div className="sidebar-item-left">
            <TopicIcon name={topic.iconName} />
            <span>{topic.title}</span>
          </div>
          <span className="pill-count">{topic.modules.length}</span>
        </button>
      ))}
    </nav>

    <div className="sidebar-footer">
      <button id="open-dev-guide-btn" className="dev-guide-btn" onClick={onOpenGuide}>
        <Code2 size={16} /> How to Add a Topic
      </button>
    </div>
  </aside>
);
