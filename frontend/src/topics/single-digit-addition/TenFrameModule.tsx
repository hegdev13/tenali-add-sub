import React, { useState } from 'react';
import { RotateCcw, Shuffle, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const TenFrameModule: React.FC = () => {
  const [num1, setNum1] = useState<number>(7);
  const [num2, setNum2] = useState<number>(5);
  const [showRegroup, setShowRegroup] = useState<boolean>(true);

  // Compute make-a-ten breakdown
  const neededForTen = Math.max(0, 10 - num1);
  const transferred = Math.min(neededForTen, num2);
  const remainderFromNum2 = num2 - transferred;
  const sum = num1 + num2;

  const handleRandomize = () => {
    const a = Math.floor(Math.random() * 6) + 4; // 4 to 9
    const b = Math.floor(Math.random() * 6) + 2; // 2 to 7
    setNum1(a);
    setNum2(b);
  };

  const handleReset = () => {
    setNum1(6);
    setNum2(4);
  };

  return (
    <div className="module-container" id="ten-frame-module">
      <div className="module-header-bar">
        <div>
          <h3 className="module-title">Ten-Frame "Make a Ten" Visualizer</h3>
          <p className="module-subtitle">
            Visualizing the mental math anchor: decompose the second addend to complete the first ten-frame.
          </p>
        </div>
        <div className="module-controls-row">
          <button
            id="randomize-tenframe-btn"
            className="btn btn-secondary"
            onClick={handleRandomize}
            title="Randomize problem"
          >
            <Shuffle size={16} /> Randomize
          </button>
          <button
            id="reset-tenframe-btn"
            className="btn btn-ghost"
            onClick={handleReset}
            title="Reset"
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </div>

      {/* Interactive Slider / Input Controls */}
      <div className="controls-card">
        <div className="control-group">
          <label className="control-label">
            First Number (Addend 1): <span className="highlight-pill color-amber">{num1}</span>
          </label>
          <input
            id="input-num1-slider"
            type="range"
            min={1}
            max={9}
            value={num1}
            onChange={(e) => setNum1(Number(e.target.value))}
            className="range-slider slider-amber"
          />
        </div>

        <div className="control-group">
          <label className="control-label">
            Second Number (Addend 2): <span className="highlight-pill color-cyan">{num2}</span>
          </label>
          <input
            id="input-num2-slider"
            type="range"
            min={1}
            max={9}
            value={num2}
            onChange={(e) => setNum2(Number(e.target.value))}
            className="range-slider slider-cyan"
          />
        </div>

        <div className="control-toggle">
          <label className="toggle-label" htmlFor="regroup-toggle">
            <input
              id="regroup-toggle"
              type="checkbox"
              checked={showRegroup}
              onChange={(e) => setShowRegroup(e.target.checked)}
            />
            <span className="toggle-custom"></span>
            Show "Make a Ten" Regrouping
          </label>
        </div>
      </div>

      {/* Math Equation Live Banner */}
      <div className="equation-banner">
        <div className="equation-math">
          <span className="eq-num eq-amber">{num1}</span>
          <span className="eq-op">+</span>
          <span className="eq-num eq-cyan">{num2}</span>
          <span className="eq-eq">=</span>
          <span className="eq-result">{sum}</span>
        </div>

        {showRegroup && neededForTen > 0 && num2 >= neededForTen && (
          <div className="regroup-breakdown">
            <Sparkles size={16} className="sparkle-icon" />
            <span>
              Thinking Strategy: <strong>{num1}</strong> + (
              <strong className="text-cyan">{transferred}</strong> +{' '}
              <strong className="text-cyan">{remainderFromNum2}</strong>) ➔ (
              <strong>{num1 + transferred}</strong>) + {remainderFromNum2} ={' '}
              <strong>{sum}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Visual Ten Frames */}
      <div className="frames-grid">
        {/* Frame 1 */}
        <div className="frame-card">
          <div className="frame-card-header">
            <h4>Frame 1 (Base Anchor)</h4>
            <span className="frame-count-badge">
              {showRegroup ? Math.min(10, num1 + transferred) : num1} / 10
            </span>
          </div>
          <div className="ten-frame-grid">
            {Array.from({ length: 10 }).map((_, index) => {
              const isBaseToken = index < num1;
              const isTransferredToken = showRegroup && index >= num1 && index < num1 + transferred;
              const isFilled = isBaseToken || isTransferredToken;

              return (
                <div
                  key={`frame1-${index}`}
                  className={`frame-cell ${isFilled ? 'filled' : 'empty'}`}
                >
                  {isBaseToken && <div className="token token-amber animate-pop"></div>}
                  {isTransferredToken && (
                    <div className="token token-cyan token-bridge animate-slide">
                      <span className="bridge-tag">+{transferred}</span>
                    </div>
                  )}
                  {!isFilled && <span className="cell-number">{index + 1}</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Frame 2 */}
        <div className="frame-card">
          <div className="frame-card-header">
            <h4>Frame 2 (Remaining)</h4>
            <span className="frame-count-badge">
              {showRegroup ? remainderFromNum2 : num2} / 10
            </span>
          </div>
          <div className="ten-frame-grid">
            {Array.from({ length: 10 }).map((_, index) => {
              const activeCount = showRegroup ? remainderFromNum2 : num2;
              const isFilled = index < activeCount;
              const isGhost = showRegroup && index >= remainderFromNum2 && index < num2;

              return (
                <div
                  key={`frame2-${index}`}
                  className={`frame-cell ${isFilled ? 'filled' : isGhost ? 'ghost-cell' : 'empty'}`}
                >
                  {isFilled && <div className="token token-cyan animate-pop"></div>}
                  {isGhost && (
                    <div className="token token-ghost" title="Moved to Frame 1 to make 10">
                      <ArrowRight size={14} />
                    </div>
                  )}
                  {!isFilled && !isGhost && <span className="cell-number">{index + 1}</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pedagogical insight footer */}
      <div className="insight-box">
        <CheckCircle2 size={18} className="insight-icon" />
        <p>
          <strong>Pedagogical Goal:</strong> Moving away from finger-counting to grouping by 10
          anchors. Learners visualize 10 as a "full box", then add the remaining ones effortlessly.
        </p>
      </div>
    </div>
  );
};
