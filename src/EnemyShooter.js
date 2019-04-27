import Phaser from "phaser";
import { Enemy } from "./Enemy";
import { GlobalSettings } from "./GlobalSettings";

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
    this.bulletDelta = 0;
    this.bullets = this.scene.enemyBullets;
  }

  update(_, deltaTime) {
    this.bulletDelta += deltaTime;

    if (this.bulletDelta > GlobalSettings.enemyShooterBulletDelay) {
      this.bulletDelta = 0;
      this.fireBullet();
    }
  }

  /**
   * Fires a bullet for this instance of EnemyShooter. The bullet will be directed at the player's position at the time of firing.
   * @memberof EnemyShooter
   */
  fireBullet() {
    // Create bullet object
    let bullet = this.scene.physics.add.image(this.x, this.y, "bullet");
    // Make it so the bullet moves towards the player current position at a speed of 50 on both axis;
    this.scene.physics.moveTo(bullet, this.scene.player.x, this.scene.player.y, 50);
    // Add the bullet to the enemyBullets group so we can do collision checking with it.
    this.bullets.add(bullet);
  }
}
