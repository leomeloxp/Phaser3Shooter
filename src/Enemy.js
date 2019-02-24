import Phaser from "phaser";

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
}
