// Import Phaser package
import Phaser from "phaser";
import { Enemy } from "./Enemy";
import { EnemyShooter } from "./EnemyShooter";
import { GlobalSettings } from "./GlobalSettings";
import { Player } from "./Player";

/**
 * The first scene of our game.
 * @class StageOne
 * @extends {Phaser.Scene}
 */
class StageOne extends Phaser.Scene {
  constructor(...args) {
    super(...args);
    // Create a promise that will be used to signal scene completion and game over
    this.done = new Promise((resolve, reject) => {
      this._resolveDone = resolve;
      this._rejectDone = reject;
    });
  }
  /**
   * Initialise this Scene object.
   * @memberof StageOne
   */
  init() {
    // Add Enemies Group.
    this.enemies = this.add.group();
    this.enemyBullets = this.add.group();
    this.enemyDelta = 0;
    this.enemyShooterDelta = 0;
    this.playerBullets = this.add.group();
    this.powerUps = this.add.group({ maxSize: 3 });
  }
  /**
   * Preloads any assets that will be used in this Scene.
   * @memberof StageOne
   */
  preload() {
    // Load Assets.
    this.load.crossOrigin = "anonymous";
    this.load.image("bullet", `${GlobalSettings.assetsUrl}/bullet.png`);
    this.load.image("powerup1", `${GlobalSettings.assetsUrl}/powerup1.png`);
    this.load.image("sea", `${GlobalSettings.assetsUrl}/sea.png`);

    this.load.spritesheet("enemy", `${GlobalSettings.assetsUrl}/enemy.png`, {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("explosion", `${GlobalSettings.assetsUrl}/explosion.png`, {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("player1", `${GlobalSettings.assetsUrl}/player1.png`, {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("shooting-enemy", `${GlobalSettings.assetsUrl}/shooting-enemy.png`, {
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

    this.createAnimation();

    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      this.handlePlayerAndEnemiesCollision(player, enemy);
    });

    this.physics.add.overlap(this.enemies, this.player.bullets, (enemy, bullet) => {
      this.handleEnemyAndPlayerBulletCollision(enemy, bullet);
    });

    this.physics.add.overlap(this.player, this.enemyBullets, (player, bullet) => {
      this.handlePlayerAndEnemieBulletsCollision(player, bullet);
    });

    this.physics.add.overlap(this.player, this.powerUps, (player, powerUp) => {
      this.handlePlayerAndPowerUpCollision(player, powerUp);
    });
    this.textLives = this.add.text(10, 10, `Lives: ${this.player.lives}`);
    this.textScore = this.add.text(100, 10, `Score: ${this.player.score}`);
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
    this.enemyShooterDelta += deltaTime;
    // If the player object exists and is active, let it update itself
    if (this.player && this.player.active) {
      this.player.update(elapsedTime, deltaTime);
    }

    // Spawn regular enemy
    if (elapsedTime > 3 && this.enemyDelta > GlobalSettings.enemySpawnDelay) {
      this.enemyDelta = 0;
      this.spawnEnemy();
    }

    // Spawn shooter enemy
    if (elapsedTime > 3 && this.enemyShooterDelta > GlobalSettings.enemyShooterSpawnDelay) {
      this.enemyShooterDelta = 0;
      this.spawnEnemyShooter();
    }

    this.enemies.getChildren().forEach(enemy => {
      enemy.update(elapsedTime, deltaTime);
    });

    this.cleanupArtifacts();
    this.checkForEndGame();
    // Add motion to bg tiles
    this.bg.tilePositionY -= 0.2;
  }

  /**
   * Spawns a new enemy object at a random horizontal position and add them to the group of enemies.
   * @memberof StageOne
   */
  spawnEnemy() {
    const enemy = new Enemy(this, this.game.rdg.between(32, this.game.config.width - 32), 32);
    enemy.playAnimation("enemy_fly");
    this.enemies.add(enemy);
  }

  /**
   * Spawns a new shooter type enemy object at a random horizontal position and add them to the group of enemies.
   * @memberof StageOne
   */
  spawnEnemyShooter() {
    const enemy = new EnemyShooter(this, this.game.rdg.between(32, this.game.config.width - 32), 32);
    enemy.playAnimation("enemyShooter_fly");
    this.enemies.add(enemy);
  }

  /**
   * Handles the spawning of power up items. Relies on provided spawn coordinates and calculates
   * the velocity and other properties of the power up sprite.
   * @param {number} [x=0] X coordinate to spawn power up on
   * @param {number} [y=0] Y coordinate to spawn power up on
   * @memberof StageOne
   */
  spawnPowerUp(x = 0, y = 0) {
    if (this.powerUps.getChildren().length < this.powerUps.maxSize && this.player.powerLevel < 5) {
      const powerUp = this.physics.add.image(x, y, "powerup1");
      this.powerUps.add(powerUp);
      powerUp.setVelocity(0, 50);
    }
  }

  /**
   * Handles the logic for collisions between enemies and player bullets.
   * @param {Enemy} enemy
   * @param {Phaser.Physics.Arcade.Image} bullet
   * @memberof StageOne
   */
  handleEnemyAndPlayerBulletCollision(enemy, bullet) {
    bullet.destroy();
    enemy.handleCollision();
    if (!enemy.active) {
      this.player.addToScore(enemy.reward);
      // Determines if the destroyed enemy dropped a power up.
      const powerUpRoll = this.game.rdg.frac();
      if (powerUpRoll < enemy.dropRate) {
        this.spawnPowerUp(enemy.x, enemy.y);
      }
    }
  }

  /**
   * Handles the logic for collisions between player and enemies.
   * @param {Player} player
   * @param {Enemy} enemy
   * @memberof StageOne
   */
  handlePlayerAndEnemiesCollision(player, enemy) {
    // Add to player score
    if (!enemy.active) {
      this.player.addToScore(enemy.reward);
    }
    // Run enemy collision handling
    enemy.handleCollision();

    // Run player collision handling
    player.handleCollision();
  }

  /**
   * Handles the collision between any bullet fired by an enemy and the player's plane.
   * @param {Player} player
   * @param {Phaser.Physics.Arcade.Image} bullet
   * @memberof StageOne
   */
  handlePlayerAndEnemieBulletsCollision(player, bullet) {
    bullet.destroy();
    // Run player collision handling
    player.handleCollision();
  }

  /**
   * Handles the collision between any power up item and the player's plane.
   * @param {*} player
   * @param {*} powerUp
   * @memberof StageOne
   */
  handlePlayerAndPowerUpCollision(player, powerUp) {
    player.addPowerUp();
    powerUp.destroy();
  }

  /**
   * Updates the GUI so it reflects internal game state correctly.
   * @memberof StageOne
   */
  updateGUI() {
    this.textLives.text = `Lives: ${this.player.lives}`;
    this.textScore.text = `Score: ${this.player.score}`;
  }

  /**
   * Cleanup any bullets or power up sprites that have left the screen to reduce memory usage.
   * @memberof StageOne
   */
  cleanupArtifacts() {
    this.enemyBullets.getChildren().forEach(bullet => {
      if (!Phaser.Geom.Rectangle.Overlaps(this.physics.world.bounds, bullet.getBounds())) {
        bullet.destroy();
      }
    });

    this.playerBullets.getChildren().forEach(bullet => {
      if (!Phaser.Geom.Rectangle.Overlaps(this.physics.world.bounds, bullet.getBounds())) {
        bullet.destroy();
      }
    });

    this.powerUps.getChildren().forEach(powerUp => {
      if (!Phaser.Geom.Rectangle.Overlaps(this.physics.world.bounds, powerUp.getBounds())) {
        powerUp.destroy();
      }
    });
  }

  /**
   * Checks whether this scene should be marked as completed.
   * @memberof StageOne
   */
  checkForEndGame() {
    if (this.player.score > 1000) {
      this._resolveDone();
    } else if (!this.player.active) {
      this._rejectDone();
    }
  }

  /**
   * Creates the animations to be used during this scene.
   * @memberof StageOne
   */
  createAnimation() {
    // Add explosion animation
    this.anims.create({
      key: "explode",
      frames: [
        { key: "explosion", frame: 0 },
        { key: "explosion", frame: 1 },
        { key: "explosion", frame: 2 },
        { key: "explosion", frame: 3 },
        { key: "explosion", frame: 4 },
        { key: "explosion", frame: 5 }
      ],
      frameRate: 15,
      repeat: 0,
      hideOnComplete: true
    });

    // Regular enemy fly animation
    this.anims.create({
      key: "enemy_fly",
      frames: [{ key: "enemy", frame: 0 }, { key: "enemy", frame: 1 }, { key: "enemy", frame: 2 }],
      frameRate: 30,
      repeat: -1
    });

    this.anims.create({
      key: "enemy_ghost",
      frames: [
        { key: "enemy", frame: 3 },
        { key: "enemy", frame: 0 },
        { key: "enemy", frame: 3 },
        { key: "enemy", frame: 1 }
      ],
      frameRate: 20,
      repeat: 1
    });
    // Regular enemy fly animation
    this.anims.create({
      key: "enemyShooter_fly",
      frames: [
        { key: "shooting-enemy", frame: 0 },
        { key: "shooting-enemy", frame: 1 },
        { key: "shooting-enemy", frame: 2 }
      ],
      frameRate: 30,
      repeat: -1
    });

    this.anims.create({
      key: "enemyShooter_ghost",
      frames: [
        { key: "shooting-enemy", frame: 3 },
        { key: "shooting-enemy", frame: 0 },
        { key: "shooting-enemy", frame: 3 },
        { key: "shooting-enemy", frame: 1 }
      ],
      frameRate: 20,
      repeat: 1
    });
  }
}
export { StageOne };
