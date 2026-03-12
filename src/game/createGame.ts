import Phaser from "phaser";
import { LunaScene } from "./scenes/LunaScene";

interface GameUiRefs {
  hpElement: HTMLDivElement;
  statusElement: HTMLDivElement;
  controlButtons: HTMLDivElement[];
}

export const createGame = (container: HTMLElement, ui: GameUiRefs) => {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: container,
    width: 960,
    height: 540,
    pixelArt: true,
    backgroundColor: "#ffeef9",
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 1200 },
        debug: false,
      },
    },
    scene: [new LunaScene(ui)],
  });
};
