import Phaser from "phaser";
import { Enemy } from "./Enemy";
import { GlobalSettings } from "./GlobalSettings";

/**
 * A basic enemy object that flies across the screen in a straight vertical path.
 * @export
 * @class Enemy
 * @extends {Phaser.Physics.Arcade.Sprite}
 */
export class EnemyBoss extends Enemy {
  constructor(scene) {
    super(scene, GlobalSettings.width / 2, 0, "boss");

    this.bulletDelta = 0;
    this.bullets = this.scene.enemyBullets;
    this.health = GlobalSettings.enemyBossHealth;
    this.reward = GlobalSettings.enemyBossReward;
    this.dropRate = GlobalSettings.enemyBossDropRate;
    // Allow bouncing off world bounds
    this.setScale(0.75);
    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      scaleY: 1,
      duration: 2000,
      onComplete: () => {
        this.anims.play("enemyBoss_fly");
        this.setVelocityX(100);
      }
    });
    this.body.bounce.x = 1;
    this.body.collideWorldBounds = true;
  }

  update(_, deltaTime) {
    this.bulletDelta += deltaTime;

    if (this.bulletDelta > GlobalSettings.enemyBossBulletDelay) {
      this.bulletDelta = 0;
      this.fireBullet();
    }
  }

  /**
   * Fires a bullet for this instance of EnemyBoss. The bullet will be directed at the player's position at the time of firing.
   * @memberof EnemyBoss
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
