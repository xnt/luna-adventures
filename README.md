# Luna Adventures

A cozy, pixel-art platformer starring Luna the pug puppy as she dashes toward her nerdy human. This Phaser + TypeScript project runs on Vite and generates a slightly faster, procedurally generated level inspired by Super Mario Bros 3.

## Features

- Procedural terrain with pits and stair-step platforms
- ~1 minute level with progress bar showing distance to your human
- Random world themes each playthrough (Canadian neighbourhood, Mexican pueblo mágico, Matrix, Soda Pop World)
- Cuddly foes (cats and roombas), puppy snacks, and power-up drumsticks
- Touch-friendly and keyboard controls
- Health, immunity, and game-over logic with tests

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

3. Build for production:

   ```bash
   npm run build
   ```

## Controls

- **Move:** Arrow keys or A/D
- **Jump:** Up arrow, W, or Space
- **Dash:** Shift, Down arrow, or on-screen dash button
- **Mobile:** Tap the on-screen buttons

## Testing

Run the unit tests with:

```bash
npm run test
```

For a single run in CI-style mode:

```bash
npm run test:run
```

## Project layout

- `src/main.ts` sets up the UI overlays and boots the game.
- `src/game/` holds the Phaser scenes and gameplay logic.
- `src/game/themes/` contains world theme definitions (extensible).
- `src/game/logic/__tests__/` contains Vitest coverage.

Enjoy snuggling with Luna Adventures! 💖