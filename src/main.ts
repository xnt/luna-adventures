import "./styles.css";
import { createGame } from "./game/createGame";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing app container");
}

const container = document.createElement("div");
container.id = "game-container";

const overlay = document.createElement("div");
overlay.id = "game-overlay";
overlay.innerHTML = "<div id=\"hp\">HP: ❤❤❤</div><div id=\"status\">Run to your human!</div>";

const instructions = document.createElement("div");
instructions.id = "instructions";
instructions.textContent =
  "Controls: ← → / A D to move, ↑ / W / Space to jump. Tap buttons for mobile.";

const controls = document.createElement("div");
controls.id = "mobile-controls";
controls.innerHTML = `
  <div class="control-button" data-action="left">◀</div>
  <div class="control-button" data-action="jump">⤒</div>
  <div class="control-button" data-action="right">▶</div>
  <div class="control-button" data-action="" aria-hidden="true"></div>
  <div class="control-button" data-action="dash">⤳</div>
  <div class="control-button" data-action="" aria-hidden="true"></div>
`;

container.append(overlay, instructions, controls);
app.appendChild(container);

createGame(container, {
  hpElement: overlay.querySelector("#hp") as HTMLDivElement,
  statusElement: overlay.querySelector("#status") as HTMLDivElement,
  controlButtons: Array.from(controls.querySelectorAll<HTMLDivElement>(".control-button")),
});
