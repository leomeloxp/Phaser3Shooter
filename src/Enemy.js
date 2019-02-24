import Phaser from "phaser";

/**
 * A basic enemy object that flies across the screen in a straight vertical path.
 */
export class Enemy extends Phaser.Physics.Arcade.Sprite {
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

  update() {
    // Destroy enemy if they leave the map.
    if (this.y > this.scene.game.config.height + this.displayHeight) {
      this.destroy();
    }
  }
}
