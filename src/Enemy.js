import Phaser from "phaser";
import { GlobalSettings } from "./GlobalSettings";

/**
 * A basic enemy object that flies across the screen in a straight vertical path.
 * @export
 * @class Enemy
 * @extends {Phaser.Physics.Arcade.Sprite}
 */
export class Enemy extends Phaser.Physics.Arcade.Sprite {
  /**
   *Creates an instance of Enemy.
   * @param {Phaser.Scene} scene - The Scene object which this enemy will belong to.
   * @param {number} [x=0] - The initial X position for the new Enemy sprite
   * @param {number} [y=0] - The initial Y position for the new Enemy sprite
   * @memberof Enemy
   */
  constructor(scene, x = 0, y = 0) {
    // Create Sprite.
    super(scene, x, y, "enemy", 0);

    // Add enemy to passed in scene as Sprite.
    scene.add.existing(this);
    // Add enemy to passed in scene as Physics object.
    scene.physics.add.existing(this);
    // Set enemy initial velocity.
    this.setVelocity(0, 25);
    this.health = GlobalSettings.enemyHealth;
    this.reward = GlobalSettings.enemyReward;

    this.createAnimation();
    this.anims.play("enemy_fly");
  }

  /**
   * Updates all aspects of our Enemy at every frame of the game.
   * @memberof Enemy
   */
  update() {
    // Destroy enemy if they leave the map.
    if (this.y > this.scene.game.config.height + this.displayHeight) {
      this.destroy();
    }
  }

  /**
   * Creates the animations to be used by the enemy sprite.
   * @memberof Enemy
   */
  createAnimation() {
    // Regular fly animation
    this.scene.anims.create({
      key: "enemy_fly",
      frames: [{ key: "enemy", frame: 0 }, { key: "enemy", frame: 1 }, { key: "enemy", frame: 2 }],
      frameRate: 30,
      repeat: -1
    });

    this.scene.anims.create({
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
  }

  handleCollision() {
    this.health -= 1;
    if (this.health < 1) {
      const explosion = this.scene.add.sprite(this.x, this.y, "explosion", 0);
      this.destroy();
      explosion.on(`${Phaser.Animations.Events.SPRITE_ANIMATION_KEY_COMPLETE}explode`, () => {
        explosion.destroy();
      });
      explosion.anims.play("explode");
    }
  }
}
