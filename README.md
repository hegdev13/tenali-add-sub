# tenali-add-sub

A collection and playground of prototypes for math addition and subtraction interactions.

## Project Structure

```
tenali-add-sub/
├── frontend/          # React + Vite + TypeScript prototype client
│   ├── src/           # UI components and prototype views
│   └── .env.example   # Frontend environment variables template
├── backend/           # Node.js + Express + TypeScript API prototype server
│   ├── src/           # Express server & prototype calculation endpoints
│   └── .env.example   # Backend environment variables template
├── .gitignore         # Ignores node_modules, build outputs, and .env files
├── .env.example       # Root environment variable template
└── package.json       # Root scripts to orchestrate frontend and backend
```

## Getting Started

### 1. Install Dependencies

```bash
# Install both frontend and backend dependencies
npm run install:all
```

Or individually:

```bash
cd frontend && npm install
cd backend && npm install
```

### 2. Run Prototypes

- **Frontend**:
  ```bash
  npm run dev:frontend
  # or from frontend/: npm run dev
  ```

- **Backend**:
  ```bash
  npm run dev:backend
  # or from backend/: npm run dev
  ```
