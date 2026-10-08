import React, { useState } from 'react';
import { RotateCcw, Shuffle, Sparkles, Trash2 } from 'lucide-react';

export const TakeAwayVisualizerModule: React.FC = () => {
  const [totalCount, setTotalCount] = useState<number>(12);
  const [removedIndices, setRemovedIndices] = useState<Set<number>>(new Set([0, 1, 2, 3]));
  const [itemType, setItemType] = useState<'gems' | 'stars' | 'cookies'>('gems');

  const icons = {
    gems: '💎',
    stars: '⭐',
    cookies: '🍪',
  };

  const currentRemovedCount = removedIndices.size;
  const remainingCount = totalCount - currentRemovedCount;

  const toggleItem = (idx: number) => {
    setRemovedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const handleTakeAwayMore = () => {
    if (currentRemovedCount < totalCount) {
      setRemovedIndices((prev) => {
        const next = new Set(prev);
        for (let i = 0; i < totalCount; i++) {
          if (!next.has(i)) {
            next.add(i);
            break;
          }
        }
        return next;
      });
    }
  };

  const handleReset = () => {
    setRemovedIndices(new Set());
  };

  const handleRandomize = () => {
    const total = Math.floor(Math.random() * 10) + 6; // 6 to 15
    const take = Math.floor(Math.random() * (total - 2)) + 1;
    setTotalCount(total);
    const set = new Set<number>();
    for (let i = 0; i < take; i++) {
      set.add(i);
    }
    setRemovedIndices(set);
  };

  return (
    <div className="module-container" id="take-away-module">
      <div className="module-header-bar">
        <div>
          <h3 className="module-title">Interactive Take-Away Playground</h3>
          <p className="module-subtitle">
            Click any item directly to cross it out or restore it, seeing subtraction as literal physical removal.
          </p>
        </div>
        <div className="module-controls-row">
          <button
            id="randomize-takeaway-btn"
            className="btn btn-secondary"
            onClick={handleRandomize}
          >
            <Shuffle size={16} /> Randomize
          </button>
          <button
            id="reset-takeaway-btn"
            className="btn btn-ghost"
            onClick={handleReset}
          >
            <RotateCcw size={16} /> Reset All
          </button>
        </div>
      </div>

      <div className="controls-card">
        <div className="control-group">
          <label className="control-label">
            Total Starting Items: <span className="highlight-pill color-amber">{totalCount}</span>
          </label>
          <input
            id="total-items-slider"
            type="range"
            min={3}
            max={20}
            value={totalCount}
            onChange={(e) => {
              const val = Number(e.target.value);
              setTotalCount(val);
              setRemovedIndices((prev) => {
                const next = new Set<number>();
                prev.forEach((i) => {
                  if (i < val) next.add(i);
                });
                return next;
              });
            }}
            className="range-slider slider-amber"
          />
        </div>

        <div className="theme-selector-group">
          <span className="mini-label">Item Theme:</span>
          <div className="theme-buttons">
            {(['gems', 'stars', 'cookies'] as const).map((t) => (
              <button
                key={t}
                className={`theme-btn ${itemType === t ? 'active' : ''}`}
                onClick={() => setItemType(t)}
              >
                {icons[t]} {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Equation Banner */}
      <div className="equation-banner">
        <div className="equation-math">
          <span className="eq-num eq-amber">{totalCount}</span>
          <span className="eq-op">−</span>
          <span className="eq-num eq-rose">{currentRemovedCount}</span>
          <span className="eq-eq">=</span>
          <span className="eq-result">{remainingCount}</span>
        </div>
        <div className="regroup-breakdown">
          <span>
            Started with <strong>{totalCount}</strong> items, removed <strong>{currentRemovedCount}</strong>, leaving{' '}
            <strong className="text-emerald">{remainingCount}</strong> active.
          </span>
          <button
            id="take-away-one-btn"
            className="btn btn-primary btn-sm"
            onClick={handleTakeAwayMore}
            disabled={currentRemovedCount >= totalCount}
          >
            <Trash2 size={14} /> Remove Next Item
          </button>
        </div>
      </div>

      {/* Interactive Object Grid */}
      <div className="items-playground-card">
        <div className="items-grid">
          {Array.from({ length: totalCount }).map((_, i) => {
            const isRemoved = removedIndices.has(i);

            return (
              <button
                key={`item-${i}`}
                id={`item-slot-${i}`}
                className={`item-card ${isRemoved ? 'item-removed' : 'item-active'}`}
                onClick={() => toggleItem(i)}
                title={isRemoved ? 'Click to restore' : 'Click to take away'}
              >
                <span className="item-emoji">{icons[itemType]}</span>
                <span className="item-index">{i + 1}</span>
                {isRemoved && <span className="item-cross-overlay">✕</span>}
              </button>
            );
          })}
        </div>
        <div className="playground-hint">
          💡 <em>Click any item directly above to remove it or put it back!</em>
        </div>
      </div>

      <div className="insight-box">
        <Sparkles size={18} className="insight-icon" />
        <p>
          <strong>Concrete Representation:</strong> Grounding subtraction in tangible object removal forms the foundational intuitive anchor before abstract symbolic manipulation is introduced.
        </p>
      </div>
    </div>
  );
};
