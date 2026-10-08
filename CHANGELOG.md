# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
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
