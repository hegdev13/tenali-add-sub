import { Search, X, ChevronRight } from 'lucide-react';
import type { Topic, LearningModule } from '../topics';

interface TopBarProps {
  activeTopic?: Topic;
  activeModule: LearningModule | null;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onHome: () => void;
  onTopic: () => void;
}

export const TopBar = ({
  activeTopic,
  activeModule,
  searchQuery,
  onSearchChange,
  onHome,
  onTopic,
}: TopBarProps) => (
  <header className="app-topbar">
    <div className="breadcrumbs">
      <button id="breadcrumb-home" className="crumb-link" onClick={onHome}>
        Gallery
      </button>
      {activeTopic && (
        <>
          <ChevronRight size={14} />
          <button id="breadcrumb-topic" className="crumb-link" onClick={onTopic}>
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
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            id="clear-search-btn"
            className="btn-ghost"
            style={{ padding: 0 }}
            onClick={() => onSearchChange('')}
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  </header>
);
