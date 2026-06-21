# AGENTS.md — Luna Adventures

Guidance for humans and coding agents working in this repository.

## What this is

A single-scene Phaser 3 + TypeScript platformer. Luna runs a seeded procedural level to reach her human. Runtime graphics are generated procedurally per theme; there is no image/audio asset folder.

Player-facing overview: [README.md](README.md). Live site deploys from `main` to GitHub Pages (`base`: `/luna-adventures/`).

## Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Vite dev server on port 5173 |
| `npm run build` | `tsc` (no emit, typecheck) + Vite build → `dist/` |
| `npm run preview` | Serve production build locally |
| `npm test` | Vitest watch mode |
| `npm run test:run` | Single Vitest run |
| `npm run test:coverage` | Vitest + Istanbul (`./coverage`) |

CI (`.github/workflows/deploy.yml`): Node 20, `npm ci`, `npm run build`, upload `dist` to GitHub Pages.

## Architecture (respect these boundaries)

1. **Pure game logic** (`src/game/logic/`) — no Phaser imports except unavoidable types. Health, level plan *data*, and run outcomes live here and are unit-tested.
2. **Scene** (`src/game/scenes/LunaScene.ts`) — Phaser only: sprites, physics, input, camera, progress bar, star-power VFX. Delegates win/lose/HP/items/foes to `RunController`.
3. **RunController** (`src/game/logic/runController.ts`) — owns run state plus DOM HUD/end-screen updates. Scene passes UI refs created in `main.ts`.
4. **Themes** (`src/game/themes/`) — each `Theme` supplies colors and `generateBackground` / `generateGround` / `generateCat` / `generateRoomba` / `generateFood` / `generateDrumstick`. Register in `ThemeRegistry.registerAll` (`themeService.ts`). Optional `ui` palette; otherwise `themeUi.ts` derives CSS variables for the end screen.
5. **DOM shell** (`src/main.ts`, `src/styles.css`) — not Phaser. End-screen “Play again” is `window.location.reload()`.

Do **not** move business rules (damage amounts, star power vs i-frames, stomp rules, win distance) into the scene if they belong in `health.ts` or `runController.ts`.

### Data flow (one run)

1. `main.ts` builds HUD/end screen/controls and calls `createGame(container, uiRefs)`.
2. `LunaScene` constructs `RunController`, then in `create()` resolves a theme (`resolveTheme`), applies textures (`applyTheme`), builds a `LevelPlan` (`generateLevelPlan`), then `buildLevelGeometry` / `spawnLevelEntities`.
3. Each frame: scene handles movement/collisions; `RunController` handles outcomes, HUD text, and showing the end screen.
4. Restart reloads the page (new seed/theme).

## Key gameplay contracts

Change these only with matching tests under `src/game/logic/__tests__/` (and theme tests if the theme API changes).

- **HP:** max 3; food heals +1; drumstick applies star power and sets HP to max.
- **Star power** (`starPowerUntil`): while active, any foe contact defeats the foe (Mario star style). Distinct from brief post-hit i-frames (`immuneUntil` only — i-frames alone do *not* defeat foes).
- **Drumstick duration:** `GAME_CONFIG.buffDurationMs` (5000). Scene blinks/warns in the last ~1500 ms of star power.
- **Stomp:** cats defeated when stomped; roombas are not (unless star power).
- **End conditions:** pit fall or HP ≤ 0 → lose end screen; distance to owner &lt; 50 → win end screen.
- **Level size:** 40 chunks, tile 32, chunk width 12 (`logic/constants/level.ts`); owner near `levelLength - 80`.
- **Display:** 960×540 (`display` constants / `createGame`).

## Where to change what

| Goal | Primary files |
|------|----------------|
| Movement speeds, gravity, HP, spawn rates | `logic/constants/*`, gravity in `createGame.ts` |
| Level shape / pits / stairs / spawns | `levelPlan.ts` (primary path used by scene) |
| Health / star power / i-frames | `health.ts` + `health.test.ts` |
| Status copy, foe/item/pit/win outcomes, end screen | `runController.ts` + `runController.test.ts` |
| Input, physics bodies, VFX, progress bar | `LunaScene.ts` |
| New world look | New `*Theme.ts` + register in `themeService.ts`; optional `ui` on `Theme` |
| HUD / end-screen markup | `main.ts`; styles in `styles.css` |
| Deploy path / Pages | `vite.config.ts` (`base`), `.github/workflows/deploy.yml` |

## Conventions

- TypeScript **strict**; ESM; target ES2022 (`tsconfig.json`).
- Prefer pure functions and small controllers over growing `LunaScene` with business logic.
- Constants: use `GAME_CONFIG` or `Constants.*` / namespaced exports from `logic/constants`; avoid scattering magic numbers.
- Tests: Vitest + jsdom; only paths listed in `vite.config.ts` `test.include` (logic + themes tests). No scene integration tests — keep testable rules out of Phaser code.
- No ESLint/Prettier config in-repo; match existing style (2-space indent, semicolons, double quotes in TS).
- Do not commit `node_modules`, `coverage`, or rely on committed `dist` for correctness — CI builds `dist` from source. `dist/` may appear in the tree from local builds; prefer not expanding it in normal PRs.
- License is MIT; keep changes compatible with that unless the owner decides otherwise.

## Adding a theme (checklist)

1. Copy an existing theme (e.g. `canadianNeighbourhood.ts`) to `src/game/themes/myTheme.ts`.
2. Implement the `Theme` interface (`types.ts`): `id`, `name`, `colors`, `backgroundElements`, `groundStyle`, and all `generate*` methods (textures must register the same keys other themes use: e.g. `theme-background`, ground/entity keys expected by the scene).
3. Optionally set `ui: ThemeUiPalette` for a hand-tuned end screen; otherwise `deriveThemeUiPalette` in `themeUi.ts` is fine.
4. Register the theme in `themeService.ts` `registerAll`.
5. Re-export from `themes/index.ts` if you maintain the barrel’s backward-compat exports.
6. Extend `themeService` / `themeUi` tests if registry or UI variable behavior changes.
7. Themes are selected per run via `resolveTheme(themeRegistry, seed)` — no in-game theme picker unless you add one deliberately.

## Pitfalls / out of scope

- **No** multiplayer, save games, level select, or external art/audio pipeline.
- Restart is a **full page reload** from the end-screen button; `RunController.start()` resets state but the UI does not currently wire in-scene restart.
- **`levelPlan.ts` vs `levelGenerator.ts`:** both describe chunk-style generation. The scene uses **`levelPlan`** (`generateLevelPlan` + builders). `levelGenerator` remains for tests/legacy class API. Prefer enhancing `levelPlan` for gameplay changes; if you change generation rules, consider whether tests on `levelGenerator` should move or stay in sync to avoid two divergent “sources of truth.”
- Production **`base`** is `/luna-adventures/`; local `npm run dev` serves from `/`. Don’t hardcode absolute asset paths outside Vite.
- Star power vs i-frames is easy to regress — see `health.ts` and `runController.onFoeHit`; tests cover the distinction.

## Suggested PR hygiene

- Keep PRs focused (gameplay rule vs theme vs deploy/docs).
- For logic changes: add/adjust Vitest coverage in the matching `__tests__` file.
- Run `npm run test:run` and `npm run build` before opening a PR.
- Update README only for player-visible behavior; update this file for agent/contributor contracts and boundaries.