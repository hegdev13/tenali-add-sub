# tenali-add-sub

A fast prototyping environment to make and test out modules for [vicharanashala/tenali](https://github.com/vicharanashala/tenali): interactive prototypes for foundational math (addition, subtraction, and place-value visual models) that can later be contributed to Tenali.

## How this maps to Tenali and FLN

- **Prototyping first.** Modules here are quick, showcase-ready prototypes. They follow Tenali's core idea of teaching through *example → question → answer → verification*, and are kept close to Tenali's structure and look so they port easily.
- **Tasks map to Levels.** Each task is mapped to a Level described in [vicharanashala/fln](https://github.com/vicharanashala/fln/tree/main/FLN%20Levels%20Structure) (FLN Levels Structure). For example, Level 16 (addition 1-30) and Level 17 (subtraction 1-30) each have a main level (`16.0`, `17.0`) and remediation sub-levels (`16.1`, `16.2`, ...).
- **Refresher / bridge course.** At a main level (e.g. `16.0`), the prerequisites are revised first, so the module can be used as a refresher or bridge-course activity. For `16.0` that is Task 1 (counting as putting things away one by one), Task 2 (ordering 1-10) and Task 3 (counting is adding one).

## Project Structure

```text
tenali-add-sub/
├── frontend/          # React + Vite + TypeScript prototype gallery
│   ├── src/
│   │   ├── topics/    # 📂 All learning module prototypes (one folder per Level)
│   │   ├── components/# Shared UI (sidebar, gallery, modals, win overlay, hint hand)
│   │   ├── router.ts  # Tiny URL router: /<module-id>/task-<n>
│   │   ├── App.tsx    # Thin shell composing the components
│   │   └── index.css  # Dark-mode styling, micro-animations & tokens
├── backend/           # Node.js + Express + TypeScript API server
├── AGENTS.md          # AI agent & contributor guidelines
├── CHANGELOG.md       # Keep a Changelog standard release history
├── NOTES.md           # Ideas, notes and to-dos
├── .gitignore         # Ignores node_modules, build outputs, and .env files
├── .env.example       # Root environment variable template
└── package.json       # Root scripts to orchestrate frontend and backend
```

## Getting Started

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Run Prototypes

- **Frontend Gallery**:
  ```bash
  npm run dev:frontend
  ```
  Open [http://localhost:5173](http://localhost:5173) to view the interactive gallery and prototypes.

- **Build Check**:
  ```bash
  npm run build:frontend
  ```

- **Backend**:
  ```bash
  npm run dev:backend
  ```

## Notes & To-Dos

Ideas, notes and the running to-do list live in [NOTES.md](NOTES.md).

## Contributing & Adding New Prototypes

See [AGENTS.md](AGENTS.md) for detailed guidelines on how to structure and register new topics and modules in seconds.
