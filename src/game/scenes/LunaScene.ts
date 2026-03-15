import Phaser from "phaser";
import { GAME_CONFIG } from "../logic/constants";
import {
  buildLevelGeometry,
  generateLevelPlan,
  spawnLevelEntities,
  type LevelPlan,
} from "../logic/levelPlan";
import type { FoeSpawn, ItemSpawn } from "../logic/types";
import {
  RunController,
  type SceneUiRefs as RunSceneUiRefs,
} from "../logic/runController";
import {
  applyTheme,
  resolveTheme,
  themeRegistry,
  type Theme,
} from "../themes/themeService";

interface SceneUiRefs extends RunSceneUiRefs {
  controlButtons: HTMLDivElement[];
}

export class LunaScene extends Phaser.Scene {
  private luna!: Phaser.Physics.Arcade.Sprite;
  private groundGroup!: Phaser.Physics.Arcade.StaticGroup;
  private foeGroup!: Phaser.Physics.Arcade.Group;
  private itemGroup!: Phaser.Physics.Arcade.Group;
  private plan!: LevelPlan;
  private runController!: RunController;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    jump: Phaser.Input.Keyboard.Key;
    dash: Phaser.Input.Keyboard.Key;
  };
  private wasJumpPressed = false;
  private statusTimer?: Phaser.Time.TimerEvent;
  private controlsState = { left: false, right: false, jump: false, dash: false };
  private progressBar!: Phaser.GameObjects.Graphics;
  private currentTheme!: Theme;

  constructor(private ui: SceneUiRefs) {
    super("luna");
    // Controller owns run-state; scene passes UI refs it needs
    this.runController = new RunController({ ui: this.ui });
  }

  preload() {
    // Theme will be selected in create()
  }

  create() {
    // Resolve and apply theme using the theme service
    this.currentTheme = resolveTheme(themeRegistry, Date.now() % 10000);

    this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, GAME_CONFIG.height + 200);
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, GAME_CONFIG.height);

    // Apply theme (generates all textures: background, ground, entities)
    applyTheme(this, this.currentTheme);

    // Use tileSprite for repeating background throughout the level
    const bg = this.add.tileSprite(0, 0, GAME_CONFIG.levelLength + GAME_CONFIG.width, GAME_CONFIG.height, "theme-background").setOrigin(0);
    bg.setScrollFactor(0.3, 0.3);
    bg.setDepth(-1);

    this.groundGroup = this.physics.add.staticGroup();
    this.foeGroup = this.physics.add.group();
    this.itemGroup = this.physics.add.group();

    // Generate Luna (always the same cute pug)
    this.createLunaSprite();

    // Generate owner and heart textures (sprites created from plan below)
    this.createOwnerSprite();
    this.createHeartSprite();

    this.progressBar = this.add.graphics();
    this.progressBar.setScrollFactor(0);
    this.progressBar.setDepth(10);

    // Generate level plan (pure data) then build Phaser geometry/entities
    this.plan = generateLevelPlan({ seed: Date.now() % 10000 });
    buildLevelGeometry(this, this.plan, this.groundGroup);
    spawnLevelEntities(this, this.plan, this.foeGroup, this.itemGroup);

    // Owner and heart sprites from plan positions
    this.add.sprite(this.plan.ownerX, this.plan.ownerY, "owner").setDepth(3);
    const heartSprite = this.add.sprite(this.plan.ownerX + 50, this.plan.ownerY - 12, "heart").setDepth(3);
    heartSprite.setAlpha(0.9);

    this.luna = this.physics.add.sprite(120, GAME_CONFIG.groundY - 80, "luna");
    this.luna.setCollideWorldBounds(false);
    this.luna.setBounce(0.1);
    this.luna.setSize(26, 30);
    this.luna.setOffset(3, 2);
    this.luna.setDepth(2);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.registerKeyboard();
    this.registerMobileControls();

    this.physics.add.collider(this.luna, this.groundGroup);
    this.physics.add.collider(this.foeGroup, this.groundGroup);
    this.physics.add.collider(this.itemGroup, this.groundGroup);

    this.physics.add.overlap(this.luna, this.foeGroup, (_, foe) => {
      this.handleFoeHit(foe as Phaser.Physics.Arcade.Sprite);
    });

    this.physics.add.overlap(this.luna, this.itemGroup, (_, item) => {
      this.handleItemPickup(item as Phaser.Physics.Arcade.Sprite);
    });

    // Show theme name
    this.runController.setStatus(`Theme: ${this.currentTheme.name}`);
    this.statusTimer = this.time.delayedCall(2000, () => {
      this.runController.clearStatus();
    });
  }

  private createLunaSprite() {
    const luna = this.add.graphics();
    luna.fillStyle(0xf2c7a1);
    luna.fillRect(8, 16, 16, 10);
    luna.fillRect(10, 14, 12, 4);
    luna.fillRect(8, 8, 16, 8);
    luna.fillStyle(0x5b3b2f);
    luna.fillRect(6, 4, 4, 6);
    luna.fillRect(22, 4, 4, 6);
    luna.fillStyle(0x3b2a25);
    luna.fillRect(11, 11, 10, 5);
    luna.fillStyle(0x8a5a47);
    luna.fillRect(12, 12, 8, 4);
    luna.fillStyle(0x1b1412);
    luna.fillRect(12, 10, 2, 2);
    luna.fillRect(18, 10, 2, 2);
    luna.fillRect(15, 13, 2, 2);
    luna.fillStyle(0xffffff);
    luna.fillRect(13, 10, 1, 1);
    luna.fillRect(19, 10, 1, 1);
    luna.fillStyle(0xa36b58);
    luna.fillRect(10, 24, 4, 4);
    luna.fillRect(18, 24, 4, 4);
    luna.fillStyle(0x5b3b2f);
    luna.fillRect(23, 19, 4, 3);
    luna.generateTexture("luna", 32, 32);
    luna.destroy();
  }

  private createOwnerSprite() {
    const girl = this.add.graphics();
    girl.fillStyle(0xffd5ea);
    girl.fillRect(12, 10, 12, 12);
    girl.fillStyle(0xffdfb3);
    girl.fillRect(14, 12, 8, 8);
    girl.fillStyle(0x4b2f2f);
    girl.fillRect(12, 6, 12, 6);
    girl.fillRect(10, 8, 4, 8);
    girl.fillRect(22, 8, 4, 8);
    girl.fillStyle(0xffc28a);
    girl.fillRect(16, 14, 2, 2);
    girl.fillRect(20, 14, 2, 2);
    girl.fillStyle(0x3b2a2a);
    girl.fillRect(16, 18, 4, 2);
    girl.fillStyle(0x7ea2ff);
    girl.fillRect(10, 22, 16, 16);
    girl.fillStyle(0x5e74d0);
    girl.fillRect(10, 30, 16, 4);
    girl.fillStyle(0xffdfb3);
    girl.fillRect(6, 24, 4, 10);
    girl.fillRect(26, 24, 4, 10);
    girl.fillRect(12, 38, 6, 6);
    girl.fillRect(18, 38, 6, 6);
    girl.generateTexture("owner", 36, 48);
    girl.destroy();
  }

  private createHeartSprite() {
    const heart = this.add.graphics();
    heart.fillStyle(0xff7ab2, 0.9);
    heart.fillCircle(6, 6, 6);
    heart.fillCircle(16, 6, 6);
    heart.fillTriangle(0, 8, 22, 8, 11, 20);
    heart.generateTexture("heart", 22, 20);
    heart.destroy();
  }

  update(time: number) {
    if (!this.runController.canMove()) {
      return;
    }

    this.updateMovement();
    this.updateEnemies();
    this.handlePitCheck();
    this.updateProgressBar();
    this.checkWinCondition();

    const health = this.runController.getHealth();
    if (health.immuneUntil > time) {
      this.luna.setTint(0xfff4b1);
    } else {
      this.luna.clearTint();
    }
  }

  private updateEnemies() {
    this.foeGroup.getChildren().forEach((foe) => {
      const sprite = foe as Phaser.Physics.Arcade.Sprite;
      if (!sprite.active || !sprite.body) {
        return;
      }

      const platformStartX = sprite.getData("platformStartX") as number;
      const platformEndX = sprite.getData("platformEndX") as number;
      const direction = sprite.getData("direction") as number;
      const kind = sprite.getData("kind") as string;

      // Check if enemy is about to walk off platform edge
      const speed = kind === "cat" ? GAME_CONFIG.catSpeed : GAME_CONFIG.roombaSpeed;

      if (sprite.x <= platformStartX && direction < 0) {
        // Turn around at left edge
        sprite.setVelocityX(speed);
        sprite.setData("direction", 1);
        sprite.setFlipX(true);
      } else if (sprite.x >= platformEndX && direction > 0) {
        // Turn around at right edge
        sprite.setVelocityX(-speed);
        sprite.setData("direction", -1);
        sprite.setFlipX(false);
      }

      // Remove enemies that somehow fell off screen
      if (sprite.y > GAME_CONFIG.height + 100) {
        sprite.destroy();
      }
    });
  }

  private updateMovement() {
    const left = this.controlsState.left || this.cursors.left?.isDown || this.wasdKeys.left?.isDown;
    const right = this.controlsState.right || this.cursors.right?.isDown || this.wasdKeys.right?.isDown;
    const jumpPressed =
      this.controlsState.jump || this.cursors.up?.isDown || this.cursors.space?.isDown || this.wasdKeys.jump?.isDown;
    const dash =
      this.controlsState.dash || this.cursors.shift?.isDown || this.cursors.down?.isDown || this.wasdKeys.down?.isDown ||
      this.wasdKeys.dash?.isDown;

    if (left) {
      this.luna.setVelocityX(dash ? -GAME_CONFIG.dashSpeed : -GAME_CONFIG.runSpeed);
      this.luna.setFlipX(true);
    } else if (right) {
      this.luna.setVelocityX(dash ? GAME_CONFIG.dashSpeed : GAME_CONFIG.runSpeed);
      this.luna.setFlipX(false);
    } else {
      this.luna.setVelocityX(0);
    }

    if (jumpPressed && !this.wasJumpPressed && this.luna.body?.blocked.down) {
      this.luna.setVelocityY(-GAME_CONFIG.jumpVelocity);
    }

    this.wasJumpPressed = jumpPressed;

    const targetScroll = Math.max(0, this.luna.x - 240);
    this.cameras.main.scrollX = Phaser.Math.Linear(this.cameras.main.scrollX, targetScroll, 0.08);
  }

  private handleFoeHit(foe: Phaser.Physics.Arcade.Sprite) {
    const kind = foe.getData("kind") as FoeSpawn["kind"];
    const isStomp = !!(this.luna.body && this.luna.body.velocity.y > 0 && this.luna.body.touching.down);

    if (isStomp && kind === "cat") {
      this.foeGroup.remove(foe, true, true);
      this.runController.setStatus("Luna booped a cat away!");
      this.scheduleStatusClear();
      this.luna.setVelocityY(-GAME_CONFIG.jumpVelocity * 0.6);
      return;
    }

    if (isStomp && kind === "roomba") {
      this.luna.setVelocityY(-GAME_CONFIG.jumpVelocity * 0.3);
    }

    const now = this.time.now;
    const result = this.runController.onFoeHit(isStomp, kind, now);
    if (result.message) {
      this.runController.setStatus(result.message);
      if (!result.gameOver) {
        this.scheduleStatusClear();
      }
    }
    if (result.gameOver) {
      this.luna.setVelocity(0, 0);
    } else if (result.damaged) {
      // Bounce the foe back
      if (foe.body) {
        foe.setVelocityX(foe.body.velocity.x * -1);
      }
    }
  }

  private handleItemPickup(item: Phaser.Physics.Arcade.Sprite) {
    const kind = item.getData("kind") as ItemSpawn["kind"];
    const now = this.time.now;
    const result = this.runController.onItemPickup(kind, now);
    this.runController.setStatus(result.message);
    this.scheduleStatusClear();
    item.destroy();
  }

  private handlePitCheck() {
    if (this.luna.y > GAME_CONFIG.height + 80) {
      this.runController.onPitFall();
      this.luna.setVelocity(0, 0);
    }
  }

  private scheduleStatusClear() {
    this.statusTimer?.destroy();
    this.statusTimer = this.time.delayedCall(2000, () => {
      this.runController.clearStatus();
    });
  }

  private updateProgressBar() {
    const { progress } = this.runController.getProgress(this.luna.x);
    const barWidth = 200;
    const barHeight = 12;
    const barX = GAME_CONFIG.width / 2 - barWidth / 2;
    const barY = 16;

    this.progressBar.clear();

    // Background
    this.progressBar.fillStyle(0x000000, 0.3);
    this.progressBar.fillRoundedRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4, 6);

    // Track
    this.progressBar.fillStyle(0xffffff, 0.6);
    this.progressBar.fillRoundedRect(barX, barY, barWidth, barHeight, 4);

    // Fill
    const fillWidth = Math.max(4, progress * barWidth);
    this.progressBar.fillStyle(0xff7ab2, 1);
    this.progressBar.fillRoundedRect(barX, barY, fillWidth, barHeight, 4);

    // Owner icon at the end
    this.progressBar.fillStyle(0x7ea2ff, 1);
    this.progressBar.fillRoundedRect(barX + barWidth - 8, barY - 4, 12, 20, 4);

    // Luna icon at current position
    this.progressBar.fillStyle(0xf7c6b8, 1);
    const lunaIconX = barX + progress * (barWidth - 8);
    this.progressBar.fillRoundedRect(lunaIconX, barY - 2, 10, 16, 3);
  }

  private checkWinCondition() {
    const result = this.runController.checkWin(
      this.luna.x,
      this.luna.y,
      this.plan.ownerX,
      this.plan.ownerY
    );
    if (result.won) {
      this.luna.setVelocity(0, 0);
    }
  }

  private registerKeyboard() {
    const keys = this.input.keyboard!.addKeys("W,A,S,D,SPACE,SHIFT") as Record<string, Phaser.Input.Keyboard.Key>;
    this.wasdKeys = {
      left: keys.A,
      right: keys.D,
      up: keys.W,
      down: keys.S,
      jump: keys.SPACE,
      dash: keys.SHIFT,
    };
  }

  private registerMobileControls() {
    this.ui.controlButtons.forEach((button) => {
      const action = button.dataset.action as keyof typeof this.controlsState | undefined;
      if (!action) {
        return;
      }
      button.style.pointerEvents = "auto";
      const setState = (active: boolean) => {
        this.controlsState[action] = active;
      };
      button.addEventListener("pointerdown", () => setState(true));
      button.addEventListener("pointerup", () => setState(false));
      button.addEventListener("pointerleave", () => setState(false));
      button.addEventListener("touchstart", (event) => {
        event.preventDefault();
        setState(true);
      });
      button.addEventListener("touchend", (event) => {
        event.preventDefault();
        setState(false);
      });
    });
  }
}
