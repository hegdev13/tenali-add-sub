const fs = require('fs');
let css = fs.readFileSync('frontend/src/index.css', 'utf8');

// Replace the root variables completely to add --social-bg and other fixes
css = css.replace(/:root \{[\s\S]*?color-scheme: light dark;\n\}/m, `:root {
  --font-display: system-ui, 'Segoe UI', Roboto, sans-serif;
  --font-body: system-ui, 'Segoe UI', Roboto, sans-serif;
  --font-mono: ui-monospace, Consolas, monospace;

  --bg-deep: #fff;
  --bg-surface: #f4f3ec;
  --bg-card: #fff;
  --bg-card-hover: rgba(244, 243, 236, 0.5);
  --border-subtle: #e5e4e7;
  --border-highlight: rgba(170, 59, 255, 0.5);
  --social-bg: rgba(244, 243, 236, 0.5);

  --text-main: #08060d;
  --text-muted: #6b6375;
  --text-dim: rgba(107, 99, 117, 0.7);

  --accent-cyan: #aa3bff;
  --accent-amber: #f59e0b;
  --accent-emerald: #10b981;
  --accent-rose: #f43f5e;
  --accent-violet: #aa3bff;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  --shadow-glow-cyan: 0 0 24px -4px rgba(170, 59, 255, 0.25);
  --shadow-card: rgba(0, 0, 0, 0.1) 0 10px 15px -3px, rgba(0, 0, 0, 0.05) 0 4px 6px -2px;

  color-scheme: light dark;
}`);

css = css.replace(/@media \(prefers-color-scheme: dark\) \{[\s\S]*?  \}\n\}/m, `@media (prefers-color-scheme: dark) {
  :root {
    --bg-deep: #16171d;
    --bg-surface: #1f2028;
    --bg-card: #16171d;
    --bg-card-hover: rgba(47, 48, 58, 0.5);
    --border-subtle: #2e303a;
    --border-highlight: rgba(192, 132, 252, 0.5);
    --social-bg: rgba(47, 48, 58, 0.5);

    --text-main: #f3f4f6;
    --text-muted: #9ca3af;
    --text-dim: rgba(156, 163, 175, 0.7);

    --accent-cyan: #c084fc;
    --accent-violet: #c084fc;
    
    --shadow-glow-cyan: 0 0 24px -4px rgba(192, 132, 252, 0.25);
    --shadow-card: rgba(0, 0, 0, 0.4) 0 10px 15px -3px, rgba(0, 0, 0, 0.25) 0 4px 6px -2px;
  }
}`);


// Fix dark app-shell gradient
css = css.replace(/background: radial-gradient\([\s\S]*?var\(--bg-deep\);/g, 'background: var(--bg-deep);');

// Replace hardcoded dark theme hexes with CSS variables
css = css.replace(/#1e293b/g, 'var(--bg-card-hover)');
css = css.replace(/rgba\(15, 23, 42, 0\.75\)/g, 'var(--bg-surface)');
css = css.replace(/rgba\(15, 23, 42, 0\.6\)/g, 'var(--bg-surface)');
css = css.replace(/rgba\(30, 41, 59, 0\.9\)/g, 'var(--bg-card-hover)');
css = css.replace(/rgba\(30, 41, 59, 0\.8\)/g, 'var(--bg-card-hover)');
css = css.replace(/rgba\(255, 255, 255, 0\.08\)/g, 'var(--social-bg)');
css = css.replace(/rgba\(255, 255, 255, 0\.04\)/g, 'var(--social-bg)');
css = css.replace(/#090d16/g, 'var(--bg-deep)');
css = css.replace(/#0f172a/g, 'var(--bg-surface)');
css = css.replace(/#182234/g, 'var(--bg-card)');
css = css.replace(/#243047/g, 'var(--border-subtle)');

// Replace gradients that shouldn't be there
css = css.replace(/background: linear-gradient\(135deg, #38bdf8 0%, #6366f1 100%\);/g, 'background: var(--accent-cyan);');
css = css.replace(/background: linear-gradient\(135deg, rgba\(30, 41, 59, 0\.8\) 0%, rgba\(15, 23, 42, 0\.9\) 100%\);/g, 'background: var(--bg-card);');
css = css.replace(/background: linear-gradient\(135deg, #1e293b 0%, #0f172a 100%\);/g, 'background: var(--bg-surface);');
css = css.replace(/background: linear-gradient\(90deg, #38bdf8 0%, #818cf8 100%\);/g, 'background: var(--text-main);');

// More hardcoded cleanups
css = css.replace(/#334155/g, 'var(--border-subtle)');
css = css.replace(/#475569/g, 'var(--text-dim)');
css = css.replace(/#0b1120/g, 'var(--bg-deep)');
css = css.replace(/#111c30/g, 'var(--bg-surface)');
css = css.replace(/#38bdf8/g, 'var(--accent-cyan)');
css = css.replace(/#818cf8/g, 'var(--accent-violet)');
css = css.replace(/#fff/g, 'var(--bg-deep)');

fs.writeFileSync('frontend/src/index.css', css);
console.log("CSS updated!");
