# Notes & To-Dos

A scratchpad for ideas, notes and to-dos. Add freely; tidy up whenever.

## To-Do

- [ ] Implement the game of chopsticks (best played after the end of module 17)
- [ ] Clean up codebase (see "Codebase review" below for what is done and what is waiting on you)

## Needs your input

Things from the codebase review that I could not decide for you. Reply with a choice and I'll do the work.

- [ ] **Backend: keep or remove?** `backend/` (Express: `/api/health`, `/api/calculate`) is not used by the frontend at all. Options: (a) delete it, (b) keep it for later (e.g. saving progress, a real "Next task" endpoint) and wire up one real call.
- [ ] **Vocabulary: Topic vs Level.** The code calls it a `Topic` (`Topic`, `topics/`, `TOPICS`), you call it a Level / main level, and the UI says "task". Rename `Topic` -> `Level` in types, folders and docs? (It is a wide rename, so I did not do it unasked.) Also decide what to call a module like `16.0` vs `16.1` in the UI.
- [ ] **Keyboard / tap-to-place alternative.** Every task is drag-only, so keyboard users cannot play. Do you want tap-to-select-then-tap-a-slot as a second way (also easier for small children and touchscreens)? Needs a decision on target devices.
- [ ] **Phones / small screens.** Task canvases need about 800px of width. What devices should the prototypes support (desktop only for the demo, or tablets and phones)? If small screens matter, I would make the canvases scale down.
- [ ] **Shared theme for the child-friendly look.** Floor, basket and block colours are hardcoded hex values in `level16.css`. With 30+ levels they should become design tokens (e.g. `--floor-light`, `--block-blue`). Pick the palette or confirm the current one and I will extract it.
- [ ] **Browser smoke test (Playwright).** Unit tests cover the game rules, but nothing clicks through the real pages. Adding Playwright means a new dev dependency and a browser download in CI. Go or no-go?
- [ ] **Real "Next task" / what follows Level 16.0.** The last task's "Next task" button is still a dummy (see `TaskRunner.tsx`). Where should it lead: the next level, back to the gallery, an HTTP endpoint?
- [ ] **Placeholder levels.** 16.1, 16.2, 17.0, 17.1, 17.2 are still placeholders. Send the tasks for each when ready.
- [ ] **`agents/` vs `.agents`.** `.agents` is a symlink to `agents/` (not a duplicate). Keep both names (some tools look in `.agents/`)?

## Codebase review (done)

- [x] Delete dead weight: unused `App.css`, Vite assets and README, `fix-css.js`, `make-grey.js`, ~650 lines of unreferenced CSS (also removed a stale `.frame-cell` rule that leaked into Task 3)
- [x] Extract shared hooks and helpers: `useIdleHint`, `useFloats`, `useDelayedFlag`, `PlusOne`, `lib/canvas.ts`
- [x] Task registry: modules declare `tasks`; `TaskRunner` generates tabs, routes and "Next task"
- [x] Fix all lint warnings; `npm run check:frontend` = lint + tests + build (added to `AGENTS.md`)
- [x] Move game rules into pure functions (`topics/<topic>/logic/`) and add Vitest tests (22 tests)
- [x] GitHub Actions CI running lint, tests and build (written but not yet run on GitHub)
- [x] Commit `backend/package-lock.json` so both lockfiles are tracked

## Ideas

<!-- Half-formed thoughts, things to try, module concepts. -->

## Notes

<!-- Decisions, observations, feedback from the team, links. -->
