import Phaser from "phaser";
import { Enemy } from "./Enemy";

/**
 * A basic enemy object that flies across the screen in a straight vertical path.
 * @export
 * @class Enemy
 * @extends {Phaser.Physics.Arcade.Sprite}
 */
export class EnemyShooter extends Enemy {
  constructor(scene, x = 0, y = 0) {
    super(scene, x, y, "shooting-enemy");

    // Set random velocity values
    const vX = this.scene.game.rdg.between(-25, 25);
    const vY = this.scene.game.rdg.between(20, 25);
    // Calculate
    const rad = Math.atan2(-vX, vY);
    this.setVelocity(vX, vY);
    this.setRotation(rad);
  }
}
