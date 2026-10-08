import React, { useState } from 'react';
import { RotateCcw, Shuffle, Sparkles, Layers, ArrowDownRight } from 'lucide-react';

export const BaseTenBorrowingModule: React.FC = () => {
  // Total Minuend: e.g. 34 (3 tens, 4 ones)
  // Subtrahend: e.g. 18 (1 ten, 8 ones)
  const [totalTens, setTotalTens] = useState<number>(3);
  const [totalOnes, setTotalOnes] = useState<number>(3);
  const [subTens, setSubTens] = useState<number>(1);
  const [subOnes, setSubOnes] = useState<number>(7);
  const [unpackedTens, setUnpackedTens] = useState<number>(0); // 0 or 1 rod unpacked into 10 ones

  const totalMinuend = totalTens * 10 + totalOnes;
  const subtrahend = subTens * 10 + subOnes;

  // Active representation after unpacking:
  const activeTens = totalTens - unpackedTens;
  const activeOnes = totalOnes + unpackedTens * 10;

  const canSubtractOnes = activeOnes >= subOnes;
  const finalDifference = totalMinuend - subtrahend;

  const handleUnpackRod = () => {
    if (activeTens > 0 && unpackedTens === 0) {
      setUnpackedTens(1);
    }
  };

  const handlePackRod = () => {
    if (unpackedTens > 0) {
      setUnpackedTens(0);
    }
  };

  const handleRandomize = () => {
    const t = Math.floor(Math.random() * 3) + 2; // 2 to 4
    const o = Math.floor(Math.random() * 5) + 1; // 1 to 5
    const st = Math.floor(Math.random() * (t - 1)) + 1; // 1 to t-1
    const so = Math.floor(Math.random() * 4) + 6; // 6 to 9 (guarantees borrowing needed!)
    setTotalTens(t);
    setTotalOnes(o);
    setSubTens(st);
    setSubOnes(so);
    setUnpackedTens(0);
  };

  return (
    <div className="module-container" id="base-ten-borrowing-module">
      <div className="module-header-bar">
        <div>
          <h3 className="module-title">Base-10 Regrouping & "Borrowing" Decomposer</h3>
          <p className="module-subtitle">
            Demystifying "borrowing" by physically ungrouping a 10-rod into 10 unit cubes.
          </p>
        </div>
        <div className="module-controls-row">
          <button
            id="randomize-baseten-btn"
            className="btn btn-secondary"
            onClick={handleRandomize}
          >
            <Shuffle size={16} /> Randomize (Need Borrowing)
          </button>
          <button
            id="reset-baseten-btn"
            className="btn btn-ghost"
            onClick={() => {
              setTotalTens(3);
              setTotalOnes(2);
              setSubTens(1);
              setSubOnes(7);
              setUnpackedTens(0);
            }}
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </div>

      {/* Inputs */}
      <div className="controls-card">
        <div className="control-group">
          <label className="control-label">
            Minuend (Total Start): <span className="highlight-pill color-amber">{totalMinuend}</span> ({totalTens} Tens, {totalOnes} Ones)
          </label>
          <div className="mini-sliders-row">
            <div>
              <span className="mini-label">Tens: {totalTens}</span>
              <input
                type="range"
                min={2}
                max={5}
                value={totalTens}
                onChange={(e) => {
                  setTotalTens(Number(e.target.value));
                  setUnpackedTens(0);
                }}
                className="range-slider slider-amber"
              />
            </div>
            <div>
              <span className="mini-label">Ones: {totalOnes}</span>
              <input
                type="range"
                min={0}
                max={9}
                value={totalOnes}
                onChange={(e) => {
                  setTotalOnes(Number(e.target.value));
                  setUnpackedTens(0);
                }}
                className="range-slider slider-amber"
              />
            </div>
          </div>
        </div>

        <div className="control-group">
          <label className="control-label">
            Subtract (Take Away): <span className="highlight-pill color-rose">{subtrahend}</span> ({subTens} Tens, {subOnes} Ones)
          </label>
          <div className="mini-sliders-row">
            <div>
              <span className="mini-label">Tens: {subTens}</span>
              <input
                type="range"
                min={0}
                max={Math.max(0, totalTens - 1)}
                value={subTens}
                onChange={(e) => setSubTens(Number(e.target.value))}
                className="range-slider slider-rose"
              />
            </div>
            <div>
              <span className="mini-label">Ones: {subOnes}</span>
              <input
                type="range"
                min={1}
                max={9}
                value={subOnes}
                onChange={(e) => setSubOnes(Number(e.target.value))}
                className="range-slider slider-rose"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Calculation and Borrowing Alert */}
      <div className="equation-banner">
        <div className="equation-math">
          <span className="eq-num eq-amber">{totalMinuend}</span>
          <span className="eq-op">−</span>
          <span className="eq-num eq-rose">{subtrahend}</span>
          <span className="eq-eq">=</span>
          <span className="eq-result">{finalDifference >= 0 ? finalDifference : 'Invalid'}</span>
        </div>

        {!canSubtractOnes && unpackedTens === 0 && (
          <div className="warning-banner">
            <span>
              ⚠️ We have <strong>{totalOnes}</strong> ones, but need to subtract <strong>{subOnes}</strong> ones!
              We don't have enough ones.
            </span>
            <button
              id="unpack-rod-btn"
              className="btn btn-primary btn-sm"
              onClick={handleUnpackRod}
            >
              <ArrowDownRight size={14} /> Decompose 1 Ten Rod into 10 Ones
            </button>
          </div>
        )}

        {unpackedTens > 0 && (
          <div className="regroup-breakdown">
            <Sparkles size={16} className="sparkle-icon" />
            <span>
              Regrouped! <strong>{totalTens}</strong> Tens & <strong>{totalOnes}</strong> Ones became{' '}
              <strong className="text-amber">{activeTens} Tens</strong> and{' '}
              <strong className="text-cyan">{activeOnes} Ones</strong>! Now {activeOnes} − {subOnes} is easy!
            </span>
            <button
              id="pack-rod-btn"
              className="btn btn-ghost btn-sm"
              onClick={handlePackRod}
            >
              Undo Unpack
            </button>
          </div>
        )}
      </div>

      {/* Base-10 Visual Block Board */}
      <div className="base-ten-board">
        {/* Tens Column */}
        <div className="place-value-column">
          <div className="column-header">
            <h4>Tens Column (Value: {activeTens * 10})</h4>
            <span className="col-badge badge-amber">{activeTens} Rods</span>
          </div>

          <div className="rods-container">
            {Array.from({ length: activeTens }).map((_, i) => {
              const isCrossed = i < subTens;
              return (
                <div
                  key={`rod-${i}`}
                  className={`ten-rod ${isCrossed ? 'crossed-out' : ''}`}
                  title={isCrossed ? 'Subtracted 10' : 'Value 10'}
                >
                  {Array.from({ length: 10 }).map((_, seg) => (
                    <div key={`seg-${seg}`} className="rod-segment"></div>
                  ))}
                  {isCrossed && <div className="cross-badge">−10</div>}
                </div>
              );
            })}

            {unpackedTens > 0 && (
              <div className="decomposed-ghost-rod" title="This rod was unpacked into 10 unit cubes">
                <span>Unpacked (10 ones ➔)</span>
              </div>
            )}
          </div>
        </div>

        {/* Ones Column */}
        <div className="place-value-column">
          <div className="column-header">
            <h4>Ones Column (Value: {activeOnes})</h4>
            <span className="col-badge badge-cyan">{activeOnes} Cubes</span>
          </div>

          <div className="cubes-grid">
            {Array.from({ length: activeOnes }).map((_, i) => {
              const isUnpacked = i >= totalOnes;
              const isSubtracted = i < subOnes;

              return (
                <div
                  key={`cube-${i}`}
                  className={`unit-cube ${isUnpacked ? 'cube-unpacked' : ''} ${
                    isSubtracted ? 'cube-subtracted' : ''
                  }`}
                  title={isSubtracted ? 'Taken away' : isUnpacked ? 'From unpacked 10' : 'Original unit'}
                >
                  {isSubtracted && <span className="cube-strike">✕</span>}
                </div>
              );
            })}
          </div>

          <div className="column-summary">
            Remaining ones: <strong>{activeOnes - subOnes >= 0 ? activeOnes - subOnes : 'Need more'}</strong>
          </div>
        </div>
      </div>

      <div className="insight-box">
        <Layers size={18} className="insight-icon" />
        <p>
          <strong>Conceptual Insight:</strong> "Borrowing" isn't a mysterious procedure—it is simply renaming place values. 32 is identically equal to 2 Tens + 12 Ones.
        </p>
      </div>
    </div>
  );
};
