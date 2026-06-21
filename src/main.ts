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

const endScreen = document.createElement("div");
endScreen.id = "end-screen";
endScreen.hidden = true;
endScreen.setAttribute("aria-hidden", "true");
endScreen.innerHTML = `
  <div class="end-screen-card" role="dialog" aria-modal="true" aria-labelledby="end-screen-title">
    <p id="end-screen-kicker" class="end-screen-kicker"></p>
    <h2 id="end-screen-title" class="end-screen-title"></h2>
    <p id="end-screen-message" class="end-screen-message"></p>
    <button type="button" id="end-screen-restart" class="end-screen-button">Play again</button>
  </div>
`;

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

container.append(overlay, endScreen, instructions, controls);
app.appendChild(container);

const restartButton = endScreen.querySelector("#end-screen-restart") as HTMLButtonElement;
restartButton.addEventListener("click", () => {
  window.location.reload();
});

createGame(container, {
  hpElement: overlay.querySelector("#hp") as HTMLDivElement,
  statusElement: overlay.querySelector("#status") as HTMLDivElement,
  endScreen,
  endScreenKicker: endScreen.querySelector("#end-screen-kicker") as HTMLParagraphElement,
  endScreenTitle: endScreen.querySelector("#end-screen-title") as HTMLHeadingElement,
  endScreenMessage: endScreen.querySelector("#end-screen-message") as HTMLParagraphElement,
  controlButtons: Array.from(controls.querySelectorAll<HTMLDivElement>(".control-button")),
});
