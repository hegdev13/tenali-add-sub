---
description: Standards and guidelines for building math prototypes in Tenali Math Lab
trigger: always_on
---

# Prototype Engineering Standards

All interactive learning modules and prototypes created in this repository must follow these core standards:

1. **Gallery Integration**:
   - Every prototype must live in `frontend/src/topics/<topic-slug>/`.
   - Each prototype must be registered as a `LearningModule` within its parent `Topic` in `frontend/src/topics/<topic-slug>/index.ts`.
   - All topics must be registered in the master `TOPICS` array in `frontend/src/topics/index.ts`.

2. **Pedagogical Anchors**:
   - Math prototypes must ground abstract mathematical rules in concrete representations (e.g., ten-frames, number lines, base-10 blocks, bead strings).
   - Provide visual feedback that demystifies procedures (e.g., decomposing a 10-rod into 10 ones units rather than calling it "borrowing").
   - Include a concise "Pedagogical Goal" or "Insight" note within the module UI.

3. **Accessibility and Testing**:
   - Every interactive element (buttons, sliders, inputs, toggles) must have a descriptive, unique `id` attribute.
   - Maintain high contrast (WCAG AA compliant) for text, interactive controls, and visual tokens.

4. **Styling and Tokens**:
   - Use Vanilla CSS and CSS custom properties declared in `frontend/src/index.css`.
   - Do not install Tailwind CSS unless explicitly requested.
   - Use established design tokens: `--bg-deep`, `--bg-surface`, `--bg-card`, `--accent-cyan`, `--accent-amber`, `--accent-rose`, `--accent-emerald`.
