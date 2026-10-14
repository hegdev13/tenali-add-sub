# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Level 16.0 Task 3 (`/level-16-0/task-3`): counting is adding one. A ten-frame reference grows one block at a time with "+1" animations; the child matches it block by block. Shared `HintHand` component.
- URL routes via a small History API router: `/<module-id>` and `/<module-id>/task-<n>` (e.g. `/level-16-0/task-2`), with working back/forward.
- Level 16.0 page: Task 1 (paper bits into a basket with +1 counting, spread slider, win celebration) and Task 2 (arrange blocks 1-10 in order, with an idle hand hint).
- Shared `WinOverlay` (confetti + message) and `src/components/` split of the former monolithic `App.tsx`.
- Level 16 (Addition 1-30) and Level 17 (Subtraction 1-30) topics, each with placeholder modules for the main level (x.0) and sub-levels (x.1, x.2), plus an info icon on every module that opens its level specification.
- Workspace agent customizations folder (`agents/` / `.agents/`) with:
  - `taste` skill: Anti-slop frontend design framework from [tasteskill.dev](https://www.tasteskill.dev/).
  - `graphify` skill: Codebase architecture knowledge graph extractor and query tool from [Graphify](https://github.com/Graphify-Labs/graphify).
  - Agent rules: `prototype-standards.md` and `frontend-architecture.md`.
- Additional math topic prototypes (e.g., number bonds, 100-chart patterns, multi-digit carryover).

## [0.1.0] - 2026-10-08

### Added
- **Gallery Hub Architecture**: Multi-topic dashboard with dynamic sidebar, concept search, grade-level filters, and module switcher.
- **Topic 1: Single-Digit Addition & Making 10**:
  - `TenFrameModule`: Double ten-frame visualizer demonstrating the "make a ten" decomposition mental math strategy.
  - `NumberLineJumpModule`: Interactive number line hopping with landmark-10 milestone arcs.
- **Topic 2: Place Value & Subtraction Regrouping**:
  - `BaseTenBorrowingModule`: Base-10 blocks with visual unbundling of 10-rods into unit cubes.
  - `TakeAwayVisualizerModule`: Concrete item strike-through playground with real-time subtraction sentences.
- **TypeScript Registry**: Strongly typed `Topic` and `LearningModule` interfaces with auto-discovery exports in `frontend/src/topics/index.ts`.
- **Backend Prototype Scaffolding**: Express + TypeScript API boilerplate in `backend/` with calculation endpoints and health check.
- **Repository Setup**: Root `.gitignore`, environment variable templates (`.env.example`), and workspace scripts in `package.json`.

[Unreleased]: https://github.com/hegdev13/tenali-add-sub/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/hegdev13/tenali-add-sub/releases/tag/v0.1.0
