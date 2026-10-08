import React, { useState } from 'react';
import { RotateCcw, Shuffle, Sparkles, Footprints } from 'lucide-react';

export const NumberLineJumpModule: React.FC = () => {
  const [startNum, setStartNum] = useState<number>(8);
  const [jumpNum, setJumpNum] = useState<number>(6);
  const [jumpMode, setJumpMode] = useState<'direct' | 'bridge-to-10'>('bridge-to-10');

  const maxVal = 20;
  const bridgeDistance = Math.max(0, 10 - startNum);
  const secondaryDistance = jumpNum - bridgeDistance;
  const sum = startNum + jumpNum;

  const handleRandomize = () => {
    const a = Math.floor(Math.random() * 6) + 4; // 4 to 9
    const b = Math.floor(Math.random() * 7) + 2; // 2 to 8
    setStartNum(a);
    setJumpNum(b);
  };

  return (
    <div className="module-container" id="number-line-jump-module">
      <div className="module-header-bar">
        <div>
          <h3 className="module-title">Number Line Hop: Bridge-Through-10</h3>
          <p className="module-subtitle">
            Visualize addition as spatial leaps along a number line, landing on the benchmark milestone 10 first.
          </p>
        </div>
        <div className="module-controls-row">
          <button
            id="randomize-numline-btn"
            className="btn btn-secondary"
            onClick={handleRandomize}
          >
            <Shuffle size={16} /> Randomize
          </button>
          <button
            id="reset-numline-btn"
            className="btn btn-ghost"
            onClick={() => {
              setStartNum(7);
              setJumpNum(5);
            }}
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </div>

      {/* Control panel */}
      <div className="controls-card">
        <div className="control-group">
          <label className="control-label">
            Starting Point (A): <span className="highlight-pill color-amber">{startNum}</span>
          </label>
          <input
            id="start-num-slider"
            type="range"
            min={1}
            max={10}
            value={startNum}
            onChange={(e) => setStartNum(Number(e.target.value))}
            className="range-slider slider-amber"
          />
        </div>

        <div className="control-group">
          <label className="control-label">
            Jump Forward (+B): <span className="highlight-pill color-cyan">{jumpNum}</span>
          </label>
          <input
            id="jump-num-slider"
            type="range"
            min={1}
            max={10}
            value={jumpNum}
            onChange={(e) => setJumpNum(Number(e.target.value))}
            className="range-slider slider-cyan"
          />
        </div>

        <div className="mode-toggle-group">
          <button
            id="mode-direct-btn"
            className={`btn-pill ${jumpMode === 'direct' ? 'active' : ''}`}
            onClick={() => setJumpMode('direct')}
          >
            Single Hop (+{jumpNum})
          </button>
          <button
            id="mode-bridge-btn"
            className={`btn-pill ${jumpMode === 'bridge-to-10' ? 'active' : ''}`}
            onClick={() => setJumpMode('bridge-to-10')}
          >
            <Sparkles size={14} /> Bridge to 10 (+{bridgeDistance} then +{secondaryDistance})
          </button>
        </div>
      </div>

      {/* Equation display */}
      <div className="equation-banner">
        <div className="equation-math">
          <span className="eq-num eq-amber">{startNum}</span>
          <span className="eq-op">+</span>
          <span className="eq-num eq-cyan">{jumpNum}</span>
          <span className="eq-eq">=</span>
          <span className="eq-result">{sum}</span>
        </div>
        {jumpMode === 'bridge-to-10' && bridgeDistance > 0 && secondaryDistance > 0 && (
          <div className="regroup-breakdown">
            <Footprints size={16} className="sparkle-icon" />
            <span>
              Hop 1: {startNum} + <strong className="text-amber">{bridgeDistance}</strong> = <strong>10</strong> ➔
              Hop 2: 10 + <strong className="text-cyan">{secondaryDistance}</strong> = <strong>{sum}</strong>
            </span>
          </div>
        )}
      </div>

      {/* SVG Number Line Visualizer */}
      <div className="number-line-canvas-card">
        <div className="number-line-wrapper">
          <svg
            viewBox="0 0 850 180"
            className="number-line-svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Base line */}
            <line x1="40" y1="130" x2="810" y2="130" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            <polygon points="815,130 805,124 805,136" fill="#475569" />

            {/* Ticks and Numbers */}
            {Array.from({ length: maxVal + 1 }).map((_, i) => {
              const x = 50 + i * 36;
              const isTen = i === 10;
              const isStart = i === startNum;
              const isEnd = i === sum;

              return (
                <g key={`tick-${i}`}>
                  <line
                    x1={x}
                    y1={isTen ? 110 : 120}
                    x2={x}
                    y2={130}
                    stroke={isTen ? '#38bdf8' : isStart ? '#f59e0b' : isEnd ? '#10b981' : '#64748b'}
                    strokeWidth={isTen || isStart || isEnd ? '3' : '1.5'}
                  />
                  <text
                    x={x}
                    y="155"
                    textAnchor="middle"
                    className={`svg-tick-label ${isTen ? 'label-ten' : isStart ? 'label-start' : isEnd ? 'label-end' : ''}`}
                  >
                    {i}
                  </text>
                  {isTen && (
                    <text x={x} y="172" textAnchor="middle" className="benchmark-milestone">
                      ★ benchmark
                    </text>
                  )}
                </g>
              );
            })}

            {/* Hop Arcs */}
            {jumpMode === 'direct' ? (
              // Single hop arc
              (() => {
                const startX = 50 + startNum * 36;
                const endX = 50 + sum * 36;
                const midX = (startX + endX) / 2;
                const arcHeight = Math.min(100, Math.abs(endX - startX) * 0.35);

                return (
                  <g className="hop-group animate-dash">
                    <path
                      d={`M ${startX} 125 Q ${midX} ${125 - arcHeight} ${endX} 125`}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3.5"
                      strokeDasharray="6,4"
                    />
                    <circle cx={startX} cy="125" r="5" fill="#f59e0b" />
                    <circle cx={endX} cy="125" r="7" fill="#10b981" />
                    <text x={midX} y={115 - arcHeight} textAnchor="middle" className="hop-label">
                      +{jumpNum}
                    </text>
                  </g>
                );
              })()
            ) : (
              // Bridge to 10 double hops
              (() => {
                const startX = 50 + startNum * 36;
                const tenX = 50 + 10 * 36;
                const endX = 50 + sum * 36;

                if (startNum >= 10 || sum <= 10) {
                  const midX = (startX + endX) / 2;
                  return (
                    <g>
                      <path
                        d={`M ${startX} 125 Q ${midX} 60 ${endX} 125`}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="3.5"
                      />
                      <circle cx={startX} cy="125" r="5" fill="#f59e0b" />
                      <circle cx={endX} cy="125" r="7" fill="#10b981" />
                      <text x={midX} y="50" textAnchor="middle" className="hop-label">
                        +{jumpNum}
                      </text>
                    </g>
                  );
                }

                const mid1 = (startX + tenX) / 2;
                const mid2 = (tenX + endX) / 2;

                return (
                  <g className="hop-bridge-group">
                    {/* Hop 1 to 10 */}
                    <path
                      d={`M ${startX} 125 Q ${mid1} 55 ${tenX} 125`}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3.5"
                    />
                    <text x={mid1} y="45" textAnchor="middle" className="hop-label text-amber">
                      +{bridgeDistance} (to 10)
                    </text>

                    {/* Hop 2 from 10 to end */}
                    <path
                      d={`M ${tenX} 125 Q ${mid2} 55 ${endX} 125`}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3.5"
                    />
                    <text x={mid2} y="45" textAnchor="middle" className="hop-label text-cyan">
                      +{secondaryDistance} (from 10)
                    </text>

                    <circle cx={startX} cy="125" r="5" fill="#f59e0b" />
                    <circle cx={tenX} cy="125" r="5" fill="#e2e8f0" />
                    <circle cx={endX} cy="125" r="7" fill="#10b981" />
                  </g>
                );
              })()
            )}
          </svg>
        </div>
      </div>

      <div className="insight-box">
        <Sparkles size={18} className="insight-icon" />
        <p>
          <strong>Number Line Strategy:</strong> Jumping across the 10-milestone gives learners mental agility. Instead of counting individual steps one by one, they leap directly to 10, then add what remains.
        </p>
      </div>
    </div>
  );
};
