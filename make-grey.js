const fs = require('fs');
let css = fs.readFileSync('frontend/src/index.css', 'utf8');

// Replace the root variables completely to add --social-bg and other fixes
css = css.replace(/:root \{[\s\S]*?color-scheme: light dark;\n\}/m, `:root {
  --font-display: system-ui, 'Segoe UI', Roboto, sans-serif;
  --font-body: system-ui, 'Segoe UI', Roboto, sans-serif;
  --font-mono: ui-monospace, Consolas, monospace;

  --bg-deep: #ffffff;
  --bg-surface: #f5f5f5;
  --bg-card: #ffffff;
  --bg-card-hover: #eeeeee;
  --border-subtle: #e0e0e0;
  --border-highlight: #cccccc;
  --social-bg: #f5f5f5;

  --text-main: #111111;
  --text-muted: #666666;
  --text-dim: #888888;

  --accent-cyan: #333333;
  --accent-amber: #555555;
  --accent-emerald: #444444;
  --accent-rose: #666666;
  --accent-violet: #333333;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  --shadow-glow-cyan: none;
  --shadow-card: rgba(0, 0, 0, 0.1) 0 10px 15px -3px, rgba(0, 0, 0, 0.05) 0 4px 6px -2px;

  color-scheme: light dark;
}`);

css = css.replace(/@media \(prefers-color-scheme: dark\) \{[\s\S]*?  \}\n\}/m, `@media (prefers-color-scheme: dark) {
  :root {
    --bg-deep: #121212;
    --bg-surface: #1e1e1e;
    --bg-card: #121212;
    --bg-card-hover: #2a2a2a;
    --border-subtle: #333333;
    --border-highlight: #555555;
    --social-bg: #1e1e1e;

    --text-main: #eeeeee;
    --text-muted: #aaaaaa;
    --text-dim: #777777;

    --accent-cyan: #dddddd;
    --accent-amber: #bbbbbb;
    --accent-emerald: #cccccc;
    --accent-rose: #aaaaaa;
    --accent-violet: #dddddd;
    
    --shadow-glow-cyan: none;
    --shadow-card: rgba(0, 0, 0, 0.4) 0 10px 15px -3px, rgba(0, 0, 0, 0.25) 0 4px 6px -2px;
  }
}`);

// Strip all remaining gradients
css = css.replace(/background:\s*(radial|linear)-gradient\([^;]+;/g, 'background: var(--bg-surface);');
css = css.replace(/background-image:\s*(radial|linear)-gradient\([^;]+;/g, 'background-image: none;');

// Any lingering colors that might not be variables
css = css.replace(/color:\s*#[a-zA-Z0-9]{3,6};/g, (match) => {
    if (match.includes('#fff') || match.includes('#000')) return match;
    return 'color: var(--text-main);';
});
css = css.replace(/background-color:\s*#[a-zA-Z0-9]{3,6};/g, (match) => {
    if (match.includes('#fff') || match.includes('#000')) return match;
    return 'background-color: var(--bg-surface);';
});

// Any specific colored backgrounds in tokens
css = css.replace(/background:\s*rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\);/g, 'background: var(--bg-surface);');

fs.writeFileSync('frontend/src/index.css', css);
console.log("Made greyscale!");
