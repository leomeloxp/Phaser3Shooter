// Import Phaser package
import Phaser from "phaser";
import { Enemy } from "./Enemy";
import { Player } from "./Player";
import { GlobalSettings } from "./ShooterGame";

/**
 * The first scene of our game.
 */
class StageOne extends Phaser.Scene {
  /**
   * Initialise this Scene object.
   * @memberof StageOne
   */
  init() {
    // Add Enemies Group.
    this.enemies = this.add.group();
    this.enemyDelta = 0;
    this.enemyDelay = 3000;
  }
  /**
   * Preloads any assets that will be used in this Scene.
   * @memberof StageOne
   */
  preload() {
    // Load Assets.
    this.load.crossOrigin = "anonymous";
    this.load.image("bullet", `${GlobalSettings.assetsUrl}/bullet.png`);
    this.load.image("sea", `${GlobalSettings.assetsUrl}/sea.png`);

    this.load.spritesheet("player1", `${GlobalSettings.assetsUrl}/player1.png`, {
      frameWidth: 64,
      frameHeight: 64
    });

    this.load.spritesheet("enemy", `${GlobalSettings.assetsUrl}/enemy.png`, {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  /**
   * Creates all necessary aspects of our Scene before it can start running.
   * @memberof StageOne
   */
  create() {
    // Set up physics basics
    this.physics.world.setBounds(0, 0, GlobalSettings.width, GlobalSettings.height);

    // Add Background
    this.bg = this.add.tileSprite(0, 0, 1200, 800, "sea");

    // Add Player
    this.player = new Player(this);

    // Enable keyboard input for the player
    // Enable arrow, shift and space keys
    this.keys = this.input.keyboard.createCursorKeys();
    // Enable custom keys (WASD, etc)
    this.keys.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keys.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keys.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keys.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  /**
   * Is called 60 times per second to update all aspects of our Scene.
   * @param {number} elapsedTime - Number of miliseconds since the game started.
   * @param {number} deltaTime - Number of miliseconds since the last time the update method was called.
   * @memberof StageOne
   */
  update(elapsedTime, deltaTime) {
    // Update timekeepers
    this.enemyDelta += deltaTime;
    // If the player object exists and is active, let it update itself
    if (this.player && this.player.active) {
      this.player.update(elapsedTime, deltaTime);
    }

    if (elapsedTime > 3 && this.enemyDelta > this.enemyDelay) {
      this.enemyDelta = 0;
      this.spawnEnemy();
    }

    this.enemies.getChildren().forEach(enemy => {
      enemy.update(elapsedTime, deltaTime);
    });

    // Add motion to bg tiles
    this.bg.tilePositionY -= 0.2;
  }

  /**
   * Spawns a new enemy object at a random horizontal position and add them to the group of enemies.
   * @memberof StageOne
   */
  spawnEnemy() {
    const enemy = new Enemy(this, this.game.rdg.between(0, this.game.config.width), 32);
    this.enemies.add(enemy);
  }
}

export { StageOne };
