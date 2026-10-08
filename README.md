# tenali-add-sub

A collection and playground of interactive prototypes for foundational math (addition, subtraction, and place-value visual models).

## Project Structure

```text
tenali-add-sub/
├── frontend/          # React + Vite + TypeScript prototype gallery
│   ├── src/
│   │   ├── topics/    # 📂 All learning module prototypes
│   │   ├── App.tsx    # Gallery shell, switcher & sandbox
│   │   └── index.css  # Dark-mode styling, micro-animations & tokens
├── backend/           # Node.js + Express + TypeScript API server
├── AGENTS.md          # AI agent & contributor guidelines
├── CHANGELOG.md       # Keep a Changelog standard release history
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

## Contributing & Adding New Prototypes

See [AGENTS.md](AGENTS.md) for detailed guidelines on how to structure and register new topics and modules in seconds.
