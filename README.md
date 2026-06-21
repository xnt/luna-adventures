# Luna Adventures

A cozy, pixel-art platformer starring Luna the pug puppy as she dashes toward her nerdy human. Phaser 3 + TypeScript on Vite; each run builds a seeded, procedural level (SMB3-adjacent speed, cozy vibes) and draws its world entirely at runtime — no image/audio asset pipeline.

**Play:** [GitHub Pages](https://xnt.github.io/luna-adventures/) (deploys from `main`)

**Stack:** Phaser 3 · TypeScript (strict) · Vite 8 · Vitest 4 · Node 20 (CI)

**License:** [MIT](LICENSE) · [Source](https://github.com/xnt/luna-adventures/)

## Features

- Seeded procedural terrain: platforms, pits, and stair-steps (40 chunks × 12 tiles × 32px)
- Progress bar toward your human at the end of the run
- Random world theme each playthrough (Canadian neighbourhood, Mexican pueblo mágico, Matrix, Soda Pop World) with procedurally generated sprites and backgrounds
- Themed win/lose end screen (DOM modal; colors follow the run’s theme)
- Foes: cats (stompable) and roombas (sturdy unless powered up)
- Items: puppy food (+1 HP, max 3) and drumsticks (Mario-style star power: full heal, ~5s immunity, rainbow glow, contact defeats foes, blink warning near expiry)
- Keyboard + on-screen mobile controls
- Pure game logic unit-tested separately from the Phaser scene

## Getting started

Requires Node 20+ recommended (matches CI).

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the dev server (http://localhost:5173 — base path applies to production builds only):

   ```bash
   npm run dev
   ```

3. Build for production (`tsc` typecheck + Vite → `dist/`):

   ```bash
   npm run build
   ```

4. Preview the production build locally:

   ```bash
   npm run preview
   ```

Pushing to `main` runs `.github/workflows/deploy.yml` (build + GitHub Pages from `dist`, site base `/luna-adventures/`).

## Controls

- **Move:** Arrow keys or A/D
- **Jump:** Up arrow, W, or Space
- **Dash:** Shift, Down arrow, or on-screen dash button
- **Mobile:** On-screen buttons — left, jump, right, dash

## Gameplay (short)

- Start with 3 hearts. Touching a foe without star power costs 1 HP (brief i-frames after a hit). HP at 0 or falling in a pit ends the run.
- Stomp cats from above to clear them; roombas shrug off stomps unless you have drumstick star power.
- Food restores 1 HP. Drumsticks grant star power (full HP, ~5 seconds, defeats foes on contact).
- Reach your human at the end of the level to win. Play again reloads the page for a new theme/level seed.

## Testing

Watch mode:

```bash
npm run test
```

Single CI-style run:

```bash
npm run test:run
```

Coverage (Istanbul HTML in `./coverage`):

```bash
npm run test:coverage
```

Tests live under `src/game/logic/__tests__/` and `src/game/themes/__tests__/` (jsdom; configured in `vite.config.ts`). The Phaser scene is not unit-tested — keep rules in pure logic where possible.

## Project layout

```
src/
  main.ts                 # DOM shell: HUD, end screen, mobile controls; boots Phaser
  styles.css              # Game frame, HUD, end-screen CSS variables
  game/
    createGame.ts         # Phaser.Game config (960×540, arcade physics, LunaScene)
    scenes/LunaScene.ts   # Input, physics, rendering, star-power VFX, progress bar
    logic/
      constants/          # display, level, player, enemies, items (+ GAME_CONFIG)
      health.ts           # HP, i-frames, star power (pure)
      levelPlan.ts        # Seeded level plan + Phaser geometry/entity builders
      levelGenerator.ts   # Chunk-class generator (tested; scene primarily uses levelPlan)
      runController.ts    # Run/HUD/end-screen outcomes (no Phaser)
      random.ts, types.ts
      __tests__/
    themes/
      *Theme.ts           # Per-world colors + generate* texture helpers
      themeService.ts     # Registry, resolveTheme, applyTheme
      themeUi.ts          # DOM/end-screen palette from theme
      types.ts, index.ts
      __tests__/
.github/workflows/deploy.yml
```

For contributor/agent conventions (boundaries, contracts, how to add a theme), see [AGENTS.md](AGENTS.md).

Enjoy snuggling with Luna Adventures! 💖
