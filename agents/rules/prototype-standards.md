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

2. **Example → Question → Answer → Verification**:
   - Every prototype shows a worked example, asks a question, takes the student's answer, and verifies it with clear (preferably visual) feedback.
   - No explanatory paragraphs. Communicate through visuals, animation and short captions that name what is happening.
   - Ground abstract rules in concrete representations (e.g., ten-frames, number lines, objects, base-10 blocks).
   - Source worksheets are inspiration only; build a better interactive experience, not a copy.
   - Keep structure and look close to the live Tenali site (https://tenali.fun/summership/) so prototypes port easily.

3. **Accessibility and Testing**:
   - Every interactive element (buttons, sliders, inputs, toggles) must have a descriptive, unique `id` attribute.
   - Maintain high contrast (WCAG AA compliant) for text, interactive controls, and visual tokens.

4. **Styling and Tokens**:
   - Use Vanilla CSS and CSS custom properties declared in `frontend/src/index.css`.
   - Do not install Tailwind CSS unless explicitly requested.
   - Use established design tokens: `--bg-deep`, `--bg-surface`, `--bg-card`, `--accent-cyan`, `--accent-amber`, `--accent-rose`, `--accent-emerald`.
