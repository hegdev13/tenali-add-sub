---
description: Frontend architectural discipline, React 19 and TypeScript conventions
trigger: always_on
---

# Frontend Architectural Discipline

1. **Strict TypeScript Compliance**:
   - `verbatimModuleSyntax` is enabled in `tsconfig.app.json`. You must use `import type { ... }` for pure types and interfaces.
   - Clean up unused variables and imports (`noUnusedLocals`).
   - Run `npm --prefix frontend run build` to verify every change before finishing.

2. **State Management**:
   - Keep interactive prototype state localized in the module component using React `useState` or `useReducer`.
   - Continuous inputs (sliders, counters) should update smoothly without lag.

3. **Icons & Assets**:
   - Use `lucide-react` for standard interface glyphs.
   - Keep stroke width uniform.
