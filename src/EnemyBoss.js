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
    this.isInvincible = true;
    this.health = GlobalSettings.enemyBossHealth;
    this.reward = GlobalSettings.enemyBossReward;
    this.dropRate = GlobalSettings.enemyBossDropRate;
    // Allow bouncing off world bounds
    this.setScale(0.75);
    this.playAnimation("enemyBoss_ghost");
    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      scaleY: 1,
      duration: 2000,
      onComplete: () => {
        this.anims.play("enemyBoss_fly");
        this.isInvincible = false;
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
   * Custom collision handling logic for the boss enemy only.
   * @returns
   * @memberof EnemyBoss
   */
  handleCollision() {
    // If boss stills in invincible mode, do not deal damage.
    if (this.isInvincible) {
      return;
    }

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

  /**
   * Fires all bullets for this instance of EnemyBoss. Shooting pattern can be one of two, depending on damage dealt.
   * @memberof EnemyBoss
   */
  fireBullet() {
    // First shooting pattern
    if (this.health >= GlobalSettings.enemyBossHealth / 2) {
      // Create centre bullet
      let bullet = this.scene.physics.add.image(this.x, this.y + 32, "bullet");
      this.scene.physics.moveTo(bullet, this.scene.player.x, this.scene.player.y, 100);
      this.bullets.add(bullet);
      Array.from({ length: 3 }).forEach((_, i) => {
        // Left hand side bullets
        let bulletLeft = this.scene.physics.add.image(this.x - 20 * (i + 1), this.y + 32, "bullet");
        this.scene.physics.moveTo(bulletLeft, this.scene.player.x, this.scene.player.y, 100);
        this.bullets.add(bulletLeft);
        // Right hand side bullets
        let bulletRight = this.scene.physics.add.image(this.x + 20 * (i + 1), this.y + 32, "bullet");
        this.scene.physics.moveTo(bulletRight, this.scene.player.x, this.scene.player.y, 100);
        this.bullets.add(bulletRight);
      });
    } else {
      // Second shooting pattern
      const bullet = this.scene.physics.add.image(this.x, this.y + 32, "bullet");
      bullet.setVelocity(0, 200);
      this.bullets.add(bullet);
      Array.from({ length: 3 }).forEach((_, i) => {
        // Left hand side bullets
        const bulletLeft = this.scene.physics.add.image(this.x, this.y + 32, "bullet");
        const theta = -270 - (i + 1) * 10;
        this.scene.physics.velocityFromAngle(theta, 200, bulletLeft.body.velocity);
        this.bullets.add(bulletLeft);
        // Right hand side bullets
        const bulletRight = this.scene.physics.add.image(this.x, this.y + 32, "bullet");
        const ro = -270 + (i + 1) * 10;
        this.scene.physics.velocityFromAngle(ro, 200, bulletRight.body.velocity);
        this.bullets.add(bulletRight);
      });
    }
  }
}
