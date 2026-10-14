import { X } from 'lucide-react';

interface GuideModalProps {
  onClose: () => void;
}

export const GuideModal = ({ onClose }: GuideModalProps) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h3>🛠️ How to Add a Topic or Prototype</h3>
        <button id="close-guide-modal-btn" className="btn-ghost" onClick={onClose}>
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
        <button id="guide-got-it-btn" className="btn btn-primary" onClick={onClose}>
          Got It
        </button>
      </div>
    </div>
  </div>
);
