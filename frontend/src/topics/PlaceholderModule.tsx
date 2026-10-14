import type { ComponentType } from 'react';
import { Construction } from 'lucide-react';
import './PlaceholderModule.css';

/**
 * Builds a placeholder component for a level that has been specified
 * but not yet prototyped. Swap `component` in the topic config once built.
 */
export const makePlaceholder = (levelCode: string, title: string): ComponentType => {
  const Placeholder = () => (
    <div className="placeholder-module" id={`placeholder-${levelCode.replace('.', '-')}`}>
      <div className="placeholder-icon">
        <Construction size={32} />
      </div>
      <h3>
        Level {levelCode} — {title}
      </h3>
      <p>Placeholder</p>
    </div>
  );
  return Placeholder;
};
