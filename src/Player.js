import Phaser from "phaser";
import { GlobalSettings } from "./GlobalSettings";

const initialX = GlobalSettings.width / 2;
const initialY = GlobalSettings.height - 50;

/**
 * Class responsible for anything related to the player object.
 * @export
 * @class Player
 * @extends {Phaser.Physics.Arcade.Sprite}
 */
export class Player extends Phaser.Physics.Arcade.Sprite {
  /**
   * Creates an instance of Player.
   * @param {Phaser.Scene} scene - The scene this player object will belong to.
   * @memberof Player
   */
  constructor(scene) {
    // Creates the Sprite instance for our Player object
    super(scene, initialX, initialY, "player1", 0);

    // Add player to passed in scene as Sprite
    scene.add.existing(this);
    // Add player to passed in scene as Physics object
    scene.physics.add.existing(this);
    // Set player to collide with world boundaries
    this.setCollideWorldBounds(true);

    // Create array that will hold bullets
    this.bullets = this.scene.add.group({ maxSize: 100 });
    this.shotDeltaTime = 0;
    this.lives = GlobalSettings.playerInitialLives;
    this.score = 0;

    this.createAnimations();
    this.anims.play("fly");
  }

  /**
   * Updates all aspects of this player's object at every frame.
   * @param {*} _ - N/A for now
   * @param {number} delta - Number of miliseconds since the last update cycle has been called.
   * @memberof Player
   */
  update(_, delta) {
    this.setVelocity(0);
    this.shotDeltaTime += delta;
    // Handle moving right
    if (this.scene.keys.right.isDown || this.scene.keys.D.isDown) {
      this.body.velocity.x += 300;
    }
    // Handle moving left
    if (this.scene.keys.left.isDown || this.scene.keys.A.isDown) {
      this.body.velocity.x -= 300;
    }

    // Add up and down keys as well as WASD
    if (this.scene.keys.up.isDown || this.scene.keys.W.isDown) {
      this.body.velocity.y -= 300;
    }
    if (this.scene.keys.down.isDown || this.scene.keys.S.isDown) {
      this.body.velocity.y += 300;
    }
    // Mouse movement
    if (this.scene.input.activePointer.isDown) {
      // Check if player is more than 5 units away from the mouse click location to determine if it should move
      const playerPos = new Phaser.Math.Vector2(this.x, this.y);
      const pointerPos = new Phaser.Math.Vector2(this.scene.input.activePointer.x, this.scene.input.activePointer.y);
      if (playerPos.distance(pointerPos) > 5) {
        this.scene.physics.moveTo(this, this.scene.input.activePointer.x, this.scene.input.activePointer.y, 300);
      }
    }

    // Bullet firing trigger logic
    if (this.scene.input.activePointer.isDown || this.scene.keys.space.isDown) {
      if (this.shotDeltaTime > GlobalSettings.playerShotDelay) {
        this.shotDeltaTime = 0;
        this.fireBullet();
      }
    }
    this.checkBulletsPosition();
  }

  /**
   * Handles the logic around firing player bullets.
   * @memberof Player
   */
  fireBullet() {
    const bullet = this.scene.physics.add.image(this.x, this.y, "bullet");
    bullet.setVelocity(0, -500);
    this.bullets.add(bullet);
  }

  /**
   * Handles logic related to the player's bullets' position.
   * @memberof Player
   */
  checkBulletsPosition() {
    this.bullets.getChildren().forEach(bullet => {
      if (bullet.y < 0) {
        bullet.destroy();
      }
    });
  }

  /**
   * Creates the animations to be used by the player sprite.
   * @memberof Player
   */
  createAnimations() {
    // Regular fly animation
    this.scene.anims.create({
      key: "fly",
      frames: [{ key: "player1", frame: 0 }, { key: "player1", frame: 1 }, { key: "player1", frame: 2 }],
      frameRate: 30,
      repeat: -1
    });
    // Ghost/Invincibility animation
    this.scene.anims.create({
      key: "ghost",
      frames: [
        { key: "player1", frame: 3 },
        { key: "player1", frame: 0 },
        { key: "player1", frame: 3 },
        { key: "player1", frame: 1 }
      ],
      frameRate: 20,
      repeat: 5
    });
  }

  /**
   * Handles player killing logic and animations.
   * @memberof Player
   */
  handleCollision() {
    // Subtract 1 life from player current lives.
    this.lives -= 1;
    this.scene.updateGUI();
    // If player has run out of lives, trigger game over logic.
    if (this.lives < 1) {
      // Signals that the player failed to complete this scene by rejecting its promise.
      this.scene._rejectDone();
      // Lastly, destroy this player object.
      this.destroy();
      // Return early as the player object no longer exist.
      return;
    }

    // If the player still has lives, play a little death animation and reset the player's position so they can continue playing
    this.x = initialX;
    this.y = initialY;
    this.on(`${Phaser.Animations.Events.SPRITE_ANIMATION_KEY_COMPLETE}ghost`, () => {
      this.anims.play("fly");
    });

    this.anims.play("ghost");
  }

  /**
   * Adds the number of supplied points to our player's score counter. (makes a call to update GUI)
   * @param {number} [points=0]
   * @memberof Player
   */
  addToScore(points = 0) {
    this.score += points;
    this.scene.updateGUI();
  }
}
