import { X } from 'lucide-react';
import type { Topic, LearningModule } from '../topics';
import './ModuleInfoModal.css';

interface ModuleInfoModalProps {
  topic: Topic;
  module: LearningModule;
  onClose: () => void;
}

export const ModuleInfoModal = ({ topic, module, onClose }: ModuleInfoModalProps) => {
  const info = module.info;
  if (!info) return null;
  const overview = topic.overview;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" id="level-info-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Level {info.levelCode}</h3>
          <button id="close-info-modal-btn" className="btn-ghost" aria-label="Close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {info.description && <p className="info-section-text">{info.description}</p>}

        {info.notes.length > 0 && (
          <>
            <h4 className="info-section-title">Details</h4>
            <ul className="info-list">
              {info.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </>
        )}

        {overview && (
          <div className="info-overview">
            <h4 className="info-section-title">{topic.title}</h4>
            <p className="info-meta">
              <strong>Class:</strong> {overview.classLabel} | <strong>Age Group:</strong>{' '}
              {overview.ageGroup}
            </p>
            <h4 className="info-section-title">Objective</h4>
            <p className="info-section-text">{overview.objective}</p>
            <h4 className="info-section-title">Description</h4>
            <p className="info-section-text">{overview.description}</p>
            <h4 className="info-section-title">Learning Outcome</h4>
            <p className="info-section-text">{overview.learningOutcome}</p>
            <h4 className="info-section-title">Topics Covered</h4>
            <ul className="info-list">
              {overview.topicsCovered.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button id="close-info-modal-footer-btn" className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
