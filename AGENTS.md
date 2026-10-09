# AGENTS.md — Contributor & AI Agent Guidelines

Welcome to **Tenali Math Lab** (`tenali-add-sub`). This repository is a playground and structured repository of high-fidelity prototypes for foundational math learning modules (addition, subtraction, place value, and mental math strategies).

This document outlines the architecture, design rules, and protocols that all AI coding agents and human contributors must follow.

---

## 1. Project Architecture

The repository utilizes a **Gallery / Hub Architecture** inside `frontend/` so that dozens of distinct math prototypes can live side-by-side without needing separate dev servers or disconnected setups.

```text
tenali-add-sub/
├── frontend/
│   ├── src/
│   │   ├── topics/                           # 📂 All learning prototype topics live here
│   │   │   ├── types.ts                      # Contracts: Topic & LearningModule
│   │   │   ├── index.ts                      # Master Topic Registry (TOPICS array)
│   │   │   ├── <topic-slug>/                 # Individual topic folder
│   │   │   │   ├── <ModuleName>Module.tsx    # Interactive prototype component
│   │   │   │   └── index.ts                  # Topic metadata & export
│   │   ├── App.tsx                           # Master Gallery, Navigation & Sandbox shell
│   │   └── index.css                         # Global tokens, theme styles, animations
│   ├── package.json
│   └── vite.config.ts
├── backend/                                  # Node.js + Express + TypeScript API server
│   ├── src/index.ts
│   └── package.json
├── AGENTS.md                                 # Agent operational instructions (this file)
├── CHANGELOG.md                              # Keep a Changelog standard changelog
├── package.json                              # Root workspace runner scripts
└── README.md                                 # General project overview
```

---

## 2. Protocol: How to Add a New Topic & Prototype Module

Whenever instructed to build a new prototype, follow this exact 4-step workflow:

### Step 1: Create the Topic Directory
Inside `frontend/src/topics/`, create a folder named after the concept (e.g., `frontend/src/topics/number-bonds/`).

### Step 2: Implement the Module Component
Create `<ModuleName>Module.tsx` inside that folder.
- Ensure all interactive buttons, inputs, and sliders have descriptive, unique `id` attributes.
- Include pedagogical insight notes or visual cues (e.g., explain why a strategy like "make a 10" or "benchmark hopping" is being used).
- Use local React state for interactive parameters (numbers, reset states, step animations).

### Step 3: Define the Topic Configuration
In `frontend/src/topics/<topic-slug>/index.ts`:

```typescript
import type { Topic } from '../types';
import { MyNewModule } from './MyNewModule';

export const myNewTopic: Topic = {
  id: 'my-topic-id',
  title: 'Topic Display Title',
  slug: 'my-topic-slug',
  description: 'Clear pedagogical summary of this topic.',
  badge: 'Foundation K-2',
  iconName: 'PlusCircle', // or 'MinusCircle', 'Layers', 'Sparkles'
  accentColor: '#38bdf8', // Hex accent color
  modules: [
    {
      id: 'module-id',
      title: 'Prototype Name',
      description: 'What this specific interactive model demonstrates.',
      category: 'visualizer', // 'visualizer' | 'interactive-game' | 'step-by-step' | 'sandbox'
      difficulty: 'Foundational', // 'Foundational' | 'Intermediate' | 'Advanced'
      pedagogicalGoal: 'Why this helps the student.',
      component: MyNewModule,
      tags: ['KeyConcept', 'VisualModel'],
    },
  ],
};
```

### Step 4: Register in Master Registry
Import and append your topic to the `TOPICS` array in `frontend/src/topics/index.ts`.
The module will immediately appear in the Gallery sidebar, search engine, and grade filter!

---

## 3. Technology Stack & Design System

1. **Framework**: React 19 + TypeScript + Vite.
2. **Styling**: **Vanilla CSS** using the CSS variables declared in `frontend/src/index.css`.
   - **Do NOT install or use Tailwind CSS** unless the user explicitly requests it.
   - Use design tokens (`--bg-deep`, `--bg-surface`, `--bg-card`, `--accent-cyan`, `--accent-amber`, etc.).
   - Modern aesthetics: dark mode slate theme, glassmorphism headers, subtle glows, and micro-animations for token interactions.
3. **Icons**: Use `lucide-react`.
4. **TypeScript Rules**:
   - `verbatimModuleSyntax` is enabled in `tsconfig.json`. You **must** use `import type { ... }` for pure types/interfaces.
   - Unused variables and imports are flagged as errors (`noUnusedLocals`). Always clean up imports.

---

## 4. Verification and Build Discipline

Before finishing any task, agents **must** verify that the build is completely green:

```bash
# Test frontend compilation and bundle
npm --prefix frontend run build
```

Do not consider a task complete if `tsc` or `vite build` throws compilation errors.

---

## 5. Git & Changelog Maintenance

1. **Git Commit Messages**: Use Conventional Commits format:
   - `feat: add 100-chart subtraction prototype`
   - `fix: resolve slider boundary in number line jump`
   - `docs: update AGENTS.md with new conventions`
2. **Changelog Updates**: When releasing new topics or major capabilities, add entries to `CHANGELOG.md` under `[Unreleased]` following the [Keep a Changelog](https://keepachangelog.com/) standard.
